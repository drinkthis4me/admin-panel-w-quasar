<template>
  <q-dialog
    ref="dialogRef"
    @hide="
      () => {
        onDialogHide()
        resetAll()
      }
    "
    transition-show="scale"
    transition-hide="scale">
    <q-card style="width: 300px">
      <q-card-section class="column" horizontal>
        <div
          v-if="'description' in rowProps.someCategory"
          class="text-h5 text-center bg-secondary q-py-sm">
          確認刪除子類別?
        </div>
        <div v-else class="text-h5 text-center bg-secondary q-py-sm">
          確認刪除類別?
        </div>
        <div class="q-mx-md q-my-sm alignMe">
          <div><span> ID </span>{{ someCategory.id }}</div>
          <div><span> 名稱 </span>{{ someCategory.name }}</div>
          <div v-if="'description' in rowProps.someCategory">
            <span>描述</span>{{ someCategory.description }}
          </div>
        </div>
      </q-card-section>
      <q-separator inset />
      <q-card-actions align="center">
        <q-btn
          flat
          label="取消"
          color="primary"
          class="btn-width"
          v-close-popup
          @click="onDialogCancel" />
        <q-btn
          label="刪除"
          color="negative"
          class="btn-width"
          :loading="submitLoading"
          :disable="submitDisabled"
          @click="onDeleteSubmitClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar'
import { ref, onUnmounted } from 'vue'
import { useMysqlStore } from 'src/stores/useMysqlStore'
import { useDataStore } from 'src/stores/useDataStore'
import { useQuasar } from 'quasar'
const rowProps = defineProps<{
  someCategory: any
}>()

defineEmits([...useDialogPluginComponent.emits])

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent()
const mysqlStore = useMysqlStore()
const dataStore = useDataStore()
const $q = useQuasar()
// q-btn
const statusMessage = ref('')
const submitLoading = ref(false)
const submitDisabled = ref(false)
const timeoutID = ref<NodeJS.Timeout>()

const onDeleteSubmitClick = async () => {
  // disable btn
  submitLoading.value = true
  submitDisabled.value = true
  try {
    if (!rowProps.someCategory.id) throw new Error('no id found')

    // call api
    if ('description' in rowProps.someCategory) {
      await mysqlStore.deleteSub(rowProps.someCategory.id)
    } else {
      await mysqlStore.deleteCate(rowProps.someCategory.id)
    }

    // error
    submitLoading.value = false
    if (mysqlStore.errorStatus) throw new Error('client error')
    if (!mysqlStore.CUDStatus || mysqlStore.CUDStatus.affectedRows <= 0)
      throw new Error('server error')

    // update pinia state
    if ('description' in rowProps.someCategory) {
      dataStore.deleteSubategory(rowProps.someCategory.id)
    } else {
      dataStore.deleteCategory(rowProps.someCategory.id)
    }

    // show notify
    statusMessage.value = '刪除成功!'
    triggerPpsitive()
  } catch (error) {
    console.log(error)
    statusMessage.value = mysqlStore.errorStatus || '伺服器錯誤'
    triggerNegative()
  } finally {
    autoClose()
    return
  }
}
const autoClose = () => {
  timeoutID.value = setTimeout(() => {
    resetAll()
    onDialogOK()
  }, 200)
}
const resetAll = () => {
  statusMessage.value = ''
  submitLoading.value = false
  submitDisabled.value = false
  clearInterval(timeoutID.value)
  mysqlStore.clearStatus()
}
onUnmounted(() => {
  resetAll()
})
const triggerNegative = () => {
  $q.notify({
    type: 'negative',
    message: statusMessage.value,
    actions: [{ icon: 'cancel', color: 'white' }],
  })
}
const triggerPpsitive = () => {
  $q.notify({
    type: 'positive',
    message: statusMessage.value,
    actions: [{ icon: 'cancel', color: 'white' }],
  })
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
