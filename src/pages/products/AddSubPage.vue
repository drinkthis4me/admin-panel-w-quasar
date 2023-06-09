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
    <div
      v-if="cStore.categories.length"
      class="q-mt-md row justify-center full-width">
      <!-- form -->
      <FormCreateNew>
        <template #title>
          <div class="text-h5 text-center">新增子類別</div>
        </template>
        <template #input>
          <div class="q-gutter-y-md">
            <q-select
              v-model="cStore.currentID"
              :options="cStore.categories"
              option-label="name"
              option-value="id"
              emit-value
              map-options
              label="選擇類別"
              outlined
              class="full-width" />
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
            :disable="!cStore.currentID || !userInput.name || !userInput.description"
            @click.prevent="onSubmitClick" />
        </template>
      </FormCreateNew>
      <!-- /form -->
    </div>
    <div v-else><ServerErrorMessage /></div>
  </q-page>
</template>
<script setup lang="ts">
import { ref, reactive, onUnmounted, watch } from 'vue'
import { useCategoriesStore } from 'src/stores/categories'
import { useQuasar } from 'quasar'
import FormCreateNew from 'src/components/FormCreateNew.vue'
import DialogResultMsg from 'src/components/DialogResultMsg.vue'
import ServerErrorMessage from 'src/components/ServerErrorMessage.vue'

const cStore = useCategoriesStore()
const $q = useQuasar()

// form
const userInput = reactive({
  name: '',
  description: '',
})
const isLoading = ref(false)
// dialog
const dialogInfo = ref({ status: '', title: '', body: '' })

const onSubmitClick = async () => {
  try {
    if (!cStore.currentID) {
      throw new Error('未選擇類別')
    }
    isLoading.value = true
    const newSub = {
      name: userInput.name,
      description: userInput.description,
      category_id: cStore.currentID,
    }
    await cStore.createNewSub(newSub)
    isLoading.value = false
    dialogInfo.value.status = 'positive'
    dialogInfo.value.title = '新增成功'
    dialogInfo.value.body = '自動關閉彈出視窗...'
  } catch (error) {
    dialogInfo.value.status = 'negative'
    if (typeof error === 'string') {
      dialogInfo.value.title = error
    } else {
      dialogInfo.value.title = '伺服器錯誤'
    }
    dialogInfo.value.body = '新增失敗，請稍後再試一次。'
  } finally {
    openDialog()
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
    if (!cStore.categories.length) {
      await cStore.getAll()
    }
  },
  { immediate: true }
)
</script>
