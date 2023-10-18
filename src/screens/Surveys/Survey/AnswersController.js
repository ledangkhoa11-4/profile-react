import PropTypes from 'prop-types';
import { renderAnswers } from '../../Poll/utils';

const AnswersController = (props) => {
  return renderAnswers(props, true)
}

AnswersController.propTypes = {
  question: PropTypes.object,
  currentAnswer: PropTypes.object,
};

export default AnswersController;
