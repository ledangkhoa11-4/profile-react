import React from 'react';
import { isEmpty, find, map } from 'lodash';
import Item from './Item';
import './style.css';
const localeCreate = window.locale.Create;
const renderListLogic = (props) =>{
    const { listQuestion, questionSelectedLogic, listTargetOption, removeOneLogic, selectCurrentLogic } = props;
    const question = find(listQuestion, { id: questionSelectedLogic.value });
    if ( isEmpty(question.logic) ) {
      return (
        <tr className="empty-cell">
            <td colSpan="2">
                {localeCreate.no_conditions_yet}
            </td>
        </tr>
      )
    }
    return map(question.logic, (logic, key) => {
        return (
            <Item
                key={key}
                index={key}
                logic={logic}
                listQuestion={listQuestion}
                listTargetOption={listTargetOption}
                removeOneLogic={removeOneLogic}
                selectCurrentLogic={selectCurrentLogic}
            />
        )
    })
}

const LogicTable = (props) => {
    return (
      <div className="col-xs-12 mrb-25px">
        <div className="box-list-logic-selected">
            <div className="title">
                {localeCreate.title_swap_question}
            </div>
            <div className="sub-title">
                {localeCreate.sub_title_swap_question}
            </div>
            <div className="list-logic-selected">
                <table className="table-swap-question">
                    <thead>
                        <tr>
                            <th>{localeCreate.cardinal_numbers}</th>
                            <th>
                                <div className="row">
                                    <div className="col-xs-5">
                                        {localeCreate.condition}
                                    </div>
                                    <div className="col-xs-7">
                                        {localeCreate.target_question}
                                    </div>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderListLogic(props)}
                    </tbody>
                </table>
                
            </div>
        </div>
      </div>
    )
  }
  
  
  export default LogicTable;