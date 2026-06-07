<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div v-for="rp in roles" :key="rp.title"
      class="bento-card group bg-white rounded-[28px] soft-shadow overflow-hidden border cursor-pointer transition-all hover:shadow-xl flex flex-col"
      :style="{ borderColor: color }"
      @click="$emit('open-roleplay', rp)">
      <div class="h-48 overflow-hidden relative shrink-0">
        <img :src="rp.image" :alt="rp.title" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        <div class="absolute top-3 right-3 bg-white/90 rounded-full px-3 py-1 text-xs font-bold text-primary">
          {{ rp.pages.length }} adegan
        </div>
      </div>
      <div class="p-5 flex flex-col flex-1">
        <h3 class="font-headline-md text-headline-md mb-2">{{ rp.title }}</h3>
        <p class="text-sm text-on-surface-variant mb-3 line-clamp-2">{{ rp.desc }}</p>
        <div class="flex gap-2 mb-3">
          <div v-for="role in rp.roles" :key="role.name" class="bg-surface-container-low rounded-xl px-3 py-2 flex items-center gap-1.5">
            <span class="text-lg">{{ role.emoji }}</span>
            <span class="text-xs font-bold text-primary">{{ role.name }}</span>
          </div>
        </div>
        <div class="bg-success-soft rounded-xl p-3 mb-3">
          <p class="text-xs text-primary font-bold">💬 {{ rp.moral }}</p>
        </div>
        <div class="flex items-center gap-2 text-primary font-label-lg mt-auto pt-3 border-t border-outline-variant">
          <span class="material-symbols-outlined text-xl">theater_comedy</span>
          Mulai Bermain ({{ rp.pages.length }} adegan)
          <span class="material-symbols-outlined text-xl ml-auto group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  roles: { type: Array, required: true },
  color: { type: String, default: '#FF9800' }
})
defineEmits(['open-roleplay'])
</script>
