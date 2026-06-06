<template>
  <div class="px-margin-mobile md:px-margin-desktop mt-stack-md max-w-2xl mx-auto">
    <h2 class="font-headline-md text-headline-md mb-stack-lg text-center">Point</h2>
    <div class="relative bg-white rounded-[40px] p-6 md:p-8 soft-shadow flex flex-col items-center overflow-hidden min-h-[360px] justify-center">
      <div class="absolute top-0 w-full h-32 bg-gradient-to-b from-yellow-50 to-transparent"></div>
      <div class="relative z-10 flex flex-col items-center mt-auto">
        <div class="text-7xl md:text-8xl mb-2 animate-bounce">🌱</div>
        <div class="w-32 h-4 bg-secondary-fixed-dim/30 rounded-full blur-md"></div>
        <div class="mt-8 text-center">
          <h3 class="font-headline-md text-primary mb-2">Benih Kebaikan</h3>
          <p class="text-on-surface-variant font-body-md max-w-[240px] mx-auto">
            Lakukan tantangan hari ini untuk menyiram bungamu hingga mekar!
          </p>
        </div>
      </div>
      <div class="mt-8 flex gap-3">
        <div class="flex flex-col items-center">
          <div class="w-14 h-14 rounded-full border-4 border-growth-green flex items-center justify-center text-growth-green font-bold text-lg">120</div>
          <span class="text-[10px] font-bold text-on-surface-variant mt-1 uppercase tracking-wider">Total Poin</span>
        </div>
      </div>
    </div>
    <div class="mt-stack-lg grid grid-cols-2 gap-4 mb-8 max-w-sm mx-auto">
      <div class="bg-white p-6 rounded-[32px] soft-shadow text-center">
        <p class="text-sm text-on-surface-variant mb-1">Misi Selesai</p>
        <p class="font-headline-md text-growth-green">8</p>
      </div>
      <div class="bg-white p-6 rounded-[32px] soft-shadow text-center">
        <p class="text-sm text-on-surface-variant mb-1">Level</p>
        <p class="font-headline-md text-secondary">Tunas</p>
      </div>
    </div>
  </div>
</template>
