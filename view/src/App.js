import React from 'react';
import { BrowserRouter } from 'react-router-dom';
// eslint-disable-next-line
import { hot } from 'react-hot-loader';

import AppLayout from './layouts/AppLayout';

const App = () => (
  <BrowserRouter>
    <AppLayout />
  </BrowserRouter>
);

export default hot(module)(App);
