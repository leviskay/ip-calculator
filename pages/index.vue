<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold text-gray-900">
          IP Calculator для обучения
        </h1>
      </div>
    </header>

    <main>
      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          <div class="flex flex-col md:flex-row gap-6">
            <!-- Левая колонка с теорией -->
            <div class="md:w-1/2">
              <TheorySection />
            </div>
            
            <!-- Правая колонка с калькулятором -->
            <div class="md:w-1/2">
              <IpCalculator />
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import TheorySection from '~/components/TheorySection.vue'
import IpCalculator from '~/components/IpCalculator.vue'
</script>
