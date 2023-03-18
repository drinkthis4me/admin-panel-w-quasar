<template>
  <q-page padding class="column items-center">
    <div class="q-ma-md">
      <q-breadcrumbs>
        <template #separator>
          <q-icon size="1.5em" name="chevron_right" color="primary" />
        </template>
        <q-breadcrumbs-el label="首頁" icon="home" to="/home" />
        <q-breadcrumbs-el label="新增子類別" />
      </q-breadcrumbs>
    </div>
    <!-- form -->
    <FormCreateNew>
      <template #title>
        <div class="text-h5 text-center">新增子類別</div>
      </template>
      <template #input>
        <div class="q-gutter-y-md">
          <q-select
            v-model="categoryId"
            :options="cStore.optionsForSelct"
            map-options
            label="選擇類別"
            outlined
            class="full-width"
            />
          <q-input
            v-model.trim="userInput.name"
            type="text"
            label="名稱"
            outlined
            :disable="isLoading" />
          <q-input
            v-model.trim="userInput.description"
            type="text"
            label="子類別描述"
            outlined
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
          :disable="!categoryId || !userInput.name || !userInput.description"
          @click.prevent="onSubmitClick" />
      </template>
    </FormCreateNew>
    <!-- /form -->
  </q-page>
</template>
<script setup lang="ts">
import { ref, reactive, onUnmounted, watch } from 'vue'
import { useCategoriesStore } from 'src/stores/categories'
import { useSubcategoriesStore } from 'src/stores/subcategories'
import { useQuasar } from 'quasar'
import FormCreateNew from 'src/components/FormCreateNew.vue'
import DialogResultMsg from 'src/components/DialogResultMsg.vue'

const cStore = useCategoriesStore()
const subStore = useSubcategoriesStore()
const $q = useQuasar()

// form
interface OptionForCategory {
  label: string
  value: number
}
const categoryId = ref<OptionForCategory>() // the number is: categoryId.value.value
const userInput = reactive({
  name: '',
  description: '',
})
const isLoading = ref(false)
// dialog
const dialogInfo = ref({ status: '', title: '', body: '' })

const onSubmitClick = async () => {
  isLoading.value = true
  try {
    if (!categoryId.value) throw new Error('no category id')
    // call api
    const newSubToSend = {
      name: userInput.name,
      description: userInput.description,
      category_id: categoryId.value.value,
    }
    await subStore.createNew(newSubToSend)
    // error
    isLoading.value = false
    // update pinia state
    // grab the new sub id from api response(serverResposeStatus)
    const insertId = subStore.serverResposeStatus?.insertId
    if (!insertId) throw new Error('server error')
    const newSubcategory = {
      name: userInput.name,
      description: userInput.description,
      category_id: categoryId.value.value,
      id: insertId,
    }
    subStore.createNewLocal(newSubcategory)
    // show success
    isLoading.value = false
    dialogInfo.value.status = 'positive'
    dialogInfo.value.title = '新增成功'
    dialogInfo.value.body = '自動關閉彈出視窗...'
  } catch (error) {
    console.log(error)
    dialogInfo.value.status = 'negative'
    dialogInfo.value.title = subStore.errorMessage || '伺服器錯誤'
    dialogInfo.value.body = '新增失敗，請稍後再試一次。'
  } finally {
    openDialog()
    return
  }
}

const resetAll = () => {
  isLoading.value = false
  categoryId.value = undefined
  userInput.name = ''
  userInput.description = ''
  subStore.clearStatus()
}

const openDialog = () => {
  $q.dialog({
    component: DialogResultMsg,
    componentProps: {
      message: dialogInfo.value,
    },
  }).onDismiss(() => {
    resetAll()
  })
}

onUnmounted(() => {
  resetAll()
})

watch(
  () => cStore.categories,
  async () => {
    if (!cStore.optionsForSelct.length) {
      await cStore.getAll()
    }
  },
  { immediate: true }
)
</script>
