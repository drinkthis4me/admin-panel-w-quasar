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
          v-model.trim="name"
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
          :disable="!name"
          @click.prevent="onSubmitClick" />
      </template>
    </FormCreateNew>
    <!-- /form -->
    <!-- dialog -->
    <DialogResultMsg
      :open="dialogOpen"
      :title="dialogInfo.title"
      :body="dialogInfo.body"
      @close="dialogOpen = false"
      @hide="clearAll" />
  </q-page>
</template>
<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { useMysqlStore } from 'stores/useMysqlStore'
import { useDataStore } from 'src/stores/useDataStore'
import FormCreateNew from 'components/FormCreateNew.vue'
import DialogResultMsg from 'src/components/DialogResultMsg.vue'

const mysqlStore = useMysqlStore()
const dataStore = useDataStore()

// form variables
const name = ref('')
const isLoading = ref(false)
// dialog variables
const dialogOpen = ref(false)
const dialogInfo = ref({ title: '', body: '' })
const timeoutID = ref<NodeJS.Timeout>()

const onSubmitClick = async () => {
  isLoading.value = true
  await mysqlStore.createCate(name.value)

  // show error
  if (!mysqlStore.CUDStatus || mysqlStore.CUDStatus.affectedRows < 1) {
    dialogInfo.value.title = mysqlStore.errorStatus
    dialogInfo.value.body = '新增失敗，請稍後再試一次。'
    dialogOpen.value = true
    return
  }

  // update pinia state
  dataStore.createCategory(name.value, mysqlStore.CUDStatus.insertId)

  // show success
  dialogInfo.value.title = '新增成功'
  dialogInfo.value.body = '自動關閉彈出視窗...'
  dialogOpen.value = true
  autoClose()
  return
}

const clearAll = () => {
  dialogOpen.value = false
  isLoading.value = false
  name.value = ''
  clearTimeout(timeoutID.value)
}

const autoClose = () => {
  timeoutID.value = setTimeout(() => {
    clearAll()
  }, 2000)
}

onUnmounted(() => {
  mysqlStore.clearStatus()
  clearAll()
})
</script>
