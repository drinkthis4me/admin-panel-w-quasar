<template>
  <q-table
    :title="title"
    :rows="rows"
    :columns="columns"
    row-key="id"
    class="my-sticky-header-table"
    table-header-class="bg-secondary"
    no-data-label="查無資料"
    no-results-label="找不到符合搜尋的資料，試試以其他關鍵字搜尋"
    rows-per-page-label="顯示行數"
    :rows-per-page-options="[10, 15, 20, 25, 50, 0]"
    :filter="searchFilter"
    :loading="isLoading">
    <!-- action slot -->
    <template #body-cell-actions="props">
      <q-td class=" no-wrap justify-center q-gutter-x-sm">
        <q-btn
          color="primary"
          icon="edit"
          :size="$q.screen.lt.sm ? 'sm' : 'md'"
          @click="onEditClick(props.row)" />
        <q-btn
          color="negative"
          icon="delete"
          :size="$q.screen.lt.sm ? 'sm' : 'md'"
          @click="onDeleteClick(props.row)" />
      </q-td>
    </template>
    <!-- /acton slot -->
    <!-- search slot -->
    <template #top-right>
      <q-input v-model="searchFilter" type="text" placeholder="尋找" :disable="!rows?.length">
        <template #append>
          <q-icon name="search" />
        </template>
      </q-input>
    </template>
    <!-- /search slot -->
    <!-- title + full screen slot -->
    <template #top-left="props">
      <div class="row inline items-center">
        <span class="text-h4">{{ title }}</span>
        <q-btn
          flat
          round
          dense
          size="lg"
          :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
          @click="props.toggleFullscreen"
          class="q-ml-sm" />
      </div>
    </template>
    <!-- /title + full screen slot -->
    <!-- loading state slot -->
    <template #loading>
      <q-inner-loading showing>
        <q-spinner-gears size="50px" color="secondary" />
      </q-inner-loading>
    </template>
    <!-- /loading state slot -->
  </q-table>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { QTableProps, useQuasar } from 'quasar'
import DialogEditCate from './DialogEditCate.vue'
import DialogEditSub from './DialogEditSub.vue'
import DialogDeleteCate from './DialogDeleteCate.vue'
import DialogDeleteSub from './DialogDeleteSub.vue'
import { useCategoriesStore } from 'src/stores/categories'

const cStore = useCategoriesStore()
const $q = useQuasar()

// variables naming conflict:
// tableProps for TableForData; props for q-table slot
const tableProps = defineProps<{
  rows: QTableProps['rows']
  columns: QTableProps['columns']
  title: string
}>()

const isLoading = computed(() => {
  return !tableProps.rows || tableProps.rows.length < 0
})

// bind searching with table data
const searchFilter = ref('')

// on actions(edit/delete)
const currentRow = ref<any>()
const onEditClick = (row: any) => {
  currentRow.value = row
  if (row && row.description) {
    cStore.currentID = row.category_id
    cStore.currentSubID = row.id
    openDialogEditSub()
    // subStore.currentSubID = row.id
  } else if (row) {
    cStore.currentID = row.id
    openDialogEditCate()
  }
}
const onDeleteClick = (row: any) => {
  currentRow.value = row
  if (row && row.description) {
    cStore.currentID = row.category_id
    cStore.currentSubID = row.id
    openDialogDeleteSub()
    // subStore.currentSubID = row.id
  } else if (row) {
    cStore.currentID = row.id
    openDialogDeleteCate()
  }
}
const openDialogEditCate = () => {
  $q.dialog({
    component: DialogEditCate,
    componentProps: {
      category: currentRow.value,
    },
  })
}
const openDialogEditSub = () => {
  $q.dialog({
    component: DialogEditSub,
    componentProps: {
      subcategory: currentRow.value,
    },
  })
}
const openDialogDeleteCate = () => {
  $q.dialog({
    component: DialogDeleteCate,
    componentProps: {
      category: currentRow.value,
    },
  })
}
const openDialogDeleteSub = () => {
  $q.dialog({
    component: DialogDeleteSub,
    componentProps: {
      subcategory: currentRow.value,
    },
  })
}
</script>

<style lang="scss" scoped>
// .my-sticky-header-table {
//   // height: 600px;

//   .q-table__top,
//   .q-table__bottom,
//   thead tr:first-child th {
//     /* bg color for th */
//     background-color: $secondary;
//   }

//   thead tr th {
//     position: sticky;
//     z-index: 1;
//   }
//   thead tr:first-child th {
//     top: 0;
//   }

//   /* this is when the loading indicator appears */
//   &.q-table--loading thead tr:last-child th {
//     /* height of all previous header rows */
//     top: 48px;
//   }
// }
</style>
