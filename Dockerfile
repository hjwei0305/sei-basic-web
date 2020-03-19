# Docker for java  basic-web

# 基础镜像
FROM nginx:stable-alpine

# 作者
LABEL maintainer="hua.feng@changhong.com"

# 环境变量
## JAVA_OPTS：JAVA启动参数
## APP_NAME：应用名称（各项目需要修改）
ENV   TZ='Asia/Shanghai' APP_NAME="sei-basic-web"

# 设置时区（上海时区）
# RUN rm -rf /etc/localtime && ln -s /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

# 添加应用
# ADD $APP_NAME-service/build/libs/$APP_NAME.jar $APP_NAME.jar
COPY dist /usr/share/nginx/html/$APP_NAME

# 开放80端口
#EXPOSE 80

# 启动应用
#ENTRYPOINT ["sh","-c","java $JAVA_OPTS -jar $APP_NAME.jar --server.servlet.context-path=/$APP_NAME"]
