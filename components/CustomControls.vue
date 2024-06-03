<script lang="ts" setup>
import type { Edge, Node } from '@vue-flow/core'  
import { MarkerType, VueFlow, useVueFlow } from '@vue-flow/core'

const props = defineProps({
  nodes: {
    type: Array as PropType<Node[]>,
    required: true,
  },
  edges: {
    type: Array as PropType<Edge[]>,
    required: true,
  },
})
</script>

<template>
  <div class="fixed top-0 right-0 mt-4 mr-4 z-50 flex flex-col gap-4">
    <TaskLists :nodes="nodes" :edges="edges" />
  </div>
</template>