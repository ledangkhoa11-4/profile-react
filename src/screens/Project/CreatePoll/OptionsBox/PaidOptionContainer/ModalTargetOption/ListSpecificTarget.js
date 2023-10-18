import React from 'react';

const ListSpecificTarget = (props) => {
   
    return(
        props.listTargetOptionSearch.map((item, idx) =>{
            return  <li key={idx}>
                        <div className="row">
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div className="title-target">
                                    {item.name}
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div className="container-item-answer-target">
                                    <div className="row">
                                        {
                                            item.question.map((iitem, idxx) => {
                                                const classBoxItemTarget = typeof props.formState.answerSelected[iitem.id] !== 'undefined' 
                                                                            ? "box-item-answer-target active"
                                                                            : "box-item-answer-target"
                                                return <div key={idxx} className="col-xs-12 col-sm-6 col-md-4 col-lg-4">
                                                            <a
                                                                onClick={() => props.showQuestionDetail(iitem)}
                                                            >
                                                                <div className={classBoxItemTarget}>
                                                                    <div className="title">
                                                                        {iitem.name}
                                                                    </div>
                                                                    <div className="icon">
                                                                        <span className="fa fa-angle-right"></span>
                                                                    </div>
                                                                </div>
                                                            </a>
                                                        </div>
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
        })
    )
}

export default ListSpecificTarget;