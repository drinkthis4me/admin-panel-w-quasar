<template>
  <q-page class="column items-center justify-evenly">
    <h1>產品管理平台</h1>
    <div v-if="dataStore.categories">系統公告(TBD)</div>
    <div v-else>
      <p class="text-negative">伺服器無回應 請聯絡技術人員</p>
    </div>
  </q-page>
</template>

<script setup lang="ts">

import { useDataStore } from 'stores/useDataStore'
const dataStore = useDataStore()
</script>
