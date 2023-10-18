import React from 'react';
import { Switch, Route } from 'react-router-dom';
import DetailProject from './DetailProject';
import ListProject from './ListProjects';
import CreatePoll from './CreatePoll';
import CreateSurvey from './CreateSurvey';
import PaymentPollSurvey from './PaymentPollSurvey';
import PaymentStatus from './PaymentStatus';
import Page404 from '../Page404';
import { CHILD_ROUTE_PATH } from 'services/config';

const localeProject = window.locale.Project;
const localeCommon = window.locale.Common;
const localeCreate = window.locale.Create;
const localePayment = window.locale.Payment;

let Project = (props) => {
  return (
    <Switch>
      <Route exact path={props.match.path} render={props => <ListProject
        {...props}
        localeProject={localeProject}
        localeCommon={localeCommon}
      />} />
      <Route
        exact 
        path={CHILD_ROUTE_PATH.PROJECT_DETAIL}
        render={props => <DetailProject
          {...props}
          localeProject={localeProject}
          localeCommon={localeCommon}
        />}
      />
      <Route
        path={CHILD_ROUTE_PATH.PROJECT_CREATE_POLL}
        render={props => <CreatePoll
          {...props}
          localeCommon={localeCommon}
          localeCreate={localeCreate}
        />}
      />
      <Route
        path={CHILD_ROUTE_PATH.PROJECT_EDIT_POLL}
        render={props => <CreatePoll
          {...props}
          localeCommon={localeCommon}
          localeCreate={localeCreate}
        />}
      />
      <Route
        path={CHILD_ROUTE_PATH.PROJECT_CREATE_SURVEY}
        render={props => <CreateSurvey
          {...props}
          localeCommon={localeCommon}
          localeCreate={localeCreate}
        />}
      />
      <Route
        path={CHILD_ROUTE_PATH.PROJECT_EDIT_SURVEY}
        render={props => <CreateSurvey
          {...props}
          localeCommon={localeCommon}
          localeCreate={localeCreate}
        />}
      />
      <Route
        path={CHILD_ROUTE_PATH.PROJECT_POLL_SURVEY_PAYMENT}
        render={props => <PaymentPollSurvey
          {...props}
          localeCommon={localeCommon}
          localePayment={localePayment}
        />}
      />
      <Route
        path={CHILD_ROUTE_PATH.PAYMENT_STATUS}
        render={props => <PaymentStatus
          {...props}
          localePayment={localePayment}
        />}
      />
      <Route component={Page404} />
    </Switch>
  )
}

export default Project;
