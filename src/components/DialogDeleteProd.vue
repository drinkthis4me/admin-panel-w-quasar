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
        <div class="text-h5 text-center bg-secondary q-py-sm">
          確認刪除本產品?
        </div>
        <div class="q-mx-md q-my-sm alignMe">
          <div><span>ID</span>{{ product.id }}</div>
          <div><span>名稱</span>{{ product.name }}</div>
          <div><span>描述</span>{{ product.description }}</div>
          <div><span>尺寸</span>{{ product.size }}</div>
          <div><span>顏色</span>{{ product.color }}</div>
          <div><span>價格</span>{{ product.price }}</div>
          <div><span>數量</span>{{ product.quantity }}</div>
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
import { useCategoriesStore } from 'src/stores/categories'
import { useNotify } from 'src/composable/notify'
import type { Product } from 'src/types/product'

const rowProps = defineProps<{
  product: Product
}>()
defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent()
const cStore = useCategoriesStore()
const { triggerNotify } = useNotify()
// q-btn
const statusMessage = ref('')
const submitLoading = ref(false)
const submitDisabled = ref(false)
const timeoutID = ref<NodeJS.Timeout>()

const onDeleteSubmitClick = async () => {
  // disable
  submitLoading.value = true
  submitDisabled.value = true
  try {
    // call api
    // show notification
    submitLoading.value = false
    statusMessage.value = '刪除成功!'
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
  statusMessage.value = ''
  submitLoading.value = false
  submitDisabled.value = false
  clearInterval(timeoutID.value)
}
onUnmounted(() => {
  resetAll()
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
