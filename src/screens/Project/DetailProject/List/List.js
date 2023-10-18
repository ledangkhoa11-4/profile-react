import React from 'react';
import PropTypes from 'prop-types';
import Item from './Item';
import BottomLoading from 'components/BottomLoading';

const List = (props) => {
  return (
    <div>
      {
        props.list.map((object, idx) => {
          return <Item
            projectId={props.projectId}
            object={object}
            key={`${typeof object.thumb !== 'undefined' ? 'survey' : 'poll'}_${object.id}_${object.id}_${idx}`}
            openResultModal={props.openResultModal}
            gotoPayment={props.gotoPayment}
            onchangeStatus={props.onchangeStatus}
            openUpdateEndDateModal={props.openUpdateEndDateModal}
            openModalConfirm={props.openModalConfirm}
          />
        })
      }
      {
        props.isBottomLoading ? <BottomLoading/> : null
      }
    </div>
  )
}

List.propTypes = {
    list: PropTypes.array,
};

export default List;
