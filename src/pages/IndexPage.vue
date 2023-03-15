<template>
  <q-page class="column items-center">
    <h1>產品管理平台</h1>
    <div>常用功能：</div>
    <div class="q-gutter-sm">
      <q-btn
        color="primary"
        icon="check"
        label="類別總覽"
        to="/home/list-categories" />
      <q-btn
        color="primary"
        icon="check"
        label="子類別總覽"
        to="/home/list-subcategories" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useMysqlStore } from 'src/stores/useMysqlStore'

const mysqlStore = useMysqlStore()

onMounted(async () => {
  if (!mysqlStore.categories) await mysqlStore.listAll()
  if (!mysqlStore.subcategories) await mysqlStore.listAllSub()
})
</script>
