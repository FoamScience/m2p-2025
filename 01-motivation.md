---
transition: fade-out
layout: two-cols
---

# Motivating mesh-free methods for CFD

<br/>

- Mesh-based methods come with some headache
  1. Excessive computational meshing costs
  1. Heavy dependence on mesh quality
  1. Some industries moving towards NURBS

<br/>
<v-clicks at="1">

- Common concerns about going meshless:
  1. Mesh connectivity eases gradient computations 
  1. More sampling points required to match FVM/FEM accuracy

</v-clicks>

::right::

<br/>
<br/>
<br/>

<v-clicks at="1">
<MeshComparison />
</v-clicks>

---
transition: fade-out
layout: two-cols
hideInToc: true
---

# Motivating mesh-free methods for CFD

<br/>

- Boundary Condition Complexity
  1. No natural "boundary faces" to apply constraints
  1. Many meshless software pieces will use <ins>ghost particles</ins> for boundary stability
  1. Or Lagrangian multipliers with penalty methods
- But this can be turned into strength when handling free-surface flows

<br/>

<v-clicks>

</v-clicks>

::right::

<br/>
<br/>
<br/>

<MeshlessBoundary />

---
transition: fade-in
---

# Meshless methods 101

<Kernel />

<Arrow v-bind="{ x1:438, y1:205, x2:400, y2:250 }" color="var(--slidev-theme-warn)" />
<Arrow v-bind="{ x1:320, y1:180, x2:410, y2:180 }" color="var(--slidev-theme-warn)" />

$$F(x_i) = \sum_j{F_j \frac{m_j}{\rho_j} W_{ij}}, \quad \rho(x_i) = \sum_j{m_jW_{ij}}$$

Approximating $F$ derivatives shifts to the kernel function $W$ in simple cases, although very unstable
