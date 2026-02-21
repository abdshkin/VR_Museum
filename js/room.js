// ============================================================
// js/room.js — 3D-зал на Three.js
//
// Управление (как Google Street View):
//   Телефон:  гироскоп + свайп пальцем + щипок для зума
//   Компьютер: зажать ЛКМ + тянуть | колёсико мыши = зум
// ============================================================

let threeState = null;
let sceneBuilt = false;

function openRoom(artistIndex) {
  const artist = window._museumsArtists?.[artistIndex];
  if (!artist) return;
  stopAuto();
  updateRoomLabel(artist);
  document.getElementById('slider-view').classList.remove('active');
  document.getElementById('room-view').classList.add('active');
  if (threeState) threeState.running = true;
  if (!sceneBuilt) {
    requestAnimationFrame(() => requestAnimationFrame(() => buildScene(artist)));
  } else {
    swapWallTexture(artist);
  }
}

function closeRoom() {
  document.getElementById('room-view').classList.remove('active');
  document.getElementById('slider-view').classList.add('active');
  if (threeState) threeState.running = false;
  startAuto();
  setTimeout(() => showBio(getCurrentIndex()), 300);
}

function updateRoomLabel(artist) {
  document.getElementById('room-label-name').textContent  = localize(artist.names);
  document.getElementById('room-label-years').textContent = artist.years;
}

function getInfoSrc(artist) {
  const b64 = artist.infographic[currentLang] || artist.infographic.ru;
  return 'data:image/jpeg;base64,' + b64;
}

function swapWallTexture(artist) {
  if (!threeState) return;
  new THREE.TextureLoader().load(getInfoSrc(artist), tex => {
    tex.colorSpace = THREE.SRGBColorSpace;
    threeState.wallMat.map = tex;
    threeState.wallMat.needsUpdate = true;
  });
}

// ──────────────────────────────────────────────────────────
// BUILD SCENE
// ──────────────────────────────────────────────────────────
function buildScene(artist) {
  const container = document.getElementById('aframe-container');
  container.innerHTML = '';

  // Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  // Scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x060504);
  scene.fog = new THREE.Fog(0x080604, 10, 22);

  // Camera — глаза внутри комнаты
  const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.05, 40
  );
  camera.position.set(0, 1.62, 0);

  // Lights
  scene.add(new THREE.AmbientLight(0xfff5e0, 0.55));

  const sun = new THREE.DirectionalLight(0xfff8f0, 1.1);
  sun.position.set(3, 5, 2);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  scene.add(sun);

  scene.add(Object.assign(new THREE.PointLight(0xc8a96e, 0.55, 9), { position: { x:0, y:3.5, z:0 } }));

  [-2.2, 2.2].forEach(x => {
    const s = new THREE.SpotLight(0xfffaf0, 2.8, 14, Math.PI/7, 0.4);
    s.position.set(x, 3.9, 1.5);
    s.target.position.set(0, 2, -5);
    scene.add(s, s.target);
  });

  // Materials
  const MAT = {
    floor:   mat(0x1a150f),
    ceiling: mat(0x100e0b),
    wall:    mat(0x17140e),
    frame:   mat(0x6a4a1a),
    frameOuter: mat(0x4a3010),
    gold:    new THREE.MeshStandardMaterial({ color: 0xc8a96e, roughness: 0.28, metalness: 0.65 }),
    canvas:  mat(0xe8ddc8),
    shelf:   mat(0x2a1e10),
    mold:    mat(0x8a6a3a),
    skirt:   mat(0x4a3018),
    books:   [mat(0xc8a96e), mat(0x6e7a9b), mat(0x9b6e8a), mat(0x6e8a5f), mat(0xa06e6e)],
  };

  function mat(c) { return new THREE.MeshLambertMaterial({ color: c }); }
  function add(geo, m, x, y, z, ry) {
    const mesh = new THREE.Mesh(geo, m);
    mesh.position.set(x, y, z);
    if (ry) mesh.rotation.y = ry;
    mesh.receiveShadow = mesh.castShadow = true;
    scene.add(mesh);
    return mesh;
  }
  function box(w, h, d, m, x, y, z, ry) { return add(new THREE.BoxGeometry(w, h, d), m, x, y, z, ry); }
  function plane(w, h, m, x, y, z, ry)  { return add(new THREE.PlaneGeometry(w, h), m, x, y, z, ry); }

  // ── Геометрия комнаты ─────────────────────────────────────

  // Пол и потолок
  box(11, 0.06, 13, MAT.floor,   0, -0.03, 0);
  box(11, 0.06, 13, MAT.ceiling, 0,  4.03, 0);

  // 4 стены
  box(11, 4.12, 0.12, MAT.wall,  0,  2, -5.06);   // задняя
  box(11, 4.12, 0.12, MAT.wall,  0,  2,  5.06);   // передняя
  box(0.12, 4.12, 13, MAT.wall, -5.06, 2, 0);     // левая
  box(0.12, 4.12, 13, MAT.wall,  5.06, 2, 0);     // правая

  // Главная стена — инфографика
  const wallMat = new THREE.MeshLambertMaterial({ color: 0xede5d0 });
  plane(8.2, 4.1, wallMat, 0, 2, -5.0);
  box(7.2, 4.6, 0.06, MAT.frame,      0, 2, -4.97);
  box(7.55, 4.95, 0.04, MAT.frameOuter, 0, 2, -4.99);

  // Загрузить текстуру
  new THREE.TextureLoader().load(getInfoSrc(artist), tex => {
    tex.colorSpace = THREE.SRGBColorSpace;
    wallMat.map = tex;
    wallMat.needsUpdate = true;
  });

  // Картины на левой стене
  function hangPainting(y, z, w, h) {
    plane(w, h, MAT.canvas, -5.0, y, z, Math.PI/2);
    box(w+0.14, h+0.14, 0.05, MAT.frame,      -4.97, y, z, Math.PI/2);
    box(w+0.28, h+0.28, 0.03, MAT.frameOuter, -4.95, y, z, Math.PI/2);
  }
  hangPainting(2.8, -2,   1.0, 1.3);
  hangPainting(1.5,  1.5, 1.3, 1.0);

  // Картина на правой стене
  hangPainting(2.2, -3, 0.9, 1.1);  // зеркально

  // Книжная полка (правая стена)
  box(0.13, 1.9, 1.6, MAT.shelf, 5.0, 1.0, -0.8);
  box(0.03, 0.07, 1.5, MAT.mold, 4.96, 1.78, -0.8);
  box(0.03, 0.07, 1.5, MAT.mold, 4.96, 1.16, -0.8);
  const bw = [0.09, 0.11, 0.08, 0.10, 0.08];
  let bz = -1.28;
  MAT.books.forEach((bm, i) => {
    const bh = 0.36 + (i % 3) * 0.06;
    box(0.05, bh, bw[i], bm, 4.97, 1.48, bz);
    bz += bw[i] + 0.015;
  });

  // Постамент + ваза
  scene.add(Object.assign(
    new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 0.88, 8), MAT.shelf),
    { position: new THREE.Vector3(-3, 0.44, 2.5) }
  ));
  const vase = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.17, 0.56, 12), MAT.gold);
  vase.position.set(-3, 1.12, 2.5);
  scene.add(vase);

  // Молдинг и плинтус
  [[-5,0],[5,0],[0,-5],[0,5]].forEach(([mx,mz]) => {
    const hor = !mz;
    box(hor?11:0.13, 0.12, hor?0.13:13, MAT.mold,  mx, 3.93, mz);
    box(hor?11:0.13, 0.13, hor?0.13:13, MAT.skirt, mx, 0.065, mz);
  });

  // ── Контроллер ────────────────────────────────────────────
  const look = buildLookController(camera, renderer.domElement);

  // ── Рендер-луп ────────────────────────────────────────────
  threeState = { renderer, scene, camera, wallMat, running: true, look };
  sceneBuilt = true;

  (function animate() {
    if (!threeState?.running) return;
    requestAnimationFrame(animate);
    look.update();
    renderer.render(scene, camera);
  })();

  // Ресайз
  const onResize = () => {
    if (!threeState) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  };
  window.addEventListener('resize', onResize);
}

// ══════════════════════════════════════════════════════════════
// buildLookController — 360° управление (drag + gyro + zoom)
// ══════════════════════════════════════════════════════════════
function buildLookController(camera, canvas) {
  // Сферические координаты взгляда
  let yaw = 0, pitch = 0, fov = 75;
  // Плавные цели
  let tYaw = 0, tPitch = 0, tFov = 75;

  const PITCH_LIMIT = 80 * Math.PI / 180;
  const FOV_MIN = 25, FOV_MAX = 100;
  const DRAG_SENS  = 0.003;
  const WHEEL_SENS = 0.07;
  const PINCH_SENS = 0.28;
  const SMOOTH_ROT = 0.14;   // инерция вращения
  const SMOOTH_FOV = 0.11;   // инерция зума

  // Quaternion оси для вращения
  const UP    = new THREE.Vector3(0, 1, 0);
  const RIGHT = new THREE.Vector3(1, 0, 0);

  // ── Drag мышью ──────────────────────────────────────────
  let dragging = false, lx = 0, ly = 0;

  canvas.addEventListener('mousedown', e => {
    dragging = true; lx = e.clientX; ly = e.clientY;
    canvas.style.cursor = 'grabbing';
    e.preventDefault();
  });
  window.addEventListener('mousemove', e => {
    if (!dragging) return;
    tYaw   -= (e.clientX - lx) * DRAG_SENS;
    tPitch -= (e.clientY - ly) * DRAG_SENS;
    tPitch  = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, tPitch));
    lx = e.clientX; ly = e.clientY;
  });
  window.addEventListener('mouseup', () => {
    dragging = false;
    canvas.style.cursor = 'grab';
  });
  canvas.style.cursor = 'grab';
  canvas.setAttribute('tabindex', '0');

  // ── Touch свайп (1 палец) ───────────────────────────────
  let px = 0, py = 0;
  const pinch = { d: 0 };

  canvas.addEventListener('touchstart', e => {
    if (e.touches.length === 1) { px = e.touches[0].clientX; py = e.touches[0].clientY; }
    if (e.touches.length === 2) { pinch.d = pinchDist(e); }
  }, { passive: true });

  canvas.addEventListener('touchmove', e => {
    e.preventDefault();
    if (e.touches.length === 1) {
      tYaw   -= (e.touches[0].clientX - px) * DRAG_SENS;
      tPitch -= (e.touches[0].clientY - py) * DRAG_SENS;
      tPitch  = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, tPitch));
      px = e.touches[0].clientX;
      py = e.touches[0].clientY;
    } else if (e.touches.length === 2) {
      const d = pinchDist(e);
      tFov = Math.max(FOV_MIN, Math.min(FOV_MAX, tFov + (pinch.d - d) * PINCH_SENS));
      pinch.d = d;
    }
  }, { passive: false });

  canvas.addEventListener('touchend', e => {
    if (e.touches.length < 2) pinch.d = 0;
  }, { passive: true });

  function pinchDist(e) {
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    return Math.hypot(dx, dy);
  }

  // ── Колёсико мыши = зум ─────────────────────────────────
  canvas.addEventListener('wheel', e => {
    e.preventDefault();
    tFov = Math.max(FOV_MIN, Math.min(FOV_MAX, tFov + e.deltaY * WHEEL_SENS));
  }, { passive: false });

  // ── Гироскоп ────────────────────────────────────────────
  let gyroActive = false;
  let gyroQ = new THREE.Quaternion();
  const qScreen = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5));
  const euler   = new THREE.Euler();

  function onOrientation(e) {
    if (e.alpha == null) return;
    euler.set(
      THREE.MathUtils.degToRad(e.beta  || 0),
      THREE.MathUtils.degToRad(e.alpha || 0),
      THREE.MathUtils.degToRad(-(e.gamma || 0)),
      'YXZ'
    );
    gyroQ.setFromEuler(euler);
    gyroQ.multiply(qScreen);
    gyroActive = true;
  }

  function startGyro() {
    window.addEventListener('deviceorientation', onOrientation, { passive: true });
  }

  if (typeof DeviceOrientationEvent?.requestPermission === 'function') {
    // iOS 13+: показать кнопку-подсказку
    const hint = document.getElementById('gyro-hint');
    if (hint) {
      hint.innerHTML = '📱 Нажмите для гироскопа<br><small>Tap to enable gyroscope</small>';
      hint.style.cssText += ';pointer-events:all;cursor:pointer;opacity:1;animation:none';
      hint.addEventListener('click', () => {
        DeviceOrientationEvent.requestPermission()
          .then(r => { if (r === 'granted') { startGyro(); hint.style.display='none'; } })
          .catch(() => {});
      }, { once: true });
    }
  } else {
    startGyro(); // Android / Desktop — без разрешения
  }

  // ── update() — вызывается каждый кадр ──────────────────
  function update() {
    if (gyroActive) {
      // Гироскоп имеет приоритет — телефон поворачивается = камера поворачивается
      camera.quaternion.slerp(gyroQ, 0.15);
    } else {
      // Drag-режим: плавная интерполяция сферических углов
      yaw   += (tYaw   - yaw)   * SMOOTH_ROT;
      pitch += (tPitch - pitch) * SMOOTH_ROT;

      const qY = new THREE.Quaternion().setFromAxisAngle(UP,    yaw);
      const qX = new THREE.Quaternion().setFromAxisAngle(RIGHT, pitch);
      camera.quaternion.copy(qY).multiply(qX);
    }

    // Зум: плавный FOV
    fov += (tFov - fov) * SMOOTH_FOV;
    if (Math.abs(fov - camera.fov) > 0.01) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
  }

  return { update };
}
