export default {
  '/mocker.api': {
    target: 'http://10.4.32.53:7300/mock/5e0c81854987bb28481c8f55/mocker',
    changeOrigin: true,
    secure: false,
    pathRewrite: { '^/mocker.api': '' },
  },
  '/api-gateway': {
    target: 'http://10.4.208.86/api-gateway',
    changeOrigin: true,
    secure: false,
    pathRewrite: { '^/api-gateway': '' },
  },
};
