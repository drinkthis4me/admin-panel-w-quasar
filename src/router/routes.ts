import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',

    component: () => import('layouts/LoginLayout.vue'),
    children: [{ path: '', component: () => import('pages/LoginPage.vue') }],
  },
  {
    path: '/home',

    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('pages/IndexPage.vue'),
      },
      {
        path: 'list-categories',
        name: 'categories list',
        component: () => import('src/pages/products/ListCategoriesPage.vue'),
      },
      {
        path: 'list-subcategories',
        name: 'subcategories list',
        component: () => import('src/pages/products/ListSubcategoriesPage.vue'),
      },
      {
        path: 'add-category',
        name: 'create category',
        component: () => import('src/pages/products/AddCategoryPage.vue'),
      },
      {
        path: 'add-subcategory',
        name: 'create subcategory',
        component: () => import('src/pages/products/AddSubPage.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
