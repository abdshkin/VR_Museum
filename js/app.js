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
    eyebrow:   'Казахстан · Искусство · Art',
    title:     'Великие художники',
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
  controlMode:  'gyro',  // 'gyro' или 'touch'
};

// DOM-ссылки (заполняются в init)
var D = {};

// ============================================================
// УПРАВЛЕНИЕ РЕЖИМОМ КОНТРОЛЯ
// ============================================================
function setControlMode(mode) {
  if (mode !== 'gyro' && mode !== 'touch') mode = 'gyro';
  S.controlMode = mode;
  localStorage.setItem('controlMode', mode);
  
  // Обновляем UI кнопок
  var modeButtons = document.querySelectorAll('.control-mode-btn');
  modeButtons.forEach(function(btn) {
    btn.classList.toggle('active', btn.dataset.mode === mode);
  });
  
  // Пересоздаём комнату если открыта, чтобы применить новый режим
  if (S.view === 'room' && S.activeArtist && threeCtx) {
    buildRoom(S.activeArtist);
  }
}

function loadControlModePreference() {
  var saved = localStorage.getItem('controlMode');
  if (saved === 'touch' || saved === 'gyro') {
    S.controlMode = saved;
  } else {
    S.controlMode = 'gyro';
  }
  
  // Обновляем UI кнопок при загрузке
  var modeButtons = document.querySelectorAll('.control-mode-btn');
  modeButtons.forEach(function(btn) {
    btn.classList.toggle('active', btn.dataset.mode === S.controlMode);
  });
}

// ============================================================
// ОПТИМИЗИРОВАННАЯ ЗАГРУЗКА ИНФОГРАФИК
// ============================================================
var textureCache = {};  // Кэш видимых текстур (path → THREE.Texture)
var loadingPromises = {};  // Текущие загрузки (path → Promise)
var TEXTURE_CACHE_MAX_AGE = 5 * 60 * 1000;  // 5 минут
var TEXTURE_LOAD_TIMEOUT = 8000;  // 8 секунд таймаут

function getIsMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function getIsIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

function getIsIPad() {
  return /iPad/.test(navigator.userAgent) || (navigator.maxTouchPoints > 2 && /Macintosh/.test(navigator.userAgent));
}

function getDevicePixelRatioOptimized() {
  var dpr = window.devicePixelRatio || 1;
  var isIOS = getIsIOS();
  var isMobile = getIsMobile();
  
  // Для iOS iPhone - ограничиваем DPR до максимум 2
  if (isIOS && !getIsIPad()) {
    return Math.min(dpr, 2);
  }
  
  // Для iPad и Android планшетов - может быть выше
  if (getIsIPad() || /android/i.test(navigator.userAgent) && screen.width > 600) {
    return Math.min(dpr, 2.5);
  }
  
  // Для обычных мобильных - 1.5 максимум
  if (isMobile) {
    return Math.min(dpr, 1.5);
  }
  
  return Math.min(dpr, 2);
}

/**
 * Загружает текстуру с кэшированием и оптимизацией размера
 * @param {string} url - Путь к изображению
 * @returns {Promise} Resolves с THREE.Texture или null
 */
function loadTextureOptimized(url) {
  if (!url) return Promise.resolve(null);
  
  // Проверяем кэш
  if (textureCache[url]) {
    return Promise.resolve(textureCache[url]);
  }
  
  // Возвращаем существующую загрузку если уже идёт
  if (loadingPromises[url]) {
    return loadingPromises[url];
  }
  
  // Создаём новую загрузку с таймаутом
  var promise = new Promise(function(resolve, reject) {
    var timeoutId = setTimeout(function() {
      reject(new Error('Texture load timeout: ' + url));
    }, TEXTURE_LOAD_TIMEOUT);
    
    // Загружаем только один раз через ONE Image→TextureLoader
    var loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');
    
    loader.load(
      url,
      function(texture) {
        clearTimeout(timeoutId);
        
        // Оптимизируем текстуру
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.encoding = THREE.sRGBEncoding;
        
        // Сжимаем для мобильных устройств
        if (getIsMobile() && texture.image) {
          var maxSize;
          var isIOS = getIsIOS();
          
          // Более агрессивное сжатие на iOS для экономии памяти
          if (isIOS) {
            // iPhone - максимум 512px
            maxSize = getIsIPad() ? 768 : 512;
          } else {
            // Android - 1024px
            maxSize = 1024;
          }
          
          if (texture.image.width > maxSize || texture.image.height > maxSize) {
            var scale = Math.min(maxSize / Math.max(texture.image.width, texture.image.height), 1);
            texture.userData.scale = scale;
            
            // На очень слабых мобильных - еще больше сжимаем
            if (navigator.deviceMemory && navigator.deviceMemory < 4) {
              maxSize *= 0.75;
              scale = Math.min(maxSize / Math.max(texture.image.width, texture.image.height), 1);
              texture.userData.scale = scale;
            }
          }
        }
        
        // Кэшируем
        textureCache[url] = texture;
        delete loadingPromises[url];
        
        resolve(texture);
      },
      undefined,  // progress
      function(err) {
        clearTimeout(timeoutId);
        delete loadingPromises[url];
        reject(err);
      }
    );
  });
  
  loadingPromises[url] = promise;
  return promise;
}

function clearTextureCache() {
  Object.values(textureCache).forEach(function(tex) {
    if (tex && tex.dispose) tex.dispose();
  });
  textureCache = {};
}

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

/**
 * Предварительно загружает инфографики соседних художников
 * для быстрого переключения
 */
function preloadAdjacentInfographics(artistIndex) {
  var adjacentIndices = [
    (artistIndex - 1 + S.artists.length) % S.artists.length,
    (artistIndex + 1) % S.artists.length
  ];
  
  var langs = ['kz', 'ru', 'en'];
  
  adjacentIndices.forEach(function(idx) {
    var artist = S.artists[idx];
    if (artist && artist.infographic) {
      langs.forEach(function(lang) {
        var url = artist.infographic[lang];
        if (url && !textureCache[url] && !loadingPromises[url]) {
          // Запускаем загрузку в фоне (не ожидаем)
          loadTextureOptimized(url).catch(function(err) {
            // Молча игнорируем ошибки при фоновой загрузке
          });
        }
      });
    }
  });
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
  
  // Предварительно загружаем инфографики соседних художников
  preloadAdjacentInfographics(S.current);
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
function updateLangText(lang) {
  var mapping = [
    ['bioEnterBtn', 'enterRoom'],
    ['bioLabel', 'bio'],
    ['gyroHint', 'dragHint'],
    ['roomBackBtn', 'back']
  ];
  mapping.forEach(function(pair) {
    if (D[pair[0]]) D[pair[0]].textContent = LANG[lang][pair[1]];
  });
  var eyebrow = document.querySelector('.section-eyebrow');
  if (eyebrow) eyebrow.textContent = LANG[lang].eyebrow;
  var titleEl = document.querySelector('.section-title');
  if (titleEl) titleEl.textContent = LANG[lang].title;
}

function setLang(lang) {
  S.lang = lang;
  D.langBtns.forEach(function(btn) {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  updateLangText(lang);

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
  // Скрываем шапку в зале
  var hdr = document.getElementById('hdr');
  if (hdr) hdr.style.display = name === 'room' ? 'none' : '';

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
// 3D ЗАЛ — Three.js (улучшенная версия)
// ============================================================

var threeCtx = null;

// ── Вспомогательные материалы ──────────────────────────────

function disposeMesh(mesh) {
  if (!mesh) return;
  if (mesh.geometry) mesh.geometry.dispose();
  if (Array.isArray(mesh.material)) {
    mesh.material.forEach(function(m) { m.dispose(); });
  } else if (mesh.material) {
    mesh.material.dispose();
  }
}

function disposeGroup(group) {
  group.traverse(function(obj) {
    if (obj.isMesh) disposeMesh(obj);
  });
}

/**
 * Инициализирует WebGL контекст с iOS-специфическими фиксами
 */
function setupWebGLContext(renderer) {
  var gl = renderer.getContext();
  if (!gl) return;
  
  // Обработка потери контекста WebGL (важно для iOS)
  var canvas = renderer.domElement;
  
  // Слушаем потерю контекста
  canvas.addEventListener('webglcontextlost', function(e) {
    console.warn('WebGL context lost');
    e.preventDefault();
  }, false);
  
  // Восстанавливаем контекст
  canvas.addEventListener('webglcontextrestored', function() {
    console.log('WebGL context restored');
    // Контекст восстановлен, renderer готов к использованию
  }, false);
  
  // iOS фиксы для WebGL
  if (getIsIOS()) {
    // Используем базовое буферирование для лучшей совместимости
    gl.hint(gl.FRAGMENT_SHADER_DERIVATIVE_HINT, gl.FASTEST);
  }
}

// ── Фабрика материалов ─────────────────────────────────────

function createMaterial(type, opts) {
  opts = opts || {};
  if (type === 'lambert') return new THREE.MeshLambertMaterial(opts);
  if (type === 'basic') return new THREE.MeshBasicMaterial(opts);
  return new THREE.MeshLambertMaterial(opts);
}

// ── Процедурная текстура паркета ───────────────────────────

function makeParquetTexture(size) {
  size = size || 512;
  var canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  var ctx = canvas.getContext('2d');
  var plankW = size / 4, plankH = size / 8;

  for (var row = 0; row < 8; row++) {
    for (var col = 0; col < 4; col++) {
      var base = (row + col) % 2 === 0 ? 48 : 38;
      var r = base + Math.floor(Math.random() * 12);
      var g = Math.floor(r * 0.62);
      var b = Math.floor(r * 0.32);
      ctx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
      ctx.fillRect(col * plankW, row * plankH, plankW, plankH);

      // Волокна древесины
      ctx.strokeStyle = 'rgba(0,0,0,0.08)';
      ctx.lineWidth = 0.5;
      for (var fi = 0; fi < 6; fi++) {
        var fy = row * plankH + (fi / 6) * plankH;
        ctx.beginPath();
        ctx.moveTo(col * plankW, fy + Math.random() * 4 - 2);
        ctx.lineTo(col * plankW + plankW, fy + Math.random() * 4 - 2);
        ctx.stroke();
      }

      // Щели
      ctx.strokeStyle = 'rgba(0,0,0,0.35)';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(col * plankW + 0.6, row * plankH + 0.6, plankW - 1.2, plankH - 1.2);
    }
  }
  var tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 4);
  return tex;
}

// ── Процедурная текстура стены ─────────────────────────────

function makeWallTexture(size) {
  size = size || 512;
  var canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  var ctx = canvas.getContext('2d');
  ctx.fillStyle = '#2a2018';
  ctx.fillRect(0, 0, size, size);

  // Тонкие горизонтальные полосы — имитация фактуры штукатурки
  for (var i = 0; i < size; i += 4) {
    var alpha = Math.random() * 0.04;
    ctx.fillStyle = 'rgba(255,220,160,' + alpha + ')';
    ctx.fillRect(0, i, size, 2);
  }
  var tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 1);
  return tex;
}

// ── Текстура ковра ─────────────────────────────────────────

function makeRugTexture(color, size) {
  size = size || 256;
  var canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  var ctx = canvas.getContext('2d');
  var c = new THREE.Color(color || '#7a1a1a');
  ctx.fillStyle = 'rgb(' + Math.round(c.r*180) + ',' + Math.round(c.g*80) + ',' + Math.round(c.b*80) + ')';
  ctx.fillRect(0, 0, size, size);

  // Узор — простая геометрия
  ctx.strokeStyle = 'rgba(220,180,80,0.5)';
  ctx.lineWidth = 3;
  ctx.strokeRect(12, 12, size - 24, size - 24);
  ctx.lineWidth = 1;
  ctx.strokeRect(20, 20, size - 40, size - 40);

  // Диагональная штриховка по краям
  for (var d = 0; d < size; d += 14) {
    ctx.beginPath();
    ctx.moveTo(0, d); ctx.lineTo(d, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(size, d); ctx.lineTo(d, size);
    ctx.stroke();
  }

  return new THREE.CanvasTexture(canvas);
}

// ── Основная функция ───────────────────────────────────────

function buildRoom(artist) {
  destroyRoom();

  var container = D.roomContainer;
  var W = container.clientWidth  || window.innerWidth;
  var H = container.clientHeight || window.innerHeight;
  
  // Убеждаемся что есть размеры
  if (W <= 0 || H <= 0) {
    console.error('Invalid container dimensions:', W, H);
    return;
  }

  // Renderer
  var renderer = new THREE.WebGLRenderer({ antialias: true });
  var isIOS = getIsIOS();
  var isMobile = getIsMobile();
  
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type    = THREE.PCFSoftShadowMap;
  renderer.toneMapping       = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  
  container.appendChild(renderer.domElement);

  // Добавляем touch-action для корректной обработки жестов
  renderer.domElement.style.touchAction = 'none';

  // Scene
  var scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a1510);
  scene.fog = new THREE.FogExp2(0x1a1510, 0.045);

  // Camera
  var camera = new THREE.PerspectiveCamera(65, W / H, 0.05, 60);
  camera.position.set(0, 1.62, 2.5);
  camera.lookAt(0, 1.62, -4);

  // ── Освещение ──────────────────────────────────────────

  // Ambient
  var ambient = new THREE.AmbientLight(0xfff0d0, 0.4);
  scene.add(ambient);

  // Основной направленный свет (общее освещение зала)
  var dirLight = new THREE.DirectionalLight(0xffe8c0, 0.8);
  dirLight.position.set(0, 6, 2);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.set(1024, 1024);
  dirLight.shadow.camera.near = 0.5;
  dirLight.shadow.camera.far  = 20;
  dirLight.shadow.camera.left = dirLight.shadow.camera.bottom = -6;
  dirLight.shadow.camera.right = dirLight.shadow.camera.top   =  6;
  scene.add(dirLight);

  // Люстра — тёплая точечная лампа
  var chandPt = new THREE.PointLight(0xffd890, 1.6, 10, 1.5);
  chandPt.position.set(0, 3.8, -1);
  chandPt.castShadow = true;
  chandPt.shadow.mapSize.set(512, 512);
  scene.add(chandPt);

  // Прожектор над главной панелью
  var spotMain = new THREE.SpotLight(0xfff5e0, 2.5, 7, Math.PI / 7, 0.3, 1.5);
  spotMain.position.set(0, 4.0, -2.5);
  spotMain.target.position.set(0, 2.2, -3.9);
  spotMain.castShadow = true;
  spotMain.shadow.mapSize.set(512, 512);
  scene.add(spotMain);
  scene.add(spotMain.target);

  // Два боковых прожектора для картин
  [-1, 1].forEach(function(side) {
    var sp = new THREE.SpotLight(0xffeedd, 1.2, 5, Math.PI / 9, 0.5, 2);
    sp.position.set(side * 3.2, 4.0, -1.0);
    sp.target.position.set(side * 3.4, 2.0, -3.9);
    sp.castShadow = false;
    scene.add(sp);
    scene.add(sp.target);
  });

  // === ОПТИМИЗАЦИЯ ДЛЯ МОБИЛЬНЫХ ===
  if (isMobile) {
    // Уменьшаем качество shadow map на мобильных
    renderer.shadowMap.type = THREE.BasicShadowMap;
    dirLight.shadow.mapSize.set(512, 512);
    chandPt.shadow.mapSize.set(256, 256);
    spotMain.shadow.mapSize.set(256, 256);
  }

  // ── Геометрия ──────────────────────────────────────────

  var textures = []; // для dispose
  var rW = 8, rH = 4.8, rD = 10;
  var artColor = new THREE.Color(artist.color || '#c4843a');

  // Материалы - оптимизируем размер текстур для мобильных
  var textureSize = isMobile ? 256 : 512;  // Уменьшаем размер текстур для мобильных
  var parquetTex = makeParquetTexture(textureSize);
  textures.push(parquetTex);
  var wallTex    = makeWallTexture(textureSize);
  textures.push(wallTex);

  var matDefs = {
    mFloor: { map: parquetTex },
    mWall: { map: wallTex },
    mCeil: { color: 0x1c1810 },
    mMold: { color: 0xd4a853 },
    mMoldD: { color: 0xb08830 },
    mFrame: { color: 0x7a5512 },
    mDark: { color: 0x1a1410 },
    mDarkMid: { color: 0x2e2418 },
    mGold: { color: 0xe8c060 },
    mBench: { color: 0x3a2810 },
    mBenchLeather: { color: 0x5a1a10 }
  };
  var mFloor = createMaterial('lambert', matDefs.mFloor);
  var mWall = createMaterial('lambert', matDefs.mWall);
  var mCeil = createMaterial('lambert', matDefs.mCeil);
  var mMold = createMaterial('lambert', matDefs.mMold);
  var mMoldD = createMaterial('lambert', matDefs.mMoldD);
  var mFrame = createMaterial('lambert', matDefs.mFrame);
  var mDark = createMaterial('lambert', matDefs.mDark);
  var mDarkMid = createMaterial('lambert', matDefs.mDarkMid);
  var mGold = createMaterial('lambert', matDefs.mGold);
  var mBench = createMaterial('lambert', matDefs.mBench);
  var mBenchLeather = createMaterial('lambert', matDefs.mBenchLeather);

  // Группа всей комнаты
  var roomGroup = new THREE.Group();
  scene.add(roomGroup);

  function addBox(w, h, d, x, y, z, mat, parent, shadow) {
    var mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    mesh.position.set(x, y, z);
    if (shadow !== false) { mesh.receiveShadow = true; mesh.castShadow = true; }
    (parent || roomGroup).add(mesh);
    return mesh;
  }

  function addCylinder(rt, rb, h, seg, x, y, z, mat, parent) {
    var mesh = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    (parent || roomGroup).add(mesh);
    return mesh;
  }

  // ── Стены, пол, потолок ──────────────────────────────

  addBox(rW, 0.04, rD,   0,    -0.02,    0,       mFloor);           // пол
  addBox(rW, 0.04, rD,   0,    rH,       0,       mCeil);            // потолок
  addBox(rW, rH,   0.12, 0,    rH/2,    -rD/2,   mWall);            // передняя (главная)
  addBox(rW, rH,   0.12, 0,    rH/2,     rD/2,   mWall);            // задняя
  addBox(0.12, rH, rD,  -rW/2, rH/2,    0,       mWall);            // левая
  addBox(0.12, rH, rD,   rW/2, rH/2,    0,       mWall);            // правая

  // ── Плинтусы (8 штук по периметру) ──────────────────

  var plinthH = 0.15, plinthD = 0.06;
  var plinths = [
    [rW - 0.24, plinthH, plinthD, 0, plinthH/2, -rD/2 + 0.06],
    [rW - 0.24, plinthH, plinthD, 0, plinthH/2,  rD/2 - 0.06],
    [plinthD, plinthH, rD - 0.24, -rW/2 + 0.06, plinthH/2, 0],
    [plinthD, plinthH, rD - 0.24,  rW/2 - 0.06, plinthH/2, 0]
  ];
  plinths.forEach(function(p) { addBox(p[0], p[1], p[2], p[3], p[4], p[5], mMoldD); });

  // ── Карнизы потолка ──────────────────────────────────

  var cornH = 0.12, cornD = 0.1;
  var cornices = [
    [rW, cornH, cornD, 0, rH - cornH/2, -rD/2 + cornD/2],
    [rW, cornH, cornD, 0, rH - cornH/2,  rD/2 - cornD/2],
    [cornD, cornH, rD, -rW/2 + cornD/2, rH - cornH/2, 0],
    [cornD, cornH, rD,  rW/2 - cornD/2, rH - cornH/2, 0]
  ];
  cornices.forEach(function(c) { addBox(c[0], c[1], c[2], c[3], c[4], c[5], mMold); });

  // ── Молдинги — горизонтальный пояс на стенах ─────────

  var mBelt = 0.05, mBeltH = 2.8;
  var belts = [
    [rW, mBelt, mBelt, 0, mBeltH, -rD/2 + 0.07],
    [rW, mBelt, mBelt, 0, mBeltH,  rD/2 - 0.07],
    [mBelt, mBelt, rD, -rW/2 + 0.07, mBeltH, 0],
    [mBelt, mBelt, rD,  rW/2 - 0.07, mBeltH, 0]
  ];
  belts.forEach(function(b) { addBox(b[0], b[1], b[2], b[3], b[4], b[5], mMold); });

  // ── Ковёр ─────────────────────────────────────────────

  var rugSize = isMobile ? 128 : 256;  // Уменьшаем размер для мобильных
  var rugTex = makeRugTexture(artist.color, rugSize);
  textures.push(rugTex);
  var rugMat = createMaterial('lambert', { map: rugTex });
  var rug = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.025, 5.5), rugMat);
  rug.position.set(0, 0.012, 0);
  rug.receiveShadow = true;
  roomGroup.add(rug);

  // ── Колонны ──────────────────────────────────────────
  var colX = [-2.5, 2.5], colZ = [-rD/2 + 0.5, rD/2 - 0.5];
  colX.forEach(function(x) {
    colZ.forEach(function(z) {
      addBox(0.3, 0.12, 0.3, x, 0.06, z, mMoldD);
      addCylinder(0.1, 0.11, rH - 0.24, 12, x, rH/2, z, mWall);
      addBox(0.28, 0.15, 0.28, x, rH - 0.1, z, mMoldD);
    });
  });

  // ── Люстра ───────────────────────────────────────────

  var chandGroup = new THREE.Group();
  chandGroup.position.set(0, rH, -1);
  roomGroup.add(chandGroup);

  // Цепь (несколько цилиндров)
  for (var ci = 0; ci < 6; ci++) {
    var chainM = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.012, 0.08, 6),
      mGold
    );
    chainM.position.set(0, -0.06 - ci * 0.1, 0);
    chandGroup.add(chainM);
  }

  // Корпус люстры
  var chandBody = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.22, 0.2, 12), mGold);
  chandBody.position.set(0, -0.65, 0);
  chandGroup.add(chandBody);

  // Свечи
  var candleAngles = [0, Math.PI/2, Math.PI, Math.PI*3/2, Math.PI/4, Math.PI*3/4, Math.PI*5/4, Math.PI*7/4];
  var candleMat = createMaterial('lambert', { color: 0xfffde8 });
  var flameMat = createMaterial('basic', { color: 0xffcc44 });
  
  candleAngles.forEach(function(a) {
    var radius = a % (Math.PI/2) === 0 ? 0.18 : 0.14;
    var cx = Math.cos(a) * radius;
    var cz = Math.sin(a) * radius;

    // Держатель
    var arm = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, radius, 4), mGold);
    arm.rotation.z = Math.PI / 2;
    arm.position.set(cx/2, -0.74, cz/2);
    arm.rotation.y = -a;
    chandGroup.add(arm);

    // Свеча
    var candle = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.12, 8), candleMat);
    candle.position.set(cx, -0.68, cz);
    chandGroup.add(candle);

    // Огонёк
    var flame = new THREE.Mesh(new THREE.SphereGeometry(0.025, 6, 6), flameMat);
    flame.position.set(cx, -0.60, cz);
    chandGroup.add(flame);
  });

  // ── Прожекторы-кронштейны над панелью ───────────────
  [-1, 1].forEach(function(side) {
    var x = side * 0.8;
    addBox(0.04, 0.04, 0.35, x, rH - 0.15, -rD/2 + 0.35, mDark);
    var lampCone = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.15, 8), mDark);
    lampCone.rotation.x = Math.PI;
    lampCone.position.set(x, rH - 0.35, -rD/2 + 0.52);
    roomGroup.add(lampCone);
  });

  // ── Главная панель (инфографика или заглушка) ─────────

  var infPath = artist.infographic && artist.infographic[S.lang]
    ? artist.infographic[S.lang] : null;

  var framePad = 0.12;
  var panH = 2.8;  // Фиксированная высота

  if (infPath) {
    // Используем оптимизированную загрузку с кэшем и таймаутом
    loadTextureOptimized(infPath)
      .then(function(tex) {
        if (!tex || !tex.image) {
          fallbackPanel();
          return;
        }
        
        textures.push(tex);
        
        // Рассчитываем ширину на основе aspect ratio изображения
        var imgWidth = tex.image.width;
        var imgHeight = tex.image.height;
        var aspectRatio = imgWidth / imgHeight;
        var panW = panH * aspectRatio;
        
        // Создаём рамку с адаптированными размерами
        addBox(panW + framePad*2, panH + framePad*2, 0.05,
          0, 2.4, -rD/2 + 0.13, mFrame);
        
        var panel = new THREE.Mesh(
          new THREE.BoxGeometry(panW, panH, 0.02),
          createMaterial('lambert', { map: tex })
        );
        panel.position.set(0, 2.4, -rD/2 + 0.17);
        roomGroup.add(panel);
      })
      .catch(function(err) { 
        console.warn('Failed to load infographic:', infPath, err.message);
        fallbackPanel(); 
      });
  } else {
    fallbackPanel();
  }

  function fallbackPanel() {
    // Для заглушки используем стандартное соотношение сторон (16:9)
    var panW = panH * (16 / 9);
    addBox(panW + framePad*2, panH + framePad*2, 0.05,
      0, 2.4, -rD/2 + 0.13, mFrame);
    
    var c = artColor.clone().multiplyScalar(0.85);
    addBox(panW, panH, 0.02, 0, 2.4, -rD/2 + 0.17,
      createMaterial('lambert', { color: c }));
  }


    // ── Книжный шкаф ─────────────────────────────────────
  //
  // Шкаф прижат к левой стене (x = -rW/2 + 0.06).
  // Все координаты внутри shelfGroup локальные.
  //
  // Размеры шкафа:
  //   ширина  (по оси X от стены)  = cabinetDepth  = 0.35
  //   высота  (по оси Y)           = cabinetH      = 2.2
  //   длина   (по оси Z)           = cabinetW      = 1.5
  //
  // В мировых координатах шкаф стоит у левой стены,
  // центр группы: x = -rW/2 + 0.06, z = -1.5

  var shelfGroup = new THREE.Group();
  shelfGroup.position.set(-rW/2 + 0.06, 0, -1.5);
  roomGroup.add(shelfGroup);

  var cabinetDepth = 0.35;   // глубина (уходит от стены по +X)
  var cabinetW     = 1.5;    // ширина вдоль стены (по Z)
  var cabinetH     = 2.2;    // высота
  var wallThick    = 0.04;   // толщина стенок/полок

  // Центр шкафа по X (от стены): половина глубины
  var cabCX = cabinetDepth / 2;
  // Центр шкафа по Y: половина высоты (стоит на полу)
  var cabCY = cabinetH / 2;

  // Задняя стенка (вплотную к стене)
  addBox(wallThick, cabinetH, cabinetW,
    wallThick / 2, cabCY, 0, mDark, shelfGroup);

  // Левая боковая стенка (по оси Z)
  addBox(cabinetDepth, cabinetH, wallThick,
    cabCX, cabCY, -cabinetW / 2 + wallThick / 2, mDark, shelfGroup);

  // Правая боковая стенка
  addBox(cabinetDepth, cabinetH, wallThick,
    cabCX, cabCY,  cabinetW / 2 - wallThick / 2, mDark, shelfGroup);

  // Верхняя крышка
  addBox(cabinetDepth, wallThick, cabinetW,
    cabCX, cabinetH - wallThick / 2, 0, mMoldD, shelfGroup);

  // Нижнее основание (немного выступает вперёд)
  addBox(cabinetDepth + 0.04, wallThick, cabinetW + 0.04,
    cabCX, wallThick / 2, 0, mMoldD, shelfGroup);

  // Полки: Y-позиции верхней грани каждой полки
  // (книги будут стоять сверху)
  var shelfTopY = [0.62, 1.12, 1.62];   // 3 полки

  shelfTopY.forEach(function(topY) {
    addBox(cabinetDepth, wallThick, cabinetW - wallThick * 2,
      cabCX, topY - wallThick / 2, 0, mMoldD, shelfGroup);
  });

  // Молдинг-карниз поверх шкафа
  addBox(cabinetDepth + 0.06, 0.06, cabinetW + 0.06,
    cabCX, cabinetH + 0.03, 0, mMold, shelfGroup);

  // ── Книги на полках ──────────────────────────────────
  //
  // Книги стоят вертикально на полке.
  // Их нижняя грань = topY полки.
  // X-центр книги = wallThick (задняя стенка) + глубина книги / 2
  // Z расставляем от левого края к правому.
var bColors = [0x8b2020, 0x205080, 0x206040, 0x806020, 0x602080, 0x883010, 0x308070, 0x7a3020];

  var bookDepth   = 0.22;   // глубина книги (от задней стенки вперёд)
  var bookXCenter = wallThick + bookDepth / 2 + 0.01; // небольшой зазор от задней стенки

  // Данные для каждой полки: сколько книг и смещение по Z
  var shelfData = [
    { topY: shelfTopY[0], count: 9,  zOffset: 0 },
    { topY: shelfTopY[1], count: 7,  zOffset: 0.05 },
    { topY: shelfTopY[2], count: 8,  zOffset: -0.05 }
  ];

  shelfData.forEach(function(shelf, si) {
    var zCursor = -cabinetW / 2 + wallThick + 0.04; // старт по Z (левый край)

    for (var bi = 0; bi < shelf.count; bi++) {
      var bookW  = 0.1 + Math.random() * 0.06;   // толщина корешка
      var bookH  = 0.20 + Math.random() * 0.12;  // высота книги
      var colorIdx = (bi + si * 3) % bColors.length;

      // Небольшой случайный наклон — только если книга не крайняя
      var tilt = (bi > 0 && bi < shelf.count - 1) ? (Math.random() - 0.5) * 0.08 : 0;

      var book = new THREE.Mesh(
        new THREE.BoxGeometry(bookDepth, bookH, bookW),
        createMaterial('lambert', { color: bColors[colorIdx] })
      );

      // Позиция: нижняя грань = shelf.topY  →  центр Y = topY + bookH/2
      book.position.set(
        bookXCenter,
        shelf.topY + bookH / 2,
        zCursor + bookW / 2 + shelf.zOffset
      );
      book.rotation.z = tilt;

      // Корешок — тонкая полоска другого цвета
      var spineColor = new THREE.Color(bColors[colorIdx]).addScalar(0.15);
      var spine = new THREE.Mesh(
        new THREE.BoxGeometry(bookDepth + 0.002, bookH - 0.01, 0.005),
        createMaterial('lambert', { color: spineColor })
      );
      spine.position.copy(book.position);
      spine.position.z -= bookW / 2 - 0.003; // передний торец
      spine.rotation.z = tilt;
      shelfGroup.add(spine);

      shelfGroup.add(book);
      zCursor += bookW + 0.008; // зазор между книгами

      // Не выходим за пределы полки
      if (zCursor > cabinetW / 2 - wallThick - 0.06) break;
    }

    // Декоративная фигурка в конце полки (небольшой цилиндр)
    var figH = 0.14 + Math.random() * 0.06;
    var fig = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.03, figH, 8),
      createMaterial('lambert', { color: 0xd4a853 })
    );
    fig.position.set(bookXCenter, shelf.topY + figH / 2, cabinetW / 2 - wallThick - 0.07);
    shelfGroup.add(fig);
  });
  // ── Скамейка для посетителей ──────────────────────────

  var benchGroup = new THREE.Group();
  benchGroup.position.set(0, 0, 1.2);
  roomGroup.add(benchGroup);

  // Сиденье
  addBox(1.8, 0.07, 0.44, 0, 0.48, 0, mBench, benchGroup);
  // Спинка
  addBox(1.8, 0.55, 0.06, 0, 0.78, -0.22, mBench, benchGroup);
  // Мягкая накладка
  addBox(1.75, 0.04, 0.4, 0, 0.52, 0.01, mBenchLeather, benchGroup);
  // Ножки
  var legPosX = [-0.78, 0.78], legPosZ = [-0.18, 0.18];
  legPosX.forEach(function(x) {
    legPosZ.forEach(function(z) {
      addBox(0.06, 0.46, 0.06, x, 0.23, z, mDarkMid, benchGroup);
    });
  });

  // ── Пьедестал со сферой ──────────────────────────────

  var pedestalGroup = new THREE.Group();
  pedestalGroup.position.set(2.5, 0, -2.5);
  roomGroup.add(pedestalGroup);

  // Основание
  addBox(0.46, 0.06, 0.46, 0, 0.03, 0, mMoldD, pedestalGroup);
  // Тело
  addBox(0.38, 0.9, 0.38, 0, 0.48, 0, mDark, pedestalGroup);
  // Верхняя плита
  addBox(0.44, 0.06, 0.44, 0, 0.96, 0, mMoldD, pedestalGroup);

  // Сфера — анимированная
  var sphereMat = createMaterial('lambert', { color: artColor });
  var sphere = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32, 32), sphereMat);
  sphere.position.set(2.5, 1.22, -2.5);
  sphere.castShadow = true;
  scene.add(sphere);

  // Кольцо вокруг сферы
  var ringMat = createMaterial('lambert', { color: 0xe8c060 });
  var ring = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.015, 8, 32), ringMat);
  ring.position.copy(sphere.position);
  ring.castShadow = false;
  scene.add(ring);

  // ── Orbit controls ────────────────────────────────────

  var orbit = createOrbit(camera, renderer.domElement, S.controlMode);

  // ── Resize через ResizeObserver ───────────────────────

  function onResize() {
    var w = container.clientWidth  || window.innerWidth;
    var h = container.clientHeight || window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  var resizeObserver = null;
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(container);
  } else {
    window.addEventListener('resize', onResize);
  }

  // ── Сохраняем контекст ────────────────────────────────

  threeCtx = {
    renderer:       renderer,
    scene:          scene,
    animId:         null,
    orbit:          orbit,
    resizeObserver: resizeObserver,
    onResize:       onResize,
    roomGroup:      roomGroup,
    sphere:         sphere,
    ring:           ring,
    chandGroup:     chandGroup,
    chandPt:        chandPt,
    textures:       textures
  };

  // ── Цикл анимации ─────────────────────────────────────

  var clock = new THREE.Clock();

  function animate() {
    threeCtx.animId = requestAnimationFrame(animate);
    var t = clock.getElapsedTime();

    // Вращение сферы
    sphere.rotation.y = t * 0.5;
    sphere.position.y = 1.22 + Math.sin(t * 1.2) * 0.04;

    // Кольцо
    ring.rotation.x = t * 0.7;
    ring.rotation.z = t * 0.4;
    ring.position.copy(sphere.position);

    // Мерцание люстры
    var flicker = 1.5 + Math.sin(t * 7.3) * 0.06 + Math.sin(t * 13.1) * 0.04;
    chandPt.intensity = flicker;

    orbit.update();
    renderer.render(scene, camera);
  }
  animate();
}

// ── Полное уничтожение с освобождением памяти ─────────────

function destroyRoom() {
  if (!threeCtx) return;

  cancelAnimationFrame(threeCtx.animId);

  if (threeCtx.orbit) threeCtx.orbit.destroy();

  if (threeCtx.resizeObserver) {
    threeCtx.resizeObserver.disconnect();
  } else {
    if (threeCtx.onResize) {
      window.removeEventListener('resize', threeCtx.onResize);
    }
  }

  // Освобождаем геометрию и материалы
  if (threeCtx.scene) {
    threeCtx.scene.traverse(function(obj) {
      if (obj.isMesh) disposeMesh(obj);
    });
  }

  // Освобождаем текстуры
  if (threeCtx.textures) {
    threeCtx.textures.forEach(function(t) { 
      if (t && t.dispose) {
        t.dispose(); 
      }
    });
  }

  // Очищаем кэш текстур для освобождения памяти
  clearTextureCache();

  // Полностью очищаем renderer
  if (threeCtx.renderer) {
    threeCtx.renderer.dispose();
  }
  
  var canvas = threeCtx.renderer.domElement;
  if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);

  threeCtx = null;
}

// ============================================================
// ORBIT + QUATERNION GYRO CONTROLS
// Google Street View style: drag look-around + pinch zoom + gyroscope
// ============================================================
function createOrbit(camera, canvas, controlMode) {
  controlMode = controlMode || 'gyro';

  var FOV_DEF = 65;    // начальный FOV
  var FOV_MIN = 20;    // максимальный зум (~3x)
  var FOV_MAX = 65;
  var SENS    = 0.005; // чувствительность drag (уменьшено в 2 раза)
  var DAMP    = 0.85;  // затухание инерции (выше = более гладкое движение)
  var MOUSE_SMOOTH = 0.65;  // коэффициент сглаживания мыши (0-1, выше = более гладко)

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
  var mouseDxSmoothed = 0;  // сглаженное движение мыши по X
  var mouseDySmoothed = 0;  // сглаженное движение мыши по Y

  // Кватернионы
  var Q     = new THREE.Quaternion();  // итоговая ориентация
  var QGyro = new THREE.Quaternion();  // от гироскопа
  var QGyroPrev = new THREE.Quaternion();  // предыдущий кватернион (для фильтрации)
  var QDrag = new THREE.Quaternion();  // смещение от drag
  var QBase = new THREE.Quaternion();  // базовая ориентация при захвате drag
  var GYRO_SMOOTH = 0.75;  // коэффициент сглаживания (0.75 = хороший баланс)

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
      dragOffY -= dy * SENS;
      dragOffY  = Math.max(-1.2, Math.min(1.2, dragOffY));
    } else {
      fallTheta += dx * SENS;
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
    mouseDxSmoothed = 0;  // Обнуляем сглаженные значения при захвате
    mouseDySmoothed = 0;
    canvas.style.cursor = 'none';
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
    
    // Сглаживание движения мыши через фильтр низких частот
    mouseDxSmoothed = mouseDxSmoothed * MOUSE_SMOOTH + dx * (1 - MOUSE_SMOOTH);
    mouseDySmoothed = mouseDySmoothed * MOUSE_SMOOTH + dy * (1 - MOUSE_SMOOTH);
    
    vX = mouseDxSmoothed * SENS; 
    vY = mouseDySmoothed * SENS;
    if (gyroActive) {
      dragOffX -= mouseDxSmoothed * SENS;
      dragOffY  = Math.max(-1.2, Math.min(1.2, dragOffY - mouseDySmoothed * SENS));
    } else {
      fallTheta += mouseDxSmoothed * SENS;
      fallPhi    = Math.max(0.15, Math.min(Math.PI - 0.15, fallPhi + mouseDySmoothed * SENS));
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

    // Фильтрация гироскопа: сглаживание между предыдущим и текущим значением
    QGyroPrev.slerp(QGyro, 1 - GYRO_SMOOTH);
    QGyro.copy(QGyroPrev);

    gyroActive = true;
  };
  on(window, 'deviceorientation', onOrient);

  // iOS 13+ — запрашиваем разрешение с повторами
  var permissionRequested = false;
  function tryEnableGyro() {
    // Не запрашиваем разрешение если включен режим 'touch' (только касание)
    if (controlMode === 'touch') {
      hasGyro = false;
      return;
    }
    
    if (permissionRequested) return;
    permissionRequested = true;
    
    if (typeof DeviceOrientationEvent === 'undefined') return;
    
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      // На iOS 13+ нужно явно запросить разрешение
      DeviceOrientationEvent.requestPermission()
        .then(function(r) { 
          if (r === 'granted') hasGyro = true; 
          else permissionRequested = false; // Дозволяем повторить
        })
        .catch(function(err) {
          console.warn('Gyroscope permission denied:', err);
          permissionRequested = false; // Дозволяем повторить
        });
    } else {
      // Старые iOS или Android с поддержкой гироскопа без явного запроса
      hasGyro = true;
    }
  }
  
  // Пытаемся запросить разрешение сразу при инициализации (если режим не 'touch')
  if (controlMode !== 'touch') {
    tryEnableGyro();
  }
  
  // Повторяем запрос на первый touchstart если ещё не разрешено
  var gyroPermCheckHandler = function() {
    if (controlMode !== 'touch' && !hasGyro) {
      tryEnableGyro();
    }
    canvas.removeEventListener('touchstart', gyroPermCheckHandler);
  };
  on(canvas, 'touchstart', gyroPermCheckHandler, { passive: true });

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
          // Мертвая зона: убираем очень малые дрожания
          if (Math.abs(vX) < 0.00008) vX = 0;
          if (Math.abs(vY) < 0.00008) vY = 0;
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
  // Загружаем сохранённый режим управления
  loadControlModePreference();
  
  var domIds = ['loader','sliderView','roomView','track','trackWrap','dots','prevBtn','nextBtn','bioPanel',
                 'bioName','bioYears','bioText','bioEnterBtn','bioLabel','roomContainer','roomLabelName',
                 'roomLabelYears','gyroHint','roomBackBtn'];
  var htmlIds = ['loader','slider-view','room-view','slider-track','slider-track-wrapper','slider-dots',
                  'prev-arrow','next-arrow','bio-panel','bio-name','bio-years','bio-text','bio-enter-btn',
                  'bio-label','aframe-container','room-label-name','room-label-years','gyro-hint','room-back-btn'];
  domIds.forEach(function(key, i) {
    D[key] = document.getElementById(htmlIds[i]);
  });
  D.langBtns = document.querySelectorAll('.lang-btn');
  D.controlModeBtns = document.querySelectorAll('.control-mode-btn');

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
  S.lang         = 'kz';
  S.current      = 0;
  S.activeArtist = S.artists[0];
  D.track.style.transform = 'translateX(0%)';

  // Применяем переводы
  setLang('kz');

  // События кнопок
  var btnEvents = [
    [D.prevBtn, 'click', function() { prev(); stopAuto(); startAuto(); }],
    [D.nextBtn, 'click', function() { next(); stopAuto(); startAuto(); }],
    [D.roomBackBtn, 'click', goBack]
  ];
  btnEvents.forEach(function(cfg) {
    if (cfg[0]) cfg[0].addEventListener(cfg[1], cfg[2]);
  });

  if (D.bioEnterBtn) {
    D.bioEnterBtn.addEventListener('click', function() {
      if (S.activeArtist) enterRoom(S.activeArtist);
    });
  }

  D.langBtns.forEach(function(btn) {
    btn.addEventListener('click', function() { setLang(btn.dataset.lang); });
  });

  // События кнопок режима управления
  D.controlModeBtns.forEach(function(btn) {
    btn.addEventListener('click', function() { setControlMode(btn.dataset.mode); });
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