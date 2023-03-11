<template>
  <q-card tag="form" class="my-card">
    <q-card-section>
      <slot name="title"></slot>
    </q-card-section>
    <q-card-section>
      <slot name="input"></slot>
      <slot name="submit"></slot>
    </q-card-section>
  </q-card>
</template>
<script setup lang="ts"></script>
<style lang="scss" scoped>
.my-card {
  width: 100%;
  max-width: 600px;
}
</style>
