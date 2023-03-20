<template>
  <q-dialog
    ref="dialogRef"
    @hide="
      () => {
        onDialogHide()
        resetAll()
      }
    "
    :persistent="submitLoading"
    transition-show="scale"
    transition-hide="scale">
    <q-card style="width: 300px">
      <q-card-section class="column" horizontal>
        <div class="text-h5 text-center bg-secondary q-py-sm">編輯類別</div>
        <q-input
          v-model="inputName"
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
import { ref, watch, watchEffect, onUnmounted } from 'vue'
import { useCategoriesStore } from 'src/stores/categories'
import { useQuasar } from 'quasar'
import type { Category } from 'src/types/category'
const props = defineProps<{
  category: Category
}>()
defineEmits([...useDialogPluginComponent.emits])

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent()
const cStore = useCategoriesStore()
const $q = useQuasar()
// inputs
const statusMessage = ref('')
const inputName = ref(props.category.name)
// q-btn
const inputDisalbled = ref(false)
const submitDisabled = ref(true)
const submitLoading = ref(false)
const timeoutID = ref<NodeJS.Timeout>()

// Disable submit button if input unchanged
watch(
  () => inputName.value,
  () => {
    if (inputName.value === props.category.name) {
      submitDisabled.value = true
    } else {
      submitDisabled.value = false
    }
  },
  { immediate: true }
)
// reset q-inputs
watchEffect(() => {
  inputName.value = props.category.name
})
const onEditSubmitClick = async () => {
  // disable
  inputDisalbled.value = true
  submitDisabled.value = true
  submitLoading.value = true
  try {
    if (!props.category.id || !inputName.value)
      throw new Error('欄位不可為空白')
    // call api
    await cStore.updateCurrent(inputName.value)
    // show notification
    submitLoading.value = false
    statusMessage.value = '更新成功!'
    triggerPpsitive()
  } catch (error) {
    console.log(error)
    if (typeof error === 'string') {
      statusMessage.value = error
    } else {
      statusMessage.value = '伺服器錯誤'
    }
    triggerNegative()
  } finally {
    autoClose()
  }
}

const autoClose = () => {
  timeoutID.value = setTimeout(() => {
    resetAll()
    onDialogOK()
  }, 200)
}

const resetAll = () => {
  inputName.value = props.category.name
  statusMessage.value = ''
  inputDisalbled.value = false
  submitLoading.value = false
  submitDisabled.value = false
  clearTimeout(timeoutID.value)
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
