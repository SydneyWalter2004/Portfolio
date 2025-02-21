import * as THREE from 'three';

const scene = new THREE.Scene();
const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true});
renderer.setClearColor(0x000000, 0);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.getElementById('canvas-container').appendChild(renderer.domElement);
//scene.background = new THREE.Color(0xAEC6CF);
scene.fog = new THREE.Fog(0x222222, 5, 15);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.5);
scene.add(pointLightHelper);
pointLight.intensity = 2;
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10).normalize();
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.bias = -0.001;
scene.add(directionalLight);

const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.5);
scene.add(hemisphereLight);

const spotLight = new THREE.SpotLight(0xffffff, 1, 10, Math.PI / 4, 0.5);
spotLight.position.set(5, 5, 5);
spotLight.castShadow = true;
scene.add(spotLight);

camera.position.z = 5;
camera.lookAt(0, 0, 0);

const planeGeometry = new THREE.PlaneGeometry(10, 10);
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = Math.PI / 2;
scene.add(plane);

const shapes = [];

function animate() {
    requestAnimationFrame(animate);
    shapes.forEach(shape => {
        shape.rotation.x += 0.01;
        shape.rotation.y += 0.01;
    });
    renderer.render(scene, camera);
}
animate();

let selectedShapeType = null;

function createShape(type) {
    let geometry, material;
    const textureLoader = new THREE.TextureLoader();
    const texture1 = textureLoader.load('../textures/sphere.jpg');
    const texture2 = textureLoader.load('../textures/knot.png');
    texture2.wrapS = THREE.RepeatWrapping;
    texture2.wrapT = THREE.RepeatWrapping;
    texture2.repeat.set(0.3, 0.3);

    const texture3 = textureLoader.load('../textures/torus.jpeg');
    const texture4 = textureLoader.load('../textures/iso.jpg');
    texture3.wrapS = THREE.RepeatWrapping;
    texture3.wrapT = THREE.RepeatWrapping;
    texture3.repeat.set(5, 5);
    texture3.minFilter = THREE.MipMap;

    texture4.anisotropy = renderer.capabilities.getMaxAnisotropy(); // Maximizes clarity
    texture4.wrapS = THREE.RepeatWrapping;
    texture4.wrapT = THREE.RepeatWrapping;
    texture4.repeat.set(2, 2);
    texture4.minFilter = THREE.MipMap;

    switch (type) {
        case 'sphere':
            geometry = new THREE.SphereGeometry(1, 64, 64);
            material = new THREE.MeshStandardMaterial({ map: texture1, color: 0xE4A0B7, roughness: 0.0, metalness: 0.0 });
            break;
        case 'torus':
            geometry = new THREE.TorusGeometry(1, 0.4, 25, 100);
            material = new THREE.MeshStandardMaterial({ map: texture3, color: 0x90EE90, roughness: 0.0, metalness: 0.0 });
            break;
        case 'torusKnot':
            geometry = new THREE.TorusKnotGeometry(0.6, 0.3, 100, 20);
            material = new THREE.MeshStandardMaterial({ map: texture2, color: 0x00ffff, roughness: 0.0, metalness: 0.0 });
            break;
        default:
            return null;
    }
    const shape = new THREE.Mesh(geometry, material);
    shape.castShadow = true;
    return shape;
}

document.querySelectorAll('.shape').forEach(button => {
    button.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent shape placement when clicking the button
        selectedShapeType = button.getAttribute('data-shape');
        console.log('Shape type registered:', selectedShapeType);
    });
});


document.querySelectorAll('.shape').forEach(button => {
    button.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent shape placement when clicking the button
        selectedShapeType = button.getAttribute('data-shape');
        console.log('Shape type registered:', selectedShapeType);
    });
});

/*document.querySelector('.refresh').addEventListener('click', (event) => {
    event.stopPropagation(); // Stop the click event from propagating to the document

    // Remove all shapes from the scene
    shapes.forEach(shape => {
        scene.remove(shape);
    });

    // Clear the shapes array
    shapes.length = 0;

    console.log('All shapes cleared from the screen.');
});

const maxShapes = 20;
*/

window.addEventListener('click', (event) => {
    if (!selectedShapeType) {
        console.log('Click detected but no shape type registered');
        return;
    }

    if (event.target.classList.contains('shape')) {
        return; // Ignore clicks on shape buttons
    }

    if (shapes.length >= maxShapes) {
        console.log('Shape limit reached');
        return;
    }

    console.log('Click detected with registered shape type');

    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const planeZ = 0;
    const intersectPoint = new THREE.Vector3();
    const distance = -camera.position.z + planeZ;
    raycaster.ray.at(distance, intersectPoint);

    const vector = new THREE.Vector3(mouse.x, mouse.y, 0.97);
    vector.unproject(camera);

    const newShape = createShape(selectedShapeType);
    if (newShape) {
        newShape.position.copy(vector);
        scene.add(newShape);
        shapes.push(newShape);
        console.log('Shape placed at:', newShape.position);
    }
});

const infoText = document.getElementById('info-text');
const messages = [
    "Front-End Enthusiast",
    "BlueSky Student Intern",
    "Connect with me on LinkedIn",
    "Let's build something together!",
    "Check out my projects on GitHub",
];
let currentIndex = 0;

// Function to update the text
function updateInfoText() {
    infoText.textContent = messages[currentIndex]; // Set the next message
    currentIndex = (currentIndex + 1) % messages.length; // Move to the next message
}

// Listen for the end of each animation cycle
infoText.addEventListener('animationiteration', () => {
    updateInfoText(); // Update the text when the animation restarts
});

// Initialize the first message
updateInfoText();

const text = document.querySelector(".breathing-text");
let glowIntensity = 5;
let growing = true;

setInterval(() => {
    if (growing) {
        glowIntensity += 2;
        if (glowIntensity >= 30) growing = false;
    } else {
        glowIntensity -= 2;
        if (glowIntensity <= 5) growing = true;
    }

    text.style.textShadow = `0 0 ${glowIntensity}px #00ffcc, 0 0 ${
        glowIntensity * 2
    }px #00ffcc`;
}, 100);
