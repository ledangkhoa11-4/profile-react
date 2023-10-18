import React, { Component } from 'react';
import { isEmpty, find, map, reduce } from 'lodash';
import { ENUM, INPUT_NAME } from '../../../../constant';

const localeCreate = window.locale.Create;
const {
  AGE_FROM,
  AGE_TO,
  CITY,
  GENDER,
} = INPUT_NAME;
const {
  DATE,
  SINGLE,
  MULTI,
  RATING,
  SLIDER,
} = ENUM.QUESTION_TYPE;
const {
  IMAGE,
} = ENUM.ANSWER_TYPE;
class Item extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowList: false
        }
    }
    toggleShowList = () =>{
        this.setState({
            isShowList: !this.state.isShowList
        })
    }
    renderLogicCol = () => {
        if (isEmpty(this.props.logic)) {
            return ''
        }
        const {
            basicProfile,
            advanceProfile,
            questionInput,
        } = this.props.logic;
        const city = basicProfile[CITY] && basicProfile[CITY].length ?
            basicProfile[CITY].map(city => city.label) : '';
        const gender = basicProfile[GENDER] ? basicProfile[GENDER] : '';
        const ageFrom = basicProfile[AGE_FROM] || '';
        const ageTo = basicProfile[AGE_TO] || '';

        const renderBasicProfile = () =>{
            return `<strong>${localeCreate.OPTION_AGE}</strong>: ${!(ageFrom && ageFrom === 1 && ageTo === 100) ? `${ageFrom} ${localeCreate.only_message_to} ${ageTo}` : `${localeCreate.OPTION_AGE_ALL}`}
            , <strong>${localeCreate.GENDER}</strong>: ${gender && gender !== 'All' ? `${gender}` : `${localeCreate.ALL_OPTION_GENDER}`}
            ${city ? `, <strong>${localeCreate.CITY}</strong>: ${city.join(', ')}` : ``}`;
        }
        const rederListBasicProfile = () =>{
            return (
                <ul className="child-ul-basic">
                    {
                        !(ageFrom && ageFrom === 1 && ageTo === 100) ? 
                            <li className="item">
                                <strong>{localeCreate.OPTION_AGE}</strong>: {ageFrom} {localeCreate.only_message_to} {ageTo}
                            </li>
                        :
                            <li className="item">
                                <strong>{localeCreate.OPTION_AGE}</strong>: {localeCreate.OPTION_AGE_ALL}
                            </li>
                    }
                    {
                        gender && gender !== 'All' ?
                            <li className="item">
                                <strong>{localeCreate.GENDER}</strong>: {gender}
                            </li>
                        :
                            <li className="item">
                                <strong>{localeCreate.GENDER}</strong>: {localeCreate.ALL_OPTION_GENDER}
                            </li>
                    }
                    {
                        city ? 
                            <li className="item">
                                <strong>{localeCreate.CITY}</strong>: {city.join(', ')} 
                            </li>
                        : null
                    }
                </ul>
            )
        }
        const renderAdvanceProfile = () =>{
            if (isEmpty(advanceProfile)) {
                return '';
            }
            const _advanceProfile = reduce(advanceProfile, (result, item, profileKey) => {
                const profile = find(this.props.listTargetOption, { id: parseInt(profileKey, 10) })
                const questions = reduce(item, (result1, item1, questionKey) => {
                    if (isEmpty(item1)) return result1;
                    const answers = map(item1, obj => {
                        return obj.label
                    })
                    const question = find(profile.question, { id: parseInt(questionKey, 10) })
                    
                    const  _val = `<strong>${question.name}</strong>: ${answers.join(', ')}`;
                    
                    result1.push(_val)
                    return result1;
                }, [])

                if (isEmpty(questions)) return result

                const profileEl = `<strong>${profile.name}</strong>: ${questions.join(', ')}`

                result.push(profileEl);
                return result;
            }, [])
          
            if (isEmpty(_advanceProfile)) return ;
            
            return `${_advanceProfile.join(', ')}`
        }
        const renderListAdvanceProfile = () =>{
            if (isEmpty(advanceProfile)) {
                return '';
            }
            const _advanceProfile = reduce(advanceProfile, (result, item, profileKey) => {
                const profile = find(this.props.listTargetOption, { id: parseInt(profileKey, 10) })
                const questions = reduce(item, (result1, item1, questionKey) => {
                    if (isEmpty(item1)) return result1;
                    const answers = map(item1, obj => {
                        return obj.label
                    })
                    const question = find(profile.question, { id: parseInt(questionKey, 10) })
                    const _val =  <div>
                                <strong>{question.name}</strong>
                                <ul>
                                    {
                                        map(answers, (answer, idxx) => {
                                            return <li key={`item-advance-profile-answer${idxx}`}>
                                                        {answer}
                                                    </li>
                                        })
                                    }
                                </ul>
                            </div>
                    result1.push(_val)
                    return result1;
                }, [])
        
                if (isEmpty(questions)) return result
                const  profileEl =  <li>
                                        <strong>{profile.name}</strong>
                                        <ul>
                                        {
                                            map(questions, (question, idx) =>{
                                            return (
                                                <li className="item" key={`item-advance-profile-question${idx}`}>
                                                    {question}
                                                </li>
                                            )
                                            })
                                        }
                                        </ul>
                                    </li>
                result.push(profileEl);
                return result;
            }, [])
            if (isEmpty(_advanceProfile)) return ;
                
            return map(_advanceProfile, (advance, key) => {
                return (
                    <ul className="list-advance-profile" key={`item-advance-profile-${key}`}>
                        {advance}
                    </ul>
                )
            })
        }
        const renderQuestion = () =>{
            if (isEmpty(questionInput)) {
              return ;
            }
            const lists = map(questionInput, (q, keyQuestion) => {
                const _question = find(this.props.listQuestion, item => item.id === parseInt(keyQuestion, 10))
                const { question_type } = q;
                const _q = {...q};
                delete _q.question_type;
                const answers = reduce(_q, (result, value, keyAnswer) => {
                    const ans = find(_question.answer, item => item.id === parseInt(keyAnswer, 10))
                    if (!value) return result
                    let _answer;
                    if (question_type === SINGLE || question_type === MULTI) {
                        _answer = `${ans.value}`;
                    } else if (question_type === DATE) {
                        const date = new Date(value);
                        _answer = `${date.getDate()} - ${(date.getMonth() + 1)} - ${date.getFullYear()}`;
                    } else if (question_type === SLIDER) {
                        _answer = `${value}`;
                    } else if (question_type === RATING) {
                        _answer = `${value}<i className="fa fa-star"></i>`;
                    } else {
                        _answer = `${value}`;
                    }
                    result.push(_answer)
                    return result
                }, [])
                return `<strong>${_question.question }</strong>: ${answers.join(', ')}`
            })
            return `${lists.join(', ')}`
        }
        const renderListQuestion = () =>{
            if (isEmpty(questionInput)) {
              return ;
            }
            const lists = map(questionInput, (q, keyQuestion) => {
                const _question = find(this.props.listQuestion, item => item.id === parseInt(keyQuestion, 10))
                const { question_type } = q;
                const _q = {...q};
                delete _q.question_type;
            
                const answers = reduce(_q, (result, value, keyAnswer) => {
                    const ans = find(_question.answer, item => item.id === parseInt(keyAnswer, 10))
                    if (!value) return result
                    let _answer;
                    if (question_type === SINGLE || question_type === MULTI) {
                        _answer = ans.value_type === IMAGE 
                        ?
                            <div className="box-answer">
                                <img src={ans.fullValue} alt="answer image"/>
                                <div className="answer">
                                {ans.value}
                                </div>
                            </div>
                        : 
                            <div className="answer">{ans.value}</div>;
                    } else if (question_type === DATE) {
                        const date = new Date(value);
                        _answer = <div>{date.getDate()} - {(date.getMonth() + 1)} - {date.getFullYear()}</div>;
                    } else if (question_type === SLIDER) {
                        _answer = <div><div className="slider-answer"> {value} </div> <span className="iconmoon1-slide"></span></div>;
                    } else if (question_type === RATING) {
                        _answer = <div><div className="slider-answer"> {value} </div> <span className="fa fa-star"></span></div>;
                    } else {
                        _answer = <div>{value}</div>;
                    }
                    result.push(_answer)
                    return result
                }, [])
                return (
                    <span>
                      <i className="poll-survey-name">{_question.question }</i>
                      <ul className="poll-survey-questions">
                        {
                          map(answers, (answer, idx) => {
                            return (
                              <li key={`item-list-answer-quesion${idx}`}>
                                {answer}
                              </li>
                            )
                          })
                        }
                      </ul>
                    </span>
                )
            })
            return map(lists, (item, key) => {
                return (
                    <div className="item" key={`item-list-quesion${key}`}>
                    {item}
                    </div>
                )
            })

        }
        if(this.state.isShowList){
            return (
                <ul className="basic-info">
                        {
                            !isEmpty(basicProfile) ?
                            <li> 
                                <React.Fragment>
                                    <strong>{localeCreate.basic_info}</strong>
                                    {rederListBasicProfile()}
                                </React.Fragment>
                            </li>
                            : null
                        }
                    
                        {
                            !isEmpty(advanceProfile) ? 
                            <li>
                                <React.Fragment>
                                    <strong>{localeCreate.advanced_info}</strong>
                                    {renderListAdvanceProfile()}
                                </React.Fragment>
                            </li>
                            : null
                        }
                    
                        {
                            !isEmpty(questionInput) ?
                            <li>
                                <React.Fragment>
                                    <strong>{localeCreate.previous_question}</strong>
                                    {renderListQuestion()}
                                </React.Fragment>
                            </li>
                            : null

                        }
                    
                </ul>
            )
        }else{
            return `${!isEmpty(basicProfile) ? renderBasicProfile() : `` }
                    ${!isEmpty(advanceProfile) ? `, ${renderAdvanceProfile()}` : `` }
                    ${!isEmpty(questionInput) ? `, ${renderQuestion()}` : `` }`
        }
    }
    renderDestinationCol = () => {
        const { questionOutput } = this.props.logic;
        
        if (!questionOutput) {
          return '';
        }
        
        const question = find(this.props.listQuestion, { id: questionOutput })
        return question ? question.question : ''
    }
    renderList = () =>{
        return (
            <div className="row wrap-condition-detail" onClick={() => this.toggleShowList()}>
                <div className="col-xs-12 clear-pd">
                    <div className="condition-detail">
                        <div className="title-detail">{localeCreate.detail_condition}</div>
                        {this.renderLogicCol()}
                        <div className="destination">
                            <div className="title-destination">{localeCreate.target_question}: </div>
                            <div className="destination-question"> {this.renderDestinationCol()} </div>
                        </div>
                        <a className="toggle-row">
                            <span className="fa fa-chevron-up"></span>
                        </a>
                    </div>
                    <ul className="list-inline">
                        <li className="pull-right">
                            <a
                                type="button"
                                className="btn-delete"
                                onClick={(e) => this.props.removeOneLogic(this.props.index)}
                            >
                                <span className="fa fa-trash-o"/> {localeCreate.DELETE_GROUP_TARGET_BUTTON}
                            </a>
                        </li>
                        <li className="pull-right">
                            <a
                                type="button"
                                className="btn-edit"
                                onClick={(e) => this.props.selectCurrentLogic(this.props.logic, this.props.index)}
                            >
                                <span className="fa fa-pencil"/> {localeCreate.messages_edit_target}
                            </a>
                        </li>
                    </ul>
                </div>
            </div>  
        )
    }
    renderRow = () =>{
        return (
            <div className="row" onClick={() => this.toggleShowList()}>
                <div className="col-xs-5 pd-10 list-content">
                    <span
                        dangerouslySetInnerHTML={{
                        __html: this.renderLogicCol()
                        }}
                    />
                </div>
                <div className="col-xs-7 list-content">
                    <div className="box_logic_target_question">
                        <div className="target-question">
                            { this.renderDestinationCol()}
                        </div>
                        <a className="toggle-row">
                            <span className="fa fa-chevron-down"></span>
                        </a>
                    </div>
                </div>
            </div>
        )
    }
    render(){
        const _classShow = this.state.isShowList ? 'active' : '';
        return (
            <tr className={_classShow}>
                <td> { this.props.index }</td>
                <td>
                    {
                        this.state.isShowList ? this.renderList() : this.renderRow()
                    }
                </td>
                
            </tr>
        )
    }
}
export default Item;