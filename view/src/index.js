import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';

import './styles/index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

Modal.setAppElement('#root');

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
