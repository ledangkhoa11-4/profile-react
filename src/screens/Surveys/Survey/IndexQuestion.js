import React, { Component } from 'react';
import PropTypes from 'prop-types';

class IndexQuestion extends Component {
  state = {
    height: 'auto',
  }
  
  componentWillMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }  
  
  componentDidMount() {
    setTimeout(() => {
      this.calculateHeight()
    }, 500);
  }

  handleResize = () => {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      this.calculateHeight();
    }, 300);
  }

  calculateHeight() {
    const bounding = this.item.getBoundingClientRect();
    this.setState({
      height: bounding.width,
    });
  }
  
  render() {
    const {
      backToQuestion,
      current,
      index,
      isActiveOne,
    } = this.props;
    const activeClass = (isActiveOne ? index === current : index <= current) ?
      'active' : undefined;

    return (
      <li className={activeClass}>
        <a
          role="button"
          title="question"
          ref={node => {
            if (node) {
              this.item = node;
            }
          }}
          style={{height: this.state.height}}
          onClick={() => {
            backToQuestion(index);
          }}
        >
          <span className="order">{ index + 1}</span>    
        </a>
      </li>
    );
  }
}

IndexQuestion.propTypes = {
  backToQuestion: PropTypes.func.isRequired,
  index: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  isActive: PropTypes.bool,
}

IndexQuestion.defaultProps = {
  isActiveOne: false,
}

export default IndexQuestion;
