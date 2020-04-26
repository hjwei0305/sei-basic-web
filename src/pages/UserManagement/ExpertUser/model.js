/*
 * @Author: zp
 * @Date:   2020-02-02 11:57:38
 * @Last Modified by:   zp
 * @Last Modified time: 2020-03-09 11:25:12
 */
import { message } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import { utils } from 'suid';
import {
  freeze,
  save,
  assignFeatureRole,
  unAssignFeatureRole,
  assignDataRole,
  unAssignDataRole,
} from './service';

const { dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: 'expertUser',

  state: {
    list: [],
    rowData: null,
    showModal: false,
    showCopyModal: false,
    showConfig: false,
  },
  effects: {
    *save({ payload }, { call }) {
      const re = yield call(save, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: 'global.save-success', defaultMessage: '保存成功' }));
      } else {
        message.error(re.message);
      }

      return re;
    },
    *freeze({ payload }, { call }) {
      const re = yield call(freeze, payload);
      message.destroy();
      if (re.success) {
        message.success(re.message);
      } else {
        message.error(re.message);
      }

      return re;
    },
    *assignFeatureRole({ payload }, { call }) {
      const re = yield call(assignFeatureRole, payload);
      message.destroy();
      if (re.success) {
        message.success(re.message);
      } else {
        message.error(re.message);
      }
      return re;
    },
    *unAssignFeatureRole({ payload }, { call }) {
      const re = yield call(unAssignFeatureRole, payload);
      message.destroy();
      if (re.success) {
        message.success(re.message);
      } else {
        message.error(re.message);
      }
      return re;
    },
    *assignDataRole({ payload }, { call }) {
      const re = yield call(assignDataRole, payload);
      message.destroy();
      if (re.success) {
        message.success(re.message);
      } else {
        message.error(re.message);
      }
      return re;
    },
    *unAssignDataRole({ payload }, { call }) {
      const re = yield call(unAssignDataRole, payload);
      message.destroy();
      if (re.success) {
        message.success(re.message);
      } else {
        message.error(re.message);
      }
      return re;
    },
  },
});
