---
hideInToc: True
layout: two-cols
transition: fade-in
---

# A case study, striding on water

<br/>
<img width="420px" src="/images/StriderSetup.png" style="clip-path: inset(60% 0 0 0);" />

::right::

<br/> <br/> <br/> <br/>

**Fluid region**, with Weakly Compressible SPH

- EOS: $p = p_0 + B((\frac{\rho}{\rho_0})^{\gamma} - 1)$
- Navier-Stocks for density and momentum
- Equations are integrated and solved for; separately from other components
- Only the maximal `TimeStep length` is dictated by a controller component

---
hideInToc: True
transition: fade-in
---

# A case study, striding on water

A few words on some WCSPH properties

The Quintic Spline kernel:
$$
  W(r, h) = \alpha_n \times
  \begin{cases}
  (3 - \frac{r}{h})^5 - 6(2 - \frac{r}{h})^5 + 15(1 - \frac{r}{h})^5, & 0 \leq \frac{r}{h} < 1 \\
  (3 - \frac{r}{h})^5 - 6(2 - \frac{r}{h})^5, & 1 \leq \frac{r}{h} < 2 \\
  (3 - \frac{r}{h})^5, & 2 \leq \frac{r}{h} < 3 \\
  0, & \frac{r}{h} \geq 3
  \end{cases}
$$

Notable properties:

- Large support radius
- Smoother pressure gradients (through $C^4$ continuity)

---
hideInToc: True
layout: two-cols
transition: fade-in
---

# A case study, striding on water

<br/>
<img width="420px" src="/images/StriderSetup.png" />

::right::

<br/>

<Arrow v-bind="{ x1:370, y1:250, x2:370, y2:210 }" color="var(--slidev-theme-primary)" />

<mdi-robot-angry class="text-3xl mx-2" style="position: absolute; top:120px; left:350px; color: var(--slidev-theme-primary);" />

**Rigid body** moments and motions are integrated with an RK2 algorithm.

Using a **skeletonized** strider body to ease controlling the strider through a behavioral tree algorithm.
  - Animate middle legs following a prescribed motion.
  - With a prescribed velocity, that mimics a realistic strider stroke.

An **FSI interface** component
  - Applies hydrophobic properties to strider legs
  - Transmits fluid forces on strider body to the skeleton (still in development)

---
hideInToc: True
layout: two-cols
transition: fade-in
---

# A case study, striding on water

<br/>

Leg speed and motion curve are optimized so that the strider applies 80 dynes/cm
of force on water surface (max. before penetration is 140 dynes/cm)
