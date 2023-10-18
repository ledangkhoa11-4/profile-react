import React from 'react';
import { Route, Switch } from 'react-router-dom';
import ListCategoriesSurvey from './ListCategoriesSurvey';
import ListSurvey from './ListSurvey';
import SurveyDetail from './Survey';
import Thankyou from './Thankyou';
import Page404 from '../Page404';
import { CHILD_ROUTE_PATH } from 'services/config';

const Survey = (props) => {
  return (
    <Switch>
      <Route exact path={props.match.path} component={ListCategoriesSurvey}/>
      <Route
        exact
        path={CHILD_ROUTE_PATH.SURVEY_LIST}
        render={routeProps => <ListSurvey {...routeProps}/>}
      />
      <Route
        exact
        path={CHILD_ROUTE_PATH.SURVEY_DETAIL}
        render={routeProps => <SurveyDetail {...routeProps}/>}
      />
      <Route
        path={CHILD_ROUTE_PATH.SURVEY_THANKS}
        component={Thankyou}
      />
      <Route component={Page404}/>
    </Switch>
  )
}

export default Survey;
