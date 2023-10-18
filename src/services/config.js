export const REGEX = {
  // password between 8 to 15 characters which contain at least one lowercase letter,
  // one uppercase letter, one numeric digit, and one special character
  PASSWORD: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/,
  EMAIL: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/,
  DIGIT: /^[0-9]+$/,
};
const localeCreate = window.locale.Create;
export const REWARD_DETAIL = {};
export const LIST_PROJECT = {};
export const CONFIG_QUESTIONS = {
  REFS: [],
};
export const genderOptChoose = [
  { value: 'Nam', label: localeCreate.OPTION_GENDER_MALE },
  { value: 'Nu', label: localeCreate.OPTION_GENDER_FEMALE },
]
export const genderOpt = [
  { value: 'Nam', label: localeCreate.OPTION_GENDER_MALE },
  { value: 'Nu', label: localeCreate.OPTION_GENDER_FEMALE },
  { value: 'Khac', label: localeCreate.ALL_OPTION_GENDER },
]

export const BASE_URL = process.env.BASE_URL || 'http://goclamme.pixelcent.com';
export const BASE_PATH = process.env.BASE_PATH || '';
export const PREFIX_PATH = process.env.PREFIX_PATH || '';
console.log(BASE_URL, '===BASE_URL===');
console.log(BASE_PATH, '===BASE_PATH===');
console.log(PREFIX_PATH, '===PREFIX_PATH===');

export const APIs = {
  comment: {
    getListComment: {
      url:`${BASE_URL}/api/comments`,
      method: 'GET'
    },
  },
  article: {
    like: {
      url: `${BASE_URL}/api/articles/like`,
      method: 'POST'
    },
    searTitleArticle: {
      url: `${BASE_URL}/articles/search/page/:search`,
      method: 'GET'
    },
    quantityCommentArticle:{
      url:`${BASE_URL}/api/articles/quantitycomment`,
      method: 'POST'
    },
    searchArticle: {
      url:`${BASE_URL}/api/articles/search`,
      method: 'POST'
    },
    getCategoryArticle: {
      url:`${BASE_URL}/api/categories_articles`,
      method: 'GET'
    },
    getListArticles: {
      url: `${BASE_URL}/api/articles`,
      method: 'GET',
    },
    getArticleDetail: {
      url: `${BASE_URL}/api/articles/{articleId}`,
      method: 'GET',
    },
    getListBookmarks: {
      url: `${BASE_URL}/api/bookmarks/article`,
      method: 'GET',      
    },
    addBookmark: {
      url: `${BASE_URL}/api/bookmarks`,
      method: 'POST',
    },
    removeBookmark: {
      url: `${BASE_URL}/api/bookmarks/{articleId}`,
      method: 'DELETE',
    },
    trackingShare: {
      url: `${BASE_URL}/api/articles/tracking/share`,
      method: 'POST',
    }
  },
  category: {
    getListCategories: {
      url: `${BASE_URL}/api/listcategories`,
      method: 'GET',
    },
  },
  friends: {
    listProviders: {
      url: `${BASE_URL}/api/networks`,
      method: 'GET',
    },
    getConnectedFriendsRequest: {
      url: `${BASE_URL}/api/user/friends`,
      method: 'POST',
    },
    getInvitingRequest: {
      url: `${BASE_URL}/api/user/friends/invited`,
      method: 'POST',
    },
    getPendingRequest: {
      url: `${BASE_URL}/api/user/friends/pendding`,
      method: 'POST',
    },
    requestAcceptFriend: {
      url: `${BASE_URL}/api/friends/add`,
      method: 'POST',
    },
    requestAddFriend: {
      url: `${BASE_URL}/api/friends/send`,
      method: 'POST',
    },
    requestUnfriend: {
      url: `${BASE_URL}/api/friends/delete`,
      method: 'POST',
    },
    requestInvitingByEmail: {
      url: `${BASE_URL}/api/search/network/email`,
      method: 'POST',
    },
    requestInvitingByPhone: {
      url: `${BASE_URL}/api/search/network/phone`,
      method: 'POST',
    },
    cancelFriendRequest: {
      url: `${BASE_URL}/api/friends/cancel`,
      method: 'POST',
    },
    rejectInvitingRequest: {
      url: `${BASE_URL}/api/friends/destroy`,
      method: 'POST',      
    },
    facebookFriends: {
      url: `${BASE_URL}/api/friends/facebook/all`,
      method: 'GET',
    },
    searchFriend: {
      url: `${BASE_URL}/api/search/friends`,
      method: 'POST',
    },
    syncSocialFriend: {
      url: `${BASE_URL}/api/sync/friend`,
      method: 'POST'
    },
    allFriendLocal: {
      url: `${BASE_URL}/api/user/friends/all`,
      method: 'POST',
    },
    getFriendActivities: {
      url: `${BASE_URL}/api/friends/activity`,
      method: 'GET',
    },
    sendInviteListEmail: {
      url: `${BASE_URL}/api/friends/send/email`,
      method: 'POST',
    },
    getListHistoryInvites: {
      url: `${BASE_URL}/api/friends/get/historyinvites`,
      method: 'GET',
    }
     
  },
  notification: {
    getQuantityNotifications: {
      url: `${BASE_URL}/api/notifications/quantity`,
      method: 'GET',
    },
    getNotifications: {
      url: `${BASE_URL}/api/notifications`,
      method: 'GET',
    },
    markRead: {
      url: `${BASE_URL}/api/notifications/read`,
      method: 'POST',
    }
  },
  poll: {
    
    getPollDetail: {
      url: `${BASE_URL}/api/polldetail/{pollId}`,
      method: 'GET',
    },
    getListBookmarks: {
      url: `${BASE_URL}/api/bookmarks/poll`,
      method: 'GET',
    },
    createQuickPoll: {
      url: `${BASE_URL}/api/polls/quick`,
      method: 'POST',
    },
    createPoll: {
      url: `${BASE_URL}/api/polls`,
      method: 'POST',
    },
    editPoll: {
      url: `${BASE_URL}/api/polls/{pollId}`,
      method: 'POST',
    },
    listPollUserInProject: {
      url: `${BASE_URL}/api/projects/{projectId}/polls`,
      method: 'POST',
    },
    listPollSurveyForTarget: {
      url: `${BASE_URL}/api/projects/{projectId}/polls/target`,
      method: 'POST',
    },
    listPollToPlay: {
      url: `${BASE_URL}/api/load/polls`,
      method: 'POST',
    },
    getPollInfoToShow: {
      url: `${BASE_URL}/api/polls/{pollId}`,
      method: 'GET',
    },
    getPollInfoToEdit: {
      url: `${BASE_URL}/api/polls/{pollId}/detail`,
      method: 'GET',
    },
    getListCity: {
      url: `${BASE_URL}/api/city`,
      method: 'GET',
    },
    votePoll: {
      url: `${BASE_URL}/api/votes`,
      method: 'POST',
    },
    getResultAnswer: {
      url: `${BASE_URL}/api/result/poll/question`,
      method: 'POST',
    },
    updateEndDate: {
      url: `${BASE_URL}/api/polls/edit/dateend`,
      method: 'POST',
    }
  },
  pointHistory: {
    url: `${BASE_URL}/api/history/points`,
    method: 'POST',
  },
  listPoint: {
    url: `${BASE_URL}/api/users/points`,
    method: 'POST',
  },
  profile: { 
    updateUserPhone: {
      url:`${BASE_URL}/api/users/phone/update`,
      method: 'POST'
    },
    checkAdmin: {
      url:`${BASE_URL}/api/checkadmin`,
      method: 'POST'
    },
    getListBookmarks: {
      url: `${BASE_URL}/api/bookmarks`,
      method: 'GET',
    },
    getUserBasicInfo: {
      url: `${BASE_URL}/api/users`,
      method: 'GET',
    },
    getUserActivities: {
      url: `${BASE_URL}/api/user/activity`,
      method: 'GET',
    },
    getDetailProfile: {
      url: `${BASE_URL}/api/categories`,
      method: 'GET',
    },
    getUserProfile: {
      url: `${BASE_URL}/api/profiles`,
      method: 'GET',
    },
    updateUserProfile: {
      url: `${BASE_URL}/api/profile/update`,
      method: 'POST',      
    },
    updateUserBasicInfo: {
      url: `${BASE_URL}/api/users`,
      method: 'PUT',
    },
    updateUserPassword: {
      url: `${BASE_URL}/api/users/password`,
      method: 'PUT',
    },
    getFriendProfile: {
      url: `${BASE_URL}/api/user/profile`,
      method: 'POST',
    },
    uploadAvatar: {
      url: `${BASE_URL}/api/user/avatar`,
      method: 'POST',
    },
    getProfileQuestionDashboard: {
      url: `${BASE_URL}/api/user/profile/question`,
      method: 'POST',
    },
    postProfileAnswerDashboard: {
      url: `${BASE_URL}/api/user/profile/update`,
      method: 'POST',
    }
  },
  project: { 
    listPollSurveyUserInProject: {
      url: `${BASE_URL}/api/projects/{projectId}/pollsandsurveys`,
      method: 'POST',
    },
    addingProject: {
      url: `${BASE_URL}/api/projects`,
      method: 'POST',
    },
    deleteProject: {
      url: `${BASE_URL}/api/projects/{projectId}`,
      method: 'DELETE',
    },
    edittingProject: {
      url: `${BASE_URL}/api/projects/{projectId}`,
      method: 'POST',
    },
    getListProjects: {
      url: `${BASE_URL}/api/projects`,
      method: 'GET',
    },
    getProjectInfo: {
      url: `${BASE_URL}/api/projects/{projectId}`,
      method: 'GET',
    },
    getListSurveys: {
      url: `${BASE_URL}/api/projects/{projectId}/surveys`,
      method: 'POST',
    },
    getSurveyInfo: {
      url: `${BASE_URL}/api/surveys/{surveyId}/detail`,
      method: 'GET',
    },
    searchProject: {
      url: `${BASE_URL}/api/projects/search`,
      method: 'POST',
    },
    // getEstimatedCost: {
    //   url: `${BASE_URL}/api/onepays/load/estimatecost`,
    //   method: 'POST',
    // },
    getPaymentInfo: {
      url: `${BASE_URL}/api/onepays/load`,
      method: 'POST',
    },
    gotoPayment: {
      url: `${BASE_URL}/api/onepays/redirect`,
      method: 'POST',
    },
    getPaymentStatus: {
      url: `${BASE_URL}/api/onepays/{vpc_MerchTxnRef}`,
      method: 'GET',
    },
    sortQuestionSurvey: {
      url: `${BASE_URL}/api/surveys/questions-order`,
      method: 'POST',
    },
    deletePoll: {
      url: `${BASE_URL}/api/polls/{pollId}/delete`,
      method: 'POST',
    },
    deleteSurvey: {
      url: `${BASE_URL}/api/surveys/{surveyId}/delete`,
      method: 'POST',
    },
    updateStatusPoll: {
      url: `${BASE_URL}/api/polls/{pollId}/status`,
      method: 'POST',
    },
    updateStatusSurvey: {
      url: `${BASE_URL}/api/surveys/{surveyId}/status`,
      method: 'POST',
    },
  },
  rewards: {
    getVoucher: {
      url:`${BASE_URL}/api/reward/giftnetwork`,
      method: 'POST'
    },
    getHistory: {
      url:`${BASE_URL}/api/reward/giftnetwork/history`,
      method: 'POST'
    },
    getRewardCategories: {
      url: `${BASE_URL}/api/reward/category`,
      method: 'GET',
    },
    getListValueVoucher: {
      url: `${BASE_URL}/api/rewardvalues`,
      method: 'GET',
    },
    // rewards of all friends
    getFriendRewardActivities: {
      url: `${BASE_URL}/api/reward/friend`,
      method: 'POST',
    },
    getRewardOfOneFriend: {
      url: `${BASE_URL}/api/reward/friend/{friendId}`,
      method: 'POST',
    },
    getRankingRewards: {
      url: `${BASE_URL}/api/reward/friendranking`,
      method: 'POST',
    },
    getListGifts: {
      url: `${BASE_URL}/api/reward/product`,
      method: 'POST',
    },
    getRewardDetail: {
      url: `${BASE_URL}/api/reward/product/{productId}/{productPriceId}`,
      method: 'GET',
    },
    getTransactions: {
      url: `${BASE_URL}/api/reward/histories`,
      method: 'POST',
    },
    getGift: {
      url: `${BASE_URL}/api/reward/transaction`,
      method: 'POST',
    },
    getDetailHistory: {
      url: `${BASE_URL}/api/reward/histories/detail`,
      method: 'POST',
    },
  },
  setting: {
    getSettings: {
      url: `${BASE_URL}/api/settings`,
      method: 'GET',
    },
    setSettings: {
      url: `${BASE_URL}/api/settings/user`,
      method: 'POST',
    },
  },
  survey: {
    getSurveyDetail: {
      url: `${BASE_URL}/api/surveydetail/{surveyId}`,
      method: 'GET',
    },
    getListBookmarks: {
      url: `${BASE_URL}/api/bookmarks/survey`,
      method: 'GET',
    },
    createSurvey: {
      url: `${BASE_URL}/api/survey/create`,
      method: 'POST',
    },
    createQuestion: {
      url: `${BASE_URL}/api/surveys/questions`,
      method: 'POST',
    },
    deleteAQuestion: {
      url: `${BASE_URL}/api/surveys/questions/{questionId}`,
      method: 'DELETE',
    },
    editQuestion: {
      url: `${BASE_URL}/api/surveys/questions/{questionId}`,
      method: 'PUT',
    },
    postTargetOption: {
      url: `${BASE_URL}/api/surveys/save`,
      method: 'POST',
    },
    getListSurveys: {
      url: `${BASE_URL}/api/load/survey`,
      method: 'POST',
    },
    getSurveyInfo: {
      url: `${BASE_URL}/api/surveys/{surveyId}`,
      method: 'GET',
    },
    voteInSurvey: {
      url: `${BASE_URL}/api/votes/survey`,
      method: 'POST',
    },
    getRatingData: {
      url: `${BASE_URL}/api/survey/thanks/{surveyId}`,
      method: 'GET',
    },
    getResultAnswer: {
      url: `${BASE_URL}/api/result/survey/question`,
      method: 'POST',
    },
    updateRatingDate: {
      url: `${BASE_URL}/api/survey/thanks`,
      method: 'POST',
    },
    updateEndDate: {
      url: `${BASE_URL}/api/surveys/edit/dateend`,
      method: 'POST',
    }
  },
  target: {
    checkListTxt: {
      url: `${BASE_URL}/api/targets/checklisttxt`,
      method: 'POST',
    },
    getListUserTarget: {
      url: `${BASE_URL}/api/targets?project_id={projectId}&target_type={targetType}`,
      method: 'GET',
    },
    getListUserFilter: {
      url: `${BASE_URL}/api/load/targets/getlistuserfilter`,
      method: 'POST',
    },
    getTargetOptions: {
      url: `${BASE_URL}/api/load/targets/option`,
      method: 'GET',
    },
    searchTargetOptions: {
      url: `${BASE_URL}/api/search/targets/option`,
      method: 'POST',
    },
    getTargetInfo: {
      url: `${BASE_URL}/api/targets/{targetId}`,
      method: 'GET',
    },
    deleteTarget: {
      url: `${BASE_URL}/api/targets/{targetId}`,
      method: 'DELETE',
    },
    createTarget: {
      url: `${BASE_URL}/api/targets`,
      method: 'POST',
    },
    
  },
  upgradeUser: {
    paid: {
      url: `${BASE_URL}/api/paid`,
      method: 'GET',
    }
  },
  socialShare: {
    url: `${BASE_URL}/api/share`,
    method: 'POST',
  },
  skipLogic: {
    editOrCreate: {
      url: `${BASE_URL}/api/skip/logics/update`,
      method: 'POST',
    },
    delete: {
      url: `${BASE_URL}/api/skip/logics/delete`,
      method: 'POST',
    },
    nextQuestion: {
      url: `${BASE_URL}/api/skip/logics/next/question`,
      method: 'POST',
    },
  },
  resultCsv: {
    poll: {
      url: `${BASE_URL}/api/download/report/poll/{pollId}`,
    },
    downLoadListUserFilter: {
      url: `${BASE_URL}/api/downLoadListUserFilter`,
    },
    survey: {
      url: `${BASE_URL}/api/download/report/survey/{surveyId}/question/{questionId}`,
    },
  },
  listTimezone: {
    url: `${BASE_URL}/api/timezone`,
    method: 'GET'
  },
  changeLanguageUrl: `${BASE_URL}/language/{language}`,
  getBannerLink: {
    url: `${BASE_URL}/api/banner`,
    method: 'GET',
  },
  menu: {
    url: `${BASE_URL}/api/categories-article`,
    method: 'GET',
  }
};

export const ROUTER_PATH = {
  INDEX: '/',
  USER_PROFILE: '/user-profile',
  FRIEND: '/friends',
  FRIEND_PROFILE: '/friend-profile/:userHash',
  REWARD: '/rewards',
  REWARD_HISTORY: '/rewards/history',
  REWARD_TYPE_DETAIL: '/rewards/:rewardType/:rewardId/:productPriceId/:historyId',
  REWARD_DETAIL: '/rewards/:rewardId/:productPriceId',
  PROJECT: '/project',
  POLL: '/poll',
  POLL_DETAIL: '/poll/:pollId',
  POINT_HISTORY: '/point-histories',
  RESULT_DETAIL_SURVEY: '/result/survey/:surveyId/question/:questionId',
  RESULT_DETAIL_POLL: '/result/poll/:pollId',
  SURVEY: '/survey',
  ARTICLE: '/article',
  NOTIFICATION: '/notifications',
  PREFERENCE: '/preference',
  LOGOUT: BASE_URL + '/logout',
  BOOKMARK: '/bookmark',
  CHANGEPASSWORD: '/change-password',
  GIFT_VERIFY: BASE_URL + '/gift/verify/phone',
  HOME: BASE_URL + "/",
  SURVEYSUB: BASE_URL + "/khao-sat-nhan-qua",
  SHORTQUESTION: BASE_URL + "/clb-lam-me",
  QUESTIONANDANSWER: BASE_URL + "/hoi-dap",
  MOMANDBABY: BASE_URL + "/me-va-be",
  GAMESTORE: BASE_URL + "/kho-game",
  COMMENT: BASE_URL + "/binh-luan",
  HIGHTLIGHT: BASE_URL + "/me-nen-doc",
  PRIVACY_POLICY: BASE_URL +  '/static/chinh-sach-bao-mat',
  TERMS_OF_SERVICES: BASE_URL + "/static/dieu-khoan-su-dung",
  CONTACT: BASE_URL + "/lien-he",
  SURVEY_MENU: BASE_URL + '/khao-sat-nhan-qua',
};

export const CHILD_ROUTE_PATH = {
  INDEX_WITH_POLL: '/created-poll/:pollId',
  ARTICLE_DETAIL: ROUTER_PATH.ARTICLE + '/:articleId',
  ARTICLE_BOOKMARK: ROUTER_PATH.ARTICLE + '/bookmark',
  FRIEND_SOCIAL: ROUTER_PATH.FRIEND + '/social',
  PROJECT_DETAIL: ROUTER_PATH.PROJECT + '/detail/:projectId',
  PROJECT_ADD: ROUTER_PATH.PROJECT + '/add',
  PROJECT_CREATE_POLL: ROUTER_PATH.PROJECT + '/detail/:projectId/create-poll',
  PROJECT_EDIT_POLL: ROUTER_PATH.PROJECT + '/detail/:projectId/edit-poll/:pollId',
  PROJECT_CREATE_SURVEY: ROUTER_PATH.PROJECT + '/detail/:projectId/create-survey',
  PROJECT_EDIT_SURVEY: ROUTER_PATH.PROJECT + '/detail/:projectId/edit-survey/:surveyId',
  PROJECT_POLL_SURVEY_PAYMENT: ROUTER_PATH.PROJECT + '/payment/:type/:pollSurveyId',
  PAYMENT_STATUS: ROUTER_PATH.PROJECT + '/payment-status/:type/:pollSurveyId/:paymentId',
  SURVEY_LIST: ROUTER_PATH.SURVEY + '/category/:categoryId',
  SURVEY_DETAIL: ROUTER_PATH.SURVEY + '/:surveyId',
  SURVEY_THANKS: ROUTER_PATH.SURVEY + '/:surveyId/thankyou',
  CATEGORY: ROUTER_PATH.ARTICLE + '/:categoryId',
};
