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
      { path: '/dashboard', component: './Dashboard' },
      {
        path: '/backConfig',
        name: 'backConfig',
        routes: [
          { path: '/backConfig/appModule', component: './BackConfig/AppModule' },
          { path: '/backConfig/feature', component: './BackConfig/Feature' },
          { path: '/backConfig/appMenu', component: './BackConfig/AppMenu' },
          { path: '/backConfig/authorType', component: './BackConfig/AuthorType' },
          { path: '/backConfig/dataAuthorType', component: './BackConfig/DataAuthorType' },
          { path: '/backConfig/tenant', component: './BackConfig/Tenant' },
        ],
      },
      {
        path: '/author',
        name: 'author',
        routes: [
          { path: '/author/featureRole', component: './Author/FeatureRole' },
          { path: '/author/dataRole', component: './Author/DataRole' },
          { path: '/author/dataView', component: './Author/DataView' },
          { path: '/author/featureView', component: './Author/FeatureView' },
        ],
      },
      {
        path: '/userProfile',
        name: 'userProfile',
        component: 'UserProfile',
      },
      {
        path: '/orgStructure',
        name: 'orgStructure',
        routes: [
          {
            path: '/orgStructure/corporation',
            component: 'OrgStructure/Corporation',
          },
          {
            path: '/orgStructure/positionCategory',
            component: 'OrgStructure/PositionCategory',
          },
          {
            path: '/orgStructure/position',
            component: 'OrgStructure/Position',
          },
          {
            path: '/orgStructure/organization',
            component: 'OrgStructure/Organization',
          },
        ],
      },
      {
        path: '/userManagement',
        name: 'userManagement',
        routes: [
          {
            path: '/userManagement/employee',
            component: 'UserManagement/Employee',
          },
          {
            path: '/userManagement/supplierUser',
            component: 'UserManagement/SupplierUser',
          },
        ],
      },
      {
        path: '/regionManagement',
        name: 'regionManagement',
        routes: [
          {
            path: '/regionManagement/professionalDomain',
            component: 'RegionManagement/ProfessionalDomain',
          },
        ],
      },
    ],
  },
];
