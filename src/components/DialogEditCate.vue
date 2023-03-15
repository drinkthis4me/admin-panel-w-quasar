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
        <div class="text-h5 text-center bg-secondary q-py-sm">編輯類別</div>
        <q-input
          v-model="editName"
          :disable="inputDisalbled"
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
          @click="onDialogCancel" />
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
import { useQuasar } from 'quasar'
import type { Basetype } from 'src/types/basetype'
const props = defineProps<{
  category: Basetype
}>()
defineEmits([...useDialogPluginComponent.emits])

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent()
const mysqlStore = useMysqlStore()
const dataStore = useDataStore()
const $q = useQuasar()
const statusMessage = ref('')
const editName = ref(props.category.name)
const inputDisalbled = ref(false)
const submitDisabled = ref(true)
const submitLoading = ref(false)
const timeoutID = ref<NodeJS.Timeout>()

// Disable submit button if input unchanged
watch(
  () => editName.value,
  () => {
    if (editName.value === props.category.name) {
      submitDisabled.value = true
    } else {
      submitDisabled.value = false
    }
  },
  { immediate: true }
)
// reset q-inputs
watch(
  () => props.category.name,
  () => {
    editName.value = props.category.name
  }
)
const onEditSubmitClick = async () => {
  // disable
  inputDisalbled.value = true
  submitDisabled.value = true
  submitLoading.value = true
  try {
    if (!props.category.id || !editName.value) throw new Error('no input found')
    const newCategory = { id: props.category.id, name: editName.value }

    // call api
    await mysqlStore.updateCate(newCategory)

    // error
    submitLoading.value = false
    if (mysqlStore.errorStatus) throw new Error('client error')
    if (!mysqlStore.CUDStatus || mysqlStore.CUDStatus.affectedRows <= 0)
      throw new Error('server error')

    // update pinia state
    dataStore.updateCategories(newCategory)

    statusMessage.value = '更新成功!'
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
  editName.value = props.category.name
  statusMessage.value = ''
  inputDisalbled.value = false
  submitLoading.value = false
  submitDisabled.value = false
  clearTimeout(timeoutID.value)
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
.btn-width {
  width: 48%;
}
</style>
