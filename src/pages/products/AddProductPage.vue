<template>
  <q-page padding class="column items-center">
    <div class="q-ma-md">
      <q-breadcrumbs>
        <template #separator>
          <q-icon size="1.5em" name="chevron_right" color="primary" />
        </template>
        <q-breadcrumbs-el label="首頁" icon="home" to="/home" />
        <q-breadcrumbs-el label="新增產品" />
      </q-breadcrumbs>
    </div>
    <div
      v-if="cStore.categories.length"
      class="q-mt-md row justify-center full-width">
      <!-- form -->
      <FormCreateNew>
        <template #title>
          <div class="text-h5 text-center">新增產品</div>
        </template>
        <template #input>
          <div class="q-gutter-y-md">
            <q-select
              v-model="cStore.currentID"
              @update:model-value="cStore.currentSubID = null"
              :options="cStore.categories"
              option-label="name"
              option-value="id"
              emit-value
              map-options
              label="選擇類別"
              outlined
              :rules="[val => !!val || '* 不可空白']"
              lazy-rules
              class="full-width" />
            <q-select
              ref="subIDRef"
              v-model="cStore.currentSubID"
              :options="cStore.currentSubs"
              option-label="name"
              option-value="id"
              emit-value
              map-options
              label="選擇子類別"
              outlined
              :rules="[val => !!val || '* 不可空白']"
              lazy-rules
              class="full-width"
              :disable="!cStore.currentID" />
            <q-input
              v-model.trim="userInput.name"
              type="text"
              label="名稱"
              outlined
              :rules="[val => !!val || '* 不可空白']"
              lazy-rules
              :disable="isLoading"
              class="q-mt-lg" />
            <q-input
              v-model.trim="userInput.description"
              type="text"
              label="產品描述"
              outlined
              :rules="[val => !!val || '* 不可空白']"
              lazy-rules
              :disable="isLoading" />
            <q-input
              v-model.trim="userInput.size"
              type="text"
              label="尺寸"
              outlined
              :rules="[val => !!val || '* 不可空白']"
              lazy-rules
              :disable="isLoading" />
            <q-input
              v-model.trim="userInput.color"
              type="text"
              label="顏色"
              outlined
              :rules="[val => !!val || '* 不可空白']"
              lazy-rules
              :disable="isLoading" />
            <q-input
              v-model.number="userInput.price"
              type="number"
              label="價格"
              outlined
              :rules="[val => !!val || '* 不可空白']"
              lazy-rules
              :disable="isLoading" />
            <q-input
              v-model.number="userInput.quantity"
              type="number"
              label="數量"
              outlined
              :rules="[val => !!val || '* 不可空白']"
              lazy-rules
              :disable="isLoading" />
          </div>
        </template>
        <template #submit>
          <q-btn
            label="送出"
            type="submit"
            color="primary"
            class="full-width q-mt-md"
            :loading="isLoading"
            @click.prevent="onSubmitClick" />
        </template>
      </FormCreateNew>
      <!-- /form -->
    </div>
    <div v-else><ServerErrorMessage /></div>
  </q-page>
</template>
<script setup lang="ts">
import { ref, computed, reactive, onUnmounted, watch } from 'vue'
import { useCategoriesStore } from 'src/stores/categories'
import { useQuasar, type QSelect, type QInput } from 'quasar'
import FormCreateNew from 'src/components/FormCreateNew.vue'
import DialogResultMsg from 'src/components/DialogResultMsg.vue'
import ServerErrorMessage from 'src/components/ServerErrorMessage.vue'

const cStore = useCategoriesStore()
const $q = useQuasar()

// form
const subIDRef = ref<QSelect | null>(null)
interface Input {
  name: string
  description: string
  size: string
  color: string
  price: number | undefined
  quantity: number | undefined
}
const userInput: Input = reactive({
  name: '',
  description: '',
  size: '',
  color: '',
  price: undefined,
  quantity: undefined,
})
const isVaild = computed(() => {
  return (
    cStore.currentID &&
    cStore.currentSubID &&
    userInput.name.length > 0 &&
    userInput.description.length > 0 &&
    userInput.size.length > 0 &&
    userInput.color.length > 0 &&
    userInput.price &&
    userInput.quantity &&
    typeof userInput.price === 'number' &&
    typeof userInput.quantity === 'number' &&
    userInput.price >= 0 &&
    userInput.quantity >= 0
  )
})
const isLoading = ref(false)
// dialog
const dialogInfo = ref({ status: '', title: '', body: '' })

const onSubmitClick = async () => {
  ;(subIDRef.value as QSelect).validate()

  if(isVaild.value){
    console.log('do submitting')
  }
}

const resetAll = () => {
  isLoading.value = false
  cStore.currentID = null
  userInput.name = ''
  userInput.description = ''
}

const openDialog = () => {
  $q.dialog({
    component: DialogResultMsg,
    componentProps: {
      message: dialogInfo.value,
    },
  })
}

onUnmounted(() => {
  resetAll()
})

watch(
  () => cStore.categories,
  async () => {
    if (!cStore.categories.length) {
      await cStore.getAll()
    }
  },
  { immediate: true }
)
</script>
