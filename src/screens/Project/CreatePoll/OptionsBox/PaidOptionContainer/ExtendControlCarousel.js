import React, { Component } from 'react';
import Carousel from 'nuka-carousel';

class ExtendControlCarousel extends Component {
  render() {
    return (
      <div className="wrap-slider">
        <Carousel
          ref="carousel"
          // data={this.setCarouselData.bind(this, 'carousel')}
          {...this.props}
          renderCenterLeftControls={({ previousSlide }) => (
            <button type="button" className="prev-carousel" onClick={() => {
              this.props.onClickPrev()
              previousSlide()
            }}>
              <span className="fa fa-angle-left"/>
            </button>
          )}
          renderCenterRightControls={({ nextSlide }) => (
            <button type="button" className="next-carousel" onClick={() => {
              this.props.onClickNext()
              nextSlide()
            }}>
              <span className="fa fa-angle-right" />
            </button>
          )}
          renderBottomCenterControls={() => {}}
        >
          {this.props.children}
        </Carousel>
      </div>
    )
  }
}

export default ExtendControlCarousel;
