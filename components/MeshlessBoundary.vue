<template>
  <div class="grid grid-cols-2 gap-6 p-4">
    <!-- Mesh Connectivity (Boundary Conditions) -->
    <div class="flex flex-col items-center">
      <svg viewBox="0 0 200 200" class="w-full max-w-xs">
        <!-- Grid Lines -->
        <g class="grid-ln" stroke-width="1">
          <line v-for="y in meshCoords" :key="'h'+y" :x1="20" :y1="y" :x2="180" :y2="y" />
          <line v-for="x in meshCoords" :key="'v'+x" :x1="x" :y1="20" :x2="x" :y2="180" />
        </g>

        <!-- Boundary Highlight -->
        <g class="boundary" stroke-width="4">
          <line x1="20" y1="20" x2="180" y2="20" />
          <line x1="180" y1="20" x2="180" y2="180" />
          <line x1="180" y1="180" x2="20" y2="180" />
          <line x1="20" y1="180" x2="20" y2="20" />
        </g>

        <!-- Points -->
        <g class="grid-dot">
          <circle
            v-for="(pt, idx) in meshPoints"
            :key="idx"
            :cx="pt[0]"
            :cy="pt[1]"
            r="3"
          />
        </g>
      </svg>
      <p class="mt-2 text-sm text-center text-gray-600">
        Clearly defined boundary elements → easy to apply BCs.
      </p>
    </div>

    <!-- Meshless Sampling with Ghost Particle Boundary -->
    <div class="flex flex-col items-center">
      <svg viewBox="0 0 200 200" class="w-full max-w-xs">
        <!-- Internal points -->
        <g class="meshless">
          <circle
            v-for="(pt, idx) in points"
            :key="'in'+idx"
            :cx="pt[0]"
            :cy="pt[1]"
            r="2.5"
          />
        </g>

        <!-- Ghost boundary -->
        <g class="ghost">
          <circle
            v-for="(pt, idx) in ghostPoints"
            :key="'ghost'+idx"
            :cx="pt[0]"
            :cy="pt[1]"
            r="2.5"
          />
        </g>

        <!-- Stencil circles -->
        <g class="grad-stroke" stroke-width="2" marker-end="url(#arrow2)">
          <circle
            v-for="(pt, idx) in meshlessGradientPts"
            :key="i"
            :cx="pt[0]"
            :cy="pt[1]"
            r="25"
          />
        </g>
      </svg>
      <p class="mt-2 text-sm text-center text-gray-600">
        No natural boundary → ghost particles surround the domain to stabilize BCs.
      </p>
    </div>
  </div>
</template>

<script setup>
const meshCoords = [20, 60, 100, 140, 180]
const meshPoints = []
for (const x of meshCoords) {
  for (const y of meshCoords) {
    meshPoints.push([x, y])
  }
}

// Random points inside domain
const points = Array.from({ length: 100 }, () => [
  30 + Math.random() * 140,
  30 + Math.random() * 140,
])

// Generate 3-layer ghost boundary around domain
const ghostPoints = []
const spacing = 10
const domainMin = 30
const domainMax = 170

for (let layer = 1; layer <= 2; layer++) {
  const offset = layer * spacing
  const rMin = domainMin - offset
  const rMax = domainMax + offset

  for (let x = rMin; x <= rMax; x += spacing) {
    ghostPoints.push([x, rMin])
    ghostPoints.push([x, rMax])
  }

  for (let y = rMin + spacing; y <= rMax - spacing; y += spacing) {
    ghostPoints.push([rMin, y])
    ghostPoints.push([rMax, y])
  }
}

const meshlessGradientPts = [
  [30, 30, 12, -30],
]
</script>

<style scoped>
.grid-ln {
  stroke: var(--slidev-theme-secondary);
}
.grid-dot {
  fill: var(--slidev-theme-primary);
}
.boundary {
  stroke: var(--slidev-theme-warn);
}
.meshless {
  fill: var(--slidev-theme-primary);
}
.ghost {
  fill: var(--slidev-theme-warn);
  fill-opacity: 0.5;
}
.grad {
  stroke: var(--slidev-theme-warn);
  fill: var(--slidev-theme-warn);
}
.grad-stroke {
  stroke: var(--slidev-theme-warn);
  fill-opacity: 0;
}
</style>
