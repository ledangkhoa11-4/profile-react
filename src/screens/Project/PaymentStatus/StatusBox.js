import React from 'react';
import PropTypes from 'prop-types';
import { formatPrice } from 'services/utils';

let StatusBox = (props) => {
  const {
    backToListPollSurvey,
    formState,
    type,
    user,
    localePayment,
  } = props;
  const statusClass = formState.code === '0' ?
    'fa-check-circle' : 'fa-exclamation-circle'

  return (
    <div className="box box-thank-payemt">
      <div className="inner">
        <div className="title">
          <span className="material-icons">card_membership</span>
          <h2>
            {localePayment.CONFIRM_TITLE}
          </h2>
        </div>
        <div className="content">
          <div className="row">
            <div className="col-xs-6">
              <div className="name">
                {localePayment.HI} {user.name},
              </div>
            </div>
            <div className="col-xs-6">
              <div className="order">
                {localePayment.ORDER_TITLE}: {formState.orderId}
              </div>
            </div>
            <div className="col-xs-12">
              <div className="desc">
                <p> <strong>{localePayment.THANKS}</strong></p>
                <p>
                  {localePayment.STATUS_TITLE}&nbsp;{formState.orderId}: {formState.message}
                  <span className={`status-payment fa ${statusClass}`}/>
                </p>
              </div>
            </div>
          </div>
          <div className="box-pay">
            <div className="row">
              <div className="col-md-7 col-md-offset-5">
                <div className="quotation">
                  <div className="row">
                    <div className="col-xs-6">
                      <div className="title-1">
                        {localePayment.PRODUCT}
                      </div>
                    </div>
                    <div className="col-xs-6">
                      <div className="text-1">
                        {formState.nameProduct}
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
                      <div className="text-1">{formState.qty}</div>
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
                        { user.currency } {formatPrice(formState.price)}
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
                        { user.currency } {formatPrice(formState.subTotal)}
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
                        { user.currency } {formatPrice(formState.total)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="button-save pull-right">
            <a role="button" name="Back home" className="btn" onClick={backToListPollSurvey}>
              <span className="material-icons">home </span>
              <span className="text">
                {localePayment.BACK_BUTTON} {type}
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

StatusBox.propTypes = {
  backToListPollSurvey: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  formState: PropTypes.shape({
    orderId: PropTypes.string,
    nameProduct: PropTypes.string,
    qty: PropTypes.number,
    price: PropTypes.number,
    subTotal: PropTypes.number,
    total: PropTypes.number,
  }).isRequired,
  user: PropTypes.object.isRequired,
}

export default StatusBox;
