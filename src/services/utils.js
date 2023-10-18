import React from 'react';
import Select from 'react-select';
import Alert from 'react-s-alert';
import axios from 'axios';
import {
  isEmpty,
  isNumber,
  filter,
  find,
  forEach,
  map,
  range,
  reduce,
} from 'lodash';
import { APIs, BASE_URL, REGEX, genderOpt } from './config';
import store from 'store';
import {
  startRequest,
  receivedRequest,
  failureRequest,
} from 'actions/requestAPIsAction';
import { INPUT_NAME } from 'screens/Project/constant';

const localeCommon = window.locale.Common;
const localeProfile = window.locale.Profile;
const localeCreate = window.locale.Create;

export const isMobile = () => {
  return window.Modernizr.mq('(max-width: 768px)');
};

export const renderInputField = ({
  input, id, label, type, className, readOnly,
  meta: { touched, error, warning }
}) => {
  return (
    <span>
      <input
        {...input}
        id={id}
        placeholder={label}
        type={type}
        className={className}
        readOnly={readOnly}
      />
      {
        touched &&
        (
          (error && <div className="placeholder-error">{error}</div>) ||
          (warning && <div className="placeholder-warning">{warning}</div>)
        )
      }
    </span>
  )
};

export const renderReactSelect = ({
  input, id, valueSelect, options, searchable,
  meta: { touched, error, warning }
  
}) => {
  return (
    <span>
      <Select
        {...input}
        id={id}
        name={input.name}
        options={options}
        searchable={false}
        clearable={false}
        onChange={(value) => {
          if(value !== null && typeof value.value !== 'undefined' && value.value !== null){
            input.onChange(value.value)
          }
        }}
      />
      {
        touched &&
        (
          (error && <div className="placeholder-error">{error}</div>) ||
          (warning && <div className="placeholder-warning">{warning}</div>)
        )
      }
    </span>
  )
};

export const VALIDATION = {
  required: (value, msg) => {
    return value ? undefined : localeCommon.REQUIRED_FIELD_MSG
  },
  password: (value, msg) => {
    return value.match(REGEX.PASSWORD) ? undefined : localeCommon.ERROR_PASSWORD_MSG;
  },
  email: (value, msg) => {
    return value.match(REGEX.EMAIL) ? undefined : localeCommon.ERROR_EMAIL_MSG;
  },
  digit: (value, msg) => {
    return value.match(REGEX.DIGIT) ? undefined : localeCommon.ERROR_NUMBER_MSG;
  },
};

export const getDateInMonth = (month, year) => {
  switch(month) {
    case 2:
      return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 29 : 28;
    case 4:
    case 6:
    case 9:
    case 11:
      return 30;
    default:
      return 31;
  }
}

export const getDateOptions = (month, year) => {
  const maxDate = getDateInMonth(month, year)
  return range(1, maxDate + 1).map(item => ({ value: item, label: item }));
}

export const getMonthOptions = () => range(1, 13).map(item => ({ value: item, label: item }));
export const getYearOptions = () => {
  const currentYear = new Date().getFullYear();
  return range(1900, currentYear + 1).map(item => ({ value: item, label: item }));
};

export const handlingError = (error, processError = () => {}) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
    typeof processError === 'function' && processError(error);
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    console.log(error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log('Error', error.message);
  }
  console.log(error.config);
}

export const getCookie = (cname) => {
  if (process.env.NODE_ENV === 'development') {
    /* admin window.uuid = 'BKTUHEhazmDlR968YULlMmt3EOyNqHT1KPMx3a96CCnUgXNWpxHiQ5yTKT9Q' */
    /* user window.uuid = 'XnExQuga5gMmqh1ZuwH5kHM3Bra1jRO4C9Jia4Vb9sdd52CGxts4igGswiSZ' */
    window.uuid = 'SoT3Mt6PzU5OzzIytjt3QGo7NBdbKs7aRCFSWb7pc6dtzMIUHd1tzlfScIGg'
    return window.uuid;
  }

  const name = cname + '=';
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
          c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
          return c.substring(name.length, c.length);
      }
  }
  return '';
}

export const getTokenCookie = () => {
  const tokenKey = 'uuid';
  return getCookie(tokenKey);
}

export const setSessionStorage = (ssName, ssValue) => {
  if (!ssName) {
    return false;
  }
  window.sessionStorage.setItem(ssName, ssValue);
}

export const getSessionStorage = (ssName) => {
  if (!ssName) {
    return '';
  }
  return window.sessionStorage.getItem(ssName);
}

export const requestAPI = (entry) => {
  const {
    method,
    url,
    dataForm,
    contentType,
  } = entry;
  const isShowPageLoading = typeof entry.isShowPageLoading === 'boolean' ?
                              entry.isShowPageLoading : true;
  const token = getTokenCookie();
  const header = {
    Authorization: `Bearer ${token}`,
  };

  if (contentType) {
    header['content-type'] = contentType;
  }
  
  isShowPageLoading && store.dispatch(startRequest());

  return new Promise((resolve, reject) => {
    axios({
      url,
      method,
      data: dataForm,
      headers: header,
    }).then(res => {
      resolve(res.data);
      isShowPageLoading && store.dispatch(receivedRequest());
    }).catch(error => {    
      console.log('Error: ', error);
      if (error.response) {
        reject(error.response.data);
      }
      isShowPageLoading && store.dispatch(failureRequest());
    });
  })
}


export const onScroll = () => {
  // http://stackoverflow.com/questions/9439725/javascript-how-to-detect-if-browser-window-is-scrolled-to-bottom
  return new Promise((resolve) => {
    var scrollTop = (document.documentElement && document.documentElement.scrollTop) ||           
    document.body.scrollTop;
    var scrollHeight = (document.documentElement && document.documentElement.scrollHeight) || 
            document.body.scrollHeight;
    var clientHeight = document.documentElement.clientHeight || window.innerHeight;
    var scrolledToBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;
  
    if (scrolledToBottom) {
      resolve();
    }
  })
}

export const getAssetsURL = (path) => {
  return BASE_URL + path;
}

export const jsonEqual = (a,b) => {
  return JSON.stringify(a) === JSON.stringify(b);
}

export const convertDateToString = (dateObj) => {
  return dateObj.getFullYear() + '-' +
    ('0' + (dateObj.getMonth()+1)).slice(-2) + '-' +
    ('0' + dateObj.getDate()).slice(-2) + ' ' +
    ('0' + dateObj.getHours()).slice(-2) + ':' +
    ('0' + dateObj.getMinutes()).slice(-2) + ':' +
    ('0' + dateObj.getSeconds()).slice(-2);
}

export const removeScriptTagInString = (string) => {
  if (!string) {
    return '';
  }
  return string.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
}

export const formatPrice = (number = 0) => {
  if (!isNumber(number)) {
    return;
  }
  return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

export const isValidURL = (url) => {
  const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locater
    return pattern.test(url)
}

/*
* @array: array objects, and each objects must have an id attribute
*/
export const mapArrayToObject = (array, prefixKey = 'k_') => {
  return reduce(array, (result, item) => {
    // the key of an object must be a string, if
    // it is a number, the object's attribute will
    // auto arrange by itself
    const key = prefixKey ? `${prefixKey}${item.id}` : item.id;
    result[key] = item;
    return result;
  }, {})
}

export const isPaidUser = (paidTime) => {
  if (!paidTime) {
    return false
  }

  try {
    const current = new Date()
    const timeExpired = new Date(paidTime)
    if (current.getTime() > timeExpired.getTime()) {
      return false
    }
    return true
  } catch(error) {
    console.log(error)
    return false
  }
}

export const getMinDateFromTargetday = (resultDate, targetDate) => {
  const _resultDate = resultDate ? new Date(resultDate) : new Date()
  const _targetDate = targetDate ? new Date(targetDate) : _resultDate

  const tempResultDate = new Date(
    _resultDate.getFullYear(),
    _resultDate.getMonth(),
    _resultDate.getDate()
  )
  const tempTargetDate = new Date(
    _targetDate.getFullYear(),
    _targetDate.getMonth(),
    _targetDate.getDate()
  )

  if (tempResultDate - tempTargetDate <= 0) {
    _resultDate.setDate(_resultDate.getDate() + 1)
  }

  return _resultDate;
}

export const validateImage = (target) => {
  const filePath = target.value;
  const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
  const size = target.files.length ?
    parseFloat(target.files[0].size / 1024, 10) : 0;

  if (!filePath) {
    return false
  }

  if (!allowedExtensions.exec(filePath)) {
    Alert.error(localeProfile.IMG_EXTENSION_ERROR, {
      timeout: 5000,
    })
    return false;
  }
  if (!size || size > 1024) {
    Alert.error(localeProfile.IMG_SIZE_ERROR, {
      timeout: 5000,
    })
    return false;
  }
  return true
}

export const currencyToPoint = (currency) => {
  return currency / 1000;
}

let cacheQuestionOfPollSurvey = []
let cacheListPollSurvey = []

export const parseAnOptionTargetToViewNew = (
  target,
  listPollSurvey,
  keyPollSurvey,
  listTargetOption,
  type
) => {
  if (!target) {
    return '';
  }

  if (cacheListPollSurvey.length !== listPollSurvey.length) {
    cacheListPollSurvey = listPollSurvey;
    cacheQuestionOfPollSurvey = [];
    forEach(listPollSurvey, entry => {
      if (isEmpty(entry.question)) {
        return;
      }

      if (Array.isArray(entry.question)) {
        cacheQuestionOfPollSurvey = cacheQuestionOfPollSurvey.concat(entry.question)
      } else {
        cacheQuestionOfPollSurvey.push(entry.question)
      }
    })
  }

  const _target = target.target;
  const city = _target[INPUT_NAME.CITY] && _target[INPUT_NAME.CITY].length ?
    _target[INPUT_NAME.CITY].map(city => city.label) : '';

   
  let gender =  genderOpt[2].label;
  if(_target[INPUT_NAME.GENDER]){
    if(_target[INPUT_NAME.GENDER] === genderOpt[0].value){
      gender = genderOpt[0].label
    }else{
      if(_target[INPUT_NAME.GENDER] === genderOpt[1].value){
        gender = genderOpt[1].label
      }else{
        gender = genderOpt[2].label
      }
    }
  }
  const ageFrom = _target[INPUT_NAME.AGE_FROM] || '';
  const ageTo = _target[INPUT_NAME.AGE_TO] || '';
  const country = _target[INPUT_NAME.COUNTRY] || '';
  const questions = reduce(target.question, (result, item, key) => {
    const hasSelectedAnswer = filter(item, value => value)
    const _question = find(cacheQuestionOfPollSurvey, { id: parseInt(key, 10) })
    const pollSurvey = !_question ? '' :
      find(cacheListPollSurvey, { id: _question[`${keyPollSurvey}_id`] })
    if (!pollSurvey) {
      return result
    }
    if (pollSurvey && !result[pollSurvey.id]) {
      result[pollSurvey.id] = {}
      result[pollSurvey.id].name = pollSurvey.name;
      result[pollSurvey.id].question = [];
    }
    if (_question && hasSelectedAnswer.length) {
      result[pollSurvey.id].question.push(_question.question)
    } else if (!_question) {
      result[pollSurvey.id].question.push(key)
    }
    return result
  }, {})
  
  function renderQuestion() {
    if(type === "li"){
      const lists = map(questions, q => {
        const items = map(q.question, value => `<li>${value}</li>`)
        return '<li class="poll-survey-name"><strong>' + q.name + '</strong>' +
                  '<ul class="poll-survey-questions">' +
                    items.join('') +
                  '</ul>' +
                '</li>'
      })
      return lists.join('')
    }else{
      const lists = map(questions, q => {
        const items = map(q.question, value => `${value}`)
        return  '<strong>' + q.name + ': </strong>' + items.join(' ')
      })
      return lists.join(' ') + ' '
    }
  }

  function renderOption() {
    if (!target.option.length) {
      return '';
    }
    const cloneOption = map(target.option, opt => {
      const category = find(listTargetOption, {
        id: parseInt(opt.categorie_id, 10)
      })
      const question = category ? find(category.question, {
        id: opt.question_id
      }) : undefined;
      const answer = question ? map(opt.answer_id, ansId => {
        return find(question.answer, { id: ansId }).name
      }) : undefined;

      if (!category || !question || !answer) {
        return undefined;
      }

      return {
        ...opt,
        answer,
        question: question.name,
      }
    })
    if(type === "li"){
      const listItems = map(cloneOption, opt => {
        if (!opt) return '';
        const items = map(opt.answer, ans => `<li>${ans}</li>`)
        return `<li><strong>${opt.question}</strong><ul>${items.join('')}</ul></li>`
      })
      return `<li><ul>${listItems.join('')}</ul><li>`
    }else{
      const listItems = map(cloneOption, opt => {
        if (!opt) return '';
        const items = map(opt.answer, ans => `${ans}`)
        return `<strong>${opt.question}:</strong> ${items.join(' ')} `
      })
      return `${listItems.join(' ')} `
    }
  }

  function renderExtendType() {
    if (isEmpty(target.extend_option)) {
      return '';
    }
    if(type === "li"){
      return `
      <li><strong>${localeCreate.SL_EXTEND_OPT_TYPE_LABEL} ${target.extend_option.type}:</strong></li>
      <li>${target.extend_option.value.join(', ')}</li>
    `
    }else{
      return `<strong>${localeCreate.SL_EXTEND_OPT_TYPE_LABEL} ${target.extend_option.type}</strong>: ${target.extend_option.value.join(', ')}`
    }
  }
  if(type === "li"){
    return `
    ${ageFrom ? `<li><strong>${localeCreate.AGE_FROM}:</strong> ${ageFrom} </li>` : ''}
    ${ageTo ? `<li><strong>${localeCreate.AGE_TO}:</strong> ${ageTo} </li>`: ''}
    ${gender ? `<li><strong>${localeCreate.GENDER}:</strong> ${gender} </li>` : ''}
    ${city ? `<li><strong>${localeCreate.CITY}:</strong> ${city} </li>` : ''}
    ${country ? `<li><strong>${localeCreate.COUNTRY}:</strong> ${country} </li>` : ''}
    ${Object.keys(questions).length ? `${localeCreate.CURRENT_QUESTION_TARGET_LABEL}: <br/>` : ''}
    ${Object.keys(questions).length ? renderQuestion() : ''}
    ${renderOption()}
    ${renderExtendType()}
  `
  }else{
    return `
    ${ageFrom ? `<strong>${localeCreate.AGE_FROM}:</strong> ${ageFrom} ` : ''}
    ${ageTo ? `<strong>${localeCreate.AGE_TO}:</strong> ${ageTo} `: ''}
    ${gender ? `<strong>${localeCreate.GENDER}:</strong> ${gender} ` : ''}
    ${city ? `<strong>${localeCreate.CITY}:</strong> ${city} ` : ''}
    ${country ? `<strong>${localeCreate.COUNTRY}:</strong> ${country} ` : ''}
    ${Object.keys(questions).length ? `${localeCreate.CURRENT_QUESTION_TARGET_LABEL}: ` : ''}
    ${Object.keys(questions).length ? renderQuestion() : ''}
    ${renderOption()}
    ${renderExtendType()}
  `
  }
 
}


export const parseAnOptionTargetToView = (
  target,
  listPollSurvey,
  keyPollSurvey,
  listTargetOption
) => {
  if (!target) {
    return '';
  }

  if (cacheListPollSurvey.length !== listPollSurvey.length) {
    cacheListPollSurvey = listPollSurvey;
    cacheQuestionOfPollSurvey = [];
    forEach(listPollSurvey, entry => {
      if (isEmpty(entry.question)) {
        return;
      }

      if (Array.isArray(entry.question)) {
        cacheQuestionOfPollSurvey = cacheQuestionOfPollSurvey.concat(entry.question)
      } else {
        cacheQuestionOfPollSurvey.push(entry.question)
      }
    })
  }

  const _target = target.target;
  const city = _target[INPUT_NAME.CITY] && _target[INPUT_NAME.CITY].length ?
    _target[INPUT_NAME.CITY].map(city => city.label) : '';
  const gender = _target[INPUT_NAME.GENDER] && _target[INPUT_NAME.GENDER].length ? 
    _target[INPUT_NAME.GENDER].map(gender => gender.label) : '';
  const ageFrom = _target[INPUT_NAME.AGE_FROM] || '';
  const ageTo = _target[INPUT_NAME.AGE_TO] || '';
  const country = _target[INPUT_NAME.COUNTRY] || '';
  
  const questions = reduce(target.question, (result, item, key) => {
    const hasSelectedAnswer = filter(item, value => value)
    const _question = find(cacheQuestionOfPollSurvey, { id: parseInt(key, 10) })
    const pollSurvey = !_question ? '' :
      find(cacheListPollSurvey, { id: _question[`${keyPollSurvey}_id`] })
    if (!pollSurvey) {
      return result
    }
    if (pollSurvey && !result[pollSurvey.id]) {
      result[pollSurvey.id] = {}
      result[pollSurvey.id].name = pollSurvey.name;
      result[pollSurvey.id].question = [];
    }
    if (_question && hasSelectedAnswer.length) {
      result[pollSurvey.id].question.push(_question.question)
    } else if (!_question) {
      result[pollSurvey.id].question.push(key)
    }
    return result
  }, {})
  
  function renderQuestion() {
    const lists = map(questions, q => {
      const items = map(q.question, value => `<li>${value}</li>`)
      return '<i class="poll-survey-name">' + q.name + '</i>' +
        '<ul class="poll-survey-questions">' +
        items.join('') +
      '</ul>'
    })
    return lists.join('') + ' <br/>'
  }

  function renderOption() {
    if (!target.option.length) {
      return '';
    }
    const cloneOption = map(target.option, opt => {
      const category = find(listTargetOption, {
        id: parseInt(opt.categorie_id, 10)
      })
      const question = category ? find(category.question, {
        id: opt.question_id
      }) : undefined;
      const answer = question ? map(opt.answer_id, ansId => {
        return find(question.answer, { id: ansId }).name
      }) : undefined;

      if (!category || !question || !answer) {
        return undefined;
      }

      return {
        ...opt,
        answer,
        question: question.name,
      }
    })
    const listItems = map(cloneOption, opt => {
      if (!opt) return '';
      const items = map(opt.answer, ans => `<li>${ans}</li>`)
      return `<li>${opt.question}<ul>${items.join('')}</ul></li>`
    })
    return `<ul>${listItems.join('')}</ul>`
  }

  function renderExtendType() {
    if (isEmpty(target.extend_option)) {
      return '';
    }

    return `
      <br/>
      <p>${localeCreate.SL_EXTEND_OPT_TYPE_LABEL}:</p>
      <p>${target.extend_option.value.join('; ')}</p>
    `
  }

  return `
    ${ageFrom ? `${localeCreate.AGE_FROM}: ${ageFrom} -` : ''}
    ${ageTo ? `${localeCreate.AGE_TO}: ${ageTo} <br/>`: ''}
    ${gender ? `${localeCreate.GENDER}: ${gender} <br/>` : ''}
    ${city ? `${localeCreate.CITY}: ${city} <br/>` : ''}
    ${country ? `${localeCreate.COUNTRY}: ${country} <br/><br/>` : ''}
    ${Object.keys(questions).length ? `${localeCreate.CURRENT_QUESTION_TARGET_LABEL}: <br/>` : ''}
    ${Object.keys(questions).length ? renderQuestion() : ''}
    ${renderOption()}
    ${renderExtendType()}
  `
}

if (!Element.prototype.matches) {
  Element.prototype.matches =
    Element.prototype.matchesSelector ||
    Element.prototype.mozMatchesSelector ||
    Element.prototype.msMatchesSelector ||
    Element.prototype.oMatchesSelector ||
    Element.prototype.webkitMatchesSelector ||
    function(s) {
      var matches = (this.document || this.ownerDocument).querySelectorAll(s),
          i = matches.length;
      while (--i >= 0 && matches.item(i) !== this) {}
      return i > -1;
    };
}

export const findAncestor = (el, sel) => {
  if (typeof el.closest === 'function') {
    return el.closest(sel) || null;
  }
  while (el) {
    if (el.matches(sel)) {
        return el;
    }
    el = el.parentElement;
  }
}  
export const checkCoinPollSurvey = (pollSurvey) => {
  if (!pollSurvey) {
    console.log('Missing poll / survey');
    return false;
  }
  const { user } = pollSurvey;

  if (pollSurvey.number_vote && (!user.pay || user.pay.coin < pollSurvey.price)) {
    Alert.warning(localeCommon.DO_NOT_ABILITY_RUNNING);
    return false;
  }
  return true;
}

export function isChromeWindows() { 
  return navigator.userAgent.indexOf('Chrome') !== -1 && 
    navigator.userAgent.indexOf('Windows') !== -1 
} 

export function trackingShare(articleid) {
  requestAPI({
    url: APIs.article.trackingShare.url,
    method: APIs.article.trackingShare.method,
    dataForm:({
      article_id: articleid
    })
  })
}
export const formatDate = (dateobject) => {
  const datetime = new Date(dateobject);
  const year = datetime.getFullYear();
  let month = datetime.getMonth() + 1;
  let date = datetime.getDate();
  month = ('0' + month).slice(-2);
  date = ('0' + date).slice(-2);
  return `${date}/${month}/${year}`;
}