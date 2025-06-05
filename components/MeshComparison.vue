<template>
  <div class="grid grid-cols-2 gap-6 p-4">
    <!-- Mesh Connectivity -->
    <div class="flex flex-col items-center">
      <svg viewBox="0 0 200 200" class="w-full max-w-xs">
        <!-- Grid Lines -->
        <g class="grid-ln" stroke-width="1">
          <line v-for="y in meshCoords" :key="'h'+y" :x1="20" :y1="y" :x2="180" :y2="y" />
          <line v-for="x in meshCoords" :key="'v'+x" :x1="x" :y1="20" :x2="x" :y2="180" />
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

        <!-- Gradient Arrows (simple centered example) -->
        <g class="grad" stroke-width="2" marker-end="url(#arrow)">
          <line x1="100" y1="100" x2="140" y2="100" />
          <line x1="100" y1="100" x2="100" y2="60" />
        </g>
        <defs>
          <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" class="grad" />
          </marker>
        </defs>
      </svg>
      <p class="mt-2 text-sm text-center text-gray-600">
        Neighbor indices are known/cached → gradients are "direct" and efficient.
      </p>
    </div>

    <!-- Meshless Sampling -->
    <div class="flex flex-col items-center">
      <svg viewBox="0 0 200 200" class="w-full max-w-xs">
        <!-- Points -->
        <g class="meshless">
          <circle
            v-for="(pt, idx) in points"
            :key="idx"
            :cx="pt[0]"
            :cy="pt[1]"
            r="2.5"
          />
        </g>

        <!-- Gradient Arrows -->
        <g class="grad" stroke-width="2" marker-end="url(#arrow2)">
          <line v-for="(pt, i) in meshlessGradientPts" :key="i"
                :x1="pt[0]" :y1="pt[1]"
                :x2="pt[0] + pt[2]" :y2="pt[1] + pt[3]" />
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

        <defs>
          <marker id="arrow2" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" class="grad" />
          </marker>
        </defs>
      </svg>
      <p class="mt-2 text-sm text-center text-gray-600">
        Neighbors must be searched & weighted → complex, less stable gradient estimation.
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

// Meshless points
const points = Array.from({ length: 100 }, () => [
  20 + Math.random() * 160,
  20 + Math.random() * 160,
])

// Sample a few gradient directions (dx, dy) for visual clarity
const meshlessGradientPts = [
  [60, 80, 12, -30],
  [100, 130, -8, 25],
  [150, 60, -40, -10],
]
</script>

<style scoped>
.grid-ln {
  stroke: var(--slidev-theme-secondary);
}
.grid-dot {
  fill: var(--slidev-theme-primary);
}
.grad {
  stroke: var(--slidev-theme-warn);
  fill: var(--slidev-theme-warn);
}
.grad-stroke {
  stroke: var(--slidev-theme-warn);
  fill-opacity: 0;
}
.meshless {
  stroke: var(--slidev-theme-primary);
  fill: var(--slidev-theme-primary);
}
</style>
