import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

function initThreeDMap() {
  // Scene setup
  const scene = new THREE.Scene();

  // Camera setup
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  camera.position.set(0, 50, 100);

  // Renderer setup
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Controls setup
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // Lights setup
  const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 1, 100);
  pointLight.position.set(50, 50, 50);
  scene.add(pointLight);

  // Generate height map using Perlin noise
  const size = 100;
  const divisions = 100;
  const geometry = new THREE.PlaneGeometry(size, size, divisions, divisions);

  const perlin = new SimplexNoise();
  for (let i = 0; i < geometry.attributes.position.count; i++) {
    const z =
      perlin.noise2D(
        geometry.attributes.position.getX(i) / 10,
        geometry.attributes.position.getY(i) / 10,
      ) * 10; // Adjust the multiplier to change height
    geometry.attributes.position.setZ(i, z);
  }

  // Apply wireframe material with glowing effect
  const material = new THREE.MeshPhongMaterial({
    color: 0x00ff00,
    wireframe: true,
    emissive: 0x00ff00,
    emissiveIntensity: 0.2,
  });

  const terrain = new THREE.Mesh(geometry, material);
  terrain.rotation.x = -Math.PI / 2;
  scene.add(terrain);

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }

  animate();
}

// Call the init function when the window loads
window.onload = initThreeDMap;
