<template>
  <q-page padding class="column items-center">
    <div class="q-ma-md">
      <q-breadcrumbs>
        <template #separator>
          <q-icon size="1.5em" name="chevron_right" color="primary" />
        </template>
        <q-breadcrumbs-el label="首頁" icon="home" to="/home" />
        <q-breadcrumbs-el label="產品" />
      </q-breadcrumbs>
    </div>
    <div
      v-if="pStore.products && pStore.products.length > 0"
      class="coloum items-center full-width">
      <div class="q-pa-sm full-width">
        <TableForData
          :title="'產品'"
          :rows="pStore.products"
          :columns="columns" />
      </div>
    </div>
    <div v-else>
      <ServerErrorMessage />
    </div>
  </q-page>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useProductStore } from 'src/stores/products'
import { useCategoriesStore } from 'src/stores/categories'
import { QTableProps } from 'quasar'
import TableForData from 'src/components/TableForData.vue'
import ServerErrorMessage from 'src/components/ServerErrorMessage.vue'

const pStore = useProductStore()
const cStore = useCategoriesStore()

// table columns
const columns = ref<QTableProps['columns']>([
  {
    name: 'id',
    required: true,
    label: 'ID',
    align: 'left',
    field: row => row.id,
    sortable: true,
  },
  {
    name: 'image',
    label: '圖片',
    align: 'center',
    field: 'image_path',
    style: 'width:50px'
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
    name: 'subcategory_id',
    label: '子分類',
    field: 'sub_category_id',
    align: 'center',
    sortable: true,
  },
  {
    name: 'size',
    label: '尺寸',
    field: 'size',
    align: 'center',
    sortable: true,
  },
  {
    name: 'color',
    label: '顏色',
    field: 'color',
    align: 'center',
    sortable: true,
  },
  {
    name: 'price',
    label: '價格',
    field: 'price',
    align: 'center',
    sortable: true,
  },
  {
    name: 'quantity',
    label: '數量',
    field: 'quantity',
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
</script>
