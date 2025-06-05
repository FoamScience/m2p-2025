---
theme: default
fonts:
  sans: Funnel Sans
  mono: Fira Mono
title: "Towards An OpenFOAM-Based Framework For Meshless Simulations"
titleTemplate: "%s"
author: Mohammed Elwardi Fadeli
keywords: presentation,slidev,slides,latex
info: |
  SPH on steroids
drawings:
  persist: false
transition: slide-left
mdc: true
exportFilename: m2p-2025
export:
  format: pdf
  timeout: 30000
  dark: false
  withClicks: false
  withToc: true
trueslash: false
lineNumbers: true
monaco: true
aspectRatio: 16/9

themeConfig:
  logo: "images/nhr-tu-logo.png"
  darkLogo: "images/nhr-tu-dark-logo.png"
  logoWidth: 180
  github: https://github.com/FoamScience
  footer: M2P - Valencia, Spain
  date: June 2025
seoMeta:
  ogImage: "https://foamscience.github.io/m2p-2025/images/thumbnail.png"
  ogUrl: "https://foamscience.github.io/slidev-template"
  twitterImage: "https://foamscience.github.io/m2p-2025/images/thumbnail.png"
download: https://foamscience.github.io/m2p-2025/m2p-2025.pdf
addons:
  - slidev-addon-python-runner
  - slidev-addon-tikzjax
python:
  loadPackagesFromImports: true
  suppressDeprecationWarnings: true
  alwaysReload: false
  loadPyodideOptions: {}

class: text-center
hideInToc: true
layout: statement
---

# Towards An OpenFOAM-Based Framework For Meshless Simulations

<br/> Composable meshless multi-physics <br/> <br/> Mohammed Elwardi Fadeli*, Holger Marschall - TU Darmstadt

---
transition: fade-out
layout: center
hideInToc: true
---

# Table of Content

<Toc maxDepth=3 />


---
src: 01-motivation.md
---

---
src: 02-meshless.md
---

---
src: 03-generic.md
---

---
layout: center
class: text-center
hideInToc: true
---

# Thank you for your attention

[GitHub](https://github.com/FoamScience/slidev-template) · [More stuff like this](https://github.com/FoamScience)

---
transition: fade-in
class: text-left
hideInToc: true
---

# Technical notes

Most important framework features:

Highly configurable, easily testable code
(Shape discretization from <Citation citeKey="Slak2019" position="right" citeElevation="bottom-105" />)

```cpp
// Type-agnostic, gets standard shape config, 0-runtime-cost
auto geoConfig = Reflect::schema<shape>("STLShape"); // STLShape is a "shape"
// Do stuff with geoConfig: GUI? LLM?
auto geo = shape::New(geoConfig);
// Works with more construction args too
auto discConfig = Reflect::schema<discretization>("Slak2019"); // STLShape is a "shape"
auto disc = discretization::New(discConfig, shape);
```

Symbolic assembly of matrices

```cpp
// only a "meta" assembly
auto eq = exp::div(phi) + laplacian(D, phi) + src
// physics component is free to solve it,
// or send the meta form to other components
eq.assembleMatrix(disc).solve()
```
