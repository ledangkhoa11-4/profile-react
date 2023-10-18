import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Alert from 'react-s-alert';
import Select from 'react-select';
import merge from 'deepmerge';
import { find, isEmpty } from 'lodash';
import moment from 'moment';
import CustomDatetimePicker from 'components/CustomDatetimePicker';
import {
  INPUT_NAME,
  QUESTION_TYPES_OPTION,
  ENUM
} from '../../constant';
import Description from 'components/Description';
import {
    jsonEqual,
    validateImage,
    convertDateToString
} from 'services/utils';
import AnswerList from './AnswerList';
const {
  POLL_NAME,
  QUESTION_TYPE,
  DESCRIPTION,
  FROM_DATE,
  TO_DATE,
} = INPUT_NAME;
const localeCreate = window.locale.Create;
const localeCommon = window.locale.Common;

class AddPollForm extends Component {
    constructor(props) {
        super(props);
        let fromDate, toDate, question = '';
        if (props.pollInfo[FROM_DATE]) {
            fromDate = moment(new Date(props.pollInfo[FROM_DATE]));
            toDate = moment(new Date(props.pollInfo[FROM_DATE])).add(10, 'years');
        } else {
            fromDate = moment();
            toDate = moment().add(10, 'years');
        }
        if(props.pollInfo.question){
            question = props.pollInfo.question.question;
        }
        
        this.state = {
            categorySelected: undefined,
            projectSelected: props.projectInfo,
            [POLL_NAME]: '',
            isValidCategory: true,
            isValidPollName: true,
            isValidDescription: true,
            [QUESTION_TYPE]: QUESTION_TYPES_OPTION[0],
            isShowDescipbe: false,
            [DESCRIPTION]: question,
            [FROM_DATE]: fromDate,
            [TO_DATE]: toDate,
            isShowTO_DATE: false,
            image: '',
        }
    }
    componentDidMount(){
        if (this.props.pollInfo) {
            this.initStateData(this.props)
        }
    }
    initStateData(props) {
        if(isEmpty(props.pollInfo)){
            return;
        }
        const _state = {
            isShowTO_DATE: props.pollInfo.show_to_date || false
        };
        if (props.pollInfo.question && props.pollInfo.question.media_type === ENUM.QUESTION_MEDIA_TYPE.IMAGE) {
            _state.image = props.pollInfo.question.fullMedia;
        }
        if(props.pollInfo.question && props.pollInfo.question.question){
            _state[DESCRIPTION] = props.pollInfo.question.question;
            _state.isShowDescipbe = true;
        }
        if(props.pollInfo[FROM_DATE]){
            _state[FROM_DATE] = moment(new Date(props.pollInfo[FROM_DATE]));
            _state[TO_DATE] = moment(new Date(props.pollInfo[TO_DATE]));
        }
        this.setState(_state);
    }
    componentWillReceiveProps(nextProps) {
        const {
          pollInfo,
          listCategories,
          projectInfo,
        } = nextProps;
        let categorySelected = listCategories[0] || {},
            projectSelected = projectInfo;
        if (jsonEqual(this.props, nextProps)) {
          return;
        }
        if (pollInfo.id) {
          categorySelected = find(listCategories, { value: pollInfo.category_id });
          const questionTypeString = pollInfo.question && pollInfo.question.question_type;
          const questionType = find(QUESTION_TYPES_OPTION, item => {
            return item.value.indexOf(questionTypeString) > -1;
          })
          
          this.initStateData(nextProps)
          this.setState({
            categorySelected,
            projectSelected,
            [POLL_NAME]: pollInfo.name,
            [QUESTION_TYPE]: questionType,
          })
        } else if (!isEmpty(projectInfo)) {
          this.setState({
            projectSelected,
          })
        }
    }
    onChangePollName = (e) => {
        this.setState({ [POLL_NAME]: e.target.value });
    }
    changeQuestionType = (val) => {
        this.setState({
          [QUESTION_TYPE]: val,
        },() =>{
            if((this.state[QUESTION_TYPE].value.indexOf(ENUM.QUESTION_TYPE.SINGLE) > -1 || this.state[QUESTION_TYPE].value.indexOf(ENUM.QUESTION_TYPE.MULTI) > -1) 
            && !this.props.isDisableEdit && this.answersEl && !isEmpty(this.props.pollInfo) && this.state[QUESTION_TYPE].value.indexOf(this.props.pollInfo.question.question_type) === -1){
                this.answersEl.toggleMultiChoice();
            }
        })
    }
    showHideDescripbe = () =>{
        this.setState({
            isShowDescipbe: !this.state.isShowDescipbe
        })
    }
    onChangeDESCRIPTION = (data) =>{
        this.setState({
            [DESCRIPTION]: data
        }) 
    }
    renderAnswers(question, answers) {
        if (this.props.isCreatePoll || Array.isArray(answers)) {
          return <AnswerList
            ref={node => {
              if (node) {
                this.answersEl = node;
              }
            }}
            localeCreate={localeCreate}
            isCreatePoll={this.props.isCreatePoll}
            pollDataFromDashboard={this.props.pollDataFromDashboard}
            question={question}
            questionType={this.state[QUESTION_TYPE]}
            answers={answers}
            isDisableEdit={this.props.isDisableEdit}
          />;
        }
        return null;
    }
    handlePreviewImg = (e) => {
        if (!validateImage(e.target)) {
          return;
        }
        
        const file = e.target.files[0] || '';
        let reader = new FileReader();
        if (!file) {
          return this.setState({
            image: '',
          });
        }
    
        if (this.timeout) {
          clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(() => {
          reader.onloadend = () => {
            this.setState({
              image: reader.result,
            });
          }
          
          reader.readAsDataURL(file);
        }, 50);
    }
    clearImage = () =>{
        this.imgInput.value = '';
        this.setState({
            image: '',
        })
    }
    onChangeProjectCategory = (subState) => {
        this.setState({...this.state, ...subState});
    }
    onChangeShowToDate = () => {
        if(!this.state.isShowTO_DATE && !this.props.pollInfo.show_to_date){
            this.setState({
                isShowTO_DATE: true,
                [TO_DATE]: moment().add( 2, 'days')
            })
        }else{
            this.setState({
                isShowTO_DATE: !this.state.isShowTO_DATE
            })
        }
        
    }
    onChangeToDate = (val) =>{
        this.setState({
            [TO_DATE]: val
        })
    }
    validateQuestionBox = () => {
        const isValidProjectCategory = this.validateProjectCategory(); // done
        const isValidPollName = this.validatePollName(); // done
        const isValidDescription = this.validateDescription(); // done
        const isValidAnswers = this.answersEl.validateAnswers();  // done
        return  isValidProjectCategory && isValidPollName && isValidDescription && isValidAnswers;
    }
    validateProjectCategory = () => { // done
        let isValidCategory = true;
        if (!this.state.categorySelected || !this.state.categorySelected.value) {
          isValidCategory = false;
          Alert.error(localeCreate.REQUIRED_CATEGORY_MSG, {
            timeout: 5000,
          })
        }
        this.setState({
          isValidCategory,
        });
        return isValidCategory;
    }
    validatePollName = () => { // done
        let isValidPollName = true;
        if (!this.state[POLL_NAME]) {
          isValidPollName = false;
          Alert.error(localeCreate.REQUIRED_POLL_NAME_MSG, {
            timeout: 5000,
          })
        }
        this.setState({ isValidPollName });
        return isValidPollName;
    }
    validateDescription = () => {
        if(!this.state.isShowDescipbe){
            return true;
        }
        let isValidDescription = true;
    
        if (!this.state[DESCRIPTION]) {
            isValidDescription = false;
            Alert.error(localeCreate.REQUIRED_DESCRIPTION_MSG, {
                timeout: 5000,
            })
        }
        this.setState({
            isValidDescription,
        });
        return isValidDescription;
    }
    getQuestionBoxData() {
        const media = { media_type: ENUM.QUESTION_MEDIA_TYPE.TEXT };
        if (this.state.image) {
            media.media = this.state.image;
            media.media_type = ENUM.QUESTION_MEDIA_TYPE.IMAGE;
        }
        const questionData = this.getQuestion();
       
        const answersData = this.answersEl.getDataEditing();
        const pollData = {
          poll: {
            project_id: this.state.projectSelected.value,
            category_id: this.state.categorySelected.value,
            name: this.state[POLL_NAME],
            show_to_date: this.state.isShowTO_DATE ? true : false,
            [FROM_DATE]: convertDateToString(this.state[FROM_DATE].toDate()),
            [TO_DATE]: this.state.isShowTO_DATE ? convertDateToString(this.state[TO_DATE].toDate()) : convertDateToString(moment().add(10, 'years').toDate())
          },
        };
        return merge.all([questionData, answersData, pollData]);
    }
    getQuestion() {
        const media = { media_type: ENUM.QUESTION_MEDIA_TYPE.TEXT };
        if (this.state.image) {
          media.media = this.state.image;
          media.media_type = ENUM.QUESTION_MEDIA_TYPE.IMAGE;
        }
        return {
          question: {
            question: this.state[DESCRIPTION],
            ...media,
          }
        };
    }
    getTodate(){
        return this.state.isShowToDate ? this.state[TO_DATE] : moment().add(10, 'years');
    }
    render(){
        const {
            pollInfo,
            pollDataFromDashboard,
            isDisableEdit,
        } = this.props;
        let question, answers;
      
        if (pollDataFromDashboard && !isEmpty(pollDataFromDashboard)) {
            question = pollDataFromDashboard.question;
            answers = question.answer;
        } else {
            question = pollInfo.question || {};
            answers = question.answer || {};
        }
       
        return(
            <div className="div-box box-create-poll">
                <div className="box-main-setting">
                    <div className="name-project">
                        {this.props.projectInfo.label}
                    </div>
                    <div className="title">
                        {localeCreate.CREATE_POLL_BUTTON}
                    </div>
                    <div>
                        <div className="row">
                            <div className="col-xs-12 col-sm-8">
                                <div className="form-group">
                                    <input
                                        className="input form-control"
                                        placeholder={localeCreate.POLL_NAME}
                                        name={POLL_NAME}
                                        value={this.state[POLL_NAME]}
                                        onChange={this.onChangePollName}
                                    />
                                    {
                                        !this.state.isValidPollName ?
                                            <span className="placeholder-error">
                                            {localeCommon.REQUIRED_FIELD_MSG}
                                            </span> : null
                                    }
                                </div>
                            </div>
                            <div className={`col-xs-12 col-sm-4 custom-select-question-type ${this.state[QUESTION_TYPE].value}-question`}>
                                <div className="form-group">
                                    <Select
                                        clearable={false}
                                        searchable={false}
                                        placeholder={localeCreate.QUESTION_TYPE_HOLDER}
                                        value={this.state[QUESTION_TYPE]}
                                        onChange={this.changeQuestionType}
                                        options={QUESTION_TYPES_OPTION}
                                        disabled={isDisableEdit}
                                        className="custom-icon-select"
                                    />
                                </div>
                            </div>
                            <div className="col-xs-12">
                                <div className="form-group">
                                    {
                                        this.state.isShowDescipbe ? 
                                            <a role="button" title={localeCreate.HIDE_DESCRIPTION} className="add-describe"
                                            onClick={() => {
                                                this.showHideDescripbe()
                                            }}>
                                                <span className="fa fa-minus"></span>
                                                <span className="text">&nbsp;{localeCreate.HIDE_DESCRIPTION}</span>
                                            </a>
                                        : 
                                            <a role="button" title={localeCreate.ADD_DESCRIPTION} className="add-describe"
                                            onClick={() => {
                                                this.showHideDescripbe()
                                            }}>
                                                <span className="fa fa-plus"></span>
                                                <span className="text">&nbsp;{localeCreate.ADD_DESCRIPTION}</span>
                                            </a>
                                    }
                                </div>
                            </div>
                            {
                                this.state.isShowDescipbe ?  
                                    <Description 
                                        data={this.state[DESCRIPTION]}
                                        onChange={this.onChangeDESCRIPTION}
                                        isValidDescription={this.state.isValidDescription}
                                    />
                                : null
                            }
                            { this.renderAnswers(question, answers) }
                        </div>
                        <div className="row box-setting-img-and-category">
                            <div className="col-sm-6">
                                <div className="create-img-poll">
                                    <div className="title">
                                        {localeCreate.TITLE_THUMB_POLL_AND_SURVEY}
                                    </div>
                                    <div className="review-img-poll">
                                        {
                                             this.state.image ?
                                                <div className="review-img">
                                                    <a
                                                        onClick={this.clearImage}
                                                    >
                                                        <img src={this.state.image} alt="preview img"/>
                                                    </a>
                                                </div>
                                             :
                                                <a
                                                    onClick={()=>{
                                                        this.imgInput.click()
                                                    }}
                                                >
                                                    <div className="default-img">
                                                        <img src={require('assets/images/img-poll.png')} alt="default img"/>
                                                        <div className="text-size">
                                                            {localeCreate.SZE_THUMB_POLL}
                                                        </div>
                                                    </div>
                                                </a>
                                                
                                        }
                                        <input
                                        ref={(node) => {
                                            if (node) {
                                            this.imgInput = node;
                                            }
                                        }}
                                        type="file"
                                        id="question-image"
                                        name="question-image"
                                        className="hidden"
                                        onChange={this.handlePreviewImg}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="add-category-and-to-date">
                                    <div className="add-category">
                                        <div className="title">
                                            {localeCreate.CATEGORY}
                                        </div>
                                        <div>
                                            <Select
                                            className="custom-select"
                                            name={INPUT_NAME.CATEGORY}
                                            clearable={false}
                                            searchable={false}
                                            options={this.props.listCategories}
                                            onChange={(val) => {
                                                this.onChangeProjectCategory({categorySelected: val})
                                            }}
                                            placeholder={localeCreate.CATEGORY}
                                            value={this.state.categorySelected}
                                            />
                                            {
                                            !this.state.isValidCategory ?
                                                <span className="placeholder-error">
                                                {localeCommon.REQUIRED_FIELD_MSG}
                                                </span> : null
                                            }
                                        </div>
                                    </div>
                                    <div className="choose-to-date noselect">
                                        <div className="answer-advanced-settings">
                                            <div className="custom-checkbox-1">
                                                <input
                                                    id="isShowTO_DATE"
                                                    name="isShowTO_DATE"
                                                    type="checkbox"
                                                    checked={this.state.isShowTO_DATE}
                                                    onChange={this.onChangeShowToDate}
                                                />
                                                <div className="checkbox-visible"></div> 
                                            </div>
                                            <label htmlFor="isShowTO_DATE" className="text-settings">
                                                {localeCreate.Customize_the_end_date}
                                            </label>
                                        </div>
                                    </div>
                                    {
                                        this.state.isShowTO_DATE ?
                                            <div>
                                                <CustomDatetimePicker
                                                    id={TO_DATE}
                                                    name={TO_DATE}
                                                    dateFormat="DD-MM-YYYY HH:mm"
                                                    minDate={this.state[FROM_DATE]}
                                                    selected={this.state[TO_DATE]}
                                                    onChange={(val) => this.onChangeToDate(val)
                                                    }
                                                    calendarClassName="custom"
                                                />
                                            </div>
                                        : null
                                    }
                                   
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}
AddPollForm.propTypes = {
    isCreatePoll: PropTypes.bool,
    projectInfo: PropTypes.object.isRequired,
    listCategories: PropTypes.array.isRequired,
    pollInfo: PropTypes.object,
  }
  
  export default AddPollForm;
