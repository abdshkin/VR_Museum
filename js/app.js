/**
 * KAZAKH ARTISTS VIRTUAL MUSEUM — js/app.js
 * ES6 module — orchestrates all features
 *
 * CUSTOMIZE: To add a new artist, edit data/artists.json only.
 * CUSTOMIZE: To change language strings, edit the LANG object below.
 */

// ============================================================
// LANGUAGE STRINGS
// Add new languages here — then add a button in index.html
// ============================================================
const LANG = {
  kz: {
    back:       '← Артқа',
    enterRoom:  'Залға кіру',
    gallery:    'Галерея',
    explore:    'Жалғастыр',
    dragHint:   '📱 Айналдыру үшін сүйреп апарыңыз',
    loading:    'Жүктелуде…',
    bio:        'Суретші туралы',
  },
  ru: {
    back:       '← Назад',
    enterRoom:  'Войти в зал',
    gallery:    'Галерея',
    explore:    'Продолжить',
    dragHint:   '📱 Перетяни для осмотра',
    loading:    'Жүктелуде…',
    bio:        'О художнике',
  },
  en: {
    back:       '← Back',
    enterRoom:  'Enter Room',
    gallery:    'Gallery',
    explore:    'Explore',
    dragHint:   '📱 Drag to explore room',
    loading:    'Loading…',
    bio:        'About the Artist',
  },
};

// ============================================================
// STATE
// ============================================================
let state = {
  artists:     [],
  lang:        'ru',
  current:     0,       // active slider index
  autoTimer:   null,
  isDragging:  false,
  dragStartX:  0,
  view:        'slider', // 'slider' | 'room'
  activeArtist: null,
};

// ============================================================
// DOM REFS (populated after DOMContentLoaded)
// ============================================================
let dom = {};

// ============================================================
// FETCH ARTISTS DATA
// ============================================================
async function loadArtists() {
  try {
    const res  = await fetch('data/artists.json');
    const data = await res.json();
    return data.artists;
  } catch (e) {
    console.error('Failed to load artists.json', e);
    return [];
  }
}

// ============================================================
// LANGUAGE
// ============================================================
function setLang(lang) {
  state.lang = lang;

  // Update buttons
  dom.langBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  // Update UI text
  dom.backBtn.innerHTML  = LANG[lang].back;
  dom.bioEnterBtn.textContent = LANG[lang].enterRoom;
  dom.bioLabel.textContent    = LANG[lang].bio;
  dom.gyroHint.innerHTML = `${LANG[lang].dragHint}<br><small>Drag to explore room</small>`;

  // Refresh bio panel text for current artist
  updateBioPanel();

  // If in room view, update infographic texture
  if (state.view === 'room' && state.activeArtist) {
    updateRoomTexture(state.activeArtist);
  }
}

// ============================================================
// SLIDER BUILD
// ============================================================
function buildSlider() {
  dom.sliderTrack.innerHTML = '';
  dom.sliderDots.innerHTML  = '';

  state.artists.forEach((artist, i) => {
    // --- CARD ---
    const card = document.createElement('div');
    card.className   = 'artist-card';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', artist.name[state.lang] || artist.name.en);

    const imgSrc   = artist.thumb;
    const initial  = (artist.name.en || '?')[0];

    card.innerHTML = `
      <div class="card-image-wrap">
        <img
          class="card-img"
          src="${imgSrc}"
          alt="${artist.name.en}"
          loading="lazy"
          onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"
        />
        <div class="card-img-placeholder" style="display:none">${initial}</div>
      </div>
      <div class="card-bottom">
        <div class="card-years">${artist.years}</div>
        <div class="card-name" data-name="${artist.id}">${artist.name[state.lang] || artist.name.en}</div>
        <div class="card-enter-btn">
          <span data-key="explore">${LANG[state.lang].explore}</span>
          <span class="arrow-icon"></span>
        </div>
      </div>
    `;

    // Click → show bio panel (mobile) or enter room (desktop)
    card.addEventListener('click', () => selectArtist(i));
    card.addEventListener('keypress', e => e.key === 'Enter' && selectArtist(i));

    dom.sliderTrack.appendChild(card);

    // --- DOT ---
    const dot = document.createElement('button');
    dot.className = `dot${i === 0 ? ' active' : ''}`;
    dot.setAttribute('aria-label', `Artist ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dom.sliderDots.appendChild(dot);
  });
}

function updateCardNames() {
  document.querySelectorAll('.card-name[data-name]').forEach((el, i) => {
    const artist = state.artists[i];
    if (artist) el.textContent = artist.name[state.lang] || artist.name.en;
  });
  document.querySelectorAll('.card-enter-btn [data-key="explore"]').forEach(el => {
    el.textContent = LANG[state.lang].explore;
  });
}

// ============================================================
// SLIDER NAVIGATION
// ============================================================
function goTo(index) {
  state.current = ((index % state.artists.length) + state.artists.length) % state.artists.length;
  const offset  = state.current * 100;
  dom.sliderTrack.style.transform = `translateX(-${offset}%)`;

  // Dots
  document.querySelectorAll('.dot').forEach((d, i) => {
    d.classList.toggle('active', i === state.current);
  });

  // Show bio panel
  selectArtist(state.current, false);
}

function next() { goTo(state.current + 1); }
function prev() { goTo(state.current - 1); }

function startAuto() {
  stopAuto();
  state.autoTimer = setInterval(() => next(), 10000);
}
function stopAuto() {
  if (state.autoTimer) { clearInterval(state.autoTimer); state.autoTimer = null; }
}

// ============================================================
// BIO PANEL
// ============================================================
function selectArtist(index, showPanel = true) {
  state.current     = index;
  state.activeArtist = state.artists[index];
  updateBioPanel();
  if (showPanel) showBio();
}

function updateBioPanel() {
  const artist = state.activeArtist || state.artists[state.current];
  if (!artist) return;
  dom.bioName.textContent  = artist.name[state.lang]  || artist.name.en;
  dom.bioYears.textContent = artist.years;
  dom.bioText.textContent  = artist.bio[state.lang]   || artist.bio.en;
  dom.bioLabel.textContent = LANG[state.lang].bio;
  dom.bioEnterBtn.textContent = LANG[state.lang].enterRoom;
}

function showBio() {
  dom.bioPanel.classList.add('visible');
}

function hideBio() {
  dom.bioPanel.classList.remove('visible');
}

// ============================================================
// TOUCH / SWIPE
// ============================================================
function initSwipe() {
  const el = dom.sliderTrackWrapper;
  let startX = 0, moved = false;

  el.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    moved  = false;
    stopAuto();
  }, { passive: true });

  el.addEventListener('touchmove', e => {
    moved = Math.abs(e.touches[0].clientX - startX) > 8;
  }, { passive: true });

  el.addEventListener('touchend', e => {
    if (!moved) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) dx > 0 ? prev() : next();
    startAuto();
  });
}

// ============================================================
// VIEW TRANSITIONS
// ============================================================
function showView(name) {
  state.view = name;
  dom.sliderView.classList.toggle('hidden', name !== 'slider');
  dom.roomView.classList.toggle('hidden',   name !== 'room');
}

function enterRoom(artist) {
  state.activeArtist = artist;
  hideBio();
  stopAuto();

  // Update room label
  dom.roomLabelName.textContent  = artist.name[state.lang] || artist.name.en;
  dom.roomLabelYears.textContent = artist.years;

  // Show gyro hint → fade after 4s
  dom.gyroHint.classList.remove('fade');
  setTimeout(() => dom.gyroHint.classList.add('fade'), 4000);

  buildRoom(artist);
  showView('room');
}

function goBack() {
  showView('slider');
  destroyRoom();
  startAuto();
}

// ============================================================
// 3D ROOM (Three.js)
// ============================================================
let threeCtx = null;

function buildRoom(artist) {
  destroyRoom();

  const container = dom.aframeContainer;
  const W = container.clientWidth;
  const H = container.clientHeight;

  // ---- Renderer ----
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type    = THREE.PCFSoftShadowMap;
  renderer.outputEncoding    = THREE.sRGBEncoding;
  container.appendChild(renderer.domElement);

  // ---- Scene ----
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a1510);
  scene.fog = new THREE.Fog(0x1a1510, 8, 20);

  // ---- Camera ----
  const camera = new THREE.PerspectiveCamera(65, W / H, 0.1, 50);
  camera.position.set(0, 1.6, 0.1);

  // ---- Orbit (mouse + touch) ----
  const orbit = createOrbitControls(camera, renderer.domElement);

  // ---- Lights ----
  const ambient = new THREE.AmbientLight(0xfff5e0, 0.5);
  scene.add(ambient);

  const dirLight = new THREE.DirectionalLight(0xffe8c0, 1.4);
  dirLight.position.set(2, 5, 3);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.set(1024, 1024);
  scene.add(dirLight);

  // Warm point from above (chandelier-style)
  const pointLight = new THREE.PointLight(0xd4a853, 1.0, 8);
  pointLight.position.set(0, 3.5, 0);
  scene.add(pointLight);

  // ---- ROOM GEOMETRY ----
  const mats = {
    floor:    new THREE.MeshLambertMaterial({ color: 0x3d2f1e }),
    wall:     new THREE.MeshLambertMaterial({ color: 0x2a2018 }),
    ceiling:  new THREE.MeshLambertMaterial({ color: 0x1e1a12 }),
    molding:  new THREE.MeshLambertMaterial({ color: 0xd4a853 }),
    frame:    new THREE.MeshLambertMaterial({ color: 0x8b6914 }),
    dark:     new THREE.MeshLambertMaterial({ color: 0x1a1410 }),
  };

  const roomW = 7, roomH = 4.5, roomD = 8;

  // Floor
  addBox(scene, roomW, 0.05, roomD, 0, 0, 0, mats.floor, true);

  // Ceiling
  addBox(scene, roomW, 0.05, roomD, 0, roomH, 0, mats.ceiling);

  // Back wall
  addBox(scene, roomW, roomH, 0.1, 0, roomH/2, -roomD/2, mats.wall);

  // Front wall (behind camera)
  addBox(scene, roomW, roomH, 0.1, 0, roomH/2, roomD/2, mats.wall);

  // Side walls
  addBox(scene, 0.1, roomH, roomD, -roomW/2, roomH/2, 0, mats.wall);
  addBox(scene, 0.1, roomH, roomD,  roomW/2, roomH/2, 0, mats.wall);

  // Gold molding strips along floor/ceiling
  addBox(scene, roomW, 0.06, 0.06,  0, 0.03,   -roomD/2 + 0.05, mats.molding); // floor front
  addBox(scene, roomW, 0.06, 0.06,  0, roomH-0.03, -roomD/2 + 0.05, mats.molding); // ceiling front

  // ---- MAIN WALL INFOGRAPHIC ----
  const infPath = (artist.infographic && artist.infographic[state.lang])
    ? artist.infographic[state.lang]
    : null;

  if (infPath) {
    const loader = new THREE.TextureLoader();
    loader.load(
      infPath,
      texture => {
        texture.encoding = THREE.sRGBEncoding;
        const mat = new THREE.MeshLambertMaterial({ map: texture });
        addBox(scene, 4, 2.6, 0.01, 0, 2.2, -roomD/2 + 0.12, mat);
      },
      undefined,
      () => addFallbackPanel(scene, artist, roomD)
    );
  } else {
    addFallbackPanel(scene, artist, roomD);
  }

  // Gold picture frame around infographic
  addFrame(scene, 4.15, 2.75, -roomD/2 + 0.11, mats.frame);

  // ---- DECORATIONS: Shelves + Books ----
  addShelf(scene, mats, -roomW/2 + 0.12, 2.0, -1.5);
  addShelf(scene, mats, -roomW/2 + 0.12, 1.3, -1.5);
  addBooks(scene, -roomW/2 + 0.12, 2.05, -1.5);
  addBooks(scene, -roomW/2 + 0.12, 1.35, -1.5);

  // ---- DECORATIONS: Pedestal ----
  addPedestal(scene, mats, 2.5, 0, -2.5, artist.color || '#c4843a');

  // ---- RESIZE ----
  function onResize() {
    const w = container.clientWidth, h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', onResize);

  // Сохраняем контекст ДО старта loop — loop обновляет animId по ссылке
  threeCtx = { renderer, animId: null, onResize, orbit };

  // ---- LOOP ----
  function animate() {
    threeCtx.animId = requestAnimationFrame(animate);
    orbit.update();
    renderer.render(scene, camera);
  }
  animate();

  // Store for texture updates
  threeCtx.updateTexture = () => buildRoom(artist);

// ---- Orbit Controls — Mobile-First, Touch-Safe ----
// Fixes:
//  • All listeners on canvas element only (не на window) — не конфликтуют со слайдером
//  • touchmove с preventDefault() — блокирует системный скролл внутри 3D-зала
//  • Гироскоп и touch разделены: touch-драг отключает гироскоп на время касания
//  • Все слушатели собираются в массив и удаляются в destroy() — нет утечек
//  • Скорость (thetaSpeed/phiSpeed) сбрасывается при новом touchstart — нет "заморозки"
function createOrbitControls(camera, domEl) {
  // --- Угловое состояние камеры ---
  const orb = {
    theta:       0,             // горизонтальный угол (рад)
    phi:         Math.PI / 2,   // вертикальный угол (рад)
    thetaVel:    0,             // скорость по theta (инерция)
    phiVel:      0,             // скорость по phi (инерция)
    lastX:       0,
    lastY:       0,
    active:      false,         // палец/мышь нажаты прямо сейчас
    useGyro:     false,         // гироскоп разрешён и активен
    gyroBase:    null,          // начальный alpha гироскопа
    touchActive: false,         // пользователь касается экрана
  };

  const SENSITIVITY = 0.006;   // чувствительность свайпа
  const DAMPING     = 0.85;    // затухание инерции (меньше = быстрее остановка)
  const PHI_MIN     = 0.25;    // не смотреть выше потолка
  const PHI_MAX     = Math.PI - 0.25; // не смотреть ниже пола

  // --- Список слушателей для cleanup ---
  const _listeners = [];
  function on(el, type, fn, opts) {
    el.addEventListener(type, fn, opts);
    _listeners.push({ el, type, fn, opts });
  }

  // =====================================================
  // TOUCH (основное управление на мобиле)
  // =====================================================
  on(domEl, 'touchstart', e => {
    if (e.touches.length !== 1) return; // игнорируем мультитач
    orb.active      = true;
    orb.touchActive = true;
    orb.lastX    = e.touches[0].clientX;
    orb.lastY    = e.touches[0].clientY;
    // Сбрасываем инерцию чтобы не "дёргало" при новом касании
    orb.thetaVel = 0;
    orb.phiVel   = 0;
    // Гироскоп отключается на время ручного свайпа
    orb.gyroBase = null;
  }, { passive: true });

  on(domEl, 'touchmove', e => {
    if (!orb.active || e.touches.length !== 1) return;
    // ВАЖНО: preventDefault блокирует скролл страницы внутри 3D-зала
    // passive:false обязателен для этого
    e.preventDefault();

    const dx = e.touches[0].clientX - orb.lastX;
    const dy = e.touches[0].clientY - orb.lastY;

    orb.thetaVel = dx * SENSITIVITY;
    orb.phiVel   = -dy * SENSITIVITY;
    orb.theta   += orb.thetaVel;
    orb.phi     += orb.phiVel;
    orb.phi      = Math.max(PHI_MIN, Math.min(PHI_MAX, orb.phi));

    orb.lastX = e.touches[0].clientX;
    orb.lastY = e.touches[0].clientY;
  }, { passive: false }); // ← НЕ passive — нужен preventDefault

  on(domEl, 'touchend', e => {
    orb.active      = false;
    orb.touchActive = false;
    // Инерция сохраняется — продолжит гасить в update()
  }, { passive: true });

  on(domEl, 'touchcancel', e => {
    orb.active      = false;
    orb.touchActive = false;
    orb.thetaVel    = 0;
    orb.phiVel      = 0;
  }, { passive: true });

  // =====================================================
  // MOUSE (десктоп)
  // =====================================================
  on(domEl, 'mousedown', e => {
    orb.active   = true;
    orb.lastX    = e.clientX;
    orb.lastY    = e.clientY;
    orb.thetaVel = 0;
    orb.phiVel   = 0;
    domEl.style.cursor = 'grabbing';
  });

  // mousemove и mouseup — на document чтобы не терять курсор за пределами canvas
  const onMouseMove = e => {
    if (!orb.active) return;
    const dx = e.clientX - orb.lastX;
    const dy = e.clientY - orb.lastY;
    orb.thetaVel = dx * SENSITIVITY * 0.7;
    orb.phiVel   = -dy * SENSITIVITY * 0.7;
    orb.theta   += orb.thetaVel;
    orb.phi     += orb.phiVel;
    orb.phi      = Math.max(PHI_MIN, Math.min(PHI_MAX, orb.phi));
    orb.lastX    = e.clientX;
    orb.lastY    = e.clientY;
  };
  const onMouseUp = () => {
    orb.active = false;
    domEl.style.cursor = 'grab';
  };
  on(document, 'mousemove', onMouseMove);
  on(document, 'mouseup',   onMouseUp);
  domEl.style.cursor = 'grab';

  // =====================================================
  // ГИРОСКОП (DeviceOrientation)
  // Включается только если touch не активен — нет конфликта
  // =====================================================
  const onOrientation = e => {
    if (orb.touchActive || !orb.useGyro) return;
    if (e.beta == null || e.gamma == null)  return;

    // Захватываем базовую точку при первом событии после включения
    if (orb.gyroBase === null) {
      orb.gyroBase = { alpha: e.alpha || 0, beta: e.beta, gamma: e.gamma };
      return;
    }

    // Горизонтальное вращение — gamma (наклон телефона влево/вправо)
    const dGamma = (e.gamma - orb.gyroBase.gamma);
    // Вертикальное — beta (наклон вперёд/назад)
    const dBeta  = (e.beta  - orb.gyroBase.beta);

    orb.theta = -dGamma * (Math.PI / 180) * 1.2;
    orb.phi   = Math.max(PHI_MIN, Math.min(PHI_MAX,
      Math.PI / 2 - dBeta * (Math.PI / 180) * 0.8
    ));
  };
  on(window, 'deviceorientation', onOrientation);

  // iOS 13+ требует явного разрешения пользователя
  if (typeof DeviceOrientationEvent !== 'undefined') {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      // Запрашиваем при первом тапе — уже есть жест пользователя
      const reqGyro = async () => {
        try {
          const perm = await DeviceOrientationEvent.requestPermission();
          if (perm === 'granted') {
            orb.useGyro  = true;
            orb.gyroBase = null;
          }
        } catch (_) {}
      };
      on(domEl, 'touchend', reqGyro, { once: true, passive: true });
    } else {
      // Android и старые Safari — гироскоп сразу доступен
      orb.useGyro  = true;
      orb.gyroBase = null;
    }
  }

  // =====================================================
  // UPDATE — вызывается каждый кадр из animate()
  // =====================================================
  function update() {
    // Применяем инерцию только когда не касаемся экрана
    if (!orb.active) {
      orb.theta    += orb.thetaVel;
      orb.phi      += orb.phiVel;
      orb.thetaVel *= DAMPING;
      orb.phiVel   *= DAMPING;
      // Гасим до нуля чтобы не было вечного дрейфа
      if (Math.abs(orb.thetaVel) < 0.0001) orb.thetaVel = 0;
      if (Math.abs(orb.phiVel)   < 0.0001) orb.phiVel   = 0;
      orb.phi = Math.max(PHI_MIN, Math.min(PHI_MAX, orb.phi));
    }

    // Камера стоит на месте, смотрит в точку на сфере вокруг неё
    const R  = 3.0;
    const ex = Math.sin(orb.phi) * Math.sin(orb.theta);
    const ey = Math.cos(orb.phi);
    const ez = -Math.sin(orb.phi) * Math.cos(orb.theta);

    camera.position.set(0, 1.62, 0);
    camera.lookAt(ex * R, 1.62 + ey * R * 0.6, ez * R);
  }

  // =====================================================
  // DESTROY — убираем всех слушателей при выходе из зала
  // =====================================================
  function destroy() {
    _listeners.forEach(({ el, type, fn, opts }) => {
      el.removeEventListener(type, fn, opts);
    });
    _listeners.length = 0;
    domEl.style.cursor = '';
  }

  return { update, destroy, orb };
}

function addBox(scene, w, h, d, x, y, z, mat, receiveShadow = false) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  mesh.position.set(x, y, z);
  mesh.receiveShadow = receiveShadow;
  mesh.castShadow    = true;
  scene.add(mesh);
  return mesh;
}

function addFallbackPanel(scene, artist, roomD) {
  // Color plane with artist initials as "painting"
  const colorStr = artist.color || '#c4843a';
  const col = new THREE.Color(colorStr);
  const mat = new THREE.MeshLambertMaterial({ color: col });
  addBox(scene, 4, 2.6, 0.01, 0, 2.2, -roomD/2 + 0.12, mat);
}

function addFrame(scene, w, h, z, mat) {
  const t = 0.12;
  // Top, bottom, left, right frame bars
  addBox(scene, w, t, t,  0,   h/2,  z, mat);
  addBox(scene, w, t, t,  0,  -h/2,  z, mat);
  addBox(scene, t, h, t, -w/2, 0,    z, mat);
  addBox(scene, t, h, t,  w/2, 0,    z, mat);
}

function addShelf(scene, mats, x, y, z) {
  addBox(scene, 0.05, 0.04, 1.2, x + 0.67, y, z, mats.molding);
}

function addBooks(scene, x, y, z) {
  const colors = [0x8b2020, 0x205080, 0x206040, 0x806020, 0x602080];
  for (let i = 0; i < 5; i++) {
    const w  = 0.06 + Math.random() * 0.04;
    const hh = 0.22 + Math.random() * 0.12;
    const mat = new THREE.MeshLambertMaterial({ color: colors[i] });
    addBox(scene, w, hh, 0.18, x + 0.38 + i * 0.13, y + hh/2, z, mat);
  }
}

function addPedestal(scene, mats, x, y, z, colorStr) {
  addBox(scene, 0.4, 0.9, 0.4, x, y + 0.45, z, mats.dark, true);
  const col = new THREE.Color(colorStr);
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.18, 16, 16),
    new THREE.MeshLambertMaterial({ color: col })
  );
  sphere.position.set(x, y + 0.9 + 0.18, z);
  scene.add(sphere);
}

function destroyRoom() {
  if (!threeCtx) return;
  cancelAnimationFrame(threeCtx.animId);
  // Убираем ВСЕ touch/mouse/gyro слушатели orbit через его destroy()
  if (threeCtx.orbit && threeCtx.orbit.destroy) threeCtx.orbit.destroy();
  window.removeEventListener('resize', threeCtx.onResize);
  threeCtx.renderer.dispose();
  const canvas = threeCtx.renderer.domElement;
  if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
  threeCtx = null;
}

function updateRoomTexture(artist) {
  if (threeCtx) buildRoom(artist);
}

// ============================================================
// INIT
// ============================================================
async function init() {
  // Collect DOM
  dom = {
    loader:             document.getElementById('loader'),
    sliderView:         document.getElementById('slider-view'),
    roomView:           document.getElementById('room-view'),
    sliderTrack:        document.getElementById('slider-track'),
    sliderTrackWrapper: document.getElementById('slider-track-wrapper'),
    sliderDots:         document.getElementById('slider-dots'),
    prevBtn:            document.getElementById('prev-arrow'),
    nextBtn:            document.getElementById('next-arrow'),
    backBtn:            document.getElementById('back-btn'),
    bioPanel:           document.getElementById('bio-panel'),
    bioName:            document.getElementById('bio-name'),
    bioYears:           document.getElementById('bio-years'),
    bioText:            document.getElementById('bio-text'),
    bioEnterBtn:        document.getElementById('bio-enter-btn'),
    bioLabel:           document.getElementById('bio-label'),
    aframeContainer:    document.getElementById('aframe-container'),
    roomLabelName:      document.getElementById('room-label-name'),
    roomLabelYears:     document.getElementById('room-label-years'),
    gyroHint:           document.getElementById('gyro-hint'),
    langBtns:           document.querySelectorAll('.lang-btn'),
  };

  // Load data
  state.artists = await loadArtists();

  // Build UI
  buildSlider();
  initSwipe();
  setLang('ru');
  goTo(0);
  startAuto();

  // Events
  dom.prevBtn.addEventListener('click', () => { prev(); stopAuto(); startAuto(); });
  dom.nextBtn.addEventListener('click', () => { next(); stopAuto(); startAuto(); });

  dom.backBtn.addEventListener('click', goBack);

  dom.bioEnterBtn.addEventListener('click', () => {
    const artist = state.activeArtist || state.artists[state.current];
    if (artist) enterRoom(artist);
  });

  // Close bio on background tap
  dom.sliderView.addEventListener('click', e => {
    if (e.target === dom.sliderView) hideBio();
  });

  dom.langBtns.forEach(btn => {
    btn.addEventListener('click', () => setLang(btn.dataset.lang));
  });

  // Done — hide loader
  setTimeout(() => dom.loader.classList.add('hidden'), 600);
}

// ============================================================
// BOOT
// ============================================================
document.addEventListener('DOMContentLoaded', init);
