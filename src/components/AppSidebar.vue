<template>
  <aside class="desktop-sidebar fixed left-0 top-0 h-full w-[280px] z-50 flex flex-col border-r border-outline-variant"
    style="background: #F0EDE8; box-shadow: 2px 0 12px rgba(0,0,0,0.04);">
    <div class="p-6 pb-4">
      <div class="flex items-center gap-3 bg-white rounded-2xl p-4 soft-shadow">
        <div class="w-12 h-12 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
          <img alt="Profil Bunda" class="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzJNpRkogQwczNStctNhENEVUYGd8K9gvJsJHTF4dEc8EJ0f7gqUIejr4bQpYMLUPW5IXczrErhaApGFrTVwP_x6ydST_7zIETJf3sBbPA_SJkfU6g7oBaRxYDJiZEVtiDkwNnpiHti6_c1CUO8EyBmmilPhrfKepTN-4SeBHs_ll75dnAePuOcw-mydodKV12Zwo6rVBVVPdjjo1ZFFuREjTkuDmc4lifG7lewY_DLtHTp4RUKAG66H77zbFeqqZi-xuHnx8k2Ew">
        </div>
        <div>
          <h2 class="font-headline-md text-headline-md text-text-main">Halo {{ userName }}!</h2>
          <p class="text-sm text-on-surface-variant">Selamat datang</p>
        </div>
      </div>
    </div>

    <div class="px-4 mb-2">
      <p class="text-xs font-bold text-on-surface-variant uppercase tracking-wider px-3">Menu</p>
    </div>

    <nav class="flex-1 px-3 space-y-2">
      <button v-for="tab in tabs" :key="tab.id"
        class="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200"
        :class="activeTab === tab.id
          ? 'bg-[#2E7D32] text-white shadow-lg shadow-green-900/20'
          : 'bg-white text-on-surface-variant hover:shadow-md hover:shadow-black/5'"
        @click="$emit('switch', tab.id)">
        <span class="material-symbols-outlined text-xl" :style="iconStyle(tab.id)">
          {{ tab.icon }}
        </span>
        <span class="font-label-lg">{{ tab.label }}</span>
        <span v-if="activeTab === tab.id" class="ml-auto w-2 h-2 rounded-full bg-white/50"></span>
      </button>
    </nav>

    <div class="p-4 mx-3 mb-4 bg-success-soft rounded-2xl border border-primary-container">
      <div class="flex items-center gap-3">
        <span class="material-symbols-outlined text-primary text-xl">lightbulb</span>
        <div>
          <p class="text-xs font-bold text-primary">Tips Hari Ini</p>
          <p class="text-xs text-on-surface-variant leading-snug mt-0.5">Fokus pada satu hal kecil untuk dampak besar.</p>
        </div>
      </div>
    </div>

    <div class="border-t border-outline-variant">
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
  userName: { type: String, default: 'Bunda' }
})

defineEmits(['switch'])

function iconStyle(tabId) {
  return { fontVariationSettings: props.activeTab === tabId ? "'FILL' 1" : "'FILL' 0" }
}
</script>
