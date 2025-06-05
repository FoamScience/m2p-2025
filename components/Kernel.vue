<script setup>
// Parameters for the right ellipse
const cx = 450;
const cy = 70;
const rx = 90;
const ry = 50;

// Generate random points **inside** ellipse
const numInteriorPoints = 140;
const interiorPoints = Array.from({ length: numInteriorPoints }, () => {
  let x, y;
  do {
    x = cx + (Math.random() - 0.5) * 2 * rx;
    y = cy + (Math.random() - 0.5) * 2 * ry;
  } while (((x - cx) ** 2) / (rx ** 2) + ((y - cy) ** 2) / (ry ** 2) > 1);
  return { x, y };
});

// Generate points **on the boundary** of the ellipse
const numBoundaryPoints = 30;
const boundaryPoints = Array.from({ length: numBoundaryPoints }, (_, i) => {
  const theta = (2 * Math.PI * i) / numBoundaryPoints;
  const x = cx + rx * Math.cos(theta);
  const y = cy + ry * Math.sin(theta);
  return { x, y };
});

const allPoints = [...interiorPoints, ...boundaryPoints];
</script>

<template>
  <div class="p-4">
    <svg width="700" height="250">
      <!-- Continuous Domain (Left Ellipse) -->
      <ellipse cx="150" cy="70" rx="90" ry="50" fill="var(--slidev-theme-primary)" stroke="var(--slidev-theme-primary)" />
      <text x="130" y="70" fill="#fff">F(x)</text>

      <!-- All Points (interior + boundary) -->
      <circle
        v-for="(pt, i) in allPoints"
        :key="i"
        :cx="pt.x"
        :cy="pt.y"
        r="3"
        fill="var(--slidev-theme-primary)"
      />

      <circle
        key="particle"
        :cx="300"
        :cy="180"
        r="40"
        fill="var(--slidev-theme-primary)"
      />

      <text x="270" y="180" fill="#fff">m_i, F_i</text>

      <circle
        key="kernel"
        :cx="cx+rx"
        :cy="cy"
        r="30"
        stroke="var(--slidev-theme-warn)"
        fill="none"
      />
      <svg width="80" height="64"  x="570" y="39" >
        <g transform="rotate(90, 40, 32)">
        <path d="M 0 80 C 36.4 47.2, 18 -3.2, 40 0" stroke="var(--slidev-theme-warn)" fill="none" stroke-width="2" />
        <path d="M 40 0 C 62 -3.2, 43.6 47.2, 80 80" stroke="var(--slidev-theme-warn)" fill="none" stroke-width="2" />
        </g>
      </svg>

      <text x="590" y="39" fill="var(--slidev-theme-primary)">W</text>
    </svg>
  </div>
</template>
