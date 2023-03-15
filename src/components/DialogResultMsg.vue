<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide()"
    transition-show="scale"
    transition-hide="scale">
    <q-card :class="['text-white', cardClass]" style="width: 300px">
      <q-card-section>
        <div class="text-h5">{{ message.title }}</div>
      </q-card-section>

      <q-card-section
        v-if="message.body && message.body.length"
        class="q-pt-none">
        {{ message.body }}
      </q-card-section>

      <q-card-actions align="right" class="bg-white text-primary">
        <q-btn flat label="OK" v-close-popup @click="onDialogOK" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useDialogPluginComponent } from 'quasar'

interface Message {
  status: 'positive' | 'negative'
  title: string
  body: string
}
const props = defineProps<{
  message: Message
}>()
defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogHide, onDialogOK } =
  useDialogPluginComponent()
const cardClass = computed(() =>
  props.message.status == 'positive' ? 'bg-positive' : 'bg-negative'
)

const timeoutID = ref<NodeJS.Timeout>()
const autoClose = () => {
  timeoutID.value = setTimeout(() => {
    onDialogOK()
  }, 2000)
}

onMounted(() => {
  autoClose()
})
</script>
