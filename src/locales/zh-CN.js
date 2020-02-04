import pwa from './zh-CN/pwa';
import login from './zh-CN/login'
import appModule from './zh-CN/appModule';
import menu from './zh-CN/menu';
import feature from './zh-CN/feature'

export default {
  "app.request.error": "接口请求异常",
  "app.request.401": "会话异常",
  "app.request.401.message": "当前会话超时或失效，请重新登录",
  ...pwa,
  ...appModule,
  ...login,
  ...menu,
  ...feature,
  "global.operation": "操作",
  "global.code": "代码",
  "global.code.tip": "规则:名称各汉字首字母大写",
  "global.code.required": "代码不能为空",
  "global.name": "名称",
  "global.name.required": "名称不能为空",
  "global.remark": "说明",
  "global.remark.required": "说明不能为空",
  "global.frozen": "冻结",
  "global.freezing": "已冻结",
  "global.rank": "序号",
  "global.rank.required": "序号不能为空",
  "global.add": "新建",
  "global.edit": "编辑",
  "global.save": "保存",
  "global.ok": "确定",
  "global.search": "输入关键字查询",
  "global.search.code_name": "输入代码或名称查询",
  "global.back": "返回",
  "global.delete": "删除",
  "global.refresh": "刷新",
  "global.delete.confirm": "确定要删除吗？",
  "global.remove.confirm": "确定要移除吗？",
  "global.warning": "提示:{title}",
  "global.warning.delete.title": "删除后不可恢复",
  "global.warning.remove.title": "移除后当前项目上的配置信息将会丢失",
  "global.save-success": "保存成功",
  "global.delete-success": "删除成功",
};
