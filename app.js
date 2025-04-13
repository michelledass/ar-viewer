let scene, camera, renderer;
let cube;

function init() {
  // Create scene and camera
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  // Set up renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('ar-container').appendChild(renderer.domElement);
  
  // Create a simple 3D cube
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  // Position the cube away from the camera
  cube.position.z = -5;
}

function animate() {
  requestAnimationFrame(animate);

  // Rotate the cube for animation
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
}

// Set up AR functionality with WebXR
function setupAR() {
  if (navigator.xr) {
    navigator.xr.requestSession('immersive-ar', {
      requiredFeatures: ['local', 'hit-test']
    }).then(session => {
      session.addEventListener('end', onXRSessionEnded);
      const glLayer = new XRWebGLLayer(session, renderer.getContext());
      session.updateRenderState({ baseLayer: glLayer });

      session.requestReferenceSpace('local').then(refSpace => {
        xrRefSpace = refSpace;
        session.requestAnimationFrame(onXRFrame);
      });
    });
  }
}

// Handle XR session frame updates
let xrRefSpace;
function onXRFrame(time, frame) {
  const session = frame.session;
  const pose = frame.getViewerPose(xrRefSpace);
  if (pose) {
    // Render the scene based on the current pose
    renderer.render(scene, camera);
  }
  session.requestAnimationFrame(onXRFrame);
}

// Start everything
init();
setupAR();
animate();
