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
        :options="cStore.optionsForSelct"
        emit-value
        map-options
        label="選擇類別"
        outlined
        transition-show="scale"
        transition-hide="scale"
        class="full-width" />
    </div>
    <div class="q-pa-sm full-width" style="max-width: 800px">
      <TableForData
        :title="'子類別'"
        :rows="selectedCategory ? filteredRows : defaultRow"
        :columns="columns"
        :visible-columns="visibleColumns" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import { QTableProps } from 'quasar'
import { useCategoriesStore } from 'src/stores/categories'
import { useSubcategoriesStore } from 'src/stores/subcategories'
import TableForData from 'components/TableForData.vue'

const cStore = useCategoriesStore()
const subStore = useSubcategoriesStore()

// table columns
const columns = ref<QTableProps['columns']>([
  {
    name: 'id',
    required: true,
    label: 'ID',
    align: 'left',
    field: row => row.id,
    format: val => (val === 0 ? '' : `${val}`),
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
    format: val =>
      `${cStore.optionsForSelct?.find(o => o.value == val)?.label}`,
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
// table rows
const filteredRows = computed(() => {
  if (selectedCategory.value) {
    return subStore.subcategories.filter(
      sub => sub.category_id === selectedCategory.value
    )
  } else {
    return []
  }
})
// default content for table:
// set defaultRow and pass visibleColumns props to table
const defaultRow = [
  {
    id: 0,
    name: '請選擇一個子類別',
    description: '',
    subcategory_id: 0,
  },
]
const visibleColumns = computed(() => {
  if (selectedCategory.value) {
    return ['id', 'name', 'description', 'category_id', 'actions']
  } else return ['name']
})
// v-model for q-select
const selectedCategory = ref()

// fetch content if empty
watchEffect(async () => {
  if (!cStore.optionsForSelct.length) {
    await cStore.getAll()
  }
})
watchEffect(async () => {
  if (!subStore.subcategories.length) {
    await subStore.getAll()
  }
})
</script>
