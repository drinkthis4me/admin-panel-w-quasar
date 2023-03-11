<template>
  <q-table
    :title="title"
    :rows="rows"
    :columns="columns"
    row-key="id"
    table-header-class="bg-secondary"
    no-data-label="伺服器錯誤/查無資料。"
    no-results-label="找不到符合搜尋的資料，試試以其他關鍵字搜尋。"
    rows-per-page-label="顯示行數"
    :rows-per-page-options="[10, 15, 20, 25, 50, 0]"
    :filter="searchFilter"
    :loading="isLoading">
    <!-- action slot -->
    <template #body-cell-actions="props">
      <q-td :props="props.value">
        <q-btn
          color="primary"
          icon="edit"
          size="sm"
          @click="emits('editClick', props.row)" />
        <q-btn
          color="negative"
          icon="delete"
          @click="emits('deleteClick', props.row)"
          size="sm" />
      </q-td>
    </template>
    <!-- /acton slot -->
    <!-- search slot -->
    <template #top-right>
      <q-input v-model="searchFilter" type="text" placeholder="尋找">
        <template #append>
          <q-icon name="search" />
        </template>
      </q-input>
    </template>
    <!-- /search slot -->
    <!-- title + full screen slot -->
    <template #top-left="props">
      <div class="items-center">
        <span class="text-h4">{{ title }}</span>
        <q-btn
          flat
          round
          dense
          :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
          @click="props.toggleFullscreen"
          class="q-ml-md" />
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
import { ref, computed, watch } from 'vue'
import { QTableProps } from 'quasar'

// naming conflict: componentProps for TableForData; props for q-table
const componentProps = defineProps<{
  rows: QTableProps['rows']
  columns: QTableProps['columns']
  filterId?: number
  title: string
}>()
const emits = defineEmits(['editClick', 'deleteClick'])

// Boolean for loading state
const isLoading = computed(() => {
  return componentProps.rows == null || componentProps.rows.length < 0
})

// bind searching with table data
const searchFilter = ref('')
watch(
  () => componentProps.filterId,
  () => {
    if (componentProps.filterId) {
      searchFilter.value = componentProps.filterId.toString()
    }
  }
)
</script>
