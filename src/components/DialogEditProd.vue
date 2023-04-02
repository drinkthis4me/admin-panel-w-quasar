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
    <q-card style="width: 600px">
      <q-card-section class="column" horizontal>
        <div class="text-h5 text-center bg-secondary q-py-sm">編輯產品</div>
        <q-input
          v-model="userInput.name"
          :disable="inputDisalbled"
          label="產品名稱"
          outlined
          color="teal-4"
          class="q-ma-sm"></q-input>
        <q-input
          v-model="userInput.description"
          :disable="inputDisalbled"
          label="描述"
          outlined
          color="teal-4"
          class="q-ma-sm"></q-input>
        <q-input
          v-model="userInput.size"
          :disable="inputDisalbled"
          label="尺寸"
          outlined
          color="teal-4"
          class="q-ma-sm"></q-input>
        <q-input
          v-model="userInput.color"
          :disable="inputDisalbled"
          label="顏色"
          outlined
          color="teal-4"
          class="q-ma-sm"></q-input>
        <q-input
          v-model="userInput.price"
          :disable="inputDisalbled"
          label="價格"
          outlined
          color="teal-4"
          class="q-ma-sm"></q-input>
        <q-input
          v-model="userInput.quantity"
          :disable="inputDisalbled"
          label="數量"
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
import { ref, reactive, watch, watchEffect, onUnmounted } from 'vue'
import { useCategoriesStore } from 'src/stores/categories'
import { useProductStore } from 'src/stores/products'
import { useNotify } from 'src/composable/notify'
import type { Product } from 'src/types/product'

const props = defineProps<{
  product: Product
}>()
defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent()
const cStore = useCategoriesStore()
const pStore = useProductStore()
const { triggerNotify } = useNotify()
// inputs
const statusMessage = ref('')
const userInput = reactive({
  name: props.product.name,
  description: props.product.description,
  size: props.product.size,
  color: props.product.color,
  price: props.product.price,
  quantity: props.product.quantity
})
// q-btn
const inputDisalbled = ref(false)
const submitDisabled = ref(true)
const submitLoading = ref(false)
const timeoutID = ref<NodeJS.Timeout>()

// Disable submit button if inputs unchanged
watch(
  () => userInput.name,
  () => {
    if (userInput.name === props.product.name) {
      submitDisabled.value = true
    } else {
      submitDisabled.value = false
    }
  },
  { immediate: true }
)
// reset q-inputs
watchEffect(() => {
  userInput.name = props.product.name
  userInput.description = props.product.description
  userInput.size = props.product.size
  userInput.color = props.product.color
  userInput.price = props.product.price
  userInput.quantity = props.product.quantity
})
const onEditSubmitClick = async () => {
  // disable
  inputDisalbled.value = true
  submitDisabled.value = true
  submitLoading.value = true
  try {
        // call api
    // show notification
    submitLoading.value = false
    statusMessage.value = '更新成功!'
    triggerNotify('positive', statusMessage)
  } catch (error) {
    console.log(error)
    if (typeof error === 'string') {
      statusMessage.value = error
    } else {
      statusMessage.value = '伺服器錯誤'
    }
    triggerNotify('negative', statusMessage)
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
  userInput.name = props.product.name
  userInput.description = props.product.description
  statusMessage.value = ''
  inputDisalbled.value = false
  submitLoading.value = false
  submitDisabled.value = false
  clearTimeout(timeoutID.value)
}
onUnmounted(() => {
  resetAll()
})
</script>

<style lang="scss" scoped>
.btn-width {
  width: 48%;
}
</style>
