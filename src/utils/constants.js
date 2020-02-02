import { base } from '../../public/app.config.json';

const getServerPath = function () {
  if (process.env.NODE_ENV !== 'production') {
    if (process.env.MOCK_SERVER === 'none') {
      return '/service.api'
    } else {
      return '/mocker.api'
    }
  }
  return `${BASE_DOMAIN}${GATEWAY}`
}

const BASE_DOMAIN = '/';

const GATEWAY = 'sei-gateway';

const APP_BASE = base;

const LOCAL_PATH = process.env.NODE_ENV !== 'production' ? '..' : `../${APP_BASE}`;

const SERVER_PATH = getServerPath();


const APP_PREFIX = 'BASIC_BTN_APP_MODULE';

/** 业务模块功能项*/
const APP_MODULE_BTN_KEY = {
  "CREATE": `${APP_PREFIX}_CREATE`,
  "EDIT": `${APP_PREFIX}_EDIT`,
  "DELETE": `${APP_PREFIX}_DELETE`
};

/** 应用菜单功能项*/
const APP_MENU_BTN_KEY = {
  "CREATE": `${APP_PREFIX}_CREATE`,
  "EDIT": `${APP_PREFIX}_EDIT`,
  "DELETE": `${APP_PREFIX}_DELETE`
};

const LOGIN_STATUS = {
  "SUCCESS": "success",
  "MULTI_TENANT": "multiTenant",
  "CAPTCHA_ERROR": "captchaError",
  "FROZEN": "frozen",
  "LOCKED": "locked",
  "FAILURE": "failure"
};

export default {
  APP_BASE,
  LOCAL_PATH,
  SERVER_PATH,
  APP_MODULE_BTN_KEY,
  LOGIN_STATUS,
  APP_MENU_BTN_KEY,
};
