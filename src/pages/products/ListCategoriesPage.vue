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
    <div class="row q-pa-sm full-width" style="max-width: 600px">
      <div class="full-width">
        <TableForData
          :title="'類別'"
          :rows="cStore.rowsForTable"
          :columns="columns" />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { QTableProps } from 'quasar'
import { useCategoriesStore } from 'src/stores/categories'
import { useSubcategoriesStore } from 'src/stores/subcategories'
import TableForData from 'components/TableForData.vue'

const cStore = useCategoriesStore()
const subStore = useSubcategoriesStore()

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
    align: 'center',
    label: '名稱',
    field: 'name',
    sortable: true,
    style: 'width:300px',
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
    align: 'center',
  },
])

watch(
  [() => cStore.categories, () => subStore.subcategories],
  async () => {
    if (!cStore.categories.length) {
      await cStore.getAll()
    }
    if (!subStore.subcategories.length) {
      await subStore.getAll()
    }
  },
  { immediate: true }
)
</script>
