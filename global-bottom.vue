<!-- global-bottom.vue -->
<script setup>
import { useSlideContext } from '@slidev/client'

const { $slidev, $page } = useSlideContext()
</script>

<template>
  <div class="absolute right-6 bottom-6 text-sm flex space-x-4">
    <span class="slidev-icon"> {{ $slidev.themeConfigs.footer }} </span>       
    <span class="slidev-icon"> [ <SlideCurrentNo /> / <SlidesTotal /> ] </span>     
  </div>
  <div  v-if="$page != 1" class="absolute left-6 bottom-6 text-sm flex space-x-4">
    <span> {{ $slidev.configs.author }}, {{ $slidev.themeConfigs.date }} </span>
  </div>
</template>
