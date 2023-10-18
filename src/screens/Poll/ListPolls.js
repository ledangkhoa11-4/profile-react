import React from 'react';
import PropTypes from 'prop-types';
import FormSort from './FormSort';
import PollItem from './PollItem';
import BottomLoading from 'components/BottomLoading';

function renderNoPollsMessage(localePoll) {
  return (
    <div>
      <div className="form form-option">
        <div className="alert alert-warning" role="alert">
          { localePoll.NO_POLL_FILTER_MSG }
        </div>
      </div>
    </div>
  )
}

const ListPolls = (props) => {
  const {
    polls,
    onFilterPolls,
    isBottomLoading,
    onOpenResultPopup,
    onOpenAnswerPopup,
  } = props;

  return (
    <div className="box-dashboard">
      <div className="inne">
        <FormSort
          onFilterPolls={onFilterPolls}
          localePoll={props.localePoll}
        />
        {
          typeof polls === 'object' && polls.length ? 
            polls.map((item) => {
              return <PollItem
                        key={item.id}
                        poll={item}
                        onOpenResultPopup={onOpenResultPopup}
                        onOpenAnswerPopup={onOpenAnswerPopup}
                        localePoll={props.localePoll}
                        localeCommon={props.localeCommon}
                        currentTime={props.currentTime}
                      />
            }) :
            renderNoPollsMessage(props.localePoll)
        }
        {
          isBottomLoading ? <BottomLoading/> : null
        }
      </div>
    </div>
  )
}

ListPolls.propTypes = {
  polls: PropTypes.array,
  onFilterPolls: PropTypes.func,
  onOpenResultPopup: PropTypes.func,
  onOpenAnswerPopup: PropTypes.func,
  isBottomLoading: PropTypes.bool,
};

export default ListPolls;
