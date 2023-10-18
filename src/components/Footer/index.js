import React from 'react'
import { BASE_URL,ROUTER_PATH } from 'services/config';
import ZaloFollowButton from '../ZaloFollowButton';

const localeNavigation = window.locale.Navigation;
const localeCommon = window.locale.Common;
const logo = BASE_URL + "/assetsnew/img/logo.png";
const scrollToTop = ()=>{
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
      })
}
const Footer = () => (
    <div>
    <footer class="footer-ver2">
        <div class="container clear-padding-container">
            <div class="row">
                <div class="col-sm-3 list-link-col">
                    <div class="column-header">
                        <div class="title">{localeCommon.footer_site_title}</div>
                    </div>
                    <ul class="link-list">
                        <li> <a href={ROUTER_PATH.HOME}>{localeNavigation.HOME}</a></li>
                        <li> <a href={ROUTER_PATH.MOMANDBABY}>{localeNavigation.MOMANDBABY}</a></li>
                        <li> <a href={ROUTER_PATH.SURVEY_MENU}>{localeNavigation.SURVEY}</a></li>
                        <li> <a href={ROUTER_PATH.CONTACT}>{localeNavigation.CONTACT}</a></li>
                    </ul>
                </div>
                <div class="col-sm-3 list-link-col">
                    <div class="column-header">
                        <div class="title">{localeCommon.footer_policy_title}</div>
                    </div>
                    <ul class="link-list">
                        <li> <a href={ROUTER_PATH.PRIVACY_POLICY}>{localeNavigation.PRIVACY_POLICY}</a></li>
                        <li> <a href={ROUTER_PATH.TERMS_OF_SERVICES}>{localeNavigation.TERMS_OF_SERVICES}</a></li>
                    </ul>
                </div>
                <div class="col-sm-6">
                    <div>
                        <a href="{{url('/')}}" title="">
                            <img src={logo} width="63px" height="74px" alt=""/>
                        </a>
                    </div>
                    <div class="follow-zalo-title">{localeCommon.footer_follow_zalo_title}</div>
                    <ZaloFollowButton />
                </div>
            </div>
            <div class="line"></div>
            <div class="col-xs-12 scroll-to-top">
                <button onClick={scrollToTop} class="btn-scroll"> {localeNavigation.RETURN_TO_TOP_OF_PAGE} </button>
            </div>
        </div>
    </footer>
</div>
)

export default Footer