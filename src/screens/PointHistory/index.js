import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updatePageTitle } from 'actions/ui';
import { APIs } from 'services/config';
import { onScroll, requestAPI } from 'services/utils';
import Layout from 'components/Layout';
import BottomLoading from 'components/BottomLoading';
import CustomDatePicker from 'components/CustomDatePicker';
import HistoryItem from './Item';

const localeCommon = window.locale.Common,
      localePointHistory = window.locale.PointHistory;
const DATE_POINT = 'date_point';

class PointHistory extends Component {
  constructor(props) {
    super(props)

    this.state = {
      [DATE_POINT]: null,
      nextPagingUrl: null,
      pointHistories: [],
      isBottomLoading: false,
    }
  }

  componentWillMount () {
    window.addEventListener('scroll', this.handleLoadmore)
    this.props.updatePageTitle(localeCommon.POINT_HISTORY_PAGE)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleLoadmore)
  }

  componentDidMount() {
    this.requestPointHistory(APIs.pointHistory.url)
  }

  handleLoadmore = async () => {
    await onScroll()
    if (this.state.isBottomLoading) return;

    if (this.state.next_page_url) {
      this.setState({
        isBottomLoading: true,
      }, () => {
        this.requestPointHistory(this.state.next_page_url)
      });
    }
  }

  requestPointHistory(url) {
    const config = {
      url,
      method: APIs.pointHistory.method,
    }
    if(this.state[DATE_POINT]) {
      const datePoint = this.state[DATE_POINT].toDate();
      const year = datePoint.getFullYear();
      let month = datePoint.getMonth() + 1;
      let date = datePoint.getDate();
      month = ('0' + month).slice(-2);
      date = ('0' + date).slice(-2);
      
      config.dataForm = {
        date: `${year}-${month}-${date}`
      }
    }
    requestAPI(config).then(res => {
      if (res.success) {
        const data = res.data;
        this.setState({
          pointHistories: this.state.pointHistories.concat(data.data),
          nextPagingUrl: data.next_page_url,
          isBottomLoading: false,
        })
      }
    })
  }

  onChangeDate = (val) => {
    this.setState({
      [DATE_POINT]: val,
      pointHistories: [],
    }, () => {
      this.requestPointHistory(APIs.pointHistory.url)
    })
  }

  render() {
    return (
      <div className="box-point-history">
        <div className="inner">
          <div className="short-info">
            <div className="date-point">
              <CustomDatePicker
                name={DATE_POINT}
                selected={this.state[DATE_POINT]}
                time={false}
                calendarClassName="date-form"
                onChange={this.onChangeDate}
                placeholderText={localePointHistory.DATE_HOLDER}
                dateFormat="DD-MM-YYYY"
              />
            </div>
            <div className="total-point">
              <div className="wrapper">
                <span className="label">
                  <span className="fa fa-rocket"/>
                  <span className="text">
                    {localePointHistory.TOTAL_LABEL}
                  </span>
                </span>
                <span className="point">
                  { this.props.user.point }
                </span>
              </div>
            </div>
          </div>
          {
            this.state.pointHistories.map((item, idx) => {
              return (
                <HistoryItem
                  key={idx}
                  {...item}
                />
              )
            })
          }
          {
            this.state.isBottomLoading ?
              <BottomLoading /> : null
          }
        </div>
      </div>
    )
  }
}

PointHistory = connect((state, ownProps) => ({
  ...ownProps,
  user: state.user,
}), {
  updatePageTitle,
})(PointHistory)

export default () => <Layout
  index={1}
  menuIcon="account_box"
  mainContent={PointHistory}
  title="User Detail"
/>
