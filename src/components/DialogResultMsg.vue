<template>
  <q-dialog
    :model-value="open"
    @hide="$emit('close')"    
    transition-show="scale"
    transition-hide="scale">
    <q-card :class="['text-white', cardClass]" style="width: 300px">
      <q-card-section>
        <div class="text-h5">{{ title }}</div>
      </q-card-section>

      <q-card-section v-if="body && body.length" class="q-pt-none">
        {{ body }}
      </q-card-section>

      <q-card-actions align="right" class="bg-white text-primary">
        <q-btn flat label="OK" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{
  open: boolean
  title: string
  body?: string
}>()
defineEmits(['close'])
const cardClass = computed(() =>
  props.title == '新增成功' ? 'bg-positive' : 'bg-negative'
)
</script>
