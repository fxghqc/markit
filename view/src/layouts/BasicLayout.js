import React from 'react';
import { Route } from 'react-router-dom';
import { pure } from 'recompose';
import { Home, Tags } from '../routes';
import { DataProvider } from '../components/DataContext';

import styles from './BasicLayout.css';

const Routes = pure(() => (
  <React.Fragment>
    <Route exact path="/" component={Home} />
    <Route path="/tags" component={Tags} />
  </React.Fragment>
));

const BasicLayout = () => (
  <div className={styles._}>
    <DataProvider>
      <Routes />
    </DataProvider>
  </div>
);

export default BasicLayout;
