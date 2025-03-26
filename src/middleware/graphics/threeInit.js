import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const gridSize = 50;
let robotPosition = { x: 0, y: 0 }; // Default position if not provided

export function initThree(mapContainer) {
  let scene, camera, renderer, controls, cylinder, gridMesh;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);

  camera = new THREE.PerspectiveCamera(50, 1000 / 730, 0.1, 2000);
  camera.position.set(0, 20, 60);
  camera.rotation.x = -Math.PI / 2;

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(1000, 730);

  if (mapContainer.value) {
    mapContainer.value.appendChild(renderer.domElement);
    gridMesh = createGrid(gridSize, scene);
    cylinder = createCylinder(scene);
    controls = setupControls(camera, renderer, cylinder);
    animate(renderer, scene, camera, controls, cylinder);
  }

  return { scene, gridMesh, camera, renderer, controls, cylinder };
}

/* Grid section */
function createGrid(gridSize, scene) {
  const gridTexture = new THREE.TextureLoader().load("src/assets/map.jpg");
  gridTexture.wrapS = THREE.RepeatWrapping;
  gridTexture.wrapT = THREE.RepeatWrapping;
  const repeat = gridSize / 10;
  gridTexture.repeat.set(repeat, repeat);

  const gridMaterial = new THREE.MeshBasicMaterial({
    map: gridTexture,
    side: THREE.DoubleSide,
  });
  const gridGeometry = new THREE.PlaneGeometry(gridSize, gridSize);

  const gridMesh = new THREE.Mesh(gridGeometry, gridMaterial);
  gridMesh.rotation.x = -Math.PI / 2;
  gridMesh.name = "grid";
  scene.add(gridMesh);

  return gridMesh;
}

/* Cylinder section */
function createCylinder(scene) {
  const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 5, 32);
  const cylinderMaterial = new THREE.MeshBasicMaterial({ color: 0xFF00FF });
  const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
  cylinder.position.set(0, 2.51, 0);
  scene.add(cylinder);
  return cylinder;
}

/* Render section */
export function updateScene(scene, gridMesh, rockData, cylinder, robotPosition) {
  scene.children.forEach((child) => {
    if (child !== gridMesh && child !== cylinder) {
      scene.remove(child);
    }
  });

  // Update robot (green cylinder) position if robotPosition is provided
  if (robotPosition && robotPosition.robotX !== undefined && robotPosition.robotY !== undefined) {
    cylinder.position.set(
      robotPosition.robotX - gridSize / 2 + 1,
      2.51,
      robotPosition.robotY - gridSize / 2 + 1
    );
  }

  // Add new elements to the scene
  createElements(scene, rockData);
}

/* Elements section */
function createElements(scene, elementsData) {
  elementsData.forEach((element) => {
    if (element.robotX !== undefined && element.robotY !== undefined) {
      return;
    }

    let geometry, material, zHeight;

    switch (element.element_type) {
      case "mountain":
        geometry = new THREE.BoxGeometry(2, 2, 2); // Mountain geometry
        material = new THREE.MeshBasicMaterial({ color: 0xffffff }); // Mountain color
        zHeight = 1.01;

        const wireframe = new THREE.WireframeGeometry(geometry);
        const wireframeMaterial = new THREE.LineBasicMaterial({
          color: 0x000000, // Black
          linewidth: 3,
        });
        const wireframeMesh = new THREE.LineSegments(
          wireframe,
          wireframeMaterial,
        );

        wireframeMesh.position.set(
          element.x - gridSize / 2 + 1,
          zHeight,
          element.y - gridSize / 2 + 1,
        );
        scene.add(wireframeMesh);
        break;
      case "valley":
        geometry = new THREE.CircleGeometry(1, 32); // Valley geometry
        material = new THREE.MeshBasicMaterial({ color: 0x000000 }); // Valley color
        zHeight = 0.1;
        break;
      case "rock_3_black":
        geometry = new THREE.SphereGeometry(0.3, 32, 16); // Rock geometry
        material = new THREE.MeshBasicMaterial({ color: 0x000000 }); // Rock color
        zHeight = 0.3;
        break;
      case "rock_3_white":
        geometry = new THREE.SphereGeometry(0.3, 32, 16); // Rock geometry
        material = new THREE.MeshBasicMaterial({ color: 0xffffff }); // Rock color
        zHeight = 0.3;
        break;
      case "rock_3_green":
        geometry = new THREE.SphereGeometry(0.3, 32, 16); // Rock geometry
        material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Rock color
        zHeight = 0.3;
        break;
      case "rock_3_blue":
        geometry = new THREE.SphereGeometry(0.3, 32, 16); // Rock geometry
        material = new THREE.MeshBasicMaterial({ color: 0x0000ff }); // Rock color
        zHeight = 0.3;
        break;
      case "rock_3_red":
        geometry = new THREE.SphereGeometry(0.3, 32, 16); // Rock geometry
        material = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Rock color
        zHeight = 0.3;
        break;
      case "rock_6_white":
        geometry = new THREE.SphereGeometry(0.6, 32, 16); // Rock geometry
        material = new THREE.MeshBasicMaterial({ color: 0x000000 }); // Rock color
        zHeight = 0.6;
        break;
      case "rock_6_black":
        geometry = new THREE.SphereGeometry(0.6, 32, 16); // Rock geometry
        material = new THREE.MeshBasicMaterial({ color: 0xffffff }); // Rock color
        zHeight = 0.6;
        break;
      case "rock_6_green":
        geometry = new THREE.SphereGeometry(0.6, 32, 16); // Rock geometry
        material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Rock color
        zHeight = 0.6;
        break;
      case "rock_6_blue":
        geometry = new THREE.SphereGeometry(0.6, 32, 16); // Rock geometry
        material = new THREE.MeshBasicMaterial({ color: 0x0000ff }); // Rock color
        zHeight = 0.6;
        break;
      case "rock_6_red":
        geometry = new THREE.SphereGeometry(0.6, 32, 16); // Rock geometry
        material = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Rock color
        zHeight = 0.6;
        break;
      case "none":
        geometry = new THREE.CircleGeometry(0, 0);
        zHeight = -10;
        break;
      default:
        print("Invalid type.\n");
        return;
    }

    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(
      element.x - gridSize / 2 + 1,
      zHeight,
      element.y - gridSize / 2 + 1,
    );

    if (element.element_type === "valley") {
      mesh.rotation.x = (3 * Math.PI) / 2;
    }
    scene.add(mesh);
  });
}

/* Controls section */
function setupControls(camera, renderer, cylinder) {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.rotateSpeed = 0.2;
  controls.zoomSpeed = 1.2;
  controls.panSpeed = 1;
  controls.update();

  document.addEventListener("keydown", (event) =>
    handleKeyDown(event, cylinder),
  );
  return controls;
}

/* Animation section */
function animate(renderer, scene, camera, controls, cylinder) {
  requestAnimationFrame(() =>
    animate(renderer, scene, camera, controls, cylinder),
  );
  controls.update();
  renderer.render(scene, camera);
}

/* Keyboard section */
function handleKeyDown(event, cylinder) {
  const speed = 0.1;
  const originalPosition = cylinder.position.clone();

  switch (event.key) {
    case "ArrowUp":
      cylinder.position.z -= speed;
      break;
    case "ArrowDown":
      cylinder.position.z += speed;
      break;
    case "ArrowLeft":
      cylinder.position.x -= speed;
      break;
    case "ArrowRight":
      cylinder.position.x += speed;
      break;
  }

  if (checkCollision(cylinder, scene)) {
    console.log("Collision detected.");
    cylinder.position.copy(originalPosition);
  }
}

/* Bounding box section */
function computeBoundingBox(object) {
  const box = new THREE.Box3().setFromObject(object);
  return box;
}

/* Collision section */
function checkCollision(cylinder, scene) {
  const cylinderBox = computeBoundingBox(cylinder);
  const objects = scene.children.filter((obj) => obj !== cylinder);
  for (const object of objects) {
    const objectBox = computeBoundingBox(object);
    if (cylinderBox.intersectsBox(objectBox)) {
      return true;
    }
  }
  return false;
}

export function resetMap(scene, gridMesh, cylinder) {
  if (!scene || !gridMesh || !cylinder) {
    console.error("Scene, gridMesh, or cylinder not initialized");
    return;
  }

  try {
    for (let i = scene.children.length - 1; i >= 0; i--) {
      const obj = scene.children[i];
      if (obj !== gridMesh && obj !== cylinder) {
        scene.remove(obj);
        disposeObject(obj);
      }
    }

    scene.add(gridMesh);
    scene.add(cylinder);

    cylinder.position.set(0, 0.51, 0);

    console.log("Map reset successfully");
  } catch (error) {
    console.error("Error in resetMap:", error);
  }
}

function disposeObject(obj) {
  if (obj.geometry) {
    obj.geometry.dispose();
  }
  if (obj.material) {
    if (Array.isArray(obj.material)) {
      obj.material.forEach((material) => material.dispose());
    } else {
      obj.material.dispose();
    }
  }
  if (obj.texture) {
    obj.texture.dispose();
  }
}
