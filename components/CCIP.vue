<template>
  <div class="flex justify-center items-center w-full max-w-7xl">
    <div class="flex flex-col items-center h-full">
      <svg viewBox="-10 -10 400 400" class="w-full max-w-5xl">
        <!-- Fluid Points (left side) -->
        <g class="fluid">
          <circle
            v-for="(pt, idx) in fluidPoints"
            :key="'f'+idx"
            :cx="pt[0]"
            :cy="pt[1]"
            r="3.5"
          />
        </g>

        <!-- Interface Line -->
        <line x1="210" y1="-10" x2="210" y2="250" stroke="var(--slidev-theme-warn)" stroke-dasharray="50 10" stroke-width="2" />
        <text x="210" y="280" fill="var(--slidev-theme-warn)" text-anchor="middle" >
          <tspan x="210" dy="0">Interface</tspan>
        </text>
        <text x="270" y="300" fill="var(--slidev-theme-secondary)" text-anchor="start" >
          <tspan x="270" dy="0">Solid</tspan>
          <tspan x="270" dy="1.4em" text-achor="left">- Physics</tspan>
          <tspan x="270" dy="1.4em" text-achor="left">- BoundingBox</tspan>
        </text>
        <text x="150" y="300" fill="var(--slidev-theme-primary)" text-anchor="end" >
          <tspan x="150" dy="0">Fluid</tspan>
          <tspan x="150" dy="1.4em" text-achor="left">- Physics</tspan>
          <tspan x="150" dy="1.4em" text-achor="left">- BoundingBox</tspan>
        </text>

        <!-- Solid Points (right side) -->
        <g class="solid">
          <circle
            v-for="(pt, idx) in solidPoints"
            :key="'s'+idx"
            :cx="pt[0]"
            :cy="pt[1]"
            r="3.5"
          />
        </g>
      </svg>
    </div>
  </div>
</template>

<script setup>
// Fluid points (left side)
const fluidPoints = Array.from({ length: 100 }, () => [
  Math.random() * 200,
  Math.random() * 200,
])

// Solid points (right side, dense and packed near interface)
const solidPoints = []
for (let x = 230; x <= 340; x += 25) {
  for (let y = 0; y <= 200; y += 20) {
    solidPoints.push([x, y])
  }
}
</script>

<style scoped>
.fluid {
  stroke: var(--slidev-theme-primary);
  fill: var(--slidev-theme-primary);
}
.solid {
  stroke: var(--slidev-theme-secondary);
  fill: var(--slidev-theme-secondary);
}
.handshake-ok {
  fill: var(--slidev-theme-primary);
}
</style>

