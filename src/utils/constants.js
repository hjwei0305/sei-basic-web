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

/** 应用菜单功能项 */
const ONLINE_USER_BTN_KEY = {
  FORCE_EXIT: `BASIC-YHGL-ONLINE-USER-FORCE-EXIT`,
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

const ROLE_TYPE = {
  CAN_USE: 'CanUse',
  CAN_ASSIGN: 'CanAssign',
};

const POSITION_ACTION = {
  COPY: 'copy',
  USER: 'user',
  FEATURE_ROLE: 'feature-role',
  DATA_ROLE: 'data-role',
};

const EMPLOYEE_ACTION = {
  RESET_PASSWORD: 'reset-password',
  COPY_AUTH: 'copy-auth',
  STATION: 'station',
  FEATURE_ROLE: 'feature-role',
  DATA_ROLE: 'data-role',
};

const SUPPLIER_ACTION = {
  FEATURE_ROLE: 'feature-role',
  DATA_ROLE: 'data-role',
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
  ROLE_TYPE,
  POSITION_ACTION,
  EMPLOYEE_ACTION,
  SUPPLIER_ACTION,
  ONLINE_USER_BTN_KEY,
};
