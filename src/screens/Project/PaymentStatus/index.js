import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Layout from 'components/Layout';
import StatusBox from './StatusBox';
import { updatePageTitle } from 'actions/ui';
import { ENUM } from '../constant';
import { APIs, ROUTER_PATH } from 'services/config';
import { requestAPI } from 'services/utils';
import Page404 from 'screens/Page404';

class PaymentStatusContent extends Component {
  state = {
    orderId: '',
    nameProduct: '',
    qty: 0,
    price: 0,
    subTotal: 0,
    total: 0,
    isNotFound: false,
  }

  componentDidMount() {
    this.getPaymentStatus() 
  }  

  getPaymentStatus() {
    const { paymentId } = this.props.match.params;
    const { getPaymentStatus } = APIs.project;

    requestAPI({
      url: getPaymentStatus.url.replace('{vpc_MerchTxnRef}', paymentId),
      method: getPaymentStatus.method,
    }).then(res => {
      if (res.success) {
        const data = res.data;
        this.setState({
          orderId: data.vpc_OrderInfo,
          nameProduct: data.Title,
          qty: data.quantity,
          price: data.priceCurrency,
          subTotal: data.subtotalCurrency,
          total: data.totalCurrency,
          code: data.code,
          message: data.sms,
        }, () => {
          this.props.updatePageTitle(`${this.props.localePayment.CONFIRM_TITLE} > ${data.Title}`)
        })
      }
    }).catch(error => {
      this.setState({ isNotFound: true })
    })
  }

  backToListPollSurvey = () => {
    const {
      type,
    } = this.props.match.params;

    switch(type) {
      case ENUM.TYPE.POLL:
        this.props.history.replace(ROUTER_PATH.POLL)
        break;
      case ENUM.TYPE.SURVEY:
        this.props.history.replace(ROUTER_PATH.SURVEY)
        break;
      default:
        break;
    }
  }

  render() {
    if (this.state.isNotFound) {
      return <Page404/>
    }

    return (
      <StatusBox
        type={this.props.match.params.type}
        backToListPollSurvey={this.backToListPollSurvey}
        formState={this.state}
        user={this.props.user}
        localePayment={this.props.localePayment}
      />
    )
  }
}

PaymentStatusContent = connect((state, ownProps) => ({
  ...ownProps,
  user: state.user,
}), {
  updatePageTitle,
})(PaymentStatusContent)

export default (props) => <Layout
  index={4}
  title="Payment"
  menuIcon="assessment"
  mainContent={withRouter(() => <PaymentStatusContent
    {...props}
  />)}
/>
