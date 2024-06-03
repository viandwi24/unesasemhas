<script lang="ts" setup>
import type { Edge, Node } from '@vue-flow/core'  
import { MarkerType, VueFlow, useNode } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { MiniMap } from '@vue-flow/minimap'
import { ControlButton, Controls } from '@vue-flow/controls'
import { Handle, Position, useHandleConnections, useNodesData, useVueFlow } from '@vue-flow/core'

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

const _nodes = computed(() => props.nodes.filter(n => n.type === 'task'))

const { updateNodeData } = useVueFlow()
const onListTaskItemChange = (id: string, e: Event) => {
  updateNodeData(id, { ...(_nodes?.value.find(item => item.id === id)?.data || {}), task_checked: (e.target as HTMLInputElement).checked })
}

const input = ref({ search: '' })
const nodesFiltered = computed(() => {
  return _nodes.value
    .filter(n => `${n.label}`.toLowerCase().includes(input.value.search.toLowerCase()))
    // sort by node.id number, 1, 2, 3a, 3b, 41, 42, 43, 5, 6, 7
    // .sort((a, b) => {
    //   // get first number from string
    //   const calc = (node: Node) => {
    //     return {
    //       fNum: parseInt(`${a.id}`[0]) || 0,
    //       sNum: parseInt(`${a.id}`.split('')[1]) || 0,
    //     }
    //   }

    //   const { fNum: aFNum, sNum: aSNum } = calc(a)
    //   const { fNum: bFNum, sNum: bSNum } = calc(b)

    //   if (aFNum === bFNum) {
    //     return aSNum - bSNum
    //   }
    //   return aFNum - bFNum
    // })
})
const doneTask = computed(() => _nodes.value.filter(n => n.data?.task_checked))

const isOpenCard = ref(true)
</script>

<template>
  <div class="relative border-2 border-gray-200 shadow-lg bg-gray-950">
    <div class="relative w-[280px]">
      <div
        class="flex items-center justify-center text-sm font-bold py-2 cursor-pointer"
        @click="isOpenCard = !isOpenCard"
      >
        <UIcon
          name="i-heroicons-chevron-right mr-2"
          class="w-4 h-4 transform"
          :class="{
            'rotate-0': !isOpenCard,
            'rotate-90': isOpenCard,
          }"
        />
        <span>DAFTAR TASK</span>
      </div>
      <div v-if="isOpenCard">
        <div>
          <input type="text" class="w-full text-xs border-2 border-gray-200 p-1" placeholder="cari task" v-model="input.search" />
        </div>
      </div>
      <div v-if="isOpenCard" class="max-h-[200px] px-2 h-[200px] relative overflow-y-auto">
        <div class="flex flex-col">
          <div v-for="node in nodesFiltered" :key="node.id" class="flex items-center justify-between">
            <label class="flex">
              <div class="pt-0.5">
                <input type="checkbox" class="mr-1" :checked="node.data?.task_checked" @change="onListTaskItemChange(node.id, $event)" />
              </div>
              <div class="flex-1">
                <span class="text-xs italic text-gray-400">{{ node.id }}). </span>
                <span class="text-xs">{{ node.label }}</span>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
    <div v-if="isOpenCard" class="text-center border-t-2 border-gray-200 py-1">
      <div class="text-xs">
        <div>Selesai: {{ doneTask.length }} / {{ _nodes.length }}</div>
      </div>
    </div>
  </div>
</template>