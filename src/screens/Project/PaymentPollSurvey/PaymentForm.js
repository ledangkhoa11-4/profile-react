import React from 'react'
import PropTypes from 'prop-types'
import { formatPrice } from 'services/utils'
import { INPUT_NAME } from '../constant'

const PaymentForm = (props) => {
  const {
    formState,
    onSubmitPayment,
    paymentStatusUrl,
    pay_id,
    pay_name,
    paymentFormUrl,
    token,
    localePayment,
    user,
  } = props;

  const coin = (user && user.pay && user.pay.coinCurrency) || 0

  return (
    <form
      method="POST"
      action={paymentFormUrl}
      className="form form-option"
      onSubmit={onSubmitPayment}
    >
      <div className="box style-orange box-pay">
        <div className="inner">
          <div className="content">
            <div className="row">
              <div className="col-sm-6">
                <div className="title-pay">
                  {localePayment.TITLE_METHOD}
                </div>
                {/* <ul className="list-inline">
                  <li><img src={require('assets/images/visa.png')} alt="visa"/></li>
                  <li><img src={require('assets/images/aexpres.png')} alt="express"/></li>
                  <li><img src={require('assets/images/master.png')} alt="master"/></li>
                  <li><img src={require('assets/images/paypal.png')} alt="paypal"/></li>
                </ul> */}
                {/* <div className="form">
                  <div className="form-group">
                    <label htmlFor="get" className="label">Get promo code</label>
                    <input id="get" type="text" name="get" className="input"/>
                  </div>
                </div> */}
                <div className="payment-provider">
                  <img src={require('assets/images/logo-onepay.png')} alt="onepay"/>
                </div>
                <div className="title-pay">
                  <p>{localePayment.CURRENT_BALANCE}</p>
                  <p>
                    <span
                      className="material-icons"
                      style={{
                        verticalAlign: 'middle'
                      }}
                    >
                      account_balance_wallet
                    </span>
                    <span className="text">
                      { formatPrice(coin) }
                      { user.currency }
                    </span>
                  </p>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="quotation">
                  <div className="row">
                    <div className="col-xs-6">
                      <div className="title-1">
                        {localePayment.PRODUCT}
                      </div>
                    </div>
                    <div className="col-xs-6">
                      <div className="text-1">
                      { formState.name }
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-xs-6">
                      <div className="title-1">
                        {localePayment.QUANTITY}
                      </div>
                    </div>
                    <div className="col-xs-6">
                      <div className="text-1">{ formState.qty }</div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-xs-6">
                      <div className="title-1">
                        {localePayment.PRICE}
                      </div>
                    </div>
                    <div className="col-xs-6">
                      <div className="text-1">
                        { user.currency } { formatPrice(formState.price) }
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-xs-6">
                      <div className="title-1">
                        {localePayment.SUBTOTAL}
                      </div>
                    </div>
                    <div className="col-xs-6">
                      <div className="text-1">
                        { user.currency } { formatPrice(formState.subTotal) }
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-xs-6">
                      <div className="title-1 large">
                        {localePayment.TOTAL}
                      </div>
                    </div>
                    <div className="col-xs-6">
                      <div className="text-1 large">
                        { user.currency } { formatPrice(formState.total) }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="box box-pay">
        <div className="inner">
          <div className="content">
            <div className="title-pay">
              {localePayment.TITLE_METHOD}
            </div>
            <ul className="list">
              <li>
                <div className="custom-radio">
                  <input
                    id="radio"
                    type="radio"
                    name={INPUT_NAME.PAYMENT_TYPE}
                    value="International"/>
                  <label htmlFor="radio">
                    {localePayment.EXTERNAL}
                  </label>
                </div>
              </li>
              <li>
                <div className="custom-radio">
                  <input
                    id="radio1"
                    type="radio"
                    name={INPUT_NAME.PAYMENT_TYPE}
                    value="Domestic"
                  />
                  <label htmlFor="radio1">
                    {localePayment.INTERNAL}
                  </label>
                </div>
              </li>
              <li>
                <div className="custom-radio">
                  <input
                    id="radio2"
                    type="radio"
                    name={INPUT_NAME.PAYMENT_TYPE}
                    value="Wallet"
                  />
                  <label htmlFor="radio2">
                    {localePayment.WALLET}
                  </label>
                </div>
              </li>
            </ul>
            <input type="hidden" name="pay_callback" value={paymentStatusUrl}/>
            <input type="hidden" name="pay_id" value={pay_id}/>
            <input type="hidden" name="pay_name" value={pay_name}/>
            <input type="hidden" name="api_token" value={token} />
            <div className="button-save pull-right">
              <button type="submit" name="pay" className="btn" title="payment">
                <span className="material-icons">poll</span>
                <span className="text">
                  {localePayment.PAYMENT_BUTTON}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}

PaymentForm.propTypes = {
  formState: PropTypes.shape({
    qty: PropTypes.number.isRequired,
    price: PropTypes.number.isRequired,
    subTotal: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
  }).isRequired,
  onSubmitPayment: PropTypes.func.isRequired,
  paymentStatusUrl: PropTypes.string.isRequired,
  pay_id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  pay_name: PropTypes.string.isRequired,
  paymentFormUrl: PropTypes.string.isRequired,
}

export default PaymentForm;
