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
          v-model="name"
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
    <div class="hidden">
      <q-dialog
        v-model="errorDialogOpen"
        persistent
        transition-show="scale"
        transition-hide="scale">
        <q-card class="bg-negative text-white" style="width: 300px">
          <q-card-section>
            <div class="text-h6">伺服器錯誤</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            新增失敗，請稍後再試一次。
          </q-card-section>

          <q-card-actions align="right" class="bg-white text-primary">
            <q-btn flat label="OK" v-close-popup @click="$router.go(0)" />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-dialog v-model="successDialogOpen" persistent>
        <q-card class="bg-positive text-white" style="width: 300px">
          <q-card-section>
            <div class="text-h6">新增成功</div>
          </q-card-section>

          <q-card-section class="q-pt-none"> 重新整理 </q-card-section>

          <q-card-actions align="right" class="bg-white text-primary">
            <q-btn flat label="OK" v-close-popup @click="$router.go(0)" />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- / dialog -->
    </div>
  </q-page>
</template>
<script setup lang="ts">
import FormCreateNew from 'src/components/FormCreateNew.vue'
import { ref } from 'vue'
import { useMysqlStore } from 'stores/useMysqlStore'

// form logic
const mysqlStore = useMysqlStore()
const name = ref('')
const isLoading = ref(false)
const onSubmitClick = async () => {
  isLoading.value = true
  await mysqlStore.create(name.value)
  if (!mysqlStore.CUDStatus || mysqlStore.CUDStatus.affectedRows < 1) {
    // open dialog
    errorDialogOpen.value = true
    return
  }
  // open dialog
  successDialogOpen.value = true
  return
}

// dialog logic
const errorDialogOpen = ref(false)
const successDialogOpen = ref(false)
</script>
<style lang=""></style>
