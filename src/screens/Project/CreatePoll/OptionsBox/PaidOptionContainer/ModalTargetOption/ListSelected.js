import React from 'react';
import {
    INPUT_NAME,
  } from '../../../../constant';
import {
    genderOpt
} from 'services/config';
import {
    map,
    isEmpty,
    find
} from 'lodash';

const localeCreate = window.locale.Create;
const {
    AGE_FROM,
    AGE_TO,
    GENDER,
    CITY,
  } = INPUT_NAME;
  
const ListSelected = (props) => {
    let gender =  genderOpt[2].label;
    if(props.formState[GENDER]){
        if(props.formState[GENDER] === genderOpt[0].value){
            gender = genderOpt[0].label
        }else{
            if(props.formState[GENDER] === genderOpt[1].value){
                gender = genderOpt[1].label
            }else{
                gender = genderOpt[2].label
            }
        }
    }
   
    function findName(questionId, type, answerId) {
       
        const { listTargetOption } = props;
        for (let i = 0, l = listTargetOption.length; i < l; i++) {
          const question = find(listTargetOption[i].question, { id: parseInt(questionId, 10) });
         
          if (!question) continue;
          if(type === 'question'){
              return question.name
          }
          const answer = find(question.answer, { id: parseInt(answerId, 10) });
          if (!answer) continue;
          return answer.name;
        }
        return null
    }
    return (
        <ul className="list-selected-object">
            {
                props.formState[CITY] && props.formState[CITY].length ?
                    <li>
                        <div className="selected-object">
                            <div className="label-object">
                                {localeCreate.Province_City}
                            </div>
                            <div className="value-object">
                                {props.formState[CITY].map(city => city.label).join(', ')}
                            </div>
                            <div className="remove-object">
                                <a
                                    onClick={() => props.clearItemTargetForm(CITY)}
                                >
                                    <img src={require('assets/images/x-mark-01.png')} />
                                </a>
                            </div>
                        </div>
                    </li>
                : null
            }
            {
                gender ? 
                    <li>
                        <div className="selected-object">
                            <div className="label-object">
                                {localeCreate.Gender_option}
                            </div>
                            <div className="value-object">
                                {gender}
                            </div>
                            <div className="remove-object">
                                <a
                                    onClick={() => props.clearItemTargetForm(GENDER)}
                                >
                                    <img src={require('assets/images/x-mark-01.png')} />
                                </a>
                            </div>
                        </div>
                    </li>
                : null
            }
            {
                props.formState[AGE_FROM] && props.formState[AGE_TO] ? 
                    <li>
                        <div className="selected-object">
                            <div className="label-object">
                                {localeCreate.OPTION_AGE}
                            </div>
                            <div className="value-object">
                                {
                                    props.formState[AGE_FROM] === 1 && props.formState[AGE_TO] === 100 ?
                                        localeCreate.OPTION_AGE_ALL
                                    :
                                        localeCreate.message_age_from + props.formState[AGE_FROM] + localeCreate.message_age_to + props.formState[AGE_TO]
                                }
                            </div>
                            <div className="remove-object">
                                <a
                                    onClick={() => props.clearItemTargetForm(AGE_FROM)}
                                >
                                    <img src={require('assets/images/x-mark-01.png')} />
                                </a>
                            </div>
                        </div>
                    </li>
                : null
            }
            {
                !isEmpty(props.formState.answerSelected) ?
                    map(props.formState.answerSelected,(item, idx) =>{
                        return  <li key={idx}>
                                    <div className="selected-object">
                                        <div className="label-object">
                                            {findName(idx, 'question', null)}
                                        </div>
                                        <div className="value-object">
                                            {
                                                !isEmpty(item) ? item.map(id => findName(idx, 'answer', id)).join(', ') : null
                                            }
                                        </div>
                                        <div className="remove-object">
                                            <a
                                                onClick={() => props.clearItemTargetForm('Option', idx)}
                                            >
                                                <img src={require('assets/images/x-mark-01.png')} />
                                            </a>
                                        </div>
                                    </div>
                                </li>
                    })
                : null
            }
            {
                !isEmpty(props.formState.extendsOptTypeTags) ?
                    <li>
                        <div className="selected-object">
                            <div className="label-object">
                                {props.localeCreate.EXTEND_OPTION_TYPE_TITLE}
                            </div>
                            <div className="value-object">
                                {props.formState.extendsOptTypeTags.length} {props.formState.extendsOptType.label}
                            </div>
                            <div className="remove-object">
                                <a
                                    onClick={() => props.clearItemTargetForm('Extend')}
                                >
                                    <img src={require('assets/images/x-mark-01.png')} />
                                </a>
                            </div>
                        </div>
                    </li>
                : null
            }
        </ul>
  )
}
export default ListSelected;