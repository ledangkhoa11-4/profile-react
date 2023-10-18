import React from 'react';
import { isEmpty } from 'lodash';
import {
  FacebookShareButton,
  FacebookIcon,
  GooglePlusShareButton,
  GooglePlusIcon,
  TwitterShareButton,
  TwitterIcon,
} from 'react-share';
import ZaloShareButton from '../../components/ZaloShareButton'
import { BASE_URL, ROUTER_PATH } from 'services/config'
// import SharePollSurvey from 'components/SharePollSurvey';
import { renderAnswers } from './utils';

import FakeComment from '../../components/FakeComment'

const AnswerContent = (props) => {
  const {
    question,
    shareSocial,
    viewSocial,
  } = props;
  const shareResultUrl = BASE_URL + '/share' + ROUTER_PATH.RESULT_DETAIL_POLL
    .replace(':pollId', question.id)

  return (
    <form className="vote-content" onSubmit={(e) => {
      e.preventDefault()
      props.votePoll(e.target)
    }}>
      <div className="title">
        <p>{ question.question }</p>
        {
          question.fullMedia ?
            <img src={question.fullMedia} alt="thumbnail" /> : null
        }
      </div>
      { renderAnswers(props) }
      
      <FakeComment/>

      <div className="box top-line">
        <div className="inner">
          <div className="content">
            <div className="col-sm-9">
              {
                viewSocial ?
                  <div className="row">
                    <div className="col-sm-6">
                      <div className="list-check-social pull-left">
                        <div className="title-share">
                          {props.localePoll.SHARE_ON}
                        </div> 
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
                    <div className="col-sm-6">
                      <div className="list-check-social pull-left">
                        <div className="title-share">
                          {props.localePoll.SHARE_ON_RESULT}
                        </div> 
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
                  </div> : null
              }
            </div>
            <div className="group-link pull-right">
              <div className="button-save">
                <ul>
                  <li>
                    <button type="submit" name="play &amp; launch" className="btn">
                      <span className="fa fa-thumbs-up"/>
                      <span className="text">
                        {
                          isEmpty(props.userVoted) ?
                            props.localePoll.VOTE_BUTTON :
                            props.localePoll.REVOTE_BUTTON
                        }
                      </span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export default AnswerContent;
