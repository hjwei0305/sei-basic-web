import {notification} from "antd";
import {formatMessage} from "umi-plugin-react/locale";

export default {
  onError(err, action, ...rest) {
    err.preventDefault();
    const [{effectArgs}] = rest;
    if (effectArgs.length > 0) {
      let {callback} = effectArgs[0];
      if (callback && callback instanceof Function) {
        callback({success: false});
      }
    }
    notification.error({
      message: formatMessage({id: "app.request.error", defaultMessage: "请求错误"}),
      description: err.message
    });
  }
};
