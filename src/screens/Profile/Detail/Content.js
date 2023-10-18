import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tabs, TabList, TabPanel, Tab } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Questions from './Questions';
import {
  findIndex,
  forEach
} from 'lodash';
// import { isMobile } from 'services/utils';

class ProfileContent extends Component {
  constructor() {
    super();
    this.state = {
      indexTab: 0,
    };
    // this.isMobile = isMobile();
    // this.resizeTimout = 0;
  }
  
  // componentWillMount() {
  //   window.addEventListener('resize', this.handleResize);
  // }
  
  // componentWillUnmount() {
  //   window.removeEventListener('resize', this.handleResize);
  // }

  // handleResize = () => {
  //   if (this.resizeTimout) {
  //     clearTimeout(this.resizeTimout);
  //   }
  //   this.resizeTimout = setTimeout(() => {
  //     const isMobile = isMobile();
  //     if (this.isMobile === isMobile) {
  //       return;
  //     }
  //     this.isMobile = isMobile;      
  //   }, 150);
  // }

  onChangeTab = (indexTab) => {
    this.setState({ indexTab })
  }
  renderQuantity = (profile) =>{
    let quantity = 0;
   
    forEach(profile.question, question =>{
      if(question.parent_id == 0){
        const check = findIndex(this.props.userProfiles, ans =>{
          return ans.question_id === question.id;
        })
        if(check === -1){
          quantity++;
        }
      }else{
        const check = findIndex(this.props.userProfiles, ans =>{
          return ans.question_id === question.id;
        })
        const matchObj = this.props.userProfiles.find(obj => {
          return obj.answer_id.indexOf(question.parent_id) > -1;
        });
        if(check === -1 && matchObj){
          quantity++;
        }
      }
    })
    if(quantity > 0){
      return(
        <div className="quantity-profile-need-input">
          {quantity}
        </div>
      )
    }
    
    return;
  }
  render() {
    return (
      <Tabs
        selectedIndex={this.state.indexTab}
        onSelect={this.onChangeTab}
      >
        <div className="list-title-information hidden-xs">
          <TabList>
            {
              this.props.profiles.map((profile, idx) => {
                return (
                  <Tab
                    key={profile.id}
                    className={idx === this.state.indexTab ? 'active' : ''}
                  >
                    <a title={profile.name}>{ profile.name }</a>
                    { this.renderQuantity(profile) }
                  </Tab>
                )
              })
            }
          </TabList>
        </div>
        <div className="collasap">
          {
            this.props.profiles.map((profile, idx) => {
              return (
                <div key={profile.id}>
                  <a title={profile.name} onClick={() => {
                    this.onChangeTab(idx);
                  }}>
                    <div className={`visible-xs title-mobile ${idx === this.state.indexTab ? 'active' : ''}`}>
                      { profile.name }
                      { this.renderQuantity(profile) }
                    </div>
                  </a>
                  <TabPanel key={profile.id}>
                    <Questions
                      localeProfile={this.props.localeProfile}
                      questions={profile.question}
                      userProfiles={this.props.userProfiles}
                      updateUserProfile={this.props.updateUserProfile}
                    />
                  </TabPanel>
                </div>
              )
            })
          }
        </div>
      </Tabs>
    );
  }
}

ProfileContent.propTypes = {
  localeProfile: PropTypes.object.isRequired,
  profiles: PropTypes.array.isRequired,
  userProfiles: PropTypes.array.isRequired,
  updateUserProfile: PropTypes.func.isRequired,
};

export default ProfileContent;
