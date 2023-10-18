import React from 'react';
import PropTypes from 'prop-types';

const localeSurvey = window.locale.Survey;

const CategoriesSurvey = (props) => {
  return (
    <div className="box-category">
      <div className="inner">
        <div className="list-category">
          {
            props.categories.map(category => {
              return (
                <div className="item" key={category.id}>
                  <a
                    role="button"
                    title={category.name}
                    onClick={() => {
                      props.gotoSubcategoriesSurvey(category)
                    }}
                  >
                    {
                      category.fullImage ?
                        <div className="thumb">
                          <img src={category.fullImage} alt={category.name}/>
                        </div> : null
                    }
                    <h3 className="title">{ category.name }</h3>
                    <div className="caption">
                      <span className="point">
                        {category.survey_count} &nbsp;
                        {localeSurvey.SURVEY_COUNT_PREFIX}
                      </span>
                    </div>
                  </a>
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

CategoriesSurvey.propTypes = {
  categories: PropTypes.array.isRequired,
  gotoSubcategoriesSurvey: PropTypes.func.isRequired,
}

export default CategoriesSurvey;
