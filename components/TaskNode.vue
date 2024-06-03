<script setup lang="ts">
import { Handle, Position, useHandleConnections, useNodeId, useNodesData, useVueFlow } from '@vue-flow/core'
import type { TaskData, TaskDataNote } from '~/utils/task';

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  }
})

const connections = useHandleConnections({
  type: 'target',
})

const nodesData = useNodesData(() => connections.value[0]?.source)
const { nodes } = useVueFlow()

const { updateNodeData } = useVueFlow()

const nodeData = computed(() => nodes.value.find(n => n.id === props.id))
const data = computed(() => {
  return (nodeData.value?.data?.notes || []) as TaskDataNote[]
})
const task_checked = ref(nodeData.value?.data['task_checked'] || false)
watch(task_checked, (task_checked) => {
  updateNodeData(props.id, { ...(nodeData.value?.data || {}), task_checked })
})
watch(() => nodes.value, (nodes) => {
  const n = nodes.find(n => n.id === props.id)
  if (n) task_checked.value = n.data?.task_checked ?? false
}, { deep: true })


const modalIsOpen = ref(false)
const dblclick = () => {
  modalIsOpen.value = true
}


const mode = ref<'view' | 'edit'>('view')
const inputs = ref<TaskData>({
  description: nodeData.value?.data?.description || '',
  notes: [ ...nodeData.value?.data?.notes || [] ],
})
watch(() => nodeData.value, (nodeData) => {
  inputs.value = {
    description: nodeData?.data?.description || '',
    notes: [ ...nodeData?.data?.notes || [] ],
  }
})
const newNote = () => {
  const notes = inputs.value.notes
  notes.push({ text: 'test' })
  inputs.value = { ...inputs.value, notes }
}
const saveEdit = () => {
  updateNodeData(props.id, inputs.value)
  mode.value = 'view'
}
</script>

<template>
  <div
    class="vue-flow__node-default cursor-pointer"
    :style="{
      backgroundColor: task_checked ? 'lightgreen' : undefined,
    }"
    @dblclick="dblclick"
  >
    <div>
      <!-- <label class="inline-flex gap-1 items-center justify-center">
        <input type="checkbox" v-model="val" />
        <span>{{ label }}</span>
      </label> -->
      <label class="block italic text-xs px-4">
        <input type="checkbox" v-model="task_checked" />
      </label>
      <span>{{ label }}</span>
    </div>
    <Teleport to="body">
      <UModal v-model="modalIsOpen">
        <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
          <template #header>
            <div class="flex justify-between items-center">
              <div class="text-lg font-bold">Detail Tugas</div>
              <UButton size="xs" @click="modalIsOpen = false" icon="i-heroicons-x-mark" />
            </div>
          </template>

          <div class="text-sm mb-6 flex flex-col gap-4">
            <div>
              <div class="font-bold">Task :</div>
              <p v-if="mode == 'view'">{{ label }}</p>
              <input v-else v-model="inputs.description" class="w-full border border-gray-300 rounded-md p-2" />
            </div>
            <div>
              <div class="font-bold">Detail :</div>
              <div v-if="mode == 'view'">
                {{ nodeData?.data?.description || 'Tidak ada detail' }}
              </div>
              <textarea v-else v-model="inputs.description" class="w-full border border-gray-300 rounded-md p-2"></textarea>
            </div>
          </div>

          <div class="">
            <div class="text-xl inline border-b-2 border-primary-500 border-dashed pb-1">Catatan</div>
            <div class="mt-4 text-xs">
              <template v-if="mode == 'edit'">
                <div class="flex justify-end mb-4">
                  <UButton size="xs" color="primary" @click="newNote">Tambah Catatan</UButton>
                </div>
              </template>
              <div class="flex flex-col gap-1">
                <div v-for="(note, i) in inputs.notes">
                  <template v-if="mode == 'view'">
                    <p v-if="note.text" class="p-1 border border-gray-500 border-dashed">
                      {{ note.text }}
                    </p>
                    <p v-if="note.image">
                      <img :src="note.image" alt="note" class="w-full" />
                    </p>
                  </template>
                  <template v-if="mode == 'edit'">
                    <div class="flex gap-2">
                      <div class="flex flex-col">
                        <UButton size="xs" color="red" @click="() => inputs.notes.splice(i, 1)" icon="i-heroicons-x-mark" />
                      </div>
                      <textarea v-model="inputs.notes[i].text" class="flex-1 border border-gray-300 rounded-md p-2"></textarea>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>

          <template #footer>
            <div class="flex items-center justify-between">
              <label class="inline-flex items-center gap-1 italic text-xs">
                <input type="checkbox" v-model="task_checked" />
                <span class="">Tandai sebagai selesai</span>
              </label>
              <div class="flex gap-2">
                <UButton v-if="mode == 'edit'" size="xs" color="red" @click="mode = 'view'">Cancel</UButton>
                <UButton v-if="mode == 'edit'" size="xs" color="primary" @click="saveEdit">Save</UButton>
                <UButton v-if="mode == 'view'" size="xs" color="primary" @click="mode = 'edit'">Edit</UButton>
              </div>
            </div>
          </template>
        </UCard>
      </UModal>
    </Teleport>
  </div>
</template>