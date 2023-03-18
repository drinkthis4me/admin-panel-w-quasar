<template>
  <q-expansion-item
    expand-separator
    :icon="menuLinks.icon"
    :label="menuLinks.title"
    header-class="text-primary">
    <q-expansion-item
      v-for="links in menuLinks.children"
      :key="links.title"
      expand-separator
      :header-inset-level="1"
      :label="links.title">
      <q-item
        v-for="link in links.children"
        :key="link.title"
        clickable
        v-ripple
        :inset-level="1.5"
        :active-class="
          currentPage == link.link ? 'bg-purple-2 text-primary' : ''
        "
        :to="link.link">
        <q-item-section>{{ link.title }}</q-item-section>
      </q-item>
    </q-expansion-item>
  </q-expansion-item>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import type { Menu } from 'src/types/menulink'

defineProps<{
  menuLinks: Menu
}>()

// change active link style by current route path
const currentPage = ref('')
const route = useRoute()
watch(
  () => route.fullPath,
  to => {
    currentPage.value = to
  },
  { immediate: true }
)
</script>
