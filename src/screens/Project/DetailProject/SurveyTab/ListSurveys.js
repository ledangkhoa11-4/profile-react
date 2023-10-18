import React from 'react';
import PropTypes from 'prop-types';
import SurveyItem from './Survey';

const ListSurveys = (props) => {
  return props.surveys.map((survey) => <SurveyItem
    openUpdateEndDateModal={props.openUpdateEndDateModal}
    localeCommon={props.localeCommon}
    survey={survey}
    key={survey.id}
    openResultModal={props.openResultModal}
    onDeleteSurvey={props.onDeleteSurvey}
    gotoPayment={props.gotoPayment}
    onChangeStatus={props.onChangeStatus}
  />)
}

ListSurveys.propTypes = {
  polls: PropTypes.array,
};

export default ListSurveys;
