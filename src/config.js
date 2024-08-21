// ==============================|| THEME CONFIG  ||============================== //

import { apiBaseURL, getAllLocatData } from 'Utility/Utility';

const type = getAllLocatData()?.user_type;
const config = {
  // defaultPath: '/admin/dashboard/default',
  defaultPath: `${type == 'Pilot' || type == 'Poster' ? '/user/dashboard/default' : '/admin/dashboard/default'}`,
  fontFamily: `'Public Sans', sans-serif`,
  i18n: 'en',
  miniDrawer: false,
  container: true,
  mode: 'light',
  presetColor: 'default',
  themeDirection: 'ltr',
  // url: 'http://localhost:5000',
  url: apiBaseURL(),
  // url: 'http://170.64.131.134',
  basename: '/admin',
  basenameuser: '/user'
};

export default config;
export const drawerWidth = 260;

export const twitterColor = '#1DA1F2';
export const facebookColor = '#3b5998';
export const linkedInColor = '#0e76a8';
