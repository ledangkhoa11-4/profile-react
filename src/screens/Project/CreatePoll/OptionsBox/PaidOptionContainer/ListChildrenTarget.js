import React from 'react';
import Select from 'react-select';
import { forEach } from 'lodash';
import { parseAnOptionTargetToViewNew } from 'services/utils';
import { GET_CONDITION_OPT } from '../../../constant';

const CONDITION_OPT = GET_CONDITION_OPT()
const localeCreate = window.locale.Create;
function childrenTargets(props) {
  const items = [];
  forEach(props.formState.childrenTargets, (target, idx) => {
    const class_item = props.ListShowItemChildrenTargetDetail[idx] ? 'item-children-target active' : 'item-children-target';
    const item =  <div className={class_item} key={idx}>
                        <div className="title-children-target">
                            {localeCreate.NAME_TARGET_GROUP_SAVED} {idx + 1}:
                        </div>
                        <div className="box-list-item-item-children-target">
                          {
                            props.ListShowItemChildrenTargetDetail[idx] ? 
                              <ul className="list-item-item-children-target"
                                dangerouslySetInnerHTML={{
                                  __html: parseAnOptionTargetToViewNew(
                                    target,
                                    props.listPollSurvey,
                                    props.keyPollSurvey,
                                    props.listTargetOption,
                                    'li'
                                  )
                                }}
                              />
                              : 
                              <span 
                                onClick={() => props.onChanShowItemChildrenTargetDetail(idx)}
                                className="list-item-item-children-target"
                                dangerouslySetInnerHTML={{
                                  __html: parseAnOptionTargetToViewNew(
                                    target,
                                    props.listPollSurvey,
                                    props.keyPollSurvey,
                                    props.listTargetOption,
                                    'span'
                                  )
                                }}
                              />
                          }
                          <a
                            className="toggle-children-target"
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                props.onChanShowItemChildrenTargetDetail(idx)
                            }}
                          >
                            {
                              props.ListShowItemChildrenTargetDetail[idx] ?
                                <span className="fa fa-chevron-up"></span>
                              :
                                <span className="fa fa-chevron-down"></span>
                            }
                            
                          </a>
                        </div>
                        <div className="group-btn-action-children-target">
                          <a
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                props.selectChildTarget(idx)
                            }}
                          >
                            {localeCreate.messages_edit_target}
                          </a>
                          <a
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              props.deleteChildTarget(idx)
                            }}
                          >
                            {localeCreate.DELETE_GROUP_TARGET_BUTTON}
                          </a>
                        </div>
                  </div>
    items.push(item)

    if (idx < props.formState.childrenTargets.length - 1) {
      const conditionItem = (
        <div key={`${idx}-condition`} className="box-compare-children-target condition-group target">
            <Select
              className="custom-select"
              clearable={false}
              searchable={false}
              options={CONDITION_OPT}
              value={target.compare}
              onChange={(option) => {
                props.onChangeTargetCondition(idx, option.value)
              }}
            />
        </div>
      )

      items.push(conditionItem)
    }
  })

  return items;
}

const ListChildrenTarget = (props) => {
  if (!props.formState.childrenTargets.length) {
    return null;
  }
  return (
    <div className="">
      { childrenTargets(props) }
    </div>
  )
}

export default ListChildrenTarget;
