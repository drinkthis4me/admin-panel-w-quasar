<template>
  <q-page padding class="column items-center">
    <div class="q-ma-md">
      <q-breadcrumbs>
        <template #separator>
          <q-icon size="1.5em" name="chevron_right" color="primary" />
        </template>
        <q-breadcrumbs-el label="首頁" icon="home" to="/home" />
        <q-breadcrumbs-el label="類別" to="/home/categories" />
        <q-breadcrumbs-el label="子類別" />
      </q-breadcrumbs>
    </div>

    <div class="q-pa-sm row full-width" style="max-width: 500px">
      <q-select
        v-model="selectedCategory"
        @update:model-value="filterCategoriesBySelect()"
        :options="options"
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
      <TableForData
        :title="'子類別'"
        :rows="rows"
        :columns="columns"
        @edit-click="(arg) => openEditDialog(arg)"
        @delete-click="(arg) => openDeleteDialog(arg)" />
    </div>

    <div class="hidden">
      <!-- edit dialog -->
      <q-dialog
        v-model="editDialogOpen"
        transition-show="scale"
        transition-hide="scale">
        <q-card style="width: 300px">
          <q-card-section class="column" horizontal>
            <div class="text-h5 text-center bg-teal-4 q-py-sm">編輯</div>
            <div
              v-show="statusMessage"
              :class="[
                'text-center text-h4 ',
                statusMessage == '更新成功!'
                  ? 'text-positive'
                  : 'text-negative',
              ]">
              {{ statusMessage }}
            </div>
            <q-input
              v-model="editName"
              label="子類別名稱"
              outlined
              color="teal-4"
              class="q-ma-sm"></q-input>
            <q-input
              v-model="editDescription"
              label="描述"
              outlined
              color="teal-4"
              class="q-ma-sm"></q-input>
          </q-card-section>
          <q-separator inset />
          <q-card-actions align="center">
            <q-btn
              flat
              label="取消"
              color="primary"
              class="btn-width"
              v-close-popup
              @click="onCancelClick" />
            <q-btn
              type="submit"
              label="確定"
              color="primary"
              class="btn-width"
              :disable="editSubmitDisabled"
              :loading="editSubmitLoading"
              @click="onEditSubmitClick" />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <!-- /edit dialog -->
      <!-- delete dialog -->
      <q-dialog
        v-model="deleteDialogOpen"
        transition-show="scale"
        transition-hide="scale">
        <q-card style="width: 300px">
          <q-card-section class="column" horizontal>
            <div class="text-h5 text-center text-white bg-red-7 q-py-sm">
              確認刪除類別
            </div>
            <div
              v-show="statusMessage"
              :class="[
                'text-center text-h4 ',
                statusMessage == '刪除成功!'
                  ? 'text-positive'
                  : 'text-negative',
              ]">
              {{ statusMessage }}
            </div>
            <div class="q-mx-md q-my-sm alignMe">
              <div><span> ID </span>{{ currentRow.id }}</div>
              <div><span> 名稱 </span>{{ currentRow.name }}</div>
              <div><span> 描述 </span>{{ currentRow.description }}</div>
            </div>
          </q-card-section>
          <q-separator inset />
          <q-card-actions align="center">
            <q-btn
              flat
              label="取消"
              color="primary"
              v-close-popup
              class="btn-width"
              @click="onCancelClick" />
            <q-btn
              label="刪除"
              color="negative"
              class="btn-width"
              :loading="deleteLoading"
              @click="onDeleteSubmitClick" />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <!-- /delete dialog -->
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, watch } from 'vue'
import { QTableProps } from 'quasar'
import { useDataStore } from 'src/stores/useDataStore'
import { useMysqlStore } from 'src/stores/useMysqlStore'
import { useRouter } from 'vue-router'
import TableForData from 'components/TableForData.vue'
const dataStore = useDataStore()
const columns = ref<QTableProps['columns']>([
  {
    name: 'id',
    required: true,
    label: 'ID',
    align: 'left',
    field: (row) => row.id,
    format: (val) => `${val}`,
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
    format: (val) => `${options.find((o) => o.value == val)?.label}`,
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
const rows = ref<QTableProps['rows']>()

// Options for table filter by category
interface OptionForCategory {
  label: string
  value: number
}
let options: OptionForCategory[] = []
const selectedCategory = ref()

// fill the rows with API response
const mysqlStore = useMysqlStore()
onBeforeMount(async () => {
  await mysqlStore.listAll()
  await mysqlStore.listAllSub()

  // fill table with subcategories
  if (dataStore.subcategories && dataStore.subcategories.length) {
    rows.value = dataStore.subcategories
  }

  // fill options with category
  if (dataStore.categories && dataStore.categories.length) {
    options = dataStore.categories.map((c) => {
      return { label: c.name, value: c.id }
    })
  }
})

const filterCategoriesBySelect = () => {
  // check null
  if (selectedCategory.value) {
    const selectedIds = Object.values(selectedCategory.value)
    // check if any id is selected
    if (selectedIds.length > 0) {
      // input has values.
      // filter subcategories if row matches selected ids
      let filtered = dataStore.subcategories.filter((row) =>
        selectedIds.includes(row.category_id)
      )
      if (filtered && filtered.length) rows.value = filtered
      return
    }
  }

  // reset rows
  rows.value = dataStore.subcategories
  return
}

/**
 * Start of editing procedure
 */
let currentRow: any
const editDialogOpen = ref(false)
const editName = ref('')
const editDescription = ref('')
const openEditDialog = (arg: any) => {
  // store the current row info
  currentRow = arg
  // pass the current row to q-dialog's input
  editName.value = currentRow.name
  editDescription.value = currentRow.description
  // open q-dialog
  editDialogOpen.value = true
}
const editSubmitDisabled = ref(false)
// Disable submit button if input unchanged
watch(
  [() => editName.value, () => editDescription.value],
  () => {
    if (currentRow != null)
      if (
        editName.value === currentRow.name &&
        editDescription.value === currentRow.description
      ) {
        editSubmitDisabled.value = true
      } else {
        editSubmitDisabled.value = false
      }
  },
  { immediate: true }
)
const editSubmitLoading = ref(false)
const router = useRouter()
const statusMessage = ref('')
const onEditSubmitClick = async () => {
  // disable submit button
  editSubmitDisabled.value = true
  editSubmitLoading.value = true
  // call api
  const payload = { name: editName.value, description: editDescription.value }
  await mysqlStore.updateOld(payload, currentRow.id)
  if (!mysqlStore.CUDStatus || mysqlStore.CUDStatus.affectedRows <= 0) {
    statusMessage.value = '伺服器錯誤!'
  } else {
    statusMessage.value = '更新成功!'
    setTimeout(() => {
      router.go(0)
    }, 2000)
  }
}
const onCancelClick = () => {
  editSubmitLoading.value = false
  deleteLoading.value = false
  statusMessage.value = ''
}
/**
 * end of editing proedcure
 */

//  deleting procedure
const deleteDialogOpen = ref(false)
const openDeleteDialog = (arg: any) => {
  currentRow = arg
  deleteDialogOpen.value = true
}
const deleteLoading = ref(false)
const onDeleteSubmitClick = async () => {
  deleteLoading.value = true
  await mysqlStore.deleteOld(currentRow.id)
  if (!mysqlStore.CUDStatus || mysqlStore.CUDStatus.affectedRows <= 0) {
    statusMessage.value = '伺服器錯誤!'
  } else {
    statusMessage.value = '刪除成功!'
    setTimeout(() => {
      router.go(0)
    }, 2000)
  }
}
</script>
<style scoped lang="scss">
.alignMe span {
  display: inline-flex;
  width: 20%;
  position: relative;
  padding-right: 10px;

  &::after {
    content: ':';
    position: absolute;
    right: 10px;
  }
}
.btn-width {
  width: 48%;
}
</style>
