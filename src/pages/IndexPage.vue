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
import { useDataStore } from 'src/stores/useDataStore'

const mysqlStore = useMysqlStore()
const dataStore = useDataStore()
onMounted(async () => {
  if (!dataStore.categories) await mysqlStore.listAll()
  if (!dataStore.subcategories) await mysqlStore.listAllSub()
})
</script>
