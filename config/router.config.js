export default [
  {
    path: '/user',
    component: '../layouts/LoginLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './Login' },
    ],
  },
  {
    path: '/',
    component: '../layouts/AuthLayout',
    routes: [
      { path: '/', redirect: '/dashboard' },
      { path: '/dashboard', component: './Dashboard' },
      {
        path: '/backConfig',
        name: 'backConfig',
        routes: [{ path: '/backConfig/appModule', component: './BackConfig/AppModule' }],
      },
      {
        path: '/orgStructure',
        name: 'orgStructure',
        routes: [{
          path: '/orgStructure/corporation',
          component: 'orgStructure/Corporation'
        }, {
          path: '/orgStructure/positionCategory',
          component: 'orgStructure/PositionCategory',
        }],
      },
    ],
  },
];
