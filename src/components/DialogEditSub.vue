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
        <div class="text-h5 text-center bg-teal-4 q-py-sm">編輯</div>
        <div
          v-show="statusMessage"
          :class="[
            'text-center text-h5 ',
            statusMessage == '更新成功!' ? 'text-positive' : 'text-negative',
          ]">
          {{ statusMessage }}
        </div>

        <q-input
          v-model="editName"
          :disable="inputDisalbled"
          label="子類別名稱"
          outlined
          color="teal-4"
          class="q-ma-sm"></q-input>
        <q-input
          v-model="editDescription"
          :disable="inputDisalbled"
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
          @click="onDialogCancel"
           />
        <q-btn
          type="submit"
          label="確定"
          color="primary"
          class="btn-width"
          :disable="submitDisabled"
          :loading="submitLoading"
          @click="onEditSubmitClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar'

import { ref, watch, onUnmounted } from 'vue'
import { useMysqlStore } from 'src/stores/useMysqlStore'
import { useDataStore } from 'src/stores/useDataStore'
const props = defineProps<{
  name: string
  subId: number
  description: string 
}>()

defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent()

const mysqlStore = useMysqlStore()
const dataStore = useDataStore()
const statusMessage = ref('')
const editName = ref(props.name)
const editDescription = ref(props.description)
const inputDisalbled = ref(false)
const submitDisabled = ref(true)
const submitLoading = ref(false)
const timeoutID = ref<NodeJS.Timeout>()

// Disable submit button if inputs unchanged
watch(
  () => editName.value,
  () => {
    if (editName.value === props.name) {
      submitDisabled.value = true
    } else {
      submitDisabled.value = false
    }
  },
  { immediate: true }
)
watch(
  () => editDescription.value,
  () => {
    if (editDescription.value === props.description) {
      submitDisabled.value = true
    } else {
      submitDisabled.value = false
    }
  },
  { immediate: true }
)
// reset q-inputs
watch(
  () => props.name,
  () => {
    editName.value = props.name
    editDescription.value = props.description
  }
)
const onEditSubmitClick = async () => {
  // disable
  inputDisalbled.value = true
  submitDisabled.value = true
  submitLoading.value = true
  // call api
  const payload = { name: editName.value, description: editDescription.value }
  await mysqlStore.updateSub(payload, props.subId)

  if (!mysqlStore.CUDStatus || mysqlStore.CUDStatus.affectedRows <= 0) {
    statusMessage.value = mysqlStore.errorStatus
    return
  } else {
    statusMessage.value = '更新成功!'
    // update pinia state

    dataStore.updateSubcategories(payload, props.subId)
    // close dialog
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
  editName.value = props.name
  editDescription.value = props.description
  statusMessage.value = ''
  inputDisalbled.value = false
  submitLoading.value = false
  submitDisabled.value = false
  clearTimeout(timeoutID.value)
  mysqlStore.clearStatus()
 
}
onUnmounted(() => {
  mysqlStore.clearStatus()
})
</script>

<style lang="scss" scoped>
.btn-width {
  width: 48%;
}
</style>
