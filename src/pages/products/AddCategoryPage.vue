<template>
  <q-page padding class="column items-center">
    <div class="q-ma-md">
      <q-breadcrumbs>
        <template #separator>
          <q-icon size="1.5em" name="chevron_right" color="primary" />
        </template>
        <q-breadcrumbs-el label="首頁" icon="home" to="/home" />
        <q-breadcrumbs-el label="新增類別" />
      </q-breadcrumbs>
    </div>
    <!-- form -->
    <FormCreateNew>
      <template #title>
        <div class="text-h5 text-center">新增類別</div>
      </template>
      <template #input>
        <q-input
          v-model.trim="inputName"
          type="text"
          label="名稱"
          outlined
          :disable="isLoading" />
      </template>
      <template #submit>
        <q-btn
          label="送出"
          type="submit"
          color="primary"
          class="full-width q-mt-md"
          :loading="isLoading"
          :disable="!inputName"
          @click.prevent="onSubmitClick" />
      </template>
    </FormCreateNew>
    <!-- /form -->
  </q-page>
</template>
<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { useCategoriesStore } from 'src/stores/categories'
import { useQuasar } from 'quasar'
import FormCreateNew from 'components/FormCreateNew.vue'
import DialogResultMsg from 'src/components/DialogResultMsg.vue'

const cStore = useCategoriesStore()
const $q = useQuasar()

// form
const inputName = ref('')
const isLoading = ref(false)
// dialog
const dialogInfo = ref({ status: '', title: '', body: '' })

const onSubmitClick = async () => {
  isLoading.value = true
  try {
    if (!inputName.value) throw new Error('no input found')
    // call api
    await cStore.createNew(inputName.value)
    //update pinia state
    // grab the new id from api response(serverResposeStatus)
    const insertId = cStore.serverResposeStatus?.insertId
    if (!insertId) throw new Error('server error')
    const newC = { name: inputName.value, id: insertId }
    cStore.createNewLocal(newC)
    // show success
    isLoading.value = false
    dialogInfo.value.status = 'positive'
    dialogInfo.value.title = '新增成功'
    dialogInfo.value.body = '自動關閉彈出視窗...'
  } catch (error) {
    console.log(error)
    dialogInfo.value.status = 'negative'
    dialogInfo.value.title = cStore.errorMessage || '伺服器錯誤'
    dialogInfo.value.body = '新增失敗，請稍後再試一次。'
  } finally {
    openDialog()
    return
  }
}

const resetAll = () => {
  isLoading.value = false
  inputName.value = ''
  cStore.clearStatus()
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
</script>
