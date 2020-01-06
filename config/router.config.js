export default [
  {
    path: '/',
    component: '../layouts/AuthLayout',
    routes: [
      { path: '/', redirect: '/dashboard' },
      { path: '/dashboard', component: './Dashboard' },
      {
        path: "/moduleName",
        name: "moduleName",
        routes: [
          { path: "/moduleName/demo", component: "./Demo" },
        ]
      }
    ],
  },
];

