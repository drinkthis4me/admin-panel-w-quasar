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
        <TableForData
          :title="'類別'"
          :rows="rows"
          :columns="columns"
          @edit-click="(arg) => openEditDialog(arg)"
          @delete-click="(arg) => openDeleteDialog(arg)" />
      </div>
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
              label="類別名稱"
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
              @click="editSubmitLoading = false" />
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
              @click="deleteLoading = false" />
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
import { ref, onMounted, watch } from 'vue'
import { QTableProps } from 'quasar'
import { useDataStore } from 'src/stores/useDataStore'
import { useMysqlStore } from 'src/stores/useMysqlStore'
import { useRouter } from 'vue-router'
import TableForData from 'components/TableForData.vue'

const dataStore = useDataStore()
const columns = ref<QTableProps['columns']>([
  {
    name: 'name',
    required: true,
    label: '名稱',
    align: 'left',
    field: (row) => row.name,
    format: (val) => `${val}`,
    sortable: true,
    headerStyle: 'width: 200px',
  },
  {
    name: 'id',
    align: 'center',
    label: 'ID',
    field: 'id',
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
const rows = ref<QTableProps['rows']>()

// fill the rows with API response
const mysqlStore = useMysqlStore()
onMounted(async () => {
  await mysqlStore.listAll()
  if (dataStore.categories && dataStore.categories.length) {
    rows.value = dataStore.categories.map((c) => {
      return {
        id: c.id,
        name: c.name,
        subcategoriesCount: c.subcategories.length,
      }
    })
  }
})

/**
 * start of editing procedure
 */
let currentRow: any
const editDialogOpen = ref(false)
const editName = ref('')
const openEditDialog = (arg: any) => {
  // store the current row info
  currentRow = arg
  // pass the current row to q-dialog's input
  editName.value = currentRow.name
  // open q-dialog
  editDialogOpen.value = true
}
const editSubmitDisabled = ref(false)
// Disable submit button if input unchanged
watch(
  () => editName.value,
  () => {
    if (currentRow != null)
      if (editName.value === currentRow.name) {
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
  const payload = { name: editName.value }
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

/**
 * end of editing proedcure
 */

// similar precedure for deleting
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
<style lang="scss" scoped>
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
