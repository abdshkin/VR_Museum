// ============================================================
// js/room.js — модуль 3D-зала (A-Frame)
//
// CUSTOMIZE геометрию зала: ищите «ROOM GEOMETRY» ниже.
// Каждый a-box / a-plane — отдельный объект в сцене.
// Документация A-Frame: https://aframe.io/docs/
// ============================================================

let sceneBuilt = false;  // сцена строится один раз

// ---- Открыть зал для художника с индексом artistIndex ----
function openRoom(artistIndex) {
  const artist = window._museumsArtists?.[artistIndex];
  if (!artist) return;

  stopAuto();  // остановить авторотацию слайдера

  updateRoomLabel(artist);

  if (!sceneBuilt) {
    buildScene(artist);
  } else {
    swapWallTexture(artist);
  }

  // Переключить виды
  document.getElementById('slider-view').classList.remove('active');
  document.getElementById('room-view').classList.add('active');
}

// ---- Закрыть зал → вернуться к слайдеру ----
function closeRoom() {
  document.getElementById('room-view').classList.remove('active');
  document.getElementById('slider-view').classList.add('active');
  startAuto();
  setTimeout(() => showBio(getCurrentIndex()), 300);
}

// ---- Обновить плашку имени/годов ----
function updateRoomLabel(artist) {
  document.getElementById('room-label-name').textContent  = localize(artist.names);
  document.getElementById('room-label-years').textContent = artist.years;
}

// ---- Получить data URI инфографики ----
function getInfoSrc(artist) {
  const b64 = artist.infographic[currentLang] || artist.infographic.ru;
  return 'data:image/jpeg;base64,' + b64;
}

// ---- Поменять текстуру на главной стене ----
function swapWallTexture(artist) {
  const imgAsset = document.getElementById('wall-texture');
  const wall     = document.getElementById('main-wall');
  if (!imgAsset || !wall) return;
  imgAsset.src = getInfoSrc(artist);
  setTimeout(() => wall.setAttribute('src', '#wall-texture'), 250);
}

// ============================================================
// ROOM GEOMETRY — стройте зал здесь
// Документация компонентов:
//   a-plane  — плоскость (стены, пол, потолок)
//   a-box    — параллелепипед (рамы, книги, молдинг)
//   a-cylinder — цилиндр (ваза, постамент)
//   a-light  — источник света
//   position="X Y Z" | rotation="X Y Z" | width height depth
// ============================================================
function buildScene(artist) {
  const container = document.getElementById('aframe-container');

  container.innerHTML =
    '<a-scene id="museum-scene" embedded vr-mode-ui="enabled:false"' +
      ' renderer="antialias:true;colorManagement:true"' +
      ' loading-screen="enabled:false">' +

    // -- ASSETS (текстура инфографики) --
    '<a-assets timeout="8000">' +
      '<img id="wall-texture" crossorigin="anonymous">' +
    '</a-assets>' +

    // -- КАМЕРА с orbit-controls (гироскоп + перетаскивание) --
    '<a-entity position="0 1.6 3.2">' +
      '<a-camera look-controls="enabled:false" wasd-controls="enabled:false"' +
        ' orbit-controls="' +
          'target: 0 1.6 0;' +
          'enableDamping: true; dampingFactor: 0.1;' +
          'rotateSpeed: 0.45;' +
          'minDistance: 1; maxDistance: 4.5;' +
          'minPolarAngle: 25; maxPolarAngle: 115;' +
          'enablePan: false; enableZoom: true;' +
          'initialPosition: 0 1.6 3.2">' +
      '</a-camera>' +
    '</a-entity>' +

    // -- СВЕТ (тёплый дневной) --
    '<a-light type="ambient" color="#fff5e0" intensity="0.55"></a-light>' +
    '<a-light type="directional" color="#fff9f0" intensity="1.1" position="2 5 2"></a-light>' +
    '<a-light type="point" color="#c8a96e" intensity="0.5" position="0 3 0" distance="7"></a-light>' +
    // Два прожектора подсвечивают инфографику
    '<a-light type="spot" color="#fffaf0" intensity="2.2" position="-1.8 3.5 0.5" angle="28" penumbra="0.4"></a-light>' +
    '<a-light type="spot" color="#fffaf0" intensity="2.2" position="1.8 3.5 0.5"  angle="28" penumbra="0.4"></a-light>' +

    // -- ПОЛ --
    '<a-plane position="0 0 0" rotation="-90 0 0" width="9" height="12" color="#1e1a14" roughness="0.85"></a-plane>' +

    // -- ПОТОЛОК --
    '<a-plane position="0 4 0" rotation="90 0 0" width="9" height="12" color="#13110e"></a-plane>' +

    // -- ГЛАВНАЯ СТЕНА (инфографика) --
    '<a-plane id="main-wall" position="0 2 -4.5" width="9" height="4" color="#ede5d0" src="#wall-texture" roughness="0.6"></a-plane>' +
    // Рама вокруг инфографики
    '<a-box position="0 2 -4.44" width="7"   height="4.55" depth="0.05" color="#7a5a2a"></a-box>' +
    '<a-box position="0 2 -4.46" width="7.35" height="4.85" depth="0.03" color="#4a3218"></a-box>' +

    // -- ЛЕВАЯ СТЕНА + картины --
    '<a-plane position="-4.5 2 0" rotation="0 90 0" width="12" height="4" color="#1a1712"></a-plane>' +
    '<a-box position="-4.44 2.8 -1.8" width="0.06" height="1.3" depth="1.0"  color="#e8ddc8"></a-box>' +
    '<a-box position="-4.41 2.8 -1.8" width="0.03" height="1.45" depth="1.15" color="#6a4a1a"></a-box>' +
    '<a-box position="-4.44 1.5 1.5"  width="0.06" height="1.1" depth="1.4"  color="#e8ddc8"></a-box>' +
    '<a-box position="-4.41 1.5 1.5"  width="0.03" height="1.25" depth="1.55" color="#6a4a1a"></a-box>' +

    // -- ПРАВАЯ СТЕНА + книжная полка --
    '<a-plane position="4.5 2 0" rotation="0 -90 0" width="12" height="4" color="#1a1712"></a-plane>' +
    '<a-box position="4.38 0.9 -0.8" width="0.15" height="1.8" depth="1.4" color="#2e2010"></a-box>' +
    '<a-box position="4.33 1.7 -0.8" width="0.02" height="0.06" depth="1.3" color="#4a3018"></a-box>' +
    '<a-box position="4.33 1.2 -0.8" width="0.02" height="0.06" depth="1.3" color="#4a3018"></a-box>' +
    // Книги (5 штук — меняйте color на свой вкус)
    '<a-box position="4.36 1.45 -1.20" width="0.05" height="0.44" depth="0.09" color="#c8a96e"></a-box>' +
    '<a-box position="4.36 1.45 -1.08" width="0.05" height="0.48" depth="0.11" color="#6e7a9b"></a-box>' +
    '<a-box position="4.36 1.45 -0.95" width="0.05" height="0.38" depth="0.08" color="#9b6e8a"></a-box>' +
    '<a-box position="4.36 1.45 -0.84" width="0.05" height="0.42" depth="0.10" color="#6e8a5f"></a-box>' +
    '<a-box position="4.36 1.45 -0.72" width="0.05" height="0.35" depth="0.08" color="#a06e6e"></a-box>' +

    // -- ПОСТАМЕНТ + ваза (декор) --
    '<a-cylinder position="-2.5 0   2.5" radius="0.22" height="0.9" color="#2e2418"></a-cylinder>' +
    '<a-cylinder position="-2.5 0.6 2.5" radius="0.12" height="0.6" color="#c8a96e" roughness="0.25" metalness="0.6"></a-cylinder>' +

    // -- ЛЕПНОЙ МОЛДИНГ (верхний край стен) --
    '<a-box position="0    3.88 -4.5" width="9"  height="0.1" depth="0.15" color="#8a6a3a"></a-box>' +
    '<a-box position="-4.5 3.88  0"   rotation="0 90 0" width="12" height="0.1" depth="0.15" color="#8a6a3a"></a-box>' +
    '<a-box position="4.5  3.88  0"   rotation="0 90 0" width="12" height="0.1" depth="0.15" color="#8a6a3a"></a-box>' +

    // -- ПЛИНТУС (нижний край стен) --
    '<a-box position="0    0.07 -4.5" width="9"  height="0.14" depth="0.12" color="#4a3018"></a-box>' +
    '<a-box position="-4.5 0.07  0"   rotation="0 90 0" width="12" height="0.14" depth="0.12" color="#4a3018"></a-box>' +
    '<a-box position="4.5  0.07  0"   rotation="0 90 0" width="12" height="0.14" depth="0.12" color="#4a3018"></a-box>' +

    '<a-sky color="#060504"></a-sky>' +
    '</a-scene>';

  sceneBuilt = true;

  // Загрузить текстуру после инициализации сцены
  document.querySelector('a-scene').addEventListener('loaded', () => {
    const imgAsset = document.getElementById('wall-texture');
    if (imgAsset) {
      imgAsset.src = getInfoSrc(artist);
      setTimeout(() => {
        document.getElementById('main-wall')?.setAttribute('src', '#wall-texture');
      }, 500);
    }
  }, { once: true });
}
