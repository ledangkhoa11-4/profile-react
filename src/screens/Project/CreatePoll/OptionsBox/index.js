import React, { Component } from 'react';
import PropTypes from 'prop-types';
import merge from 'deepmerge';
import PaidOptionContainer from './PaidOptionContainer';

class OptionsBox extends Component {
  getTargetData() {
    const paidOpt = this.paidOptEl.getPaidOptData();
    return paidOpt;
  }

  validatePaidOption() {
    if (!this.props.hasPaidOption) {
      return true;
    }
    const isValidPaidOpt = this.paidOptEl.validatePaidOption();
    return isValidPaidOpt;
  }

  render() {
    const { localeCreate } = this.props;
    return (
      <div>
        <PaidOptionContainer
          ref={node => {
            if (node) this.paidOptEl = node;
          }}
          isCreatePoll={this.props.isCreatePoll}
          hasPaidOption={this.props.hasPaidOption}
          listCityOption={this.props.listCityOption}
          listTargetsOfUser={this.props.listTargetsOfUser}
          listTargetOption={this.props.listTargetOption}
          onChangePaidOption={this.props.onChangePaidOption}
          pollInfo={this.props.pollInfo}
          updateListTargetOfUser={this.props.updateListTargetOfUser}
          localeCreate={localeCreate}
          disableChangePaidOption={this.props.disableChangePaidOption}
          keyPollSurvey={this.props.keyPollSurvey}
          projectId={this.props.projectId}
          projectInfo={this.props.projectInfo}
          hideLoading={this.props.hideLoading}
          isDisableEdit={this.props.isDisableEdit}
          isAdmin={this.props.isAdmin}
        />
      </div>
    );
  }
}

OptionsBox.defaultProps = {
  disableChangePaidOption: false,
}

OptionsBox.propTypes = {
  pollInfo: PropTypes.object,
  disableChangePaidOption: PropTypes.bool,
}

export default OptionsBox;
