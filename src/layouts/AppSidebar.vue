<template>
  <aside class="desktop-sidebar fixed left-0 top-0 h-full w-[280px] z-50 flex flex-col border-r-4 border-[#B7D9BC]"
    style="background: #FFF9F3;">
    <div class="p-6 pb-4">
      <div class="flex items-center gap-3 bg-canvas-cream rounded-[20px] p-4 border-4 border-[#B7D9BC] shadow-md">
        <div class="w-12 h-12 rounded-full bg-success-soft flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
          <span class="text-2xl">{{ userGender === 'Ayah' ? '👨' : '👩' }}</span>
        </div>
        <div>
          <h2 class="font-headline-md text-headline-md text-text-main">Halo {{ userName }}!</h2>
          <p class="text-sm text-on-surface-variant">Selamat datang</p>
        </div>
      </div>
    </div>

    <div class="px-4 mb-2">
      <p class="text-xs font-bold text-primary uppercase tracking-wider px-3">Menu</p>
    </div>

    <nav class="flex-1 px-3 space-y-2">
      <button v-for="tab in tabs" :key="tab.id"
        class="w-full flex items-center gap-3 px-4 py-3 border-2 shadow-sm rounded-2xl transition-all duration-200"
        :class="activeTab === tab.id
          ? 'bg-primary text-on-primary'
          : 'bg-canvas-cream text-on-surface-variant border-2 shadow-sm border-[#B7D9BC]  hover:border-primary/30'"
        @click="$emit('switch', tab.id)">
        <span class="material-symbols-outlined text-xl" :style="iconStyle(tab.id)">
          {{ tab.icon }}
        </span>
        <span class="font-label-lg">{{ tab.label }}</span>
        <span v-if="activeTab === tab.id" class="ml-auto w-2 h-2 rounded-full bg-white/50"></span>
      </button>
    </nav>

    <div class="p-4 mx-3 mb-4 bg-success-soft rounded-[20px] border-4 border-[#B7D9BC]">
      <div class="flex items-center gap-3">
        <span class="w-8 h-8 rounded-full bg-white border-2 border-[#B7D9BC] flex items-center justify-center text-base">💡</span>
        <div>
          <p class="text-xs font-bold text-primary">Tips Hari Ini</p>
          <p class="text-xs text-on-surface-variant leading-snug mt-0.5">Fokus pada satu hal kecil untuk dampak besar.</p>
        </div>
      </div>
    </div>

    <div class="border-t-4 border-[#B7D9BC]">
      <div class="flex items-center gap-3 px-6 py-4">
        <span class="material-symbols-outlined text-on-surface-variant text-xl">notifications</span>
        <span class="font-label-lg text-on-surface-variant">Notifikasi</span>
        <span class="ml-auto w-5 h-5 rounded-full bg-error text-on-error text-xs font-bold flex items-center justify-center">3</span>
      </div>
    </div>
  </aside>
</template>

<script setup>
const props = defineProps({
  tabs: { type: Array, required: true },
  activeTab: { type: String, required: true },
  userName: { type: String, default: 'Bunda' },
  userGender: { type: String, default: '' }
})

defineEmits(['switch'])

function iconStyle(tabId) {
  return { fontVariationSettings: props.activeTab === tabId ? "'FILL' 1" : "'FILL' 0" }
}
</script>
