# Three.js Rubik's Cube Solver

A browser-based 3D Rubik's Cube simulator and automated solver built with Three.js and the Kociemba algorithm. This project demonstrates 3D manipulation, animation queuing, and the integration of complex combinatorial algorithms in a web environment.

![Project Demo](rubikdemo.gif)

## Features

* **3D Interactive Cube**: A fully rendered 3x3x3 Rubik's Cube using Three.js with OrbitControls for 360-degree viewing.
* **Smooth Animations**: Layer rotations are processed through an animation queue to ensure fluid motion and prevent command overlapping.
* **Optimal Solver**: Integrates the Kociemba algorithm (via cubejs) to calculate and execute the shortest possible solution from any scrambled state.
* **Keyboard and UI Support**: Functional buttons and keyboard shortcuts for all standard notation moves (U, D, L, R, F, B).

## Implementation Details

### Core Technologies
* **Three.js**: Used for 3D rendering, mesh grouping, and coordinate transformation.
* **Cube.js**: A JavaScript implementation of the Two-Phase (Kociemba) algorithm for solving the cube.
* **ES Modules**: Modern JavaScript structure using import maps for dependency management.

### Technical Challenges
* **State Synchronization**: The system maintains a logical representation of the cube state in the solver while simultaneously updating the spatial coordinates of 27 individual meshes in the 3D scene.
* **Rotation Logic**: Uses a temporary THREE.Group to handle layer rotations. Upon completion, objects are re-attached to the world scene to maintain accurate positional data for subsequent moves.

## Controls

### Mouse
* **Left Click + Drag**: Orbit the camera around the cube.
* **Scroll Wheel**: Zoom in and out.

### Keyboard Shortcuts
* **S**: Scramble the cube with 20 random moves.
* **Enter**: Trigger the automated solver.
* **U / D / L / R / F / B**: Execute a clockwise rotation of the corresponding face.

## Getting Started

### Prerequisites
* A local web server (required for ES Module support).

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/black-leg-nameko/rubik-cube-solver.git
   ```
2. Go to the directory
   ```
   cd ./rubik-cube-solver
   ```
3. Start local server
   ```
    # Using Python
    python3 -m http.server 8000
   ```
4. Open http://localhost:8000 in your web browser.
