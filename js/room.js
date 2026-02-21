// ============================================================
// js/room.js — 3D зал на Three.js r128
// 360° просмотр: drag мышью/пальцем, гироскоп, зум колёсиком/щипком
// ============================================================

var threeState = null;
var sceneBuilt = false;

// ── Открыть зал ─────────────────────────────────────────────
function openRoom(artistIndex) {
  var artist = window._museumsArtists && window._museumsArtists[artistIndex];
  if (!artist) return;
  stopAuto();
  updateRoomLabel(artist);
  document.getElementById('slider-view').classList.remove('active');
  document.getElementById('room-view').classList.add('active');
  if (threeState) threeState.running = true;
  if (!sceneBuilt) {
    // двойной rAF — дать браузеру отрисовать #room-view перед WebGL
    requestAnimationFrame(function() {
      requestAnimationFrame(function() { buildScene(artist); });
    });
  } else {
    swapWallTexture(artist);
  }
}

// ── Закрыть зал ─────────────────────────────────────────────
function closeRoom() {
  document.getElementById('room-view').classList.remove('active');
  document.getElementById('slider-view').classList.add('active');
  if (threeState) threeState.running = false;
  startAuto();
  setTimeout(function() { showBio(getCurrentIndex()); }, 300);
}

// ── Плашка имени ────────────────────────────────────────────
function updateRoomLabel(artist) {
  document.getElementById('room-label-name').textContent  = localize(artist.names);
  document.getElementById('room-label-years').textContent = artist.years;
}

// ── Инфографика ─────────────────────────────────────────────
function getInfoSrc(artist) {
  var b64 = artist.infographic[currentLang] || artist.infographic.ru;
  return 'data:image/jpeg;base64,' + b64;
}

function swapWallTexture(artist) {
  if (!threeState || !threeState.wallMat) return;
  var loader = new THREE.TextureLoader();
  loader.load(getInfoSrc(artist), function(tex) {
    threeState.wallMat.map = tex;
    threeState.wallMat.needsUpdate = true;
  });
}

// ═══════════════════════════════════════════════════════════
// BUILD SCENE — Three.js r128
// ═══════════════════════════════════════════════════════════
function buildScene(artist) {
  var container = document.getElementById('aframe-container');
  container.innerHTML = '';

  var W = container.clientWidth  || window.innerWidth;
  var H = container.clientHeight || window.innerHeight;

  // ── Renderer ──────────────────────────────────────────────
  var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W, H);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  // r128: используем gammaOutput вместо outputColorSpace
  renderer.gammaOutput = true;
  renderer.gammaFactor = 2.2;
  container.appendChild(renderer.domElement);

  // ── Scene ─────────────────────────────────────────────────
  var scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0806);
  scene.fog = new THREE.Fog(0x0a0806, 12, 24);

  // ── Camera ────────────────────────────────────────────────
  var camera = new THREE.PerspectiveCamera(75, W / H, 0.05, 40);
  camera.position.set(0, 1.6, 0);

  // ── Helpers ───────────────────────────────────────────────
  function makeMat(color) {
    return new THREE.MeshLambertMaterial({ color: color });
  }

  function addBox(w, h, d, mat, x, y, z, ry) {
    var mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    mesh.position.set(x, y, z);
    if (ry) mesh.rotation.y = ry;
    mesh.receiveShadow = true;
    mesh.castShadow    = true;
    scene.add(mesh);
    return mesh;
  }

  function addPlane(w, h, mat, x, y, z, rx, ry) {
    var mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
    mesh.position.set(x, y, z);
    if (rx) mesh.rotation.x = rx;
    if (ry) mesh.rotation.y = ry;
    mesh.receiveShadow = true;
    scene.add(mesh);
    return mesh;
  }

  // ── Lights ────────────────────────────────────────────────
  scene.add(new THREE.AmbientLight(0xfff5e0, 0.7));

  var sun = new THREE.DirectionalLight(0xfff8f0, 1.0);
  sun.position.set(2, 4, 1);
  sun.castShadow = true;
  sun.shadow.mapSize.width  = 1024;
  sun.shadow.mapSize.height = 1024;
  scene.add(sun);

  var fillLight = new THREE.PointLight(0xc8a96e, 0.5, 10);
  fillLight.position.set(0, 3.4, 0);
  scene.add(fillLight);

  // Прожекторы на инфографику
  var spot1 = new THREE.SpotLight(0xfffaf0, 2.0, 14, Math.PI / 7.5, 0.45);
  spot1.position.set(-2.0, 3.8, 1.0);
  spot1.target.position.set(0, 2, -5);
  spot1.castShadow = true;
  scene.add(spot1);
  scene.add(spot1.target);

  var spot2 = new THREE.SpotLight(0xfffaf0, 2.0, 14, Math.PI / 7.5, 0.45);
  spot2.position.set(2.0, 3.8, 1.0);
  spot2.target.position.set(0, 2, -5);
  spot2.castShadow = true;
  scene.add(spot2);
  scene.add(spot2.target);

  // ── Materials ─────────────────────────────────────────────
  var mFloor   = makeMat(0x1a150f);
  var mCeiling = makeMat(0x111009);
  var mWall    = makeMat(0x18140e);
  var mFrame   = makeMat(0x6a4a1a);
  var mFrameOuter = makeMat(0x4a3010);
  var mCanvas  = makeMat(0xe0d8c4);
  var mShelf   = makeMat(0x2a1e10);
  var mMold    = makeMat(0x8a6a3a);
  var mSkirt   = makeMat(0x4a3018);
  var mGold    = new THREE.MeshStandardMaterial({ color: 0xc8a96e, roughness: 0.3, metalness: 0.6 });
  var mBooks   = [makeMat(0xc8a96e), makeMat(0x6e7a9b), makeMat(0x9b6e8a), makeMat(0x6e8a5f), makeMat(0xa06e6e)];

  // ── Пол ───────────────────────────────────────────────────
  addBox(11, 0.06, 13, mFloor,   0, -0.03, 0);

  // ── Потолок ───────────────────────────────────────────────
  addBox(11, 0.06, 13, mCeiling, 0,  4.03, 0);

  // ── 4 стены ───────────────────────────────────────────────
  addBox(11, 4.12, 0.12, mWall,  0, 2, -5.06);        // задняя
  addBox(11, 4.12, 0.12, mWall,  0, 2,  5.06);        // передняя
  addBox(0.12, 4.12, 13, mWall, -5.06, 2, 0);         // левая
  addBox(0.12, 4.12, 13, mWall,  5.06, 2, 0);         // правая

  // ── Главная стена — инфографика ───────────────────────────
  var wallMat = new THREE.MeshLambertMaterial({ color: 0xede5d0 });
  addPlane(8.2, 4.1, wallMat, 0, 2, -5.0);
  // Рама
  addBox(7.2,  4.6,  0.06, mFrame,      0, 2, -4.97);
  addBox(7.55, 4.95, 0.04, mFrameOuter, 0, 2, -4.99);

  // Загрузить текстуру инфографики
  var texLoader = new THREE.TextureLoader();
  texLoader.load(getInfoSrc(artist), function(tex) {
    wallMat.map = tex;
    wallMat.needsUpdate = true;
  });

  // ── Картины на левой стене ────────────────────────────────
  function hangPainting(y, z, w, h) {
    addPlane(w, h, mCanvas, -5.0, y, z, 0, Math.PI / 2);
    addBox(w + 0.14, h + 0.14, 0.05, mFrame,      -4.97, y, z, Math.PI / 2);
    addBox(w + 0.28, h + 0.28, 0.03, mFrameOuter, -4.95, y, z, Math.PI / 2);
  }
  hangPainting(2.8, -2.0, 1.0, 1.3);
  hangPainting(1.5,  1.5, 1.3, 1.0);

  // Картина на правой стене
  var canvasR = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 1.1), mCanvas);
  canvasR.position.set(5.0, 2.4, -2.5);
  canvasR.rotation.y = -Math.PI / 2;
  scene.add(canvasR);
  addBox(0.05, 1.25, 1.05, mFrame,      4.97, 2.4, -2.5, -Math.PI / 2);
  addBox(0.03, 1.40, 1.20, mFrameOuter, 4.95, 2.4, -2.5, -Math.PI / 2);

  // ── Книжная полка (правая стена) ──────────────────────────
  addBox(0.13, 1.9, 1.6, mShelf, 5.0, 1.0, -0.8);
  addBox(0.03, 0.07, 1.5, mMold, 4.96, 1.78, -0.8);
  addBox(0.03, 0.07, 1.5, mMold, 4.96, 1.16, -0.8);
  var bookWidths = [0.09, 0.11, 0.08, 0.10, 0.08];
  var bz = -1.28;
  for (var bi = 0; bi < mBooks.length; bi++) {
    var bh = 0.36 + (bi % 3) * 0.06;
    addBox(0.05, bh, bookWidths[bi], mBooks[bi], 4.97, 1.47, bz);
    bz += bookWidths[bi] + 0.015;
  }

  // ── Постамент + ваза ─────────────────────────────────────
  var ped = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 0.88, 8), mShelf);
  ped.position.set(-3, 0.44, 2.5);
  ped.castShadow = ped.receiveShadow = true;
  scene.add(ped);

  var vase = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.17, 0.56, 12), mGold);
  vase.position.set(-3, 1.12, 2.5);
  vase.castShadow = true;
  scene.add(vase);

  // ── Молдинг + плинтус ─────────────────────────────────────
  addBox(11,   0.12, 0.14, mMold,  0,    3.93, -5.06);
  addBox(11,   0.12, 0.14, mMold,  0,    3.93,  5.06);
  addBox(0.14, 0.12, 13,   mMold, -5.06, 3.93,  0);
  addBox(0.14, 0.12, 13,   mMold,  5.06, 3.93,  0);

  addBox(11,   0.13, 0.14, mSkirt,  0,    0.065, -5.06);
  addBox(11,   0.13, 0.14, mSkirt,  0,    0.065,  5.06);
  addBox(0.14, 0.13, 13,   mSkirt, -5.06, 0.065,  0);
  addBox(0.14, 0.13, 13,   mSkirt,  5.06, 0.065,  0);

  // ── Контроллер взгляда ────────────────────────────────────
  var ctrl = buildLookController(camera, renderer.domElement);

  // ── Рендер-луп ────────────────────────────────────────────
  threeState = { renderer: renderer, scene: scene, camera: camera,
                 wallMat: wallMat, running: true, ctrl: ctrl };
  sceneBuilt = true;

  function animate() {
    if (!threeState || !threeState.running) return;
    requestAnimationFrame(animate);
    ctrl.update();
    renderer.render(scene, camera);
  }
  animate();

  // ── Ресайз ────────────────────────────────────────────────
  window.addEventListener('resize', function() {
    if (!threeState) return;
    var w = container.clientWidth;
    var h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
}

// ═══════════════════════════════════════════════════════════
// buildLookController — 360° управление
// ═══════════════════════════════════════════════════════════
function buildLookController(camera, canvas) {

  var yaw = 0, pitch = 0, fov = 75;
  var tYaw = 0, tPitch = 0, tFov = 75;

  var PITCH_MAX  =  78 * Math.PI / 180;
  var PITCH_MIN  = -78 * Math.PI / 180;
  var FOV_MIN    = 28;
  var FOV_MAX    = 100;
  var DRAG_SENS  = 0.003;
  var WHEEL_SENS = 0.08;
  var PINCH_SENS = 0.25;
  var SMOOTH     = 0.13;

  var UP_VEC    = new THREE.Vector3(0, 1, 0);
  var RIGHT_VEC = new THREE.Vector3(1, 0, 0);

  // ── Мышь ──────────────────────────────────────────────────
  var dragging = false, lx = 0, ly = 0;

  canvas.addEventListener('mousedown', function(e) {
    dragging = true; lx = e.clientX; ly = e.clientY;
    canvas.style.cursor = 'grabbing';
    e.preventDefault();
  });
  window.addEventListener('mousemove', function(e) {
    if (!dragging) return;
    tYaw   -= (e.clientX - lx) * DRAG_SENS;
    tPitch -= (e.clientY - ly) * DRAG_SENS;
    tPitch  = Math.max(PITCH_MIN, Math.min(PITCH_MAX, tPitch));
    lx = e.clientX; ly = e.clientY;
  });
  window.addEventListener('mouseup', function() {
    dragging = false;
    canvas.style.cursor = 'grab';
  });
  canvas.style.cursor = 'grab';

  // ── Тач (1 палец = поворот, 2 пальца = зум) ──────────────
  var px = 0, py = 0, pinchDist0 = 0;

  canvas.addEventListener('touchstart', function(e) {
    if (e.touches.length === 1) {
      px = e.touches[0].clientX;
      py = e.touches[0].clientY;
    } else if (e.touches.length === 2) {
      pinchDist0 = getTouchDist(e);
    }
  }, { passive: true });

  canvas.addEventListener('touchmove', function(e) {
    e.preventDefault();
    if (e.touches.length === 1) {
      var dx = e.touches[0].clientX - px;
      var dy = e.touches[0].clientY - py;
      px = e.touches[0].clientX;
      py = e.touches[0].clientY;
      tYaw   -= dx * DRAG_SENS;
      tPitch -= dy * DRAG_SENS;
      tPitch  = Math.max(PITCH_MIN, Math.min(PITCH_MAX, tPitch));
    } else if (e.touches.length === 2) {
      var d = getTouchDist(e);
      if (pinchDist0 > 0) {
        tFov = Math.max(FOV_MIN, Math.min(FOV_MAX, tFov + (pinchDist0 - d) * PINCH_SENS));
      }
      pinchDist0 = d;
    }
  }, { passive: false });

  canvas.addEventListener('touchend', function(e) {
    if (e.touches.length < 2) pinchDist0 = 0;
  }, { passive: true });

  function getTouchDist(e) {
    var dx = e.touches[0].clientX - e.touches[1].clientX;
    var dy = e.touches[0].clientY - e.touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // ── Колёсико мыши ─────────────────────────────────────────
  canvas.addEventListener('wheel', function(e) {
    e.preventDefault();
    tFov = Math.max(FOV_MIN, Math.min(FOV_MAX, tFov + e.deltaY * WHEEL_SENS));
  }, { passive: false });

  // ── Гироскоп ──────────────────────────────────────────────
  var gyroActive = false;
  var gyroQ = new THREE.Quaternion();
  var gyroEuler = new THREE.Euler();
  // Поворот системы координат телефона → Three.js
  var qCorrect = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2);

  function onDeviceOrientation(e) {
    if (e.alpha == null && e.beta == null) return;
    gyroEuler.set(
      THREE.Math.degToRad(e.beta  || 0),
      THREE.Math.degToRad(e.alpha || 0),
      THREE.Math.degToRad(-(e.gamma || 0)),
      'YXZ'
    );
    gyroQ.setFromEuler(gyroEuler);
    gyroQ.multiply(qCorrect);
    gyroActive = true;
  }

  function enableGyro() {
    window.addEventListener('deviceorientation', onDeviceOrientation, { passive: true });
  }

  // iOS 13+ требует явного разрешения пользователя
  if (typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function') {
    var hint = document.getElementById('gyro-hint');
    if (hint) {
      hint.textContent = '📱 Нажмите для гироскопа';
      hint.style.cssText += ';pointer-events:all;cursor:pointer;opacity:1;animation:none';
      hint.addEventListener('click', function() {
        DeviceOrientationEvent.requestPermission().then(function(r) {
          if (r === 'granted') { enableGyro(); hint.style.display = 'none'; }
        }).catch(function() {});
      }, { once: true });
    }
  } else {
    // Android и все desktop — гироскоп без разрешения
    enableGyro();
  }

  // ── update() каждый кадр ──────────────────────────────────
  function update() {
    if (gyroActive) {
      // Телефон крутится — камера следует за ним
      camera.quaternion.slerp(gyroQ, 0.15);

      // Зум всё равно работает через FOV
      fov += (tFov - fov) * SMOOTH;
      camera.fov = fov;
      camera.updateProjectionMatrix();

    } else {
      // Drag-режим: строим quaternion из yaw + pitch
      yaw   += (tYaw   - yaw)   * SMOOTH;
      pitch += (tPitch - pitch) * SMOOTH;

      var qY = new THREE.Quaternion().setFromAxisAngle(UP_VEC,    yaw);
      var qX = new THREE.Quaternion().setFromAxisAngle(RIGHT_VEC, pitch);
      var q  = new THREE.Quaternion().multiplyQuaternions(qY, qX);
      camera.quaternion.copy(q);

      fov += (tFov - fov) * SMOOTH;
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
  }

  return { update: update };
}
