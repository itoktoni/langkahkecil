<template>
  <div class="fade-in-up">
    <button @click="$emit('back')"
      class="flex items-center gap-2 text-primary font-label-lg mb-stack-md hover:opacity-80 transition-opacity border border-primary-container px-3 py-1.5 rounded-full">
      <span class="material-symbols-outlined text-xl">arrow_back</span>
      Kembali
    </button>

    <section class="mb-stack-lg">
      <div class="flex items-center gap-3 mb-2">
        <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl" :style="{ background: item.bg }">{{ item.emoji }}</div>
        <div>
          <h2 class="font-headline-lg-mobile text-headline-lg-mobile text-text-main leading-tight">{{ item.title }}</h2>
          <p class="font-body-md text-body-md text-on-surface-variant">{{ item.desc }}</p>
        </div>
      </div>
    </section>

    <!-- STORY TELLING -->
    <div v-if="item.feature === 'story'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="story in item.stories" :key="story.title"
        class="bento-card group bg-white rounded-[28px] soft-shadow overflow-hidden border cursor-pointer transition-all hover:shadow-xl flex flex-col"
        :style="{ borderColor: item.color }"
        @click="openStory(story)">
        <!-- Image -->
        <div class="h-48 overflow-hidden relative shrink-0">
          <img :src="story.image" :alt="story.title" class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          <div class="absolute top-3 right-3 bg-white/90 rounded-full px-3 py-1 text-xs font-bold text-primary">
            {{ story.pages.length }} halaman
          </div>
        </div>
        <!-- Content -->
        <div class="p-5 flex flex-col flex-1">
          <h3 class="font-headline-md text-headline-md mb-2">{{ story.title }}</h3>
          <p class="text-sm text-on-surface-variant mb-3 line-clamp-2">{{ story.desc }}</p>
          <div class="bg-success-soft rounded-xl p-3 mb-3">
            <p class="text-xs text-primary font-bold">💬 {{ story.moral }}</p>
          </div>
          <!-- Footer -->
          <div class="flex items-center gap-2 text-primary font-label-lg mt-auto pt-3 border-t border-outline-variant">
            <span class="material-symbols-outlined text-xl">auto_stories</span>
            Baca Cerita ({{ story.pages.length }} halaman)
            <span class="material-symbols-outlined text-xl ml-auto group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ROLEPLAY -->
    <div v-if="item.feature === 'roleplay'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="rp in item.roles" :key="rp.title"
        class="bento-card group bg-white rounded-[28px] soft-shadow overflow-hidden border cursor-pointer transition-all hover:shadow-xl flex flex-col"
        :style="{ borderColor: item.color }"
        @click="openRoleplay(rp)">
        <!-- Image -->
        <div class="h-48 overflow-hidden relative shrink-0">
          <img :src="rp.image" :alt="rp.title" class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          <div class="absolute top-3 right-3 bg-white/90 rounded-full px-3 py-1 text-xs font-bold text-primary">
            {{ rp.pages.length }} adegan
          </div>
        </div>
        <!-- Content -->
        <div class="p-5 flex flex-col flex-1">
          <h3 class="font-headline-md text-headline-md mb-2">{{ rp.title }}</h3>
          <p class="text-sm text-on-surface-variant mb-3 line-clamp-2">{{ rp.desc }}</p>
          <!-- Roles -->
          <div class="flex gap-2 mb-3">
            <div v-for="role in rp.roles" :key="role.name" class="bg-surface-container-low rounded-xl px-3 py-2 flex items-center gap-1.5">
              <span class="text-lg">{{ role.emoji }}</span>
              <span class="text-xs font-bold text-primary">{{ role.name }}</span>
            </div>
          </div>
          <div class="bg-success-soft rounded-xl p-3 mb-3">
            <p class="text-xs text-primary font-bold">💬 {{ rp.moral }}</p>
          </div>
          <!-- Footer -->
          <div class="flex items-center gap-2 text-primary font-label-lg mt-auto pt-3 border-t border-outline-variant">
            <span class="material-symbols-outlined text-xl">theater_comedy</span>
            Mulai Bermain ({{ rp.pages.length }} adegan)
            <span class="material-symbols-outlined text-xl ml-auto group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </div>
        </div>
      </div>
    </div>

    <!-- GAME -->
    <div v-if="item.feature === 'game'" class="space-y-4">
      <div v-for="game in item.games" :key="game.title" class="bg-white rounded-[28px] p-6 soft-shadow border" :style="{ borderColor: item.color }">
        <h3 class="font-headline-md text-headline-md mb-3">{{ game.title }}</h3>
        <p class="font-body-md text-body-md text-on-surface-variant mb-4">{{ game.how }}</p>
        <div class="bg-surface-container-low rounded-2xl p-4 mb-3">
          <p class="font-label-lg text-label-lg text-primary mb-2">📋 Aturan</p>
          <ul class="space-y-2">
            <li v-for="(rule, i) in game.rules" :key="i" class="flex items-start gap-2 text-sm text-on-surface-variant">
              <span class="material-symbols-outlined text-primary text-lg mt-0.5">check_circle</span>
              {{ rule }}
            </li>
          </ul>
        </div>
        <div class="bg-success-soft rounded-2xl p-4">
          <p class="font-label-lg text-label-lg text-primary mb-1">💬 Pelajaran</p>
          <p class="text-sm text-on-surface-variant">{{ game.moral }}</p>
        </div>
      </div>
    </div>

    <!-- MONOLOG -->
    <div v-if="item.feature === 'monolog'" class="space-y-4">
      <div v-for="sc in item.scripts" :key="sc.title" class="bg-white rounded-[28px] p-6 soft-shadow border" :style="{ borderColor: item.color }">
        <h3 class="font-headline-md text-headline-md mb-3">🎤 {{ sc.title }}</h3>
        <div class="bg-surface-container-low rounded-2xl p-5 mb-4">
          <p class="font-body-md text-body-md text-on-surface-variant italic leading-relaxed">"{{ sc.script }}"</p>
        </div>
        <div class="bg-[#D7EDFF] rounded-2xl p-4">
          <p class="font-label-lg text-label-lg text-on-tertiary-fixed mb-2">💡 Tips</p>
          <ul class="space-y-1.5">
            <li v-for="(tip, i) in sc.tips" :key="i" class="flex items-start gap-2 text-sm text-on-surface-variant">
              <span class="material-symbols-outlined text-tertiary text-lg mt-0.5">lightbulb</span>
              {{ tip }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- PROJECT -->
    <div v-if="item.feature === 'project'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="proj in item.projects" :key="proj.title"
        class="bento-card group bg-white rounded-[28px] soft-shadow overflow-hidden border cursor-pointer transition-all hover:shadow-xl flex flex-col"
        :style="{ borderColor: item.color }"
        @click="openProject(proj)">
        <!-- Image -->
        <div class="h-48 overflow-hidden relative shrink-0">
          <img :src="proj.image" :alt="proj.title" class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          <div class="absolute top-3 right-3 bg-white/90 rounded-full px-3 py-1 text-xs font-bold text-primary">
            {{ proj.duration }}
          </div>
          <div class="absolute bottom-3 left-3 flex items-center gap-2">
            <span class="bg-white/90 rounded-full px-3 py-1 text-xs font-bold" :style="{ color: item.color }">
              {{ proj.difficulty }}
            </span>
          </div>
        </div>
        <!-- Content -->
        <div class="p-5 flex flex-col flex-1">
          <h3 class="font-headline-md text-headline-md mb-2">{{ proj.title }}</h3>
          <p class="text-sm text-on-surface-variant mb-3">{{ proj.desc }}</p>
          <!-- Materials Banner -->
          <div class="bg-surface-container-low rounded-xl p-4 mb-3 border border-outline-variant">
            <p class="font-label-lg text-label-lg text-primary mb-2 flex items-center gap-2">
              <span class="material-symbols-outlined text-lg">inventory_2</span>
              Bahan yang Dibutuhkan
            </p>
            <ul class="space-y-1.5">
              <li v-for="m in proj.materials" :key="m" class="flex items-center gap-2 text-xs text-on-surface-variant">
                <span class="material-symbols-outlined text-sm text-primary">check_box_outline_blank</span>
                {{ m }}
              </li>
            </ul>
          </div>
          <!-- Footer -->
          <div class="flex items-center gap-2 text-primary font-label-lg mt-auto pt-3 border-t border-outline-variant">
            <span class="material-symbols-outlined text-xl">palette</span>
            Mulai Proyek
            <span class="material-symbols-outlined text-xl ml-auto group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </div>
        </div>
      </div>
    </div>

    <!-- MUSIC -->
    <div v-if="item.feature === 'music'" class="space-y-4">
      <div v-for="song in item.songs" :key="song.title" class="bg-white rounded-[28px] p-6 soft-shadow border" :style="{ borderColor: item.color }">
        <h3 class="font-headline-md text-headline-md mb-3">🎵 {{ song.title }}</h3>
        <div class="bg-surface-container-low rounded-2xl p-5 mb-4">
          <p class="font-body-md text-body-md text-on-surface-variant whitespace-pre-line leading-relaxed">{{ song.lyrics }}</p>
        </div>
        <div class="bg-[#D7EDFF] rounded-2xl p-4 mb-3">
          <p class="font-label-lg text-label-lg text-on-tertiary-fixed mb-2">💃 Gerakan</p>
          <ul class="space-y-1.5">
            <li v-for="(move, i) in song.moves" :key="i" class="flex items-start gap-2 text-sm text-on-surface-variant">
              <span class="font-bold text-tertiary shrink-0">{{ i + 1 }}.</span>{{ move }}
            </li>
          </ul>
        </div>
        <div class="bg-success-soft rounded-2xl p-4">
          <p class="font-label-lg text-label-lg text-primary mb-1">💬 Pelajaran</p>
          <p class="text-sm text-on-surface-variant">{{ song.moral }}</p>
        </div>
      </div>
    </div>

    <!-- PUZZLE -->
    <div v-if="item.feature === 'puzzle'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="pz in item.puzzles" :key="pz.title"
        class="bento-card group bg-white rounded-[28px] soft-shadow overflow-hidden border cursor-pointer transition-all hover:shadow-xl flex flex-col"
        :style="{ borderColor: item.color }"
        @click="openPuzzle(pz)">
        <!-- Header -->
        <div class="p-5 pb-3 flex items-center justify-between" :style="{ background: item.bg }">
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl" :style="{ background: 'white' }">🧩</div>
          <span class="bg-white/90 rounded-full px-3 py-1 text-xs font-bold text-primary">
            {{ pz.questions.length }} soal
          </span>
        </div>
        <!-- Content -->
        <div class="p-5 pt-3 flex flex-col flex-1">
          <h3 class="font-headline-md text-headline-md mb-2">{{ pz.title }}</h3>
          <p class="text-sm text-on-surface-variant mb-3">{{ pz.desc }}</p>
          <!-- Footer -->
          <div class="flex items-center gap-2 text-primary font-label-lg mt-auto pt-3 border-t border-outline-variant">
            <span class="material-symbols-outlined text-xl">psychology</span>
            Mulai Teka-Teki
            <span class="material-symbols-outlined text-xl ml-auto group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </div>
        </div>
      </div>
    </div>

    <!-- MINDFULNESS -->
    <div v-if="item.feature === 'mindfulness'" class="space-y-4">
      <div v-for="ex in item.exercises" :key="ex.title" class="bg-white rounded-[28px] p-6 soft-shadow border" :style="{ borderColor: item.color }">
        <h3 class="font-headline-md text-headline-md mb-3">🧘 {{ ex.title }}</h3>
        <ol class="space-y-3 mb-4">
          <li v-for="(step, i) in ex.steps" :key="i" class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0" :style="{ background: item.color }">{{ i + 1 }}</div>
            <p class="font-body-md text-body-md text-on-surface-variant pt-1">{{ step }}</p>
          </li>
        </ol>
        <div class="bg-success-soft rounded-2xl p-4">
          <p class="font-label-lg text-label-lg text-primary mb-1">✨ Manfaat</p>
          <p class="text-sm text-on-surface-variant">{{ ex.benefit }}</p>
        </div>
      </div>
    </div>

    <!-- OUTDOOR -->
    <div v-if="item.feature === 'outdoor'" class="space-y-4">
      <div v-for="act in item.activities" :key="act.title" class="bg-white rounded-[28px] p-6 soft-shadow border" :style="{ borderColor: item.color }">
        <h3 class="font-headline-md text-headline-md mb-3">🌿 {{ act.title }}</h3>
        <ol class="space-y-3 mb-4">
          <li v-for="(step, i) in act.steps" :key="i" class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0" :style="{ background: item.color }">{{ i + 1 }}</div>
            <p class="font-body-md text-body-md text-on-surface-variant pt-1">{{ step }}</p>
          </li>
        </ol>
        <div class="bg-[#D7EDFF] rounded-2xl p-4">
          <p class="font-label-lg text-label-lg text-on-tertiary-fixed mb-1">🔍 Pengamatan</p>
          <p class="text-sm text-on-surface-variant">{{ act.observation }}</p>
        </div>
      </div>
    </div>

    <!-- Story Reader Modal -->
    <StoryReader
      v-if="activeStory"
      :story="activeStory"
      :color="item.color"
      :bg="item.bg"
      @close="activeStory = null" />

    <!-- Roleplay Reader Modal -->
    <RoleplayReader
      v-if="activeRoleplay"
      :roleplay="activeRoleplay"
      :color="item.color"
      :bg="item.bg"
      @close="activeRoleplay = null" />

    <!-- Project Reader Modal -->
    <ProjectReader
      v-if="activeProject"
      :project="activeProject"
      :color="item.color"
      :bg="item.bg"
      @close="activeProject = null" />

    <!-- Puzzle Reader Modal -->
    <PuzzleReader
      v-if="activePuzzle"
      :puzzle="activePuzzle"
      :color="item.color"
      :bg="item.bg"
      @close="activePuzzle = null" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import StoryReader from './StoryReader.vue'
import RoleplayReader from './RoleplayReader.vue'
import ProjectReader from './ProjectReader.vue'
import PuzzleReader from './PuzzleReader.vue'

defineProps({
  item: { type: Object, required: true }
})

defineEmits(['back'])

const activeStory = ref(null)
const activeRoleplay = ref(null)
const activeProject = ref(null)
const activePuzzle = ref(null)

function openStory(story) {
  activeStory.value = story
  history.pushState({ action: 'reader' }, '')
}

function openRoleplay(rp) {
  activeRoleplay.value = rp
  history.pushState({ action: 'reader' }, '')
}

function openProject(proj) {
  activeProject.value = proj
  history.pushState({ action: 'reader' }, '')
}

function openPuzzle(pz) {
  activePuzzle.value = pz
  history.pushState({ action: 'reader' }, '')
}

function goBack() {
  if (activeStory.value) { activeStory.value = null; return true }
  if (activeRoleplay.value) { activeRoleplay.value = null; return true }
  if (activeProject.value) { activeProject.value = null; return true }
  if (activePuzzle.value) { activePuzzle.value = null; return true }
  return false
}

defineExpose({ goBack })
</script>
