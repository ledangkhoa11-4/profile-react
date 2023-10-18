import React, { Component } from 'react';
import Select from 'react-select';
import ListSpecificTarget from './ListSpecificTarget';
import Alert from 'react-s-alert';
import CustomTags from 'components/CustomTags';
import {
    isEmpty,
    cloneDeep,
  } from 'lodash';
import {
    EXTEND_OPTION_TYPE,
  } from '../../../../constant';
  import {
    REGEX,
    APIs
  } from 'services/config';
  import {
    requestAPI,
  } from 'services/utils';
const localeCreate = window.locale.Create;
class SpecificTarget extends Component{
    constructor(props){
        super(props);
        this.state={
            categoryTargetOption: null,
            search: '',
            isShowQuestionDetail: false,
            QuestionDetail: [],
            listTargetOptionSearch: cloneDeep(props.listTargetOption)
        }
    }
    renderOptionSpecificTarget = () =>{
        return  this.props.listTargetOption.map((target) =>{
            return {
                value: target.id,
                label: target.name,
            }
        })
    }
    onChangeTargetOption = (val) => {
        this.setState({
            categoryTargetOption: val,
        },() => this.searchTargetOptions());
    }
    onChangeSearch = (e) =>{
        const { value } = e.target;
        this.setState({
            search: value
        })
    }
    showQuestionDetail = (question) => {
        this.setState({
            QuestionDetail: question,
            isShowQuestionDetail: true
        })
    }
    closeQuestionDetail = () =>{
        this.setState({
            QuestionDetail: [],
            isShowQuestionDetail: false
        })
    }
    searchTargetOptions = () => {
        let category_id, search;
      
        if(!isEmpty(this.state.categoryTargetOption)){
            category_id = this.state.categoryTargetOption.value
        }
        if(this.state.search !== ''){
            search = this.state.search
        }
        requestAPI({
            url: APIs.target.searchTargetOptions.url,
            method: APIs.target.searchTargetOptions.method,
            dataForm:{
                category_id: category_id,
                search: search
            }
          }).then(res => {
            if(res.success){
                this.setState({
                    listTargetOptionSearch: res.data
                })
            }
          })
    }
    render(){
        const class_extend_option = !isEmpty(this.props.formState.extendsOptTypeTags) ? 'box-extend-option active' : 'box-extend-option';
        let regex, extendsOptType;
        switch(this.props.formState.extendsOptType.value) {
            case 'email':
            regex = REGEX.EMAIL;
            extendsOptType = this.props.localeCreate.EXTEND_OPTION_TYPE_LABEL.EMAIL;
            break;
            case 'phone':
            regex = REGEX.DIGIT;
            extendsOptType = this.props.localeCreate.EXTEND_OPTION_TYPE_LABEL.PHONE;
            break;
            default:
            extendsOptType = this.props.localeCreate.EXTEND_OPTION_TYPE_LABEL.ID;
            regex = /.*/;
        }
        return(
            !this.state.isShowQuestionDetail ?
                this.props.formState.isShowExtendsOptTypeDetail ?
                    <div className="row">
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <div className="question-target-detail">
                                <div className="title">
                                    {localeCreate.title_list_extends_option} {extendsOptType}
                                </div>
                                <div className="box-body-extend-option-detail">
                                    <div className="row">
                                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                            <div className="sub-title">
                                                {localeCreate.sub_title_list_extends_option} {extendsOptType} <span>{localeCreate.description_input_list_extends_option.replace(':extends', extendsOptType)}</span>
                                            </div>
                                            <div className="input-extend-option">
                                                <CustomTags
                                                    value={this.props.formState.extendsOptTypeTags}
                                                    onChange={this.props.onChangeExtendOptType}
                                                    validationRegex={regex}
                                                    onValidationReject={() => {
                                                        Alert.error(this.props.localeCreate.ERROR_EXTEND_TYPE)
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                            <div className="sub-title">
                                                {localeCreate.messages_input_file_txt} <span>{localeCreate.messages_description_input_file_txt.replace(':extends', extendsOptType)}</span>
                                            </div>
                                            <div className="input-file">
                                                <a
                                                    className="btn"
                                                    role="button"
                                                    onClick={() => this.txtInput.click()}
                                                >
                                                    {localeCreate.messages_choose_file_txt}
                                                </a>
                                                <div className="status">
                                                    {this.props.formState.statusInputTxt}
                                                </div>
                                                <input
                                                    ref={(node) => {
                                                        if (node) {
                                                        this.txtInput = node;
                                                        }
                                                    }}
                                                    type="file"
                                                    id="extend-option-txt"
                                                    name="txt-file"
                                                    className="hidden"
                                                    onChange={this.props.onChangeInputTXT}
                                                    accept="text/plain"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="group-btn-action-item-target">
                                    <a
                                        className="btn" 
                                        role="button"
                                        onClick={this.props.hideExtendsOptTypeSelectBox}
                                    >
                                        {localeCreate.messages_back}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                : 
                    <div className="row">
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <div className="box-list-specific-target">
                                <div className="box-search-specific-target">
                                    <div className="row">
                                        <div className="col-xs-12 col-sm-4 col-md-3 col-lg-3">
                                            <Select
                                                name="categoryTargetOption"
                                                searchable={false}
                                                multi={false}
                                                removeSelected={false}
                                                closeOnSelect={true}
                                                className="custom-select-target"
                                                placeholder='Nhóm mục tiêu'
                                                options={this.renderOptionSpecificTarget()}
                                                value={this.state.categoryTargetOption}
                                                onChange={this.onChangeTargetOption}
                                            />
                                        </div>
                                        <div className="col-xs-12 col-sm-8 col-md-9 col-lg-9">
                                            <div className="search-target">
                                                <input
                                                    type="text"
                                                    placeholder={localeCreate.Search_for_targets}
                                                    className="form-control"
                                                    value={this.state.search}
                                                    onChange={this.onChangeSearch}
                                                    onKeyUp={(e) => {
                                                        if(e.keyCode === 13){
                                                            this.searchTargetOptions()
                                                        }
                                                    }}
                                                />
                                                <a
                                                    onClick={() => this.searchTargetOptions()}
                                                >
                                                    <span className="fa fa-search"></span>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="list-specific-target">
                                    <ul>
                                        <ListSpecificTarget 
                                        showQuestionDetail={this.showQuestionDetail}
                                        listTargetOptionSearch={this.state.listTargetOptionSearch}
                                        {...this.props} />
                                        {/* <li>
                                            <div className="row">
                                                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                                    <div className="title-target">
                                                        {this.props.localeCreate.QUESTION_TARGET_TITLE}
                                                    </div>
                                                </div>
                                                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                                    <div className="container-item-answer-target">
                                                        <div className="row">
                                                            {renderQuestionOption(this.props)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li> */}
                                        {
                                            this.props.isAdmin ?
                                                <li>
                                                    <div className="row">
                                                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                                            <div className="title-target">
                                                                {this.props.localeCreate.EXTEND_OPTION_TYPE_TITLE}
                                                            </div>
                                                        </div>
                                                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                                            <div className="container-item-answer-target">
                                                                <div className="row">
                                                                    <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                                                                        <div className={class_extend_option}>
                                                                            <Select
                                                                                className="custom-select"
                                                                                searchable={false}
                                                                                clearable={false}
                                                                                options={EXTEND_OPTION_TYPE}
                                                                                value={this.props.formState.extendsOptType}
                                                                                onChange={this.props.onChangeExtendsOptTypeSelectBox}
                                                                                placeholder={this.props.localeCreate.SL_EXTEND_OPT_TYPE_LABEL}
                                                                            />
                                                                            <div className="icon">
                                                                                <span className="fa fa-angle-right"></span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            : 
                                                null

                                        }
                                       
                                    </ul>
                                </div>
                                <div className="btn-back-basic-target">
                                    <a
                                        className="btn"
                                        role="button"
                                        onClick={this.props.toggleOptionTarget}
                                    >
                                        {localeCreate.messages_back}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
            : 
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div className="question-target-detail">
                            <div className="title">
                                {this.state.QuestionDetail.name}
                            </div>
                            {
                                this.state.QuestionDetail.answer.map((item, idx) =>{
                                    const type = this.state.QuestionDetail.type === '0' ? "radio" : "checkbox";
                                    const questionid = this.state.QuestionDetail.id;
                                    return  <div key={idx} className='custom-check-option'>
                                                <div className="custom-checkbox-1">
                                                    <input
                                                        id={`answer_${item.id}`}
                                                        type='checkbox'
                                                        value={item.id}
                                                        checked={typeof this.props.formState.answerSelected[questionid] !== 'undefined' && this.props.formState.answerSelected[questionid].indexOf(item.id) > -1}
                                                        onChange={(e) => this.props.onChangeAnswers(type, questionid, e)}
                                                    />
                                                    <div className={`checkbox-visible ${type}`}></div> 
                                                </div>
                                                <label htmlFor={`answer_${item.id}`} className="text-settings noselect">
                                                    {item.name}
                                                </label>
                                            </div>
                                })
                            }
                            <div className="group-btn-action-item-target">
                                <a
                                    className="btn" 
                                    role="button"
                                    onClick={() => this.closeQuestionDetail()}
                                >
                                    {localeCreate.messages_back}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
        )
    }

}


export default SpecificTarget;
