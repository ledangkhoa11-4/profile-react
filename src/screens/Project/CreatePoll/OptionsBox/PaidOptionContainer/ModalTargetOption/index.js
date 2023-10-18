import React, { Component } from 'react';
import Modal from 'react-responsive-modal';
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';
import Select from 'react-select';
import InputRange from 'react-input-range';
import ListSelected from './ListSelected';
import 'react-input-range/lib/css/index.css';
import BasicContent from './BasicContent';
import SpecificTarget from './SpecificTarget';
import './style.css';
import {
    TYPE_OPTION_TARGET,
    GENDEROPT,
    INPUT_NAME,
    ENUM,
    EXTEND_OPTION_TYPE,
  } from '../../../../constant';
import {
    parseData,
    renderItemtarget,
  } from './renderOptionsForm';
  import {
    isEmpty,
    filter,
    cloneDeep,
  } from 'lodash';
import { findAncestor } from '../../../../../../services/utils';

const localeCreate = window.locale.Create;
const {
    AGE_FROM,
    AGE_TO,
    GENDER,
    CITY,
    TARGET_NAME,
  } = INPUT_NAME;
class ModalTargetOtion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showObjectTarget: TYPE_OPTION_TARGET.BASIC,
            searchListUserTarget: '',
            listTargetsOfUserSearch: props.listTargetsOfUser
            //minHeight: 300,
        }
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.listTargetsOfUser.length !== this.state.listTargetsOfUserSearch){
            this.setState({
                listTargetsOfUserSearch: nextProps.listTargetsOfUser
            })
        }
    }
    onChangeSearchUserTarget = (e) => {
        const { value } = e.target;
        let listTargetsOfUserSearch;
        if(this.state.listTargetsOfUserSearch.length > 0 && value !== ''){
            listTargetsOfUserSearch = filter(this.state.listTargetsOfUserSearch, (item) => {
                return item.name.indexOf(value) > -1;
            })
        }else{
            listTargetsOfUserSearch = this.props.listTargetsOfUser
        }
        this.setState({
            searchListUserTarget: value,
            listTargetsOfUserSearch
        })
    }
    toggleOptionTarget = () => {
        if(this.state.showObjectTarget === TYPE_OPTION_TARGET.BASIC){
            this.setState({
                showObjectTarget: TYPE_OPTION_TARGET.ADVANCED
            })
        }else{
            this.setState({
                showObjectTarget: TYPE_OPTION_TARGET.BASIC
            })
        }
    }
    componentDidMount(){
        // const minHeight = document.getElementById('container-left-target').offsetHeight;
        // this.setState({
        //     minHeight
        // })
    }
    render(){
        const tabsClass = [undefined, undefined];
        const tabsPanelClass = ['hidden box-dashboard-target', 'hidden box-dashboard-target', 'hidden box'];
        tabsClass[this.props.formState.indexTab] = 'active';
        tabsPanelClass[this.props.formState.indexTab] = tabsPanelClass[this.props.formState.indexTab].replace('hidden', 'tab-content');
        return(
            <Modal
                open={this.props.formState.isExpandTargetForm}
                onClose={() => this.props.onToggleTargetForm(true)}
                blockScroll={false}
                closeOnOverlayClick={false}
                showCloseIcon={true}
                classNames={{
                    overlay: 'Modal-overlay-0-1 modal-target-option',
                    modal: 'Modal-modal-0-3',
                    closeIcon: 'Modal-closeIcon-0-4'
                }}
            >
                <div className="container">
                    <div className="row">
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <Tabs
                                className="box-tab-target"
                                selectedIndex={this.props.formState.indexTab}
                                onSelect={this.props.onChangeIndexTab}
                            >
                                <div className="tablist-target-option">
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <TabList className="list-tab-target list-inline">
                                                <Tab className={tabsClass[0]}>
                                                    {localeCreate.Create_new_target_option}
                                                </Tab>
                                                <Tab className={tabsClass[1]}>
                                                    <a
                                                        className="toggle-list-user-target noselect"
                                                        onClick={this.props.onToggleUserTarget}
                                                    >
                                                        {localeCreate.Select_the_saved_object} {this.props.formState.isShowOptionUserTarget ? <span className="fa fa-angle-up"></span> : <span className="fa fa-angle-down"></span>}
                                                    </a>
                                                    {
                                                        this.props.formState.isShowOptionUserTarget ?
                                                            <div className="box-select-list-user-target">
                                                                <div className="search-user-target">
                                                                   <input
                                                                    className="form-control"
                                                                    value={this.state.searchListUserTarget}
                                                                    onChange={this.onChangeSearchUserTarget}
                                                                    placeholder="Tìm kiếm"
                                                                    />
                                                                    <span className="fa fa-search"></span>
                                                                </div>
                                                                <div className="sub-title">
                                                                    {localeCreate.Select_a_saved_object}
                                                                </div>
                                                                <ul>
                                                                    {
                                                                        this.state.listTargetsOfUserSearch.length > 0 ?
                                                                            this.state.listTargetsOfUserSearch.map((item, idx) =>{
                                                                                const classitem = !isEmpty(this.props.formState.currentUserTargetSelected) && this.props.formState.currentUserTargetSelected.value === item.id ? 'active' : ''
                                                                                return <li className={classitem} key={idx}
                                                                                            onClick={() => this.props.onChangeUserTarget(item.id)}
                                                                                        >
                                                                                            {item.name}
                                                                                        </li>
                                                                            })
                                                                        :
                                                                            <li>
                                                                                {localeCreate.There_are_no_objects}
                                                                            </li>
                                                                    }
                                                                </ul>
                                                            </div>
                                                        : null
                                                    }
                                                </Tab>
                                            </TabList>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <TabPanel className={tabsPanelClass[0]}>
                                        <div className="container-paid-option">
                                            <div className="row">
                                                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                                    <div className="title-paid-option">
                                                        {
                                                            !isEmpty(this.props.formState.currentUserTargetSelected) ?
                                                                this.props.formState.currentUserTargetSelected.label
                                                            :
                                                                this.props.formState.currentIndexChildTarget === -1 ?
                                                                `${localeCreate.NAME_TARGET_GROUP_SAVED} ${this.props.index + 1}`
                                                                :
                                                                `${localeCreate.NAME_TARGET_GROUP_SAVED} ${this.props.formState.currentIndexChildTarget + 1}`
                                                        }
                                                        
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div id="container-left-target" className="col-xs-12 col-sm-9 col-md-9 col-lg-9">
                                                    <div className="box-choose-object-target">
                                                        {
                                                            this.state.showObjectTarget === TYPE_OPTION_TARGET.BASIC ?
                                                                <BasicContent
                                                                    toggleOptionTarget={this.toggleOptionTarget}
                                                                   {...this.props}
                                                                />
                                                            :
                                                                <SpecificTarget
                                                                    toggleOptionTarget={this.toggleOptionTarget}
                                                                    localeCreate={this.localeCreate}
                                                                    {...this.props}
                                                                />
                                                        }
                                                    </div>
                                                </div>
                                                {/* style={{minHeight: this.state.minHeight + 'px'}} */}
                                                <div  id="container-right-target" className="col-xs-12 col-sm-3 col-md-3 col-lg-3 padding-right-0">
                                                    <div className="box-selected-object">  
                                                        <div className="title">
                                                            {localeCreate.The_object_is_selected}
                                                        </div>
                                                        <ListSelected {...this.props} />
                                                        <div className="btn-group-object">
                                                           <div className="btn-style">
                                                                <a
                                                                    role="buttom"
                                                                    className="btn btn-create-object-target"
                                                                    onClick={this.props.appendTarget}
                                                                >
                                                                    {
                                                                        this.props.formState.currentIndexChildTarget === -1 ?
                                                                            localeCreate.Create_object
                                                                        :
                                                                            localeCreate.OK_EDIT_TARGET_BUTTON
                                                                    }
                                                                    
                                                                </a>
                                                           </div>
                                                           <div className="btn-no-style">
                                                                
                                                                <a
                                                                    onClick={this.props.onToggleTargetModal}
                                                                >
                                                                    {localeCreate.Save_target_group}
                                                                </a>
                                                           </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </TabPanel>
                                    <TabPanel className={tabsPanelClass[1]}>
                                        <div className="box-show-detail-target">
                                            {
                                                !isEmpty(this.props.formState.dataTargetChoose) ?
                                                    <div>
                                                        <div className="row">
                                                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                                                <div className="title-target">
                                                                    {this.props.formState.dataTargetChoose[TARGET_NAME]}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {renderItemtarget(this.props)}

                                                        <div className="row">
                                                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                                                <div className="box-btn">
                                                                
                                                                    <a
                                                                        className="btn"
                                                                        role="buttom"
                                                                        onClick={() => this.props.onDeleteTarget(this.props.formState.dataTargetChoose.currentUserTargetSelected.value)}
                                                                    >
                                                                        {localeCreate.Delete_object}
                                                                    </a>
                                                                    <a
                                                                        className="btn"
                                                                        role="buttom"
                                                                        onClick={this.props.onChoooseTarget}
                                                                    >
                                                                        {localeCreate.Select_object}
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                : 
                                                    <div className="empty">
                                                        {localeCreate.Empty_object}
                                                    </div>
                                            }
                                        </div>
                                    </TabPanel>
                                </div>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </Modal>
        )
    }
}
export default ModalTargetOtion;