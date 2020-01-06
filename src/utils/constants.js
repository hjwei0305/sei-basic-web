import { base } from '../../public/app.config.json';

const BASE_DOMAIN = '/';

const GATEWAY = 'mobileapi-gateway';

const APP_BASE = base;

const LOCAL_PATH = process.env.NODE_ENV !== 'production' ? '..' : `../${APP_BASE}`;

const SERVER_PATH =
  process.env.NODE_ENV !== 'production' ? '/mocker.api' : `${BASE_DOMAIN}${GATEWAY}`;

export default {
  APP_BASE,
  LOCAL_PATH,
  SERVER_PATH,
};
