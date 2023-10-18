export const INPUT_NAME = {
  ACCOUNT_FORM: {
    NAME: 'name',
    DATE: 'date',
    MONTH: 'month',
    YEAR: 'year',
    EMAIL: 'email',
    PHONE: 'phone',
    ADDRESS: 'address',
    CITY: 'city',
    NATION: 'nation',
    STATUS: 'description',
    GENDER: 'gender',
    TIMEZONE: 'timezone',
    CURRENCY: 'currency',
  },
  PASSWORD_FORM: {
    CURRENT_PASS: 'current-password',
    NEW_PASS: 'new-password',
    CONFIRM_PASS: 'confirm-password',
    IS_AGREE: 'is-agree',
  },
  FILTER_REWARD_CATEGORIES: {
    TYPE: 'type',
    POINT: 'point',
    SEARCH: 'search',
    RANGE_POINT: 'range-point',
    INCREASE: 'increase',
    DECREASE: 'decrease',
  },
  FILTER_MY_REWARD: {
    STATUS: 'status',
    FROM_DATE: 'from-date',
    TO_DATE: 'to-date',
  },
  FILTER_POLL_PROJECT: {
    CHOOSE_PROJECT: 'choose-project',
    STATUS: 'status',
    SEARCH: 'search',
  },
  FORM_SORT_POLL: {
    FROM_DATE: 'from_date',
    TO_DATE: 'to_date',
    STATUS: 'status',
    POINT: 'point',
    EXPIRED: 'expired',
  },
  ADD_PROJECT_FORM: {
    NAME: 'name',
    DESCRIPTION: 'description',
    IMAGE: 'image',
  },
  SEARCH_PROJECT_FORM: {
    SEARCH: 'search-project',
  },
  FILTER_POLL_SURVEY_PROJECT: {
    CHOOSE_PROJECT: 'choose-project',
    STATUS: 'status',
    SEARCH: 'search',
  },
}

export const IMGs = {
  BOTTOM_LOADING: {
    GIF: require('assets/images/double-ring.gif'),
    SVG: require('assets/images/double-ring.svg'),
  }
}

export const POLL_STATUS = {
  APPROVED: 'Approved',
  WAITINGFORAPPROVAL: 'WaitingForApproval',
  WAILTINGFORPAYMENT: 'WaitingForPayment',
  REFUSE: 'Refuse',
  DRAFT: 'Draft',
  PAUSE: 'Pause',
  FINISH: 'Finish',
  DELETE: 'Delete',
  RUNNING: 'Running',
  SCHEDULED: 'Scheduled',
  EXPIRED: 'Expired'
}
export const POLL_SURVEY_STATUS = {
  APPROVED: 'Approved',
  WAITINGFORAPPROVAL: 'WaitingForApproval',
  WAILTINGFORPAYMENT: 'WaitingForPayment',
  REFUSE: 'Refuse',
  DRAFT: 'Draft',
  PAUSE: 'Pause',
  FINISH: 'Finish',
  DELETE: 'Delete',
  RUNNING: 'Running',
  SCHEDULED: 'Scheduled',
  EXPIRED: 'Expired'
}
export const ACTION_EDIT_POLL_SURVEY = {
  PAUSE: 'Pause',
  LAUNCHNOW:'Launch now',
  LAUNCH:'Launch',
  RENEW: 'Renew',
  FINISH: 'Finish',
  SUBMITAPPROVAL:'Submit approval',
  EDIT:'Edit',
  DELETE: 'Delete',
}
export const ALERT_STATUS = {
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
}

export const ENUM = {
  ANSWER_TYPE: {
    TEXT: 'text',
    IMAGE: 'image',
  },
  QUESTION_MEDIA_TYPE: {
    TEXT: 'text',
    IMAGE: 'image',
    VIDEO: 'video',
  },
  QUESTION_TYPE: {
    SINGLE: 'single',
    MULTI: 'multi',
    SLIDER: 'slider',
    RATING: 'rating',
    DATE: 'date',
    NUMBER: 'number',
    TEXT: 'text',
  },
  REWARD_TYPE: {
    ME: 'me',
    FRIEND: 'friend',
  },
  SOCIAL_PROVIDER: {
    FB: 'FacebookProvider',
    TW: 'TwitterProvider',
    GG: 'GoogleProvider',
    ZA: 'ZaloProvider',
    VB: 'ViberProvider'
  },
}

export const NOTIFICATION_CATEGORY ={
  REWARD: 'reward',
  VOTE_POLL: 'vote-poll',
  VOTE_SURVEY: 'vote-survey',
  SURVEY: 'survey',
  POLL: 'poll',
  EXPRIEDPOINTS_180: 'expiredpoints-180',
  EXPRIEDPOINTS_150: 'expiredpoints-150',
  ADDPOINT: 'addpoint',
  ADDPOINT_SURVEY: 'addpoint-survey',
  ADDPOINT_POLL: 'addpoint-poll',
  ADDPOINT_SHARE: 'addpoint-share',
  ADDPOINT_INVITE: 'addpoint-invite',
  MINUSPOINT: 'minuspoint',
  COMMENT: 'comment',
  FRIEND: 'friend',
  INFOMATION: 'information',
  APPROVED_COMMENT : 'approved-comment',
  
}

export const CURRENCY_VAL = [
  { value: 'VND', label: 'VND' },
  { value: 'USD', label: 'USD' }
]
