import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import { Landing, OrphanagesMap, CreateOrphanage, Orphanage } from '../pages';

function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Landing} />
        <Route path="/orphanages" component={OrphanagesMap} />
        <Route path="/orphanage/create" component={CreateOrphanage} />
        <Route path="/orphanage/:id" component={Orphanage} />
      </Switch>
    </BrowserRouter>
  );
}

export default Routes;