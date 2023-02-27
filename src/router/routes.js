
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/components/ImportXLSX.vue') }
    ]
  },
  {
    path: '/proc-generator',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/components/CreateProcs.vue') }
    ]
  },


  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
