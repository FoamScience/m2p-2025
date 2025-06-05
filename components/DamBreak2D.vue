<template>
  <div class="dambreak-container">
    <canvas ref="canvas" width="470" height="350"></canvas>
    <div class="controls" v-if="showControls">
      <div class="controls-grid">
        <div class="button-cell">
          <button @click="toggleSimulation" :class="{ 'start-button': !isRunning }">{{ isRunning ? 'Pause' : 'Start' }}</button>
        </div>
        <div class="button-cell">
          <button @click="reset">Reset</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

// Configuration
// Domain size reduced to 70% of original
const domainSize = ref([4, 3])
const particleSpacing = ref(0.2)
const particleMass = ref(1.0)
const viscosity = ref(0.001)
const gravity = ref([0, -9.81])
const timeStep = ref(0.001)
const showControls = ref(true)

// Canvas and animation refs
const canvas = ref(null)
const ctx = ref(null)
const animationId = ref(null)
const isRunning = ref(false)

// Particle class equivalent to Python code
class Particle {
  constructor(position, velocity, mass, density = 1.0, isBoundary = false) {
    this.position = [...position]
    this.velocity = [...velocity]
    this.mass = mass
    this.density = density
    this.force = [0, 0]
    this.isBoundary = isBoundary
  }
}

// SPH Simulation class equivalent to Python code
class SPHSimulation {
  constructor(domainSize, particleSpacing, particleMass, viscosity, gravity, timeStep) {
    this.domainSize = domainSize
    this.particleSpacing = particleSpacing
    this.particleMass = particleMass
    this.viscosity = viscosity
    this.gravity = [...gravity]
    this.timeStep = timeStep
    this.particles = this.initializeParticles()
  }
  
  initializeParticles() {
    const particles = []
    const boundaryMargin = 0.5
    
    // Internal domain (water particles) - starting at [0.5, 0.5]
    for (let x = boundaryMargin+this.particleSpacing/2; x < 1.5; x += this.particleSpacing) {
      for (let y = boundaryMargin+this.particleSpacing/2; y < 2.3; y += this.particleSpacing) {
        const position = [x, y]
        const velocity = [0, 0]
        particles.push(new Particle(position, velocity, this.particleMass))
      }
    }
    
    // Boundary particles - 0.5 unit band around the entire domain
    // Left boundary
    for (let x = this.particleSpacing; x < boundaryMargin; x += this.particleSpacing) {
      for (let y = this.particleSpacing; y <= this.domainSize[1]; y += this.particleSpacing) {
        const position = [x, y]
        const velocity = [0, 0]
        particles.push(new Particle(position, velocity, this.particleMass, 1.0, true))
      }
    }
    
    // Right boundary
    for (let x = this.domainSize[0] - boundaryMargin+ this.particleSpacing/2; x <= this.domainSize[0]-this.particleSpacing/2; x += this.particleSpacing) {
      for (let y = this.particleSpacing; y <= this.domainSize[1]; y += this.particleSpacing) {
        const position = [x, y]
        const velocity = [0, 0]
        particles.push(new Particle(position, velocity, this.particleMass, 1.0, true))
      }
    }
    
    // Bottom boundary
    for (let x = boundaryMargin+ this.particleSpacing/2; x < this.domainSize[0] - boundaryMargin; x += this.particleSpacing) {
      for (let y = this.particleSpacing; y < boundaryMargin; y += this.particleSpacing) {
        const position = [x, y]
        const velocity = [0, 0]
        particles.push(new Particle(position, velocity, this.particleMass, 1.0, true))
      }
    }
    
    // Top boundary
    for (let x = boundaryMargin + this.particleSpacing/2; x < this.domainSize[0] - boundaryMargin; x += this.particleSpacing) {
      for (let y = this.domainSize[1] - boundaryMargin +this.particleSpacing/2; y <= this.domainSize[1]; y += this.particleSpacing) {
        const position = [x, y]
        const velocity = [0, 0]
        particles.push(new Particle(position, velocity, this.particleMass, 1.0, true))
      }
    }
    
    // Middle barrier
    for (let x = this.domainSize[0]/1.6+this.particleSpacing/2; x < this.domainSize[0]/1.6 + 2 * this.particleSpacing; x += this.particleSpacing) {
      for (let y = boundaryMargin+this.particleSpacing/2; y < 6 * this.particleSpacing; y += this.particleSpacing) {
        const position = [x, y]
        const velocity = [0, 0]
        particles.push(new Particle(position, velocity, this.particleMass, 1.0, true))
      }
    }
    
    return particles
  }
  
  kernel(r) {
    const h = 2 * this.particleSpacing
    const distance = Math.sqrt(r[0]*r[0] + r[1]*r[1])
    const q = distance / h
    
    if (q <= 1) {
      return Math.pow(1 - q, 3)
    } else {
      return 0
    }
  }
  
  kernelGradient(r) {
    const h = 2 * this.particleSpacing
    const distance = Math.sqrt(r[0]*r[0] + r[1]*r[1])
    const q = distance / h
    
    if (q <= 1 && distance > 0) {
      const factor = -3 * Math.pow(1 - q, 2) / (h * distance)
      return [factor * r[0], factor * r[1]]
    } else {
      return [0, 0]
    }
  }
  
  kernelLaplacian(r) {
    const h = 2 * this.particleSpacing
    const distance = Math.sqrt(r[0]*r[0] + r[1]*r[1])
    const q = distance / h
    
    if (q <= 1) {
      return 6 * (1 - q) / (h * h)
    } else {
      return 0
    }
  }
  
  computeDensity() {
    for (const p of this.particles) {
      p.density = 0
      for (const q of this.particles) {
        const r = [p.position[0] - q.position[0], p.position[1] - q.position[1]]
        p.density += q.mass * this.kernel(r)
      }
      // Ensure minimum density to prevent division by zero
      p.density = Math.max(p.density, 0.1)
    }
  }
  
  computeForces() {
    for (const p of this.particles) {
      // Apply gravity
      p.force = [this.gravity[0] * p.mass, this.gravity[1] * p.mass]
      
      // Apply viscosity
      for (const q of this.particles) {
        if (p !== q) {
          const r = [p.position[0] - q.position[0], p.position[1] - q.position[1]]
          const laplacian = this.kernelLaplacian(r)
          
          // Viscosity force
          const vx = (q.velocity[0] - p.velocity[0]) * this.viscosity * laplacian
          const vy = (q.velocity[1] - p.velocity[1]) * this.viscosity * laplacian
          
          p.force[0] += vx
          p.force[1] += vy
        }
      }
    }
  }
  
  computePressureForces() {
    for (const p of this.particles) {
      let pressureForceX = 0
      let pressureForceY = 0
      
      for (const q of this.particles) {
        if (p !== q) {
          const r = [p.position[0] - q.position[0], p.position[1] - q.position[1]]
          const gradient = this.kernelGradient(r)
          
          // Simple pressure model
          const pressure = (p.density + q.density) / 2
          
          pressureForceX += pressure * gradient[0]
          pressureForceY += pressure * gradient[1]
        }
      }
      
      p.force[0] -= pressureForceX
      p.force[1] -= pressureForceY
    }
  }
  
  applyBoundaryConditions(p) {
    for (const q of this.particles) {
      if (q.isBoundary) {
        const r = [p.position[0] - q.position[0], p.position[1] - q.position[1]]
        const distance = Math.sqrt(r[0]*r[0] + r[1]*r[1])
        
        if (distance < this.particleSpacing && distance > 0) {
          // Calculate normal vector
          const nx = r[0] / distance
          const ny = r[1] / distance
          
          // Check if particle is moving towards boundary
          const dotProduct = p.velocity[0] * nx + p.velocity[1] * ny
          
          if (dotProduct < 0) {
            // Reflect velocity component along normal
            p.velocity[0] -= dotProduct * nx
            p.velocity[1] -= dotProduct * ny
          }
        }
      }
    }
    
    // Simple domain boundary check
    if (p.position[0] < 0) {
      p.position[0] = 0
      p.velocity[0] = Math.abs(p.velocity[0]) * 0.5  // Dampen bounce
    }
    if (p.position[0] > this.domainSize[0]) {
      p.position[0] = this.domainSize[0]
      p.velocity[0] = -Math.abs(p.velocity[0]) * 0.5  // Dampen bounce
    }
    if (p.position[1] < 0) {
      p.position[1] = 0
      p.velocity[1] = Math.abs(p.velocity[1]) * 0.5  // Dampen bounce
    }
    if (p.position[1] > this.domainSize[1]) {
      p.position[1] = this.domainSize[1]
      p.velocity[1] = -Math.abs(p.velocity[1]) * 0.5  // Dampen bounce
    }
  }
  
  updateVelocities() {
    for (const p of this.particles) {
      if (!p.isBoundary) {
        // Update velocity using force and density (F = ma, so a = F/m, and v += a*dt)
        p.velocity[0] += this.timeStep * p.force[0] / p.density
        p.velocity[1] += this.timeStep * p.force[1] / p.density
        
        // Apply boundary conditions
        this.applyBoundaryConditions(p)
      }
    }
  }
  
  updatePositions() {
    for (const p of this.particles) {
      if (!p.isBoundary) {
        // Update position based on velocity (p += v*dt)
        p.position[0] += this.timeStep * p.velocity[0]
        p.position[1] += this.timeStep * p.velocity[1]
      }
    }
  }
  
  step() {
    this.computeDensity()
    this.computeForces()
    this.computePressureForces()
    this.updateVelocities()
    this.updatePositions()
  }
}

// Simulation instance
let simulation = null

// Animation and rendering functions
function drawParticles() {
  if (!ctx.value || !simulation) return
  
  const scale = Math.min(
    canvas.value.width / domainSize.value[0],
    canvas.value.height / domainSize.value[1]
  )
  
  // Clear canvas
  ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
  
  // Draw domain boundaries
  ctx.value.strokeStyle = '#333'
  ctx.value.lineWidth = 2
  ctx.value.strokeRect(0, 0, domainSize.value[0] * scale, domainSize.value[1] * scale)
  
  // Draw particles
  for (const p of simulation.particles) {
    const x = p.position[0] * scale
    const y = canvas.value.height - p.position[1] * scale  // Flip Y axis
    
    if (p.isBoundary) {
      ctx.value.fillStyle = '#777'  // Gray for boundary particles
    } else {
      // Color based on velocity magnitude
      const velMag = Math.sqrt(p.velocity[0]*p.velocity[0] + p.velocity[1]*p.velocity[1])
      const r = Math.min(255, Math.floor(velMag * 25))
      const g = Math.min(255, Math.floor(150 - velMag * 5))
      const b = Math.min(255, Math.floor(255 - velMag * 10))
      ctx.value.fillStyle = `rgb(${r}, ${g}, ${b})`
    }
    
    // Draw the particle with half the radius
    ctx.value.beginPath()
    ctx.value.arc(x, y, particleSpacing.value * scale / 4, 0, Math.PI * 2)
    ctx.value.fill()
    
    // Draw velocity vector for internal particles
    if (!p.isBoundary) {
      const velMag = Math.sqrt(p.velocity[0]*p.velocity[0] + p.velocity[1]*p.velocity[1])
      if (velMag > 0.01) { // Only draw if velocity is significant
        // Scale vector to make it visible
        const vectorScale = 5
        const endX = x + p.velocity[0] * vectorScale
        const endY = y - p.velocity[1] * vectorScale  // Note: Y is flipped
        
        // Draw line with transparency
        ctx.value.beginPath()
        ctx.value.moveTo(x, y)
        ctx.value.lineTo(endX, endY)
        ctx.value.strokeStyle = 'rgba(255, 255, 255, 0.6)'  // White with 60% opacity
        ctx.value.lineWidth = 1
        ctx.value.stroke()
      }
    }
  }
}

function animate() {
  if (isRunning.value && simulation) {
    simulation.step()
  }
  
  drawParticles()
  animationId.value = requestAnimationFrame(animate)
}

// Setup and lifecycle functions
function initSimulation() {
  simulation = new SPHSimulation(
    domainSize.value,
    particleSpacing.value,
    particleMass.value,
    viscosity.value,
    gravity.value,
    timeStep.value
  )
}

function toggleSimulation() {
  isRunning.value = !isRunning.value
}

function reset() {
  isRunning.value = false
  initSimulation()
  drawParticles()
}

// Watch for parameter changes
watch([viscosity, gravity, timeStep], ([newViscosity, newGravity, newTimeStep]) => {
  if (simulation) {
    simulation.viscosity = newViscosity
    simulation.gravity = newGravity
    simulation.timeStep = newTimeStep
  }
})

onMounted(() => {
  if (canvas.value) {
    ctx.value = canvas.value.getContext('2d')
    
    // Initialize simulation but don't auto-start
    initSimulation()
    isRunning.value = false
    animate()
  }
})

onUnmounted(() => {
  if (animationId.value) {
    cancelAnimationFrame(animationId.value)
  }
})
</script>

<style scoped>
.dambreak-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

canvas {
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  max-width: 100%;
  max-height: 80vh;
}

.controls {
  margin-top: 1rem;
  width: 100%;
  max-width: 600px;
}

.controls-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  align-items: center;
}

.button-cell {
  display: flex;
  justify-content: center;
}

.control-cell {
  grid-column: span 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

button {
  background-color: #4a8fe7;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  max-width: 150px;
}

button:hover {
  background-color: #3a7fd7;
}

.start-button {
  background-color: #4caf50;
}

.start-button:hover {
  background-color: #3d8b40;
}

label {
  text-align: center;
  margin-bottom: 0.25rem;
}

input[type="range"] {
  width: 100%;
  max-width: 300px;
}
</style>
