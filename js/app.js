/**
 * KAZAKH ARTISTS VIRTUAL MUSEUM — app.js
 * ES6 Module Architecture
 * 
 * Customization guide (search "// CUSTOMIZE"):
 *   - AUTO_ROTATE_MS: change slide interval
 *   - SWIPE_THRESHOLD: change swipe sensitivity
 *   - Room scene colors/lights in buildAFrameScene()
 */

// ============================================================
// CONFIG — CUSTOMIZE HERE
// ============================================================
const CONFIG = {
  AUTO_ROTATE_MS: 10000,   // Auto-rotate interval (ms)
  SWIPE_THRESHOLD: 50,     // Min swipe distance (px)
  DEFAULT_LANG: 'ru',      // Fallback language
};

// ============================================================
// STATE
// ============================================================
const state = {
  artists: [],
  currentIndex: 0,
  lang: CONFIG.DEFAULT_LANG,
  autoTimer: null,
  isDragging: false,
  dragStartX: 0,
  dragCurrentX: 0,
};

// ============================================================
// DOM REFS
// ============================================================
const $ = id => document.getElementById(id);
const dom = {
  loader: () => $('loader'),
  sliderView: () => $('slider-view'),
  roomView: () => $('room-view'),
  track: () => $('slider-track'),
  dots: () => $('slider-dots'),
  arrows: () => $('slider-arrows'),
  aframeContainer: () => $('aframe-container'),
  roomLabelName: () => $('room-label-name'),
  roomLabelYears: () => $('room-label-years'),
  langBtns: () => document.querySelectorAll('.lang-btn'),
  gyroHint: () => $('gyro-hint'),
};

// ============================================================
// DATA LOADING
// ============================================================
async function loadArtists() {
  const res = await fetch('data/artists.json');
  const data = await res.json();
  state.artists = data.artists;
}

// ============================================================
// LANGUAGE MODULE
// ============================================================
const Lang = {
  set(code) {
    state.lang = code;
    document.documentElement.lang = code;
    dom.langBtns().forEach(b => b.classList.toggle('active', b.dataset.lang === code));
    Slider.refreshBio();
    // Update room label if visible
    if (dom.roomView().classList.contains('active')) {
      Room.updateLabel(state.artists[state.currentIndex]);
    }
  },
  t(obj) {
    return obj[state.lang] || obj['ru'] || obj['en'] || '';
  },
};

// ============================================================
// SLIDER MODULE
// ============================================================
const Slider = {
  build() {
    const track = dom.track();
    const dotsContainer = dom.dots();
    track.innerHTML = '';
    dotsContainer.innerHTML = '';

    state.artists.forEach((artist, i) => {
      // Card
      const card = document.createElement('div');
      card.className = 'artist-card';
      card.style.setProperty('--artist-color', artist.color);

      card.innerHTML = `
        <div class="card-image">
          <img 
            src="assets/images/${artist.thumb}" 
            alt="${Lang.t(artist.name)}"
            onerror="this.parentElement.classList.add('no-thumb-bg'); this.remove();"
            loading="${i === 0 ? 'eager' : 'lazy'}"
          />
        </div>
        <div class="card-overlay"></div>
        <div class="card-corner"></div>
        <div class="card-num">0${i + 1}</div>
        <div class="card-info">
          <div class="card-name" data-name="${artist.id}">${Lang.t(artist.name)}</div>
          <div class="card-years">${artist.years}</div>
          <div class="bio-panel" id="bio-${artist.id}">
            <div class="bio-text" id="bio-text-${artist.id}">${Lang.t(artist.bio)}</div>
          </div>
          <button class="card-enter-btn" id="enter-${artist.id}" data-id="${artist.id}" aria-label="Enter room">
            <span data-i18n="enter">Залға кіру</span>
            <span class="arrow">→</span>
          </button>
        </div>
      `;

      // Image fallback background color
      const img = card.querySelector('.card-image');
      img.style.background = `linear-gradient(135deg, ${artist.color}22 0%, #1a1814 100%)`;

      track.appendChild(card);

      // Enter btn
      card.querySelector('.card-enter-btn').addEventListener('click', e => {
        e.stopPropagation();
        Room.open(i);
      });

      // Dot
      const dot = document.createElement('div');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => Slider.goTo(i));
      dotsContainer.appendChild(dot);
    });

    this.setupDrag();
    this.setupArrows();
    this.showBio(0);
    this.startAuto();
  },

  setupArrows() {
    document.getElementById('prev-btn')?.addEventListener('click', () => this.prev());
    document.getElementById('next-btn')?.addEventListener('click', () => this.next());
  },

  setupDrag() {
    const track = dom.track();

    // Touch
    track.addEventListener('touchstart', e => {
      state.dragStartX = e.touches[0].clientX;
      state.isDragging = true;
      this.stopAuto();
    }, { passive: true });

    track.addEventListener('touchmove', e => {
      if (!state.isDragging) return;
      state.dragCurrentX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchend', () => {
      if (!state.isDragging) return;
      const delta = state.dragStartX - state.dragCurrentX;
      if (Math.abs(delta) > CONFIG.SWIPE_THRESHOLD) {
        delta > 0 ? this.next() : this.prev();
      }
      state.isDragging = false;
      this.startAuto();
    });

    // Mouse
    track.addEventListener('mousedown', e => {
      state.dragStartX = e.clientX;
      state.isDragging = true;
      this.stopAuto();
    });
    track.addEventListener('mousemove', e => {
      if (!state.isDragging) return;
      state.dragCurrentX = e.clientX;
    });
    track.addEventListener('mouseup', () => {
      if (!state.isDragging) return;
      const delta = state.dragStartX - state.dragCurrentX;
      if (Math.abs(delta) > CONFIG.SWIPE_THRESHOLD) {
        delta > 0 ? this.next() : this.prev();
      }
      state.isDragging = false;
      this.startAuto();
    });
    track.addEventListener('mouseleave', () => {
      state.isDragging = false;
      this.startAuto();
    });

    // Pause auto on hover
    track.addEventListener('mouseenter', () => this.stopAuto());
    track.addEventListener('mouseleave', () => this.startAuto());
  },

  goTo(index) {
    // Hide previous bio
    const prevArtist = state.artists[state.currentIndex];
    this.hideBio(prevArtist.id);

    state.currentIndex = (index + state.artists.length) % state.artists.length;
    
    dom.track().style.transform = `translateX(-${state.currentIndex * 100}%)`;

    // Update dots
    dom.dots().querySelectorAll('.dot').forEach((d, i) =>
      d.classList.toggle('active', i === state.currentIndex)
    );

    // Show new bio after transition
    setTimeout(() => this.showBio(state.currentIndex), 400);
  },

  showBio(index) {
    const artist = state.artists[index];
    const bio = document.getElementById(`bio-${artist.id}`);
    const btn = document.getElementById(`enter-${artist.id}`);
    if (bio) bio.classList.add('visible');
    if (btn) btn.classList.add('visible');
  },

  hideBio(artistId) {
    const bio = document.getElementById(`bio-${artistId}`);
    const btn = document.getElementById(`enter-${artistId}`);
    if (bio) bio.classList.remove('visible');
    if (btn) btn.classList.remove('visible');
  },

  refreshBio() {
    state.artists.forEach(artist => {
      const nameEl = document.querySelector(`[data-name="${artist.id}"]`);
      const bioText = document.getElementById(`bio-text-${artist.id}`);
      if (nameEl) nameEl.textContent = Lang.t(artist.name);
      if (bioText) bioText.textContent = Lang.t(artist.bio);
    });
    // Update enter btn text
    const i18nKey = { kz: 'Залға кіру', ru: 'Войти в зал', en: 'Enter Room' };
    document.querySelectorAll('[data-i18n="enter"]').forEach(el => {
      el.textContent = i18nKey[state.lang] || i18nKey.en;
    });
  },

  next() { this.goTo(state.currentIndex + 1); },
  prev() { this.goTo(state.currentIndex - 1); },

  startAuto() {
    this.stopAuto();
    state.autoTimer = setInterval(() => this.next(), CONFIG.AUTO_ROTATE_MS);
  },

  stopAuto() {
    clearInterval(state.autoTimer);
    state.autoTimer = null;
  },
};

// ============================================================
// ROOM MODULE (A-Frame 3D)
// ============================================================
const Room = {
  sceneBuilt: false,

  open(index) {
    state.currentIndex = index;
    Slider.stopAuto();

    const artist = state.artists[index];
    this.updateLabel(artist);
    this.buildOrUpdateScene(artist);

    // Transition: slider out, room in
    dom.sliderView().classList.remove('active');
    dom.roomView().classList.add('active');

    // Show gyro hint briefly
    const hint = dom.gyroHint();
    if (hint) { hint.style.opacity = '1'; hint.style.animation = 'fadeHint 3s 0.5s forwards'; }
  },

  close() {
    dom.roomView().classList.remove('active');
    dom.sliderView().classList.add('active');
    Slider.startAuto();
    Slider.showBio(state.currentIndex);
  },

  updateLabel(artist) {
    dom.roomLabelName().textContent = Lang.t(artist.name);
    dom.roomLabelYears().textContent = artist.years;
  },

  buildOrUpdateScene(artist) {
    const container = dom.aframeContainer();

    if (this.sceneBuilt) {
      // Just swap the infographic texture
      this.updateWallTexture(artist);
      return;
    }

    // Build A-Frame scene HTML
    container.innerHTML = this.buildAFrameHTML(artist);
    this.sceneBuilt = true;

    // Wait for scene to load then setup gyroscope
    container.querySelector('a-scene')?.addEventListener('loaded', () => {
      this.setupGyro();
    });
  },

  buildAFrameHTML(artist) {
    const infographicSrc = `assets/images/${artist.infographic[state.lang] || artist.infographic['ru']}`;
    
    return `
    <a-scene
      id="museum-scene"
      embedded
      vr-mode-ui="enabled: false"
      renderer="antialias: true; colorManagement: true; physicallyCorrectLights: true"
      loading-screen="enabled: false"
    >
      <!-- ASSETS -->
      <a-assets>
        <img id="wall-infographic" src="${infographicSrc}" crossorigin="anonymous"
          onerror="console.warn('Infographic not found, using color')">
        <img id="floor-tex" src="assets/images/thumbs/floor_tile.jpg" crossorigin="anonymous">
      </a-assets>

      <!-- CAMERA with orbit controls for gyroscope -->
      <a-entity id="camera-rig" position="0 1.6 3.5">
        <a-camera
          id="museum-camera"
          look-controls="enabled: false"
          wasd-controls="enabled: false"
          orbit-controls="
            target: 0 1.6 0;
            enableDamping: true;
            dampingFactor: 0.1;
            rotateSpeed: 0.5;
            minDistance: 1;
            maxDistance: 4;
            minPolarAngle: 30;
            maxPolarAngle: 110;
            enablePan: false;
            enableZoom: true;
            autoRotate: false;
            enableKeys: false;
            initialPosition: 0 1.6 3.5;
          "
        ></a-camera>
      </a-entity>

      <!-- LIGHTS — warm museum daylight -->
      <a-light type="ambient" color="#fff5e0" intensity="0.5"></a-light>
      <a-light type="directional" color="#fff8f0" intensity="1.2"
        position="2 4 2" cast-shadow="true"></a-light>
      <a-light type="point" color="#c8a96e" intensity="0.6"
        position="0 2.8 0" distance="6"></a-light>
      <!-- Accent lights on main wall -->
      <a-light type="spot" color="#fff8f0" intensity="2"
        position="-1.5 3 1" target="#main-wall" angle="30" penumbra="0.3"></a-light>
      <a-light type="spot" color="#fff8f0" intensity="2"
        position="1.5 3 1" target="#main-wall" angle="30" penumbra="0.3"></a-light>

      <!-- FLOOR — parquet effect -->
      <a-plane
        position="0 0 0" rotation="-90 0 0"
        width="8" height="10"
        color="#2a2018"
        repeat="4 5"
        roughness="0.8" metalness="0.05"
      ></a-plane>

      <!-- CEILING -->
      <a-plane
        position="0 4 0" rotation="90 0 0"
        width="8" height="10"
        color="#1a1814"
      ></a-plane>

      <!-- BACK WALL — MAIN (infographic) -->
      <a-plane
        id="main-wall"
        position="0 2 -4"
        width="8" height="4"
        color="#f0e8d8"
        src="#wall-infographic"
        side="front"
        roughness="0.7"
      ></a-plane>

      <!-- Painting frame (molding) around infographic -->
      <a-box position="0 2 -3.95" width="6.4" height="4.4" depth="0.04" color="#8a6a3a"></a-box>
      <a-box position="0 2 -3.97" width="6.6" height="4.6" depth="0.02" color="#5a4020"></a-box>

      <!-- LEFT WALL — decorative -->
      <a-plane position="-4 2 0" rotation="0 90 0" width="10" height="4" color="#1e1c19"></a-plane>
      <!-- Small framed artworks on left wall -->
      <a-box position="-3.95 2.5 -1" width="0.05" height="1.2" depth="0.9" color="#f0e8d8" roughness="0.7"></a-box>
      <a-box position="-3.92 2.5 -1" width="0.02" height="1.35" depth="1.05" color="#6a4a1a"></a-box>
      <a-box position="-3.95 1.5 1" width="0.05" height="0.9" depth="1.2" color="#f0e8d8" roughness="0.7"></a-box>
      <a-box position="-3.92 1.5 1" width="0.02" height="1.05" depth="1.35" color="#6a4a1a"></a-box>

      <!-- RIGHT WALL — decorative with bookshelf -->
      <a-plane position="4 2 0" rotation="0 -90 0" width="10" height="4" color="#1e1c19"></a-plane>
      <!-- Bookshelf -->
      <a-box position="3.9 0.8 -0.5" width="0.1" height="1.6" depth="1.2" color="#3a2810"></a-box>
      <a-box position="3.85 1.5 -0.5" width="0.02" height="0.05" depth="1.1" color="#5a3820"></a-box>
      <a-box position="3.85 1.1 -0.5" width="0.02" height="0.05" depth="1.1" color="#5a3820"></a-box>
      <!-- Book spines (colorful) -->
      <a-box position="3.88 1.3 -0.7" width="0.04" height="0.35" depth="0.08" color="#c8a96e"></a-box>
      <a-box position="3.88 1.3 -0.6" width="0.04" height="0.4" depth="0.1" color="#6e7a9b"></a-box>
      <a-box position="3.88 1.3 -0.48" width="0.04" height="0.3" depth="0.07" color="#a06e6e"></a-box>
      <a-box position="3.88 1.3 -0.38" width="0.04" height="0.38" depth="0.09" color="#6e8a5f"></a-box>

      <!-- PEDESTAL (decorative vase area) -->
      <a-cylinder position="-2 0 1.5" radius="0.2" height="0.8" color="#3a3028"></a-cylinder>
      <a-cylinder position="-2 0.55 1.5" radius="0.18" height="0.5" color="#c8a96e" roughness="0.3" metalness="0.5"></a-cylinder>

      <!-- Molding (decorative strip along top of walls) -->
      <a-box position="0 3.85 -4" width="8" height="0.08" depth="0.12" color="#8a6a3a"></a-box>
      <a-box position="-4 3.85 0" rotation="0 90 0" width="10" height="0.08" depth="0.12" color="#8a6a3a"></a-box>
      <a-box position="4 3.85 0" rotation="0 90 0" width="10" height="0.08" depth="0.12" color="#8a6a3a"></a-box>

      <!-- Baseboard -->
      <a-box position="0 0.06 -4" width="8" height="0.12" depth="0.1" color="#5a4020"></a-box>
      <a-box position="-4 0.06 0" rotation="0 90 0" width="10" height="0.12" depth="0.1" color="#5a4020"></a-box>
      <a-box position="4 0.06 0" rotation="0 90 0" width="10" height="0.12" depth="0.1" color="#5a4020"></a-box>

      <!-- Sky / fog effect -->
      <a-sky color="#0a0908"></a-sky>
    </a-scene>
    `;
  },

  updateWallTexture(artist) {
    const scene = document.getElementById('museum-scene');
    if (!scene) return;
    const wall = document.getElementById('main-wall');
    const imgAsset = document.getElementById('wall-infographic');
    if (!wall || !imgAsset) return;
    const src = `assets/images/${artist.infographic[state.lang] || artist.infographic['ru']}`;
    imgAsset.src = src;
    wall.setAttribute('src', '#wall-infographic');
  },

  setupGyro() {
    // Request device orientation for gyroscope orbit
    if (typeof DeviceOrientationEvent !== 'undefined' &&
        typeof DeviceOrientationEvent.requestPermission === 'function') {
      // iOS 13+ requires permission
      const hint = dom.gyroHint();
      if (hint) {
        hint.style.opacity = '1';
        hint.style.animation = 'none';
        hint.textContent = 'Tap to enable gyroscope';
        hint.style.pointerEvents = 'all';
        hint.style.cursor = 'pointer';
        hint.addEventListener('click', async () => {
          try {
            const perm = await DeviceOrientationEvent.requestPermission();
            if (perm === 'granted') this.activateGyro();
            hint.style.display = 'none';
          } catch(e) { hint.style.display = 'none'; }
        }, { once: true });
      }
    } else if (window.DeviceOrientationEvent) {
      this.activateGyro();
    }
  },

  activateGyro() {
    const camera = document.getElementById('museum-camera');
    if (!camera) return;
    // A-Frame's orbit-controls picks up device orientation automatically
    // when it is a touch device. We can also manually nudge it:
    window.addEventListener('deviceorientation', e => {
      if (!e.beta || !e.gamma) return;
      // Pass hint to orbit controls via custom event — orbit-controls handles internally
    }, { passive: true });
  },
};

// ============================================================
// INIT
// ============================================================
async function init() {
  // Load data
  await loadArtists();

  // Build slider
  Slider.build();

  // Show slider view
  dom.sliderView().classList.add('active');

  // Language buttons
  dom.langBtns().forEach(btn => {
    btn.addEventListener('click', () => Lang.set(btn.dataset.lang));
  });

  // Back button
  $('back-btn')?.addEventListener('click', () => Room.close());

  // Set initial language
  Lang.set(CONFIG.DEFAULT_LANG);

  // Hide loader
  setTimeout(() => dom.loader()?.classList.add('hidden'), 800);
}

// Start when DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
