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
        <div class="text-h5 text-center bg-secondary q-py-sm">編輯子類別</div>
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
import type { Subcategory } from 'src/types/subcategory'

const props = defineProps<{
  subcategory: Subcategory
}>()
defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent()
const mysqlStore = useMysqlStore()
const dataStore = useDataStore()
const $q = useQuasar()
const statusMessage = ref('')
const editName = ref(props.subcategory.name)
const editDescription = ref(props.subcategory.description)
const inputDisalbled = ref(false)
const submitDisabled = ref(true)
const submitLoading = ref(false)
const timeoutID = ref<NodeJS.Timeout>()

// Disable submit button if inputs unchanged
watch(
  () => editName.value,
  () => {
    if (editName.value === props.subcategory.name) {
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
    if (editDescription.value === props.subcategory.description) {
      submitDisabled.value = true
    } else {
      submitDisabled.value = false
    }
  },
  { immediate: true }
)
// reset q-inputs
watch(
  () => props.subcategory.name,
  () => {
    editName.value = props.subcategory.name
    editDescription.value = props.subcategory.description
  }
)
const onEditSubmitClick = async () => {
  // disable
  inputDisalbled.value = true
  submitDisabled.value = true
  submitLoading.value = true

  try {
    if (
      !editName.value ||
      !editDescription.value ||
      !props.subcategory.category_id ||
      !props.subcategory.category_id
    ) {
      throw new Error('no input found')
    }
    const newSubcategory = {
      id: props.subcategory.id,
      name: editName.value,
      description: editDescription.value,
      category_id: props.subcategory.category_id,
    }

    // call api
    await mysqlStore.updateSub(newSubcategory)

    // error
    submitLoading.value = false
    if (mysqlStore.errorStatus) throw new Error('client error')
    if (!mysqlStore.CUDStatus || mysqlStore.CUDStatus.affectedRows <= 0)
      throw new Error('server error')

    // update pinia state
    dataStore.updateSubcategories(newSubcategory)

    // show notify
    statusMessage.value = '更新成功!'
    triggerPpsitive()
  } catch (error) {
    console.log(error)
    statusMessage.value = mysqlStore.errorStatus
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
  editName.value = props.subcategory.name
  editDescription.value = props.subcategory.description
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
