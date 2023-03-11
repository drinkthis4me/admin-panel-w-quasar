<template>
  <q-expansion-item
    v-for="link in menuLinks"
    :key="link.title"
    expand-separator
    :icon="link.icon"
    :label="link.title"
    header-class="text-primary">
    <q-item
      v-for="c in link.children"
      :key="c.title"
      clickable
      v-ripple
      :inset-level="1"
      :to="c.link"
      :active="currentPage == c.link"
      active-class="bg-purple-2 text-primary">
      <q-item-section>{{ c.title }}</q-item-section>
    </q-item>
  </q-expansion-item>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

interface MenuLink {
  title: string
  icon: string
  children: ChildInMenuLink[]
}
interface ChildInMenuLink {
  title: string
  link: string
}
defineProps<{
  menuLinks: MenuLink[]
}>()

// change active link style by current route path
const currentPage = ref('')
const route = useRoute()
watch(
  () => route.path,
  (to) => {
    currentPage.value = to
  },
  { immediate: true }
)
</script>
