<template>
  <q-layout view="lHh lpR lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-btn label="Mall管理系統" to="/home" stretch flat />
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      show-if-above
      v-model="leftDrawerOpen"
      side="left"
      bordered
      class="bg-grey-3">
      <!-- drawer content -->
      <q-scroll-area class="fit">
        <q-list bordered class="rounded-borders">
          <q-item>
            <q-item-section class="text-center text-h4">
              功能選擇
            </q-item-section>
          </q-item>
          <DrawerItems :menu-links="menuLinks" />
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DrawerItems from 'components/DrawerItems.vue'

const menuLinks = ref([
  {
    title: '產品設定',
    icon: 'storefront',
    children: [
      {
        title: '類別',
        link: '/home/categories',
      },
      {
        title: '新增類別',
        link: '/home/add-category',
      },
      {
        title: '子類別',
        link: '/home/subcategories',
      },
      {
        title: '新增子類別',
        link: '/home/add-subcategory',
      },
      {
        title: '產品',
        link: '#',
      },
      {
        title: '新增產品',
        link: '#',
      },
    ],
  },
  {
    title: '訂單設定',
    icon: 'list',
    children: [],
  },
  {
    title: '使用者設定',
    icon: 'manage_accounts',
    children: [],
  },
])
const leftDrawerOpen = ref(false)
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>

<style lang="scss" scoped></style>
