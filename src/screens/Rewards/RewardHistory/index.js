
import React , { Component} from 'react';
import { connect } from 'react-redux';
import Layout from 'components/Layout';
import { APIs } from 'services/config';
import Alert from 'react-s-alert';
import moment from 'moment';
import {
    formatDate,
    formatPrice,
    requestAPI,
  } from 'services/utils';

const localeReward = window.locale.Reward;

class RewardHistoryContent extends Component{
    constructor(props) {
        super(props)
        this.state = {
            listHistory: []
        }
    }
    componentDidMount(){
        this.getListHistoryVoucher();
    }
    getListHistoryVoucher(){
        requestAPI({
        url: APIs.rewards.getHistory.url,
        method: APIs.rewards.getHistory.method,
        }).then(res => {
            if(res.success){
                this.setState({
                    listHistory: res.data
                })
            }
        }).catch(error =>{
            Alert.error(error.message)
        })
    }
    render(){
        return (
            <div className="div-box box-history-reward">
                <div className="title">
                    {localeReward.HISTORYREWARD}
                </div>
                <div className="line-2px"></div>
                <div className="table-reward-history table-responsive">
                    <table className="table table-responsive">
                        <thead>
                            <tr>
                                <th>{localeReward.Trading_code}</th>
                                <th>{localeReward.Gift_information}</th>
                                <th>{localeReward.Number_of_stars}</th>
                                <th>{localeReward.Date_of_change}</th>
                                {/* <th>Thời hạn</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.listHistory.map((history, idx) =>{
                                    return  <tr key={idx}>
                                                <td data-title={localeReward.Trading_code}>{history.ssDistributionId}</td>
                                                <td data-title={localeReward.Gift_information}>{history.totalOrderQuantity} voucher {formatPrice(history.voucher_value)} vnđ</td>
                                                <td data-title={localeReward.Number_of_stars}>{history.stars} <i className="fa fa-star"></i></td>
                                                <td data-title={localeReward.Date_of_change}>{formatDate(history.created_at)}</td>
                                                {/* <td data-title="Thời hạn">07/08/19-07/08/20</td> */}
                                            </tr>
                                })
                            }
                            {
                                this.state.listHistory.length === 0 ?
                                            <tr>
                                                <td data-title={localeReward.Trading_code}></td>
                                                <td data-title={localeReward.Gift_information}></td>
                                                <td data-title={localeReward.Number_of_stars}></td>
                                                <td data-title={localeReward.Date_of_change}></td>
                                                {/* <td data-title="Thời hạn">07/08/19-07/08/20</td> */}
                                            </tr>
                                : null
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

RewardHistoryContent = connect((state, ownProps) => ({
    ...ownProps,
    user: state.user,
  }), {
  })(RewardHistoryContent)
  
  const RewardHistory = () => {
    return (
      <Layout
        index={2}
        title="Reward"
        menuIcon="card_giftcard"
        mainContent={RewardHistoryContent}
      />
    )
  }
  
  export default RewardHistory;