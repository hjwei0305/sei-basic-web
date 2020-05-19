import { base } from '../../public/app.config.json';

const BASE_DOMAIN = '/';

const GATEWAY = 'api-gateway';

const getServerPath = () => {
  if (process.env.NODE_ENV !== 'production') {
    if (process.env.MOCK === 'yes') {
      return '/mocker.api';
    }
    return '/api-gateway';
  }
  return `${BASE_DOMAIN}${GATEWAY}`;
};

const APP_BASE = base;

const LOCAL_PATH = process.env.NODE_ENV !== 'production' ? '..' : `../${APP_BASE}`;

const SERVER_PATH = getServerPath();

const APP_PREFIX = 'BASIC_BTN_APP_MODULE';

/** 功能类型 */
const FEATURE_TYPE = {
  PAGE: 'Page',
  OPERATE: 'Operate',
  APP_MODULE: null,
  BUSINESS: 'Business',
};

/** 应用模块功能项 */
const APP_MODULE_BTN_KEY = {
  CREATE: `${APP_PREFIX}_CREATE`,
  EDIT: `${APP_PREFIX}_EDIT`,
  DELETE: `${APP_PREFIX}_DELETE`,
};

/** 应用菜单功能项 */
const APP_MENU_BTN_KEY = {
  CREATE: `${APP_PREFIX}_CREATE`,
  EDIT: `${APP_PREFIX}_EDIT`,
  DELETE: `${APP_PREFIX}_DELETE`,
};

const LOGIN_STATUS = {
  SUCCESS: 'success',
  MULTI_TENANT: 'multiTenant',
  CAPTCHA_ERROR: 'captchaError',
  FROZEN: 'frozen',
  LOCKED: 'locked',
  FAILURE: 'failure',
};

const ROLE_VIEW = {
  CONFIG_STATION: 'config-station',
  CONFIG_USER: 'config-user',
  STATION: 'role-station',
  USER: 'role-user',
};

export default {
  APP_BASE,
  LOCAL_PATH,
  SERVER_PATH,
  APP_MODULE_BTN_KEY,
  LOGIN_STATUS,
  APP_MENU_BTN_KEY,
  ROLE_VIEW,
  FEATURE_TYPE,
};
