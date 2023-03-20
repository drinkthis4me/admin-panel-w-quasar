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
    <div
      v-if="cStore.categories && cStore.categories.length"
      class="column items-center full-width">
      <div class="q-pa-sm full-width" style="max-width: 500px">
        <q-select
          v-model="cStore.currentID"
          :options="cStore.categories"
          emit-value
          map-options
          option-label="name"
          option-value="id"
          label="選擇類別"
          outlined
          transition-show="scale"
          transition-hide="scale" />
      </div>
      <div
        v-if="cStore.currentSubs"
        class="q-pa-sm full-width"
        style="max-width: 800px">
        <TableForData
          :title="'子類別'"
          :rows="cStore.currentSubs"
          :columns="columns" />
      </div>
      <div v-else class="q-pa-sm q-mt-md text-h5">⬆ 選擇類別</div>
    </div>
    <div v-else><ServerErrorMessage /></div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { QTableProps } from 'quasar'
import { useCategoriesStore } from 'src/stores/categories'
import TableForData from 'components/TableForData.vue'
import ServerErrorMessage from 'src/components/ServerErrorMessage.vue'

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
    format: val => `${cStore.categories?.find(c => c.id === val)?.name}`,
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

// fetch categories if empty
watch(
  () => cStore.categories,
  async () => {
    if (!cStore.categories.length) {
      await cStore.getAll()
    }
  },
  { immediate: true }
)
</script>
