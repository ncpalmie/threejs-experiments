import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75, // FOV
  window.innerWidth / window.innerHeight, // Aspect Ratio
  0.1, // Frustum start
  1000 // Frustum end
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

// Prepare screen
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Position camera
camera.position.setZ(30);

// Draw image
renderer.render(scene, camera);

// Load textures
const spaceTexture = new THREE.TextureLoader().load("./assets/space.jpg");
const planetTexture = new THREE.TextureLoader().load("./assets/planet.jpg");
const ringTexture = new THREE.TextureLoader().load("./assets/ring.jpg");
scene.background = spaceTexture;

// Adding an object (sphere)
const sphere_geo = new THREE.SphereGeometry(8, 40, 40); // Create geometry
const sphere_mat = new THREE.MeshPhongMaterial({
  color: "#00AFB9",
  map: planetTexture,
}); // Create material for geometry
const sphere = new THREE.Mesh(sphere_geo, sphere_mat); // Create mesh from geometry and material

const ring_geo = new THREE.RingGeometry(10, 12, 40);
const ring_mat = new THREE.MeshPhongMaterial({
  map: ringTexture,
  side: THREE.DoubleSide,
});
const ring = new THREE.Mesh(ring_geo, ring_mat);

const inner_ring_geo = new THREE.RingGeometry(9.5, 10, 40);
const inner_ring_mat = new THREE.MeshPhongMaterial({
  color: "#FFFFFF",
  side: THREE.DoubleSide,
});
const inner_ring = new THREE.Mesh(inner_ring_geo, inner_ring_mat);

const outer_ring_geo = new THREE.RingGeometry(12, 12.5, 40);
const outer_ring_mat = new THREE.MeshPhongMaterial({
  color: "#FFFFFF",
  side: THREE.DoubleSide,
});
const outer_ring = new THREE.Mesh(outer_ring_geo, outer_ring_mat);

// Lighting
const ambientLight = new THREE.AmbientLight("#ffffff");

// Adding mesh to the screen
scene.add(sphere, ring, inner_ring, outer_ring);
scene.add(ambientLight);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);

// Generate starfield naively, could be done better with instancing
const addStar = (scene) => {
  const star_geo = new THREE.SphereGeometry(
    THREE.MathUtils.randFloat(0.01, 0.5)
  );
  const star_mat = new THREE.MeshBasicMaterial({ color: "#ffffff" });
  const star = new THREE.Mesh(star_geo, star_mat);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(300, 400));
  star.position.set(x, y, z);
  scene.add(star);
};

Array(300)
  .fill()
  .forEach(() => addStar(scene));

// Scene positioning variables
let zRotationDelta = 0.001;
ring.rotation.x = Math.PI / 2;
inner_ring.rotation.x = Math.PI / 2;
outer_ring.rotation.x = Math.PI / 2;

// Setup animation loop function
const animate = () => {
  requestAnimationFrame(animate);

  sphere.rotation.y += 0.004;
  if (sphere.rotation.z > Math.PI / 4) zRotationDelta *= -1;
  if (sphere.rotation.z < -Math.PI / 4) zRotationDelta *= -1;
  sphere.rotation.z += zRotationDelta;

  ring.rotation.z += 0.01;

  controls.update();

  renderer.render(scene, camera);
};

// Begin animation
animate();
