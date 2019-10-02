import React from 'react';
import Select from 'react-select';

const options = [
  { value: 'try-it', label: 'try-it' },
  { value: 'use-it', label: 'use-it' },
  { value: 'imitate', label: 'imitate' },
  { value: 'article', label: 'article' },
  { value: 'book', label: 'book' },
  { value: 'learn', label: 'learn' },
  { value: 'remember', label: 'remember' },
  { value: 'refer', label: 'refer' },
  { value: 'play', label: 'play' },
  { value: 'fun', label: 'fun' },
  { value: 'comprehend', label: 'comprehend' },
  { value: 'familiar-with', label: 'familiar-with' },
];

const Shortcuts = () => (
  <div style={{ width: '10rem' }}>
    <Select options={options} searchable={false} />
  </div>
);

export default Shortcuts;
