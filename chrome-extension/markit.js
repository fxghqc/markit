// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
'use strict';

function ActiveTab() {}

// async
ActiveTab.prototype.getData = function() {
  if (this.data) {
    return Promise.resolve(this.data);
  }

  return new Promise((resolve) => {
    chrome.tabs.query(
      { active: true, currentWindow: true },
      (tabs) => {
        const activeTab = tabs[0];
        this.data = activeTab;
        resolve(activeTab);
      }
    );
  });
}

ActiveTab.prototype.checkTab = function() {
  return this.getData()
    .then((tab) => {
      const { url } = tab;
      return fetch(`http://localhost:5000/link?href=eq.${encodeURIComponent(url)}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW5fdXNlciIsImF1ZCI6Im1hcmtpdCJ9.FJEIARIVi0DXOwrjfmdSe0Dc-l0NFMBkd0gEv8ehPUA',
        },
      }).then(res => {
        if (!res.ok) {
          res.json()
            .then((json) => {
              throw new Error(json.message)
            });
        } else {
          return res.json();
        }
      }).then((json) => {
        this.setMarked(Array.isArray(json) && json.length > 0 && json[0].id);
      }).catch(err => {
        console.error(err);
      });
    });
}

ActiveTab.prototype.setMarked = function(id) {
  this.markedId = id;
  if (!this.markBtn) {
    this.markBtn = document.getElementById('mark');
  }
  
  if (this.markedId) {
    this.markBtn.style.color = '#f76b8a';
    this.markBtn.style.fontWeight = 'bold';
  } else {
    this.markBtn.style.color = 'buttontext';
    this.markBtn.style.fontWeight = 'normal';
  }
}

ActiveTab.prototype.markTab = function () {
  this.getData()
    .then((tab) => {
      const { id, title, url, favIconUrl } = tab;
      const link = {
        // TODO: generate random id.
        id: String(id) + Math.floor(Math.random() * 1000),
        title,
        href: url,
        icon: favIconUrl,
        add_date: Date.now(),
      };
      console.log('create bookmark', link);
      fetch('http://localhost:5000/link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW5fdXNlciIsImF1ZCI6Im1hcmtpdCJ9.FJEIARIVi0DXOwrjfmdSe0Dc-l0NFMBkd0gEv8ehPUA',
        },
        body: JSON.stringify(link)
      }).then(res => {
        if (!res.ok) {
          throw new Error('Postgrest: unexpected error.');
        }
        console.log(res.headers.get('Location'));
        this.setMarked(true);
      }).catch(err => {
        console.log(err);
      });
    });
}

// TODO: use postgres function
ActiveTab.prototype.unMarkTab = function() {
  this.getData()
    .then((tab) => {
      console.log('remove bookmark', tab.title, tab.url);
      fetch(`http://localhost:5000/link?href=eq.${tab.url}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW5fdXNlciIsImF1ZCI6Im1hcmtpdCJ9.FJEIARIVi0DXOwrjfmdSe0Dc-l0NFMBkd0gEv8ehPUA',
        },
      }).then(res => {
        if (!res.ok) {
          throw new Error('Postgrest: unexpected error.');
        }
        this.setMarked(false);
        
        return fetch(`http://localhost:5000/link_tag?link=eq.${this.markedId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW5fdXNlciIsImF1ZCI6Im1hcmtpdCJ9.FJEIARIVi0DXOwrjfmdSe0Dc-l0NFMBkd0gEv8ehPUA',
          },
        });
      }).then(res => {
        if (!res.ok) {
          throw new Error('Postgrest: unexpected error.');
        }
        
      }).catch(err => {
        console.error(err);
      });
    })
};

const activeTab = new ActiveTab();
activeTab.checkTab()
  .then(() => {
    activeTab.markBtn.addEventListener('click', () => {
      if (activeTab.markedId) {
        activeTab.unMarkTab();
      } else {
        activeTab.markTab();
      }
    })
  });
