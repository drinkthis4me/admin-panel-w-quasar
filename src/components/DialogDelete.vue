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
        <div class="text-h5 text-center text-white bg-red-7 q-py-sm">
          確認刪除類別
        </div>
        <div
          v-show="statusMessage"
          :class="[
            'text-center text-h5 ',
            statusMessage == '刪除成功!' ? 'text-positive' : 'text-negative',
          ]">
          {{ statusMessage }}
        </div>
        <div class="q-mx-md q-my-sm alignMe">
          <div><span> ID </span>{{ id }}</div>
          <div><span> 名稱 </span>{{ name }}</div>
          <div v-if="description"><span>描述</span>{{ description }}</div>
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

const props = defineProps<{
  name: string
  id: number
  description?: string
}>()
defineEmits([...useDialogPluginComponent.emits])

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent()

const mysqlStore = useMysqlStore()
const dataStore = useDataStore()
const statusMessage = ref('')
const submitLoading = ref(false)
const submitDisabled = ref(false)
const timeoutID = ref<NodeJS.Timeout>()

const onDeleteSubmitClick = async () => {
  submitLoading.value = true
  submitDisabled.value = true
  if (props.description) {
    await mysqlStore.deleteSub(props.id)
  } else {
    await mysqlStore.deleteCate(props.id)
  }

  if (!mysqlStore.CUDStatus || mysqlStore.CUDStatus.affectedRows <= 0) {
    statusMessage.value = mysqlStore.errorStatus
    return
  } else {
    statusMessage.value = '刪除成功!'
    // update pinia store
    if (props.description) {
      dataStore.deleteSubategory(props.id)
    } else {
      dataStore.deleteCategory(props.id)
    }

    autoClose()
    return
  }
}
const autoClose = () => {
  timeoutID.value = setTimeout(() => {
    resetAll()
    onDialogOK()
  }, 2000)
}

const resetAll = () => {
  statusMessage.value = ''
  submitLoading.value = false
  submitDisabled.value = false
  clearInterval(timeoutID.value)
  mysqlStore.clearStatus()
}

onUnmounted(() => {
  mysqlStore.clearStatus()
})
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
