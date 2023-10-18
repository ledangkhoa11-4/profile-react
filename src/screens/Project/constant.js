export const INPUT_NAME = {
  PROJECT: 'project',
  CATEGORY: 'category',
  ANSWER_SELECTED: 'answer-selected',
  EXCLUDE_ANSWERS: 'exclude-answer',
  FROM_DATE: 'from_date',
  TO_DATE: 'to_date',
  NUMBER_VOTE: 'number_vote',
  TARGET_NAME: 'target-name',
  POLL_NAME: 'poll-name',
  AGE_FROM: 'age_start',
  AGE_TO: 'age_end',
  GENDER: 'gender',
  CITY: 'city',
  COUNTRY: 'country',
  SURVEY_NAME: 'survey-name',
  HAS_QUESTION: 'has-question',
  LIST_QUESTION: 'list-question',
  DESCRIPTION: 'description',
  FILTER_QUESTION: 'filter-question',
  REFERENCE_QUES: 'reference-question',
  PAYMENT_TYPE: 'pay_module',
  PAID_CHECKBOX: 'paid-option',
  GIZMO_LINK: 'gizmoLink',
  GIZMO_RESULT_LINK: 'gizmoResultLink',
  QUESTION_TYPE: 'question_type',
  MAX_VALUE_SLIDER: 'max_value',
  MIN_VALUE_SLIDER: 'min_value',
  LABEL_SLIDER: 'label',
  LABEL_SLIDER_LEFT: 'label_left',
  LABEL_SLIDER_RIGHT: 'label_right',
  LABEL_RATING: 'label',
  NUMBER_STAR_RATING: 'numberStar',
  MULTI_AVANCE_OPTION: 'multi_avance_option',
  VIEW_RESULT: 'view_result',
  VIEW_SOCIAL: 'view_social',
  SELECT_LOGIC: 'select_logic',
  GIZMO_STATUS_COMPLETED: 'status_completed',
  GIZMO_STATUS_PARTIAL: 'status_partial',
  GIZMO_STATUS_DISQUALIFIED: 'status_disqualified',
  GIZMO_STATUS_FULL_QUOTA: 'status_full_quota',
  GIZMO_STATUS_SALT: 'status_salt',
  DURATION: 'duration',
  GIFT: 'gift',
};

export const GENDEROPT = {
  MALE: 'Nam',
  FEMALE: 'Nu',
  ALL: 'All'
}


export const MAX_DISTANCE_TARGETS = 800;

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
  TYPE: {
    POLL: 'poll',
    SURVEY: 'survey',
  },
  PERMISSION_MSG: 'Permission denied',
};

export const QUESTION_TYPES_OPTION = [
  { value: ENUM.QUESTION_TYPE.SINGLE, label: 'Single Choice' },
  { value: ENUM.QUESTION_TYPE.MULTI, label: 'Multi Choice' },
  { value: ENUM.QUESTION_TYPE.SLIDER, label: 'Slider' },
  { value: ENUM.QUESTION_TYPE.RATING, label: 'Rating' },
  { value: ENUM.QUESTION_TYPE.DATE, label: 'Date' },
  { value: ENUM.QUESTION_TYPE.NUMBER, label: 'Number' },
  { value: ENUM.QUESTION_TYPE.TEXT, label: 'Text' },
]

export const LIST_QUESTION_TYPE_FILTER = [
  { value: '', label: 'All' },
  { value: ENUM.QUESTION_TYPE.SINGLE, label: 'Single' },
  { value: ENUM.QUESTION_TYPE.MULTI, label: 'Multi' },
  { value: ENUM.QUESTION_TYPE.SLIDER, label: 'Slider' },
  { value: ENUM.QUESTION_TYPE.RATING, label: 'Rating' },
  { value: ENUM.QUESTION_TYPE.DATE, label: 'Date' },
  { value: ENUM.QUESTION_TYPE.NUMBER, label: 'Number' },
  { value: ENUM.QUESTION_TYPE.TEXT, label: 'Text' },
]

const {EXTEND_OPTION_TYPE_LABEL} = window.locale.Create
export const EXTEND_OPTION_TYPE = [
  { value: 'email', label: EXTEND_OPTION_TYPE_LABEL.EMAIL },
  { value: 'phone', label: EXTEND_OPTION_TYPE_LABEL.PHONE },
  { value: 'id', label: EXTEND_OPTION_TYPE_LABEL.ID },
]

export const COMPARE_VAL = {
  OR: 'or',
  AND: 'and',
}

export const GET_CONDITION_OPT = (text) => [
  {
    value: COMPARE_VAL.OR,
    label: window.locale.Create.GROUP_TARGET.OR
  },
  {
    value: COMPARE_VAL.AND,
    label: window.locale.Create.GROUP_TARGET.AND
  },
]
export const CONDITION_OPT = [
  {
    value: COMPARE_VAL.OR,
    label: window.locale.Create.GROUP_TARGET.OR
  },
  {
    value: COMPARE_VAL.AND,
    label: window.locale.Create.GROUP_TARGET.AND
  },
]

export const STATUS_CAN_CHANGE = [
  'Close',
  'Launch',
  'Pause',
]
export const TYPE_OPTION_TARGET = {
  BASIC: 'Basic',
  ADVANCED: 'Advanced'
}