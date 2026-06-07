<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="fixed inset-0 z-[100] flex items-end justify-center lg:items-center">
        <div class="absolute inset-0 bg-black/40" @click="closeOnBackdrop && $emit('update:modelValue', false)"></div>
        <div class="relative bg-canvas-cream rounded-t-[32px] lg:rounded-[32px] w-full max-w-md p-6 pb-8 lg:mb-0 max-h-[85vh] overflow-y-auto border-4 border-[#B7D9BC] border-b-0 lg:border-b-4">
          <div class="w-10 h-1 bg-[#B7D9BC] rounded-full mx-auto mb-5 lg:hidden"></div>
          <div v-if="title" class="flex items-center justify-between mb-5">
            <h3 class="font-headline-md text-text-main">{{ title }}</h3>
            <button v-if="closable" @click="$emit('update:modelValue', false)"
              class="w-10 h-10 rounded-full bg-white border-2 border-[#B7D9BC] flex items-center justify-center hover:bg-success-soft transition-colors">
              <span class="material-symbols-outlined text-primary">close</span>
            </button>
          </div>
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '' },
  closable: { type: Boolean, default: false },
  closeOnBackdrop: { type: Boolean, default: true }
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .relative {
  transform: translateY(100%);
}
.modal-leave-to .relative {
  transform: translateY(100%);
}
@media (min-width: 1024px) {
  .modal-enter-from .relative,
  .modal-leave-to .relative {
    transform: translateY(16px);
  }
}
</style>
