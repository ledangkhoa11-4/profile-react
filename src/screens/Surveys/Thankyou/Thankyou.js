import React from 'react';
import {
  FacebookShareButton,
  FacebookIcon,
  GooglePlusShareButton,
  GooglePlusIcon,
  TwitterShareButton,
  TwitterIcon,
} from 'react-share';
import Rating from './Rating';
import ZaloShareButton from '../../../components/ZaloShareButton'
import { BASE_URL, CHILD_ROUTE_PATH, ROUTER_PATH } from 'services/config';

const Thankyou = (props) => {
  const shareSocial = BASE_URL + CHILD_ROUTE_PATH.SURVEY_DETAIL
    .replace(':surveyId', props.surveyId)

  let shareResultUrl = '';
  if (props.history.location.state && props.history.location.state.questionId) {
    shareResultUrl = BASE_URL + '/share' + ROUTER_PATH.RESULT_DETAIL_SURVEY
      .replace(':surveyId', props.surveyId)
      .replace(':questionId', props.history.location.state.questionId)
  }

  return (
    <div className="thanks-box box">
      <div className="inner">
        <h2>
          {props.localeThankyou.TITLE}
        </h2>
        <div className="share text-center">
          <div className="title-share">
            {props.localeThankyou.SHARE_TITLE}
          </div>
          <div className="list-check-social">
            <ul className="list-icon">
              <li>
                <FacebookShareButton
                  url={shareSocial}
                >
                  <FacebookIcon
                    size={35}
                    round
                  />
                </FacebookShareButton>
              </li>
              <li>
                <TwitterShareButton
                  url={shareSocial}
                >
                  <TwitterIcon
                    size={35}
                    round
                  />
                </TwitterShareButton>
              </li>
              <li>
                <GooglePlusShareButton
                  url={shareSocial}
                >
                  <GooglePlusIcon
                    size={35}
                    round
                  />
                </GooglePlusShareButton>
              </li>
              <li>
                <ZaloShareButton
                  url={shareSocial}
                />
              </li>
            </ul>
          </div>
        </div>
        <div className="share text-center">
          <div className="title-share">
            {props.localeThankyou.SHARE_TITLE}
          </div>
          <div className="list-check-social">
            <ul className="list-icon">
              <li>
                <FacebookShareButton
                  url={shareResultUrl}
                >
                  <FacebookIcon
                    size={35}
                    round
                  />
                </FacebookShareButton>
              </li>
              <li>
                <TwitterShareButton
                  url={shareResultUrl}
                >
                  <TwitterIcon
                    size={35}
                    round
                  />
                </TwitterShareButton>
              </li>
              <li>
                <GooglePlusShareButton
                  url={shareResultUrl}
                >
                  <GooglePlusIcon
                    size={35}
                    round
                  />
                </GooglePlusShareButton>
              </li>
              <li>
                <ZaloShareButton
                  url={shareResultUrl}
                />
              </li>
            </ul>
          </div>
        </div>
        <div className="rating">
          <form name="rating" className="form">
            <ul>
              {
                props.ratingData.map((item, idx) => <Rating
                  key={idx}
                  index={idx}
                  {...item}
                  changeRating={props.changeRating}
                />)
              }
            </ul>
            <div className="form-btn text-center">
              <ul>
                <li>
                  <button
                    type="button"
                    name="Vote"
                    className="btn"
                    onClick={props.onVoteSurvey}
                  >
                    <span className="text">
                      {props.localeThankyou.VOTE_BUTTON}
                    </span>
                  </button>
                </li>
              </ul>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Thankyou;
