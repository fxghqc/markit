'use strict';

chrome.runtime.onInstalled.addListener(function() {
  chrome.bookmarks.onCreated.addListener(function(id, bookmark) {
    // console.log('create bookmark', id, bookmark.title, bookmark.dateAdded);
    // fetch('http://localhost:5000/link', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW5fdXNlciIsImF1ZCI6Im1hcmtpdCJ9.FJEIARIVi0DXOwrjfmdSe0Dc-l0NFMBkd0gEv8ehPUA',
    //   },
    //   body: JSON.stringify({
    //     "id": bookmark.id,
    //     "href": bookmark.url,
    //     "add_date": bookmark.dateAdded,
    //     "icon": '',
    //     "title": bookmark.title
    //   })
    // }).then(res => {
    //   if (!res.ok) {
    //     throw new Error('Postgrest: unexpected error.');
    //   }
    //   console.log(res.headers.get('Location'));
    // }).catch(err => {
    //   console.log(err);
    // });
  });
  chrome.bookmarks.onRemoved.addListener(function(id, bookmark) {
    // console.log('remove bookmark', id, bookmark.node.title);
    // fetch(`http://localhost:5000/link?or=(id.eq.${id},title.eq.${bookmark.node.title})`, {
    //   method: 'DELETE',
    //   headers: {
    //     'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW5fdXNlciIsImF1ZCI6Im1hcmtpdCJ9.FJEIARIVi0DXOwrjfmdSe0Dc-l0NFMBkd0gEv8ehPUA',
    //   },
    // }).then(res => {
    //   if (!res.ok) {
    //     throw new Error('Postgrest: unexpected error.');
    //   }
    // }).catch(err => {
    //   console.log(err);
    // });
  });
  chrome.bookmarks.onChanged.addListener(function(id, changeInfo) {
    console.log('change bookmark or folder', id, changeInfo);
  });
  chrome.bookmarks.onMoved.addListener(function(id, moveInfo) {
    console.log('move bookmark or folder', id, moveInfo);
    // chrome.bookmarks.get(String(id), function(results) {
    //   console.log(results);
    // });
    // chrome.bookmarks.get(String(moveInfo.parentId), function(results) {
    //   console.log(results);
    // });
  });
  chrome.bookmarks.onChildrenReordered.addListener(function(id, reorderInfo) {
    console.log('reorder bookmark or folder', id, reorderInfo);
  });
  chrome.bookmarks.onImportBegan.addListener(function() {
    console.log('import began');
  });

  chrome.bookmarks.onImportEnded.addListener(function() {
    console.log('import ended');
  });
});
