import React, { Component } from 'react';
import Alert from 'react-s-alert';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Layout from 'components/Layout';
import PaymentForm from './PaymentForm';
import { updatePageTitle } from 'actions/ui';
import { APIs, BASE_URL, CHILD_ROUTE_PATH, PREFIX_PATH } from 'services/config';
import { getTokenCookie, requestAPI } from 'services/utils';
import { ENUM, INPUT_NAME } from '../constant';

class PaymentContent extends Component {
  state = {
    name: '',
    qty: 0,
    price: 0,
    subTotal: 0,
    total: 0,
    canUsingWalletPayment: false,
  }

  componentWillMount() {
    const { type } = this.props.match.params;
    this.props.updatePageTitle(`${type} > ${this.props.localeCommon.PAYMENT_PAGE}`)
  }
  
  componentDidMount() {
    this.getPaymentInfo()
  }

  componentDidUpdate = (prevProps) => {
    const { user } = this.props
    if (
      JSON.stringify(user) !== JSON.stringify(prevProps.user) &&
      user.pay && user.pay.coin && this.state.subTotal < user.pay.coin
    ) {
      this.setState({
        canUsingWalletPayment: true
      })
    }
  }
  

  getPaymentInfo() {
    const { getPaymentInfo } = APIs.project;
    const { pollSurveyId, type, action } = this.props.match.params;
    if (ENUM.TYPE.POLL !== type && ENUM.TYPE.SURVEY !== type) {
      // type false
      return;
    }

    const dataForm = {
      pay_name: type,
      pay_id: pollSurveyId,
      action: action
    }

    requestAPI({
      url: getPaymentInfo.url,
      method: getPaymentInfo.method,
      dataForm,
    }).then(res => {
      if (!res.success) {
        // TODO: show the error
        return;
      }

      const data = res.data;
      const _state = {
        name: data[0],
        qty: data[1],
        price: data[2],
        subTotal: data[3],
        total: data[4],
      }
      const { user } = this.props

      if (user && user.pay && user.pay.coin && data[4] < user.pay.coin) {
        _state.canUsingWalletPayment = true
      }

      this.setState(_state)
    })
  }

  onSubmitPayment = (e) => {
    const dataForm = new FormData(e.target);
    const paymentType = dataForm.get(INPUT_NAME.PAYMENT_TYPE)
    
    if (!paymentType) {
      e.preventDefault()
      Alert.error(this.props.localePayment.PAYMENT_TYPE_REQUIRED)
      return;
    } else if (paymentType === 'Wallet' && !this.state.canUsingWalletPayment) {
      e.preventDefault()
      Alert.warning(this.props.localePayment.WALLET_NOT_ENOUGH)
      return;
    }
  }
  
  render() {
    const { pollSurveyId, type } = this.props.match.params;
    const paymentStatusUrl = BASE_URL + PREFIX_PATH + CHILD_ROUTE_PATH.PAYMENT_STATUS
                              .replace(':type', type)
                              .replace(':pollSurveyId', pollSurveyId)

    return (
      <PaymentForm
        formState={this.state}
        onSubmitPayment={this.onSubmitPayment}
        paymentStatusUrl={paymentStatusUrl}
        pay_id={pollSurveyId}
        pay_name={type}
        token={getTokenCookie()}
        paymentFormUrl={APIs.project.gotoPayment.url}
        localePayment={this.props.localePayment}
        user={this.props.user}
      />
    )
  }
}

PaymentContent = connect((state, ownProps) => ({
  ...ownProps,
  user: state.user,
}), {
  updatePageTitle,
})(PaymentContent)

export default (props) => <Layout
  index={4}
  title="Payment"
  menuIcon="assessment"
  mainContent={withRouter(() => <PaymentContent
    {...props}
  />)}
/>
