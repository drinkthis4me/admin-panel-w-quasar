<template>
  <q-page class="column items-center justify-center q-gutter-md">
    <div :class="[$q.screen.lt.md ? 'text-h2' : 'text-h1']">產品管理平台</div>
    <div>常用功能：</div>
    <div class="q-gutter-sm">
      <q-btn
        color="primary"
        icon="check"
        label="類別總覽"
        to="/home/list-categories" />
      <q-btn
        color="primary"
        icon="check"
        label="子類別總覽"
        to="/home/list-subcategories" />
      <q-btn
        color="primary"
        icon="check"
        label="產品總覽"
        to="/home/list-products" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
</script>
