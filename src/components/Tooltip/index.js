import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Tooltip.css';

export default class Tooltip extends Component {
    constructor() {
      super();
      this.state = {
        show: false
      }
      this.handleClick = this.handleClick.bind(this);
    }
  
    handleClick() {
      this.setState({ show: !this.state.show });
    }
  
    render() {
      return (
        <span className='tooltip-container'
          onClick={this.handleClick}
        >
            { this.state.show &&
                <div
                    className={`tooltip-content ${this.props.position}`}
                    dangerouslySetInnerHTML={{ __html: this.props.content }}
                />
            }
          {this.props.children}
        </span>
      );
    }
  }
  
  Tooltip.propTypes = {
    content: PropTypes.string.isRequired,
    position: PropTypes.string,
    trigger: PropTypes.string
  };
  
  Tooltip.defaultProps = {
    position: 'top',
  };
  