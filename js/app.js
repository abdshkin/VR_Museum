/**
 * KAZAKH ARTISTS VIRTUAL MUSEUM — js/app.js
 * Orbit viewer (Google Street View style) + trilingual UI + working back button
 */

// ============================================================
// LANGUAGE STRINGS
// ============================================================
var LANG = {
  kz: {
    back:      '← Артқа',
    enterRoom: 'Залға кіру',
    explore:   'Жалғастыр',
    dragHint:  '📱 Айналдыру үшін сүйреп апарыңыз',
    bio:       'Суретші туралы',
    eyebrow:   'Қазақстан · Өнер · Art',
    title:     'Ұлы Суретшілер',
  },
  ru: {
    back:      '← Назад',
    enterRoom: 'Войти в зал',
    explore:   'Продолжить',
    dragHint:  '📱 Перетяни для осмотра',
    bio:       'О художнике',
    eyebrow:   'Казахстан · Өнер · Art',
    title:     'Ұлы Суретшілер',
  },
  en: {
    back:      '← Back',
    enterRoom: 'Enter Room',
    explore:   'Explore',
    dragHint:  '📱 Drag to explore room',
    bio:       'About the Artist',
    eyebrow:   'Kazakhstan · Өнер · Art',
    title:     'Great Artists',
  },
};

// ============================================================
// ДАННЫЕ ХУДОЖНИКОВ (встроенный fallback — работает без сервера)
// ============================================================
var ARTISTS_FALLBACK = [
  {
    id: 'telzhanov', years: '1927 – 2013', color: '#c4843a',
    name: { kz: 'Мұхамедханафия Тельжанов', ru: 'Мухамедханафия Тельжанов', en: 'Mukhamedhanafia Telzhanov' },
    bio: {
      kz: 'Қазақ КСР және КСРО халық суретшісі (1978). Омскіде туылған, Репин атындағы институтты бітірген (1953). «Жамал», «Домбыраның үні», «Атамекен» туындылары қазақ кескіндемесінің классикасына айналды.',
      ru: 'Народный художник КазССР и СССР (1978). Родился в Омске, окончил Институт живописи им. Репина (1953). Работы «Жамал», «Звуки домбры», «На земле дедов» стали классикой казахской живописи.',
      en: "People's Artist of the Kazakh SSR and USSR (1978). Born in Omsk, graduated from the Repin Institute (1953). His works 'Zhamal', 'Sounds of the Dombra' and 'Native Land' are classics of Kazakh painting.",
    },
    thumb: 'assets/images/thumbs/telzhanov_thumb.jpg',
    infographic: { kz: 'assets/images/infographics/telzhanov_kz.jpg', ru: 'assets/images/infographics/telzhanov_ru.jpg', en: 'assets/images/infographics/telzhanov_en.jpg' },
  },
  {
    id: 'galimbayeva', years: '1917 – 2008', color: '#7a5c9e',
    name: { kz: 'Айша Ғалымбаева', ru: 'Айша Галимбаева', en: 'Aisha Galimbayeva' },
    bio: {
      kz: 'Қазақстанның алғашқы кәсіби суретші әйелі, ҚазКСР халық суретшісі (1967). ВГИК кино факультетін бітірген (1949). «Қазақ халық костюмі» альбомының авторы.',
      ru: 'Первая профессиональная художница-казашка, народный художник КазССР (1967). Окончила художественно-декоративный факультет ВГИКа (1949). Автор альбома «Казахский народный костюм».',
      en: "The first professional Kazakh female artist, People's Artist of the Kazakh SSR (1967). Graduated from VGIK (1949). Author of the album 'Kazakh National Costume'.",
    },
    thumb: 'assets/images/thumbs/galimbayeva_thumb.jpg',
    infographic: { kz: 'assets/images/infographics/galimbayeva_kz.jpg', ru: 'assets/images/infographics/galimbayeva_ru.jpg', en: 'assets/images/infographics/galimbayeva_en.jpg' },
  },
  {
    id: 'mullashev', years: '1944 – н.в.', color: '#3a7a5c',
    name: { kz: 'Камиль Муллашев', ru: 'Камиль Муллашев', en: 'Kamil Mullashev' },
    bio: {
      kz: 'Қазақстан мен Татарстанның еңбек сіңірген суретшісі. «Жер және уақыт. Қазақстан» триптихі Париждегі Гранд-Пале мен бүкіл дүниежүзінде таныс.',
      ru: 'Заслуженный деятель искусств Казахстана и народный художник Татарстана. Триптих «Земля и время. Казахстан» экспонировался в Гранд-Пале в Париже, серебряная медаль Академии художеств Франции.',
      en: "Honored Artist of Kazakhstan and People's Artist of Tatarstan. His triptych 'Land and Time. Kazakhstan' was shown at the Grand Palais in Paris, winning a silver medal from the French Academy of Arts.",
    },
    thumb: 'assets/images/thumbs/mullashev_thumb.jpg',
    infographic: { kz: 'assets/images/infographics/mullashev_kz.jpg', ru: 'assets/images/infographics/mullashev_ru.jpg', en: 'assets/images/infographics/mullashev_en.jpg' },
  },
  {
    id: 'ismailova', years: '1929 – 2013', color: '#c44a4a',
    name: { kz: 'Гүлфайрус Ысмайылова', ru: 'Гульфайрус Исмаилова', en: 'Gulfairous Ismailova' },
    bio: {
      kz: 'ҚазКСР халық суретшісі (1987), актриса. «Қазақ вальсі» — «Кастеев» мұражайының бас туындысы. Абай атындағы опера театрының бас суретшісі (16 жыл). «Қыз Жібек» фильмінің безендірушісі.',
      ru: 'Народный художник КазССР (1987), актриса. «Казахский вальс» — жемчужина музея им. Кастеева. 16 лет — главный художник театра оперы и балета им. Абая. Художник-постановщик фильма «Кыз Жибек».',
      en: "People's Artist of the Kazakh SSR (1987), actress. Her 'Kazakh Waltz' is the centrepiece of the Kasteev Museum. For 16 years chief designer of the Abai Opera Theatre. Production designer of 'Kyz Zhibek'.",
    },
    thumb: 'assets/images/thumbs/ismailova_thumb.jpg',
    infographic: { kz: 'assets/images/infographics/ismailova_kz.jpg', ru: 'assets/images/infographics/ismailova_ru.jpg', en: 'assets/images/infographics/ismailova_en.jpg' },
  },
  {
    id: 'kasteev', years: '1904 – 1973', color: '#4a6e9e',
    name: { kz: 'Әбілхан Қастеев', ru: 'Абылхан Кастеев', en: 'Abylkhan Kasteev' },
    bio: {
      kz: 'Қазақ кәсіби кескіндемесінің негізін қалаушы, ҚазКСР халық суретшісі (1944). 1100-ден астам туынды жасаған. Алматыдағы мемлекеттік өнер мұражайы оның атымен аталған.',
      ru: 'Основоположник казахского профессионального изобразительного искусства, народный художник КазССР (1944). Создал свыше 1100 произведений. Именем художника назван Государственный музей искусств в Алматы.',
      en: "Pioneer of Kazakh professional fine art, People's Artist of the Kazakh SSR (1944). Created over 1,100 works. The State Museum of Arts in Almaty bears his name.",
    },
    thumb: 'assets/images/thumbs/kasteev_thumb.jpg',
    infographic: { kz: 'assets/images/infographics/kasteev_kz.jpg', ru: 'assets/images/infographics/kasteev_ru.jpg', en: 'assets/images/infographics/kasteev_en.jpg' },
  },
];

// ============================================================
// СОСТОЯНИЕ
// ============================================================
var S = {
  artists:      [],
  lang:         'ru',
  current:      0,
  autoTimer:    null,
  view:         'slider',
  activeArtist: null,
};

// DOM-ссылки (заполняются в init)
var D = {};

// ============================================================
// ЗАГРУЗКА ДАННЫХ
// ============================================================
async function loadArtists() {
  try {
    var res = await fetch('data/artists.json');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    var data = await res.json();
    if (Array.isArray(data.artists) && data.artists.length) return data.artists;
    throw new Error('empty');
  } catch (e) {
    console.warn('Fallback to built-in data:', e.message);
    return ARTISTS_FALLBACK;
  }
}

// ============================================================
// СЛАЙДЕР
// ============================================================
function buildSlider() {
  D.track.innerHTML = '';
  D.dots.innerHTML  = '';

  S.artists.forEach(function(artist, i) {
    var card = document.createElement('div');
    card.className = 'artist-card';
    var initial = (artist.name.en || 'A')[0];
    card.innerHTML =
      '<div class="card-image-wrap">' +
        '<img class="card-img" src="' + artist.thumb + '" alt="' + (artist.name.en || '') + '" loading="lazy"' +
          ' onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">' +
        '<div class="card-img-placeholder" style="display:none">' + initial + '</div>' +
      '</div>' +
      '<div class="card-bottom">' +
        '<div class="card-years">' + artist.years + '</div>' +
        '<div class="card-name">' + (artist.name[S.lang] || artist.name.en) + '</div>' +
        '<div class="card-enter-btn"><span class="explore-lbl">' + LANG[S.lang].explore + '</span><span class="arrow-icon"></span></div>' +
      '</div>';

    card.addEventListener('click', function() { onCardClick(i); });
    D.track.appendChild(card);

    var dot = document.createElement('button');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', function() { goTo(i); });
    D.dots.appendChild(dot);
  });
}

function updateCardText() {
  D.track.querySelectorAll('.card-name').forEach(function(el, i) {
    var a = S.artists[i];
    if (a) el.textContent = a.name[S.lang] || a.name.en;
  });
  D.track.querySelectorAll('.explore-lbl').forEach(function(el) {
    el.textContent = LANG[S.lang].explore;
  });
}

function goTo(idx) {
  var len = S.artists.length;
  S.current = ((idx % len) + len) % len;
  D.track.style.transform = 'translateX(-' + (S.current * 100) + '%)';
  D.dots.querySelectorAll('.dot').forEach(function(d, i) {
    d.classList.toggle('active', i === S.current);
  });
  S.activeArtist = S.artists[S.current];
  refreshBio();
}

function next() { goTo(S.current + 1); }
function prev() { goTo(S.current - 1); }

function startAuto() {
  stopAuto();
  S.autoTimer = setInterval(next, 10000);
}
function stopAuto() {
  if (S.autoTimer) { clearInterval(S.autoTimer); S.autoTimer = null; }
}

function initSwipe() {
  var el = D.trackWrap;
  var startX = 0;
  el.addEventListener('touchstart', function(e) {
    startX = e.touches[0].clientX;
    stopAuto();
  }, { passive: true });
  el.addEventListener('touchend', function(e) {
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) { dx > 0 ? prev() : next(); }
    startAuto();
  }, { passive: true });
}

// ============================================================
// BIO ПАНЕЛЬ
// ============================================================
function refreshBio() {
  var artist = S.activeArtist;
  if (!artist) return;
  D.bioName.textContent  = artist.name[S.lang]  || artist.name.en  || '';
  D.bioYears.textContent = artist.years || '';
  D.bioText.textContent  = artist.bio[S.lang]   || artist.bio.en   || '';
}

function showBio() { D.bioPanel.classList.add('visible'); }
function hideBio() { D.bioPanel.classList.remove('visible'); }

function onCardClick(i) {
  goTo(i);
  showBio();
}

// ============================================================
// ЯЗЫК
// ============================================================
function setLang(lang) {
  S.lang = lang;
  D.langBtns.forEach(function(btn) {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  if (D.bioEnterBtn) D.bioEnterBtn.textContent = LANG[lang].enterRoom;
  if (D.bioLabel)    D.bioLabel.textContent    = LANG[lang].bio;
  if (D.gyroHint)    D.gyroHint.textContent    = LANG[lang].dragHint;
  if (D.roomBackBtn) D.roomBackBtn.textContent = LANG[lang].back;

  // Заголовок галереи
  var eyebrow = document.querySelector('.section-eyebrow');
  if (eyebrow) eyebrow.textContent = LANG[lang].eyebrow;
  var titleEl = document.querySelector('.section-title');
  if (titleEl) titleEl.textContent = LANG[lang].title;

  // Метка в зале
  if (S.activeArtist && D.roomLabelName) {
    D.roomLabelName.textContent  = S.activeArtist.name[lang] || S.activeArtist.name.en;
    D.roomLabelYears.textContent = S.activeArtist.years;
  }

  updateCardText();
  refreshBio();

  // Перестраиваем зал если открыт (обновляет инфографику на нужном языке)
  if (S.view === 'room' && S.activeArtist && threeCtx) {
    buildRoom(S.activeArtist);
  }
}

// ============================================================
// ПЕРЕКЛЮЧЕНИЕ ВИДОВ
// ============================================================
function showView(name) {
  S.view = name;
  D.sliderView.classList.toggle('hidden', name !== 'slider');
  D.roomView.classList.toggle('hidden',   name !== 'room');
}

function enterRoom(artist) {
  S.activeArtist = artist;
  hideBio();
  stopAuto();
  D.roomLabelName.textContent  = artist.name[S.lang] || artist.name.en;
  D.roomLabelYears.textContent = artist.years;
  D.gyroHint.classList.remove('fade');
  setTimeout(function() { D.gyroHint.classList.add('fade'); }, 4000);
  showView('room');
  buildRoom(artist);
}

function goBack() {
  showView('slider');
  destroyRoom();
  startAuto();
}

// ============================================================
// 3D ЗАЛ — Three.js
// ============================================================
var threeCtx = null;

function buildRoom(artist) {
  destroyRoom();

  var container = D.roomContainer;
  var W = container.clientWidth  || window.innerWidth;
  var H = container.clientHeight || window.innerHeight;

  var renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type    = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  var scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a1510);
  scene.fog = new THREE.Fog(0x1a1510, 8, 20);

  var camera = new THREE.PerspectiveCamera(65, W / H, 0.1, 50);
  camera.position.set(0, 1.62, 0);

  // Свет
  scene.add(new THREE.AmbientLight(0xfff5e0, 0.55));
  var dir = new THREE.DirectionalLight(0xffe8c0, 1.3);
  dir.position.set(2, 5, 3);
  dir.castShadow = true;
  scene.add(dir);
  var pt = new THREE.PointLight(0xd4a853, 0.9, 8);
  pt.position.set(0, 3.5, 0);
  scene.add(pt);

  // Материалы
  var mFloor = new THREE.MeshLambertMaterial({ color: 0x3d2f1e });
  var mWall  = new THREE.MeshLambertMaterial({ color: 0x2a2018 });
  var mCeil  = new THREE.MeshLambertMaterial({ color: 0x1e1a12 });
  var mMold  = new THREE.MeshLambertMaterial({ color: 0xd4a853 });
  var mFrame = new THREE.MeshLambertMaterial({ color: 0x8b6914 });
  var mDark  = new THREE.MeshLambertMaterial({ color: 0x1a1410 });

  var rW = 7, rH = 4.5, rD = 8;

  function box(w, h, d, x, y, z, mat, shadow) {
    var m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z);
    if (shadow) m.receiveShadow = true;
    m.castShadow = true;
    scene.add(m);
    return m;
  }

  // Комната
  box(rW, 0.05, rD,  0, 0,    0,      mFloor, true);
  box(rW, 0.05, rD,  0, rH,   0,      mCeil);
  box(rW, rH,   0.1, 0, rH/2, -rD/2,  mWall);
  box(rW, rH,   0.1, 0, rH/2,  rD/2,  mWall);
  box(0.1, rH,  rD, -rW/2, rH/2, 0,   mWall);
  box(0.1, rH,  rD,  rW/2, rH/2, 0,   mWall);

  // Молдинги
  box(rW, 0.06, 0.06, 0, 0.03,    -rD/2 + 0.05, mMold);
  box(rW, 0.06, 0.06, 0, rH-0.03, -rD/2 + 0.05, mMold);

  // Рамка под картину
  var fw = 4.15, fh = 2.75, fz = -rD/2 + 0.11, ft = 0.12;
  box(fw, ft, ft,  0,    fh/2,  fz, mFrame);
  box(fw, ft, ft,  0,   -fh/2,  fz, mFrame);
  box(ft, fh, ft, -fw/2, 0,     fz, mFrame);
  box(ft, fh, ft,  fw/2, 0,     fz, mFrame);

  // Инфографика или цветная заглушка
  var infPath = artist.infographic && artist.infographic[S.lang]
    ? artist.infographic[S.lang] : null;

  if (infPath) {
    new THREE.TextureLoader().load(
      infPath,
      function(tex) {
        var m = new THREE.Mesh(
          new THREE.BoxGeometry(4, 2.6, 0.01),
          new THREE.MeshLambertMaterial({ map: tex })
        );
        m.position.set(0, 2.2, -rD/2 + 0.12);
        scene.add(m);
      },
      undefined,
      function() { fallbackPanel(); }
    );
  } else {
    fallbackPanel();
  }

  function fallbackPanel() {
    box(4, 2.6, 0.01, 0, 2.2, -rD/2 + 0.12,
      new THREE.MeshLambertMaterial({ color: new THREE.Color(artist.color || '#c4843a') }));
  }

  // Полки и книги
  box(0.05, 0.04, 1.2, -rW/2+0.79, 2.0, -1.5, mMold);
  box(0.05, 0.04, 1.2, -rW/2+0.79, 1.3, -1.5, mMold);
  var bColors = [0x8b2020, 0x205080, 0x206040, 0x806020, 0x602080];
  for (var bi = 0; bi < 5; bi++) {
    var bw = 0.06 + (bi * 0.008), bh = 0.22 + (bi * 0.02);
    box(bw, bh, 0.18, -rW/2+0.38+(bi*0.13), 2.0+bh/2, -1.5,
      new THREE.MeshLambertMaterial({ color: bColors[bi] }));
    box(bw, bh, 0.18, -rW/2+0.38+(bi*0.13), 1.3+bh/2, -1.5,
      new THREE.MeshLambertMaterial({ color: bColors[(bi+2)%5] }));
  }

  // Пьедестал со сферой
  box(0.4, 0.9, 0.4, 2.5, 0.45, -2.5, mDark, true);
  var sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.18, 16, 16),
    new THREE.MeshLambertMaterial({ color: new THREE.Color(artist.color || '#c4843a') })
  );
  sphere.position.set(2.5, 1.08, -2.5);
  scene.add(sphere);

  // Orbit controls (Street View style)
  var orbit = createOrbit(camera, renderer.domElement);

  function onResize() {
    var w = container.clientWidth || window.innerWidth;
    var h = container.clientHeight || window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', onResize);

  threeCtx = { renderer: renderer, animId: null, onResize: onResize, orbit: orbit };

  function animate() {
    threeCtx.animId = requestAnimationFrame(animate);
    orbit.update();
    renderer.render(scene, camera);
  }
  animate();
}

function destroyRoom() {
  if (!threeCtx) return;
  cancelAnimationFrame(threeCtx.animId);
  if (threeCtx.orbit) threeCtx.orbit.destroy();
  window.removeEventListener('resize', threeCtx.onResize);
  threeCtx.renderer.dispose();
  var canvas = threeCtx.renderer.domElement;
  if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
  threeCtx = null;
}

// ============================================================
// ORBIT + QUATERNION GYRO CONTROLS
// Google Street View style: drag look-around + pinch zoom + gyroscope
// ============================================================
function createOrbit(camera, canvas) {

  var FOV_DEF = 65;    // начальный FOV
  var FOV_MIN = 20;    // максимальный зум (~3x)
  var FOV_MAX = 65;
  var SENS    = 0.010; // чувствительность drag
  var DAMP    = 0.82;  // затухание инерции

  // --- Состояние ---
  var fov      = FOV_DEF;
  var vX = 0, vY = 0;       // инерция drag
  var dragOffX = 0;          // смещение от drag поверх гиро (радианы)
  var dragOffY = 0;
  var lastX = 0, lastY = 0;
  var isDown     = false;
  var isTouching = false;
  var isPinch    = false;
  var lastPinch  = 0;

  // Кватернионы
  var Q     = new THREE.Quaternion();  // итоговая ориентация
  var QGyro = new THREE.Quaternion();  // от гироскопа
  var QDrag = new THREE.Quaternion();  // смещение от drag
  var QBase = new THREE.Quaternion();  // базовая ориентация при захвате drag

  // Для конвертации DeviceOrientation → кватернион (алгоритм DeviceOrientationControls THREE.js r128)
  var zee   = new THREE.Vector3(0, 0, 1);
  var euler = new THREE.Euler();
  var q0    = new THREE.Quaternion();
  var q1    = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5));

  var gyroActive = false;
  var hasGyro    = false;

  // Начальный взгляд вперёд (без гироскопа)
  var fallTheta = 0;
  var fallPhi   = Math.PI / 2;

  var listeners = [];
  function on(el, type, fn, opt) {
    el.addEventListener(type, fn, opt);
    listeners.push([el, type, fn, opt]);
  }

  // ── PINCH DISTANCE ──────────────────────────────────────────
  function getPinchDist(e) {
    var dx = e.touches[0].clientX - e.touches[1].clientX;
    var dy = e.touches[0].clientY - e.touches[1].clientY;
    return Math.sqrt(dx*dx + dy*dy);
  }

  // ── TOUCH START ──────────────────────────────────────────────
  on(canvas, 'touchstart', function(e) {
    e.preventDefault();
    if (e.touches.length === 2) {
      isPinch    = true;
      isDown     = false;
      isTouching = true;
      lastPinch  = getPinchDist(e);
      return;
    }
    if (e.touches.length === 1) {
      isPinch    = false;
      isDown     = true;
      isTouching = true;
      lastX      = e.touches[0].clientX;
      lastY      = e.touches[0].clientY;
      vX = 0; vY = 0;
      QBase.copy(Q);
      QDrag.identity();
    }
  }, { passive: false });

  // ── TOUCH MOVE ───────────────────────────────────────────────
  on(canvas, 'touchmove', function(e) {
    e.preventDefault();

    // PINCH-ZOOM
    if (e.touches.length === 2) {
      isPinch = true; isDown = false;
      var d     = getPinchDist(e);
      var delta = lastPinch - d;  // >0 = zoom out
      fov     = Math.max(FOV_MIN, Math.min(FOV_MAX, fov + delta * 0.15));
      camera.fov = fov;
      camera.updateProjectionMatrix();
      lastPinch = d;
      return;
    }

    // DRAG (1 палец)
    if (!isDown || isPinch) return;
    var dx = e.touches[0].clientX - lastX;
    var dy = e.touches[0].clientY - lastY;

    vX = dx * SENS;
    vY = dy * SENS;

    if (gyroActive) {
      dragOffX -= dx * SENS;
      dragOffY += dy * SENS;
      dragOffY  = Math.max(-1.2, Math.min(1.2, dragOffY));
    } else {
      fallTheta -= dx * SENS;
      fallPhi    = Math.max(0.15, Math.min(Math.PI - 0.15, fallPhi + dy * SENS));
    }

    lastX = e.touches[0].clientX;
    lastY = e.touches[0].clientY;
  }, { passive: false });

  // ── TOUCH END ────────────────────────────────────────────────
  on(canvas, 'touchend', function() {
    isPinch    = false;
    isDown     = false;
    isTouching = false;
  }, { passive: true });

  on(canvas, 'touchcancel', function() {
    isPinch = false; isDown = false; isTouching = false;
    vX = 0; vY = 0;
  }, { passive: true });

  // ── MOUSE (десктоп) ──────────────────────────────────────────
  on(canvas, 'mousedown', function(e) {
    isDown = true;
    lastX  = e.clientX; lastY = e.clientY;
    vX = 0; vY = 0;
    canvas.style.cursor = 'grabbing';
  });
  on(canvas, 'wheel', function(e) {
    e.preventDefault();
    fov = Math.max(FOV_MIN, Math.min(FOV_MAX, fov + e.deltaY * 0.05));
    camera.fov = fov;
    camera.updateProjectionMatrix();
  }, { passive: false });

  var onMM = function(e) {
    if (!isDown) return;
    var dx = e.clientX - lastX, dy = e.clientY - lastY;
    vX = dx * SENS * 0.7; vY = dy * SENS * 0.7;
    if (gyroActive) {
      dragOffX -= dx * SENS * 0.7;
      dragOffY  = Math.max(-1.2, Math.min(1.2, dragOffY + dy * SENS * 0.7));
    } else {
      fallTheta -= dx * SENS * 0.7;
      fallPhi    = Math.max(0.15, Math.min(Math.PI - 0.15, fallPhi + dy * SENS * 0.7));
    }
    lastX = e.clientX; lastY = e.clientY;
  };
  var onMU = function() { isDown = false; canvas.style.cursor = 'grab'; };
  on(document, 'mousemove', onMM);
  on(document, 'mouseup',   onMU);

  canvas.style.cursor = 'grab';

  // ── ГИРОСКОП — кватернионный ─────────────────────────────────
  // Точная копия алгоритма из DeviceOrientationControls three.js r128
  var onOrient = function(e) {
    if (!hasGyro || e.alpha == null) return;

    var alpha  = e.alpha  ? THREE.MathUtils.degToRad(e.alpha)  : 0;
    var beta   = e.beta   ? THREE.MathUtils.degToRad(e.beta)   : 0;
    var gamma  = e.gamma  ? THREE.MathUtils.degToRad(e.gamma)  : 0;
    var orient = window.screen && window.screen.orientation && window.screen.orientation.angle
                 ? THREE.MathUtils.degToRad(window.screen.orientation.angle) : 0;

    euler.set(beta, alpha, -gamma, 'YXZ');
    QGyro.setFromEuler(euler);
    QGyro.multiply(q1);
    q0.setFromAxisAngle(zee, -orient);
    QGyro.multiply(q0);

    gyroActive = true;
  };
  on(window, 'deviceorientation', onOrient);

  // iOS 13+ — запрашиваем разрешение при первом тапе
  function tryEnableGyro() {
    if (typeof DeviceOrientationEvent === 'undefined') return;
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      on(canvas, 'touchend', function askPerm() {
        DeviceOrientationEvent.requestPermission()
          .then(function(r) { if (r === 'granted') hasGyro = true; })
          .catch(function() {});
        canvas.removeEventListener('touchend', askPerm);
      }, { passive: true });
    } else {
      hasGyro = true;
    }
  }
  tryEnableGyro();

  // ── UPDATE (каждый кадр) ─────────────────────────────────────
  return {
    update: function() {

      if (gyroActive && hasGyro) {
        // ── РЕЖИМ ГИРОСКОПА ──
        var qH = new THREE.Quaternion().setFromAxisAngle(
          new THREE.Vector3(0, 1, 0), dragOffX);
        var qV = new THREE.Quaternion().setFromAxisAngle(
          new THREE.Vector3(1, 0, 0), dragOffY);
        Q.copy(QGyro).multiply(qH).multiply(qV);

        if (!isDown) {
          dragOffX -= vX * 0.3; vX *= DAMP;
          dragOffY += vY * 0.3; vY *= DAMP;
          dragOffY  = Math.max(-1.2, Math.min(1.2, dragOffY));
          if (Math.abs(vX) < 0.0001) vX = 0;
          if (Math.abs(vY) < 0.0001) vY = 0;
        }

        camera.position.set(0, 1.62, 0);
        camera.quaternion.copy(Q);

      } else {
        // ── РЕЖИМ БЕЗ ГИРОСКОПА (drag look-around, как Google Street View) ──
        if (!isDown) {
          fallTheta -= vX; vX *= DAMP;
          fallPhi    = Math.max(0.15, Math.min(Math.PI - 0.15, fallPhi + vY));
          vY *= DAMP;
          if (Math.abs(vX) < 0.0001) vX = 0;
          if (Math.abs(vY) < 0.0001) vY = 0;
        }
        var R  = 3.0;
        var sp = Math.sin(fallPhi), cp = Math.cos(fallPhi);
        var st = Math.sin(fallTheta), ct = Math.cos(fallTheta);
        camera.position.set(0, 1.62, 0);
        camera.lookAt(sp * st * R, 1.62 + cp * R * 0.5, -sp * ct * R);
      }
    },

    destroy: function() {
      listeners.forEach(function(l) { l[0].removeEventListener(l[1], l[2], l[3]); });
      listeners = [];
      canvas.style.cursor = '';
    },
  };
}

// ============================================================
// ИНИЦИАЛИЗАЦИЯ
// ============================================================
async function init() {
  D.loader         = document.getElementById('loader');
  D.sliderView     = document.getElementById('slider-view');
  D.roomView       = document.getElementById('room-view');
  D.track          = document.getElementById('slider-track');
  D.trackWrap      = document.getElementById('slider-track-wrapper');
  D.dots           = document.getElementById('slider-dots');
  D.prevBtn        = document.getElementById('prev-arrow');
  D.nextBtn        = document.getElementById('next-arrow');
  D.bioPanel       = document.getElementById('bio-panel');
  D.bioName        = document.getElementById('bio-name');
  D.bioYears       = document.getElementById('bio-years');
  D.bioText        = document.getElementById('bio-text');
  D.bioEnterBtn    = document.getElementById('bio-enter-btn');
  D.bioLabel       = document.getElementById('bio-label');
  D.roomContainer  = document.getElementById('aframe-container');
  D.roomLabelName  = document.getElementById('room-label-name');
  D.roomLabelYears = document.getElementById('room-label-years');
  D.gyroHint       = document.getElementById('gyro-hint');
  D.langBtns       = document.querySelectorAll('.lang-btn');
  D.roomBackBtn    = document.getElementById('room-back-btn');

  // Проверяем критичные элементы
  var missing = ['track','trackWrap','dots','bioPanel','roomContainer'].filter(function(k) { return !D[k]; });
  if (missing.length) {
    console.error('Missing DOM elements:', missing);
    if (D.loader) D.loader.innerHTML = '<div style="color:#c44;padding:20px;text-align:center">DOM error: ' + missing.join(', ') + '</div>';
    return;
  }

  // Загружаем данные
  S.artists = await loadArtists();

  // Строим слайдер
  buildSlider();
  initSwipe();

  // Начальный язык и состояние
  S.lang         = 'ru';
  S.current      = 0;
  S.activeArtist = S.artists[0];
  D.track.style.transform = 'translateX(0%)';

  // Применяем переводы
  setLang('ru');

  // События кнопок
  if (D.prevBtn)    D.prevBtn.addEventListener('click',    function() { prev(); stopAuto(); startAuto(); });
  if (D.nextBtn)    D.nextBtn.addEventListener('click',    function() { next(); stopAuto(); startAuto(); });
  if (D.roomBackBtn) D.roomBackBtn.addEventListener('click', goBack);

  if (D.bioEnterBtn) {
    D.bioEnterBtn.addEventListener('click', function() {
      if (S.activeArtist) enterRoom(S.activeArtist);
    });
  }

  D.langBtns.forEach(function(btn) {
    btn.addEventListener('click', function() { setLang(btn.dataset.lang); });
  });

  // Автопрокрутка
  startAuto();

  // Скрываем лоадер
  setTimeout(function() {
    if (D.loader) D.loader.classList.add('hidden');
  }, 400);
}

document.addEventListener('DOMContentLoaded', function() {
  init().catch(function(err) {
    console.error('Museum init failed:', err);
    var loader = document.getElementById('loader');
    if (loader) loader.innerHTML =
      '<div style="color:#c44;font-family:sans-serif;padding:20px;text-align:center">' +
      'Ошибка инициализации<br><small>' + err.message + '</small></div>';
  });
});
