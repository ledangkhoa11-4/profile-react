import React from 'react';
import PropTypes from 'prop-types';
import PollItem from './Poll';
import BottomLoading from 'components/BottomLoading';

const ListPolls = (props) => {
  return (
    <div>
      {
        props.polls.map((poll) => {
          return <PollItem
            projectId={props.projectId}
            poll={poll}
            key={poll.id}
            localeCommon={props.localeCommon}
            openUpdateEndDateModal={props.openUpdateEndDateModal}
            openResultModal={props.openResultModal}
            onDeletePoll={props.onDeletePoll}
            gotoPayment={props.gotoPayment}
            onChangeStatus={props.onChangeStatus}
          />
        })
      }
      {
        props.isBottomLoading ? <BottomLoading/> : null
      }
    </div>
  )
}

ListPolls.propTypes = {
  polls: PropTypes.array,
};

export default ListPolls;
