# Motivation

## Meshless methods? and OpenFOAM?

+ Issues with mesh-based methods?
  - Excessive computational costs for industrial cases
  - Some industries moving towards NURBS
  - Dependence on mesh quality
+ Go meshless?
  - Giving up the high fidelity
+ Why OpenFOAM?
  - Well maintained, open source, FVM-based CFD package that can be used as an alternative solution method
    for some regions if needed.

## Background and related work

+ Very brief intro to meshless methods (e.g., SPH, MPS, RKPM)
+ State of the art: PySPH, DualSPHysics, Medusa, etc.
+ OpenFOAM's usual FVM context

Where meshlessFlow fits in!

## Design overview

CCIP: A Component-to-Component Interface Protocol that is based on gRPC/protobuf
- LSP-like, language-agnostic, based on capability negotiation between components

Technical areas that this protocol shines
- **Configurable** capability: Can provide standard configuration beforehand
- **MPI-ready** capability: Can do data-intensive comms through MPI
- **GLStreamer** capability: Can stream visualization data to OpenGL-compatible visualizers

