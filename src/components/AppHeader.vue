<template>
  <header
    class="w-full top-0 sticky z-40 bg-canvas-cream flex justify-between items-center px-margin-mobile md:px-margin-desktop py-stack-md lg:hidden">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
        <img alt="Profil Bunda" class="w-full h-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzJNpRkogQwczNStctNhENEVUYGd8K9gvJsJHTF4dEc8EJ0f7gqUIejr4bQpYMLUPW5IXczrErhaApGFrTVwP_x6ydST_7zIETJf3sBbPA_SJkfU6g7oBaRxYDJiZEVtiDkwNnpiHti6_c1CUO8EyBmmilPhrfKepTN-4SeBHs_ll75dnAePuOcw-mydodKV12Zwo6rVBVVPdjjo1ZFFuREjTkuDmc4lifG7lewY_DLtHTp4RUKAG66H77zbFeqqZi-xuHnx8k2Ew">
      </div>
      <h1 class="font-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-text-main">{{ title }}</h1>
    </div>
    <button
      class="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white shadow-sm text-primary hover:opacity-80 transition-opacity duration-200">
      <span class="material-symbols-outlined">notifications</span>
    </button>
  </header>
</template>

<script setup>
defineProps({
  title: { type: String, default: 'Halo Bunda 👋' }
})
</script>
