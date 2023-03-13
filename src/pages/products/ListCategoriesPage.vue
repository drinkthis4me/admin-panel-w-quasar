<template>
  <q-page padding class="column items-center">
    <div class="q-ma-md">
      <q-breadcrumbs>
        <template #separator>
          <q-icon size="1.5em" name="chevron_right" color="primary" />
        </template>
        <q-breadcrumbs-el label="首頁" icon="home" to="/home" />
        <q-breadcrumbs-el label="類別" />
      </q-breadcrumbs>
    </div>
    <hr />
    <div class="row q-pa-sm" style="max-width: 900px">
      <div class="full-width">
        <TableForData :title="'類別'" :rows="dataStore.reducedCategories" :columns="columns" />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { QTableProps } from 'quasar'
import { useDataStore } from 'src/stores/useDataStore'
import TableForData from 'components/TableForData.vue'

const dataStore = useDataStore()

// q-table columns
const columns = ref<QTableProps['columns']>([
  {
    name: 'id',
    required: true,
    label: 'ID',
    align: 'left',
    field: row => row.id,
    format: val => `${val}`,
    sortable: true,
  },
  {
    name: 'name',
    align: 'left',
    label: '名稱',
    field: 'name',
    sortable: true,
  },
  {
    name: 'subcategoriesCount',
    label: '子類別數量',
    field: 'subcategoriesCount',
    align: 'center',
    sortable: true,
  },
  {
    name: 'actions',
    label: '編輯/刪除',
    field: 'actions',
    align: 'left',
  },
])

</script>
