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
            :options="dataStore.cateOptions"
            map-options
            label="選擇類別"
            outlined
            class="full-width" />
          <q-input
            v-model.trim="name"
            type="text"
            label="名稱"
            outlined
            :disable="isLoading" />
          <q-input
            v-model.trim="description"
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
          :disable="!categoryId || !name || !description"
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
import FormCreateNew from 'src/components/FormCreateNew.vue'
import DialogResultMsg from 'src/components/DialogResultMsg.vue'

const mysqlStore = useMysqlStore()
const dataStore = useDataStore()

// form variables
interface OptionForCategory {
  label: string
  value: number
}
const categoryId = ref<OptionForCategory>()
const name = ref('')
const description = ref('')
const isLoading = ref(false)
// dialog variables
const dialogOpen = ref(false)
const dialogInfo = ref({ title: '', body: '' })
const timeoutID = ref<NodeJS.Timeout>()

const onSubmitClick = async () => {
  isLoading.value = true
  if (categoryId.value) {
    await mysqlStore.createSub(
      name.value,
      description.value,
      categoryId.value.value
    )
  }

  // show error
  if (!mysqlStore.CUDStatus || mysqlStore.CUDStatus.affectedRows < 1) {
    dialogInfo.value.title = mysqlStore.errorStatus
    dialogInfo.value.body = '新增失敗，請稍後再試一次。'
    dialogOpen.value = true
    return
  }

  // update pinia state
  if (mysqlStore.CUDStatus.insertId && categoryId.value) {
    const payload = {
      name: name.value,
      description: description.value,
      category_id: categoryId.value.value,
      id: mysqlStore.CUDStatus.insertId,
    }
    dataStore.createSubcategory(payload, categoryId.value.value)
  }

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
  categoryId.value = undefined
  name.value = ''
  description.value = ''
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
