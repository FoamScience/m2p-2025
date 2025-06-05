---
transition: fade-out
layout: two-cols
---

# Is it only about SPH?

Current implementation status for different meshless methods in MeshlessFlow

```mermaid {scale: 0.6}
mindmap
    root((Meshless <br/> journey))
      1 - Field Approximation with kernels
          RBFs with compact support: SPH, GMF
          Wighted Least Squares: DEM, FPM, GMF
      2 - Discretize PDEs
        Strong form PDE: SPH, FPM, GMF
        Weak form PDE: DEM, GMF
      3 - section Impose BCs
        Ghost cells behind boundary: SPH, FPM, GMF
        Modified kernels around boundaries: SPH
        Lagrangian modifiers with penalties: DEM, GMF
      4 - section Assemble global system of equations
        Linear system matrix:  SPH, DEM, FPM, GMF
```


::right::

<br/> <br/>

Strong form solutions mostly follow <Citation citeKey="Slak2021" position="left" citeElevation="bottom-12" />;<br/>
for an extensive overview: <Citation citeKey="Li2013" position="right" citeElevation="bottom-12" />


---
transition: fade-in
layout: center
---

# What's next?


- More SPHERIC Grand challenges: Established validation cases
- Full Parallelization
- User Interface
- Coupling with OpenFOAM FVM-based solvers
