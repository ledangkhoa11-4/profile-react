import {
  TOGGLE_MENU,
  UPDATE_PAGE_TITLE,
  SHOW_LOADING,
  HIDE_LOADING,
} from './constant';

export const showMenu = () => ({ type: TOGGLE_MENU.SHOW })
export const hideMenu = () => ({ type: TOGGLE_MENU.HIDE })

export const showLoading = () => ({ type: SHOW_LOADING })
export const hideLoading = () => ({ type: HIDE_LOADING })

export const updatePageTitle = (pageTitle) => ({
  type: UPDATE_PAGE_TITLE,
  pageTitle,
})
