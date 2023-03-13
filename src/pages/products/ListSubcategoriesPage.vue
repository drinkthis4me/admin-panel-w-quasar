<template>
  <q-page padding class="column items-center">
    <div class="q-ma-md">
      <q-breadcrumbs>
        <template #separator>
          <q-icon size="1.5em" name="chevron_right" color="primary" />
        </template>
        <q-breadcrumbs-el label="首頁" icon="home" to="/home" />
        <q-breadcrumbs-el label="子類別" />
      </q-breadcrumbs>
    </div>

    <div class="q-pa-sm row full-width" style="max-width: 500px">
      <q-select
        v-model="selectedCategory"
        :options="dataStore.cateOptions"
        use-chips
        multiple
        emit-value
        map-options
        clearable
        label="選擇類別"
        outlined
        transition-show="scale"
        transition-hide="scale"
        class="full-width" />
    </div>
    <div class="q-pa-sm" style="max-width: 700px">
      <TableForData :title="'子類別'" :rows="filteredRows" :columns="columns" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { QTableProps } from 'quasar'
import { useDataStore } from 'src/stores/useDataStore'
import TableForData from 'components/TableForData.vue'

const dataStore = useDataStore()
// table columns
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
    name: 'description',
    label: '描述',
    field: 'description',
    align: 'left',
    sortable: true,
    style: 'width:300px',
  },
  {
    name: 'category_id',
    label: '分類',
    field: 'category_id',
    format: val => `${dataStore.cateOptions.find(o => o.value == val)?.label}`,
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

// v-model for q-select
const selectedCategory = ref()

// table rows. changes with q-select
const filteredRows = computed<QTableProps['rows']>(() => {
  // selected: filtered
  if (selectedCategory.value) {
    const selectedIds = Object.values(selectedCategory.value)
    if (selectedIds.length > 0) {
      return dataStore.subcategories?.filter(row =>
        selectedIds.includes(row.category_id)
      )
    } else return dataStore.subcategories
  }

  // default: all
  return dataStore.subcategories
})

</script>
