<script lang="ts" setup>
import type { Edge, Node } from '@vue-flow/core'  
import { MarkerType, VueFlow, useVueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { MiniMap } from '@vue-flow/minimap'
import { ControlButton, Controls } from '@vue-flow/controls'
import type { TaskData, TaskDataNote } from './utils/task'
import FlowsJson from './flows.json'

const { getNodes } = useVueFlow()

const { $PSPDFKit } = useNuxtApp()

const createNode = (name: string, x: number, y: number, id?: string, opts?: Partial<Node>) => {
  if (!id) id = name // id = Math.random().toString(36).substring(7)
  return { id, label: name, position: { x: x, y: y }, class: 'light', ...opts } as Node
}

const isLoadedData = ref(false)
const nodes = ref<Node[]>([ ...FlowsJson.nodes as any ])
const edges = ref<Edge[]>([ ...FlowsJson.edges ])

// STORED STATE
watch(() => nodes.value, (_nodes) => {
  if (!isLoadedData.value) return
  // save to local storage
  setTimeout(() => {
    localStorage.setItem('nodes', JSON.stringify(nodes.value))
  }, 1000)
}, { deep: true })
onMounted(() => {
  // load from local storage
  let storedNodes = localStorage.getItem('nodes')
  if (storedNodes) storedNodes = JSON.parse(storedNodes)
  if (!storedNodes) return

  // update data only
  // console.log('load', storedNodes);
  const _nodes = [...nodes.value]
  for (const node of (storedNodes as unknown as Node[])) {
    const n = _nodes.find(n => n.id === node.id)
    if (n) {
      n['data']['task_checked'] = node['data']['task_checked']
    }
  }

  nodes.value = _nodes
  // nodes.value = storedNodes as unknown as Node[]
  isLoadedData.value = true
})

const currentFlows = computed(() => {
  const nodeVal = JSON.parse(JSON.stringify([...nodes.value]))
  const edgeVal = JSON.parse(JSON.stringify([...edges.value]))

  // only keep necessary data in nodeval: id, label, position, class, data, type
  const nodeProps = ['id', 'label', 'position', 'class', 'data', 'type', 'style', 'extent', 'parentNode']
  for (const node of nodeVal) {
    for (const key in node) {
      // console.log(key)
      if (!nodeProps.includes(key)) delete (node as any)[key]
    }    
  }
  // only keep necessary data in edgeval: id, source, target, markerEnd
  const edgeProps = ['id', 'source', 'target', 'markerEnd']
  for (const edge of edgeVal) {
    for (const key in edge) {
      if (!edgeProps.includes(key)) delete (edge as any)[key]
    }    
  }

  return JSON.stringify({
    nodes: nodeVal,
    edges: edgeVal,
  })
})
</script>

<template>
  <div class="w-screen h-screen overflow-hidden relative">
    <div class="fixed top-0 left-0 p-4 z-50">
      <div>TAHAPAN SEMHAS</div>
      <ClientOnly>
        <input type="text" :value="currentFlows" />
      </ClientOnly>
    </div>
    <div>
    </div>
    <ClientOnly>
      <VueFlow
        class="basicflow"
        v-model:nodes="nodes"
        :edges="edges"
        :nodes-draggable="false"
        :zoom-on-double-click="false"
        :fit-view-on-init="false"
      >
        <Controls />
        <Background pattern-color="#aaa" :gap="16" />
        <MiniMap />
        <CustomControls v-model:nodes="nodes" :edges="edges" />

        <template #node-task="{ id, data, label }">
          <TaskNode :id="id" :label="(label as string)" />
        </template>
      </VueFlow>
    </ClientOnly>
  </div>
</template>

<style>
/* import the necessary styles for Vue Flow to work */
@import '@vue-flow/core/dist/style.css';

/* import the default theme, this is optional but generally recommended */
@import '@vue-flow/core/dist/theme-default.css';
</style>