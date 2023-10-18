import React, { Component } from 'react';
import Modal from 'react-responsive-modal';
import { INPUT_NAME } from '../../../constant';
import {
    renderItemtarget
} from './ModalTargetOption/renderOptionsForm';
const localeCommon = window.locale.Common;
const localeCreate = window.locale.Create;
const {
    TARGET_NAME,
} = INPUT_NAME;

class ModalSaveShowTarget extends Component{
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    render(){
        return (
            <Modal
                open={this.props.formState.isExpandTargetModal}
                onClose={this.props.onToggleTargetModal}
                showCloseIcon={true}
                classNames={{
                    overlay: 'Modal-overlay-0-1 modal-save-target',
                    modal: 'Modal-modal-0-3',
                    closeIcon: 'Modal-closeIcon-0-4'
                }}
            >
                <div className="box-save-target">
                    <div className="title">
                        {localeCreate.Save_target_group}
                    </div>
                    <div className="line"></div>
                    <div className="box-main-form-save-target">
                        <div className="row">
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className="sub-title">
                                    {localeCreate.input_name_target_group} 
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className="content">
                                    <input
                                        name={TARGET_NAME}
                                        className="input"
                                        value={this.props.formState[TARGET_NAME]}
                                        onChange={this.props.onChangeInputText}
                                    />
                                    {
                                        !this.props.formState.isValidTargetName ?
                                        <span className="placeholder-error">
                                            {localeCommon.REQUIRED_FIELD_MSG}
                                        </span> : null
                                    }
                                </div>
                            </div>
                        </div>

                        {renderItemtarget(this.props)}
                       
                        <div className="row">
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div className="box-btn-form-save-target">
                                    <a
                                        className="btn"
                                        role="buttom"
                                        onClick={this.props.onToggleTargetModal}
                                    >
                                        {localeCreate.messages_cancel}
                                    </a>
                                    <a
                                       className="btn"
                                       role="buttom"
                                       onClick={this.props.saveTarget}
                                    >
                                        {localeCreate.TARGET_SAVE}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        )
    }
}

export default ModalSaveShowTarget;