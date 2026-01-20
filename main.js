import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Cube from 'cubejs';

Cube.initSolver();
let internalCube = new Cube();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

camera.position.set(5, 5, 5);
const controls = new OrbitControls(camera, renderer.domElement);
scene.add(new THREE.AmbientLight(0xffffff, 0.8));

let cubies = [];
let moveQueue = [];
let currentMove = null;
const ROTATION_SPEED = 0.15;

const colors = [0x0000ff, 0x00ff00, 0xffffff, 0xffff00, 0xff0000, 0xffa500];

function createCube() {
    const geometry = new THREE.BoxGeometry(0.95, 0.95, 0.95);
    for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
            for (let z = -1; z <= 1; z++) {
                const materials = colors.map((color, i) => {
                    let isVisible = false;
                    if (i === 0 && x === 1) isVisible = true;
                    if (i === 1 && x === -1) isVisible = true;
                    if (i === 2 && y === 1) isVisible = true;
                    if (i === 3 && y === -1) isVisible = true;
                    if (i === 4 && z === 1) isVisible = true;
                    if (i === 5 && z === -1) isVisible = true;
                    return new THREE.MeshBasicMaterial({ color: isVisible ? color : 0x000000 });
                });
                const cubie = new THREE.Mesh(geometry, materials);
                cubie.position.set(x, y, z);
                cubie.add(new THREE.LineSegments(
                    new THREE.EdgesGeometry(geometry), 
                    new THREE.LineBasicMaterial({ color: 0x000000 })
                ));
                scene.add(cubie);
                cubies.push(cubie);
            }
        }
    }
}
createCube();

function applyMove(move) {
    if (!move) return;
    internalCube.move(move); 

    const face = move[0];
    const modifier = move.substring(1);

    let axis, layer, direction;

    switch (face) {
        case 'U': axis = 'y'; layer = 1;  direction = -1; break;
        case 'D': axis = 'y'; layer = -1; direction = 1;  break;
        case 'L': axis = 'x'; layer = -1; direction = 1;  break;
        case 'R': axis = 'x'; layer = 1;  direction = -1; break;
        case 'F': axis = 'z'; layer = 1;  direction = -1; break;
        case 'B': axis = 'z'; layer = -1; direction = 1;  break;
    }

    if (modifier === "'") {
        direction *= -1;
    } else if (modifier === "2") {
        direction *= 2;
    }

    const targetAngle = (Math.PI / 2) * direction;

    // Finalize targetAngle here to simplify math in startNextMove
    moveQueue.push({ axis, layer, targetAngle });
}

function startNextMove() {
    if (moveQueue.length === 0 || currentMove) return;

    const moveData = moveQueue.shift();
    const { axis, layer, targetAngle } = moveData;

    const group = new THREE.Group();
    scene.add(group);
    
    const targets = cubies.filter(c => Math.round(c.position[axis]) === layer);
    targets.forEach(c => group.attach(c));

    currentMove = {
        group: group,
        axis: axis,
        targets: targets,
        targetAngle: targetAngle,
        currentAngle: 0
    };
}

function updateAnimation() {
    if (!currentMove) {
        startNextMove();
        return;
    }

    const remain = currentMove.targetAngle - currentMove.currentAngle;
    const step = Math.sign(remain) * Math.min(Math.abs(remain), ROTATION_SPEED);

    currentMove.group.rotation[currentMove.axis] += step;
    currentMove.currentAngle += step;

    if (Math.abs(currentMove.currentAngle - currentMove.targetAngle) < 0.001) {
        currentMove.group.updateMatrixWorld();
        currentMove.targets.forEach(c => scene.attach(c));
        scene.remove(currentMove.group);
        currentMove = null;
    }
}

window.applyMove = applyMove;

window.shuffle = function() {
    const moves = ["U", "D", "L", "R", "F", "B"];
    for (let i = 0; i < 20; i++) {
        const move = moves[Math.floor(Math.random() * moves.length)];
        const suffix = ["", "'", "2"][Math.floor(Math.random() * 3)];
        applyMove(move + suffix);
    }
};

window.solve = function() {
    const solution = internalCube.solve();
    if (solution) {
        solution.split(' ').forEach(move => applyMove(move));
    }
};

window.addEventListener('keydown', (e) => {
    const keyMap = { 's': 'shuffle', 'Enter': 'solve', 'r': 'R', 'u': 'U', 'f': 'F', 'l': 'L', 'd': 'D', 'b': 'B' };
    const command = keyMap[e.key] || keyMap[e.code];
    if (command === 'shuffle') window.shuffle();
    else if (command === 'solve') window.solve();
    else if (command) applyMove(command);
});

function animate() {
    requestAnimationFrame(animate);
    updateAnimation();
    controls.update();
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});