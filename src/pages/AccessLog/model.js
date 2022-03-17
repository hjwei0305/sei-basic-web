import { utils, message } from 'suid';
import { getPeriods } from './service';

const { pathMatchRegexp, dvaModel } = utils;
const { modelExtend, model } = dvaModel;

const byTypes = [
  { title: '按功能', value: 'Feature' },
  { title: '按人员', value: 'Personnel' },
];
const [currentByType] = byTypes;

export default modelExtend(model, {
  namespace: 'accessLog',

  state: {
    topNum: 10,
    periods: [],
    currentPeriod: null,
    byTypes,
    currentByType,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (pathMatchRegexp('/accessLog', location.pathname)) {
          dispatch({
            type: 'getPeriods',
          });
        }
      });
    },
  },
  effects: {
    *getPeriods({ payload }, { call, put }) {
      const re = yield call(getPeriods, payload);
      if (re.success) {
        const [currentPeriod] = re.data;
        yield put({
          type: 'updateState',
          payload: {
            periods: re.data,
            currentPeriod,
          },
        });
      } else {
        message.error(re.message);
      }
    },
  },
});
