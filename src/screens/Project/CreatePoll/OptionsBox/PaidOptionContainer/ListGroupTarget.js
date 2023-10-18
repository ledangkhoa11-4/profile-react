import React, { Component } from 'react';
import Select from 'react-select';
import TargetOptionContainer from './TargetOptionContainer';
import { GET_CONDITION_OPT } from '../../../constant';
const _localeCreate = window.locale.Create;
const CONDITION_OPT = GET_CONDITION_OPT(_localeCreate.TITLE_GROUP_TARGET)

class ListGroupTarget extends Component {
  getGroupTargetValue = () => {
    return this.props.groupTarget.map((group, idx) => {
      const targetsVal = this.listGroupEl[idx].getTargetOptData()
      return {
        value: targetsVal,
        compare: group.compare,
      }
    })
  }
  render() {
    this.listGroupEl = [];
    return this.props.groupTarget.map((target, idx) => {
      return (
        <div key={idx}>
          {
            idx > 0 ?
            (
              <div className="condition-group target group">
                <Select
                  className="custom-select"
                  clearable={false}
                  searchable={false}
                  options={CONDITION_OPT}
                  value={target.compare}
                  onChange={(option) => {
                    this.props.onChangeCondition(idx, option.value)
                  }}
                />
              </div>
            ) : null
          }
          <TargetOptionContainer
            ref={node => {
              if (node) this.listGroupEl.push(node)
            }}
            index={idx}
            {...this.props}
            target={target}
            getListUserFilter={this.props.getListUserFilter}
          />
        </div>
      )
    })
  }
}

export default ListGroupTarget;
