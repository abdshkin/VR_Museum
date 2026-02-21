// ============================================================
// js/slider.js — модуль горизонтального слайдера художников
//
// CUSTOMIZE:
//   AUTO_INTERVAL — интервал авторотации в миллисекундах
//   SWIPE_THRESHOLD — минимальное расстояние свайпа (px)
// ============================================================

const AUTO_INTERVAL  = 10000;  // 10 секунд
const SWIPE_THRESHOLD = 46;    // пикселей

let currentIndex  = 0;
let autoTimer     = null;
let onEnterRoom   = null;  // коллбэк при клике «Войти в зал»

// ---- Сборка DOM слайдера ----
function buildSlider(artists, onEnter) {
  onEnterRoom = onEnter;

  const track     = document.getElementById('slider-track');
  const dotsWrap  = document.getElementById('slider-dots');
  track.innerHTML = '';
  dotsWrap.innerHTML = '';

  artists.forEach((artist, i) => {
    // ---- Карточка ----
    const card = document.createElement('div');
    card.className = 'artist-card' + (i === 0 ? ' current' : '');

    const imgSrc = 'data:image/jpeg;base64,' + artist.thumb;
    const nameTxt = localize(artist.names);
    const bioTxt  = localize(artist.bios);

    card.innerHTML =
      '<div class="card-image" style="background:linear-gradient(135deg,' + artist.color + '22,#1a1814)">' +
        '<img src="' + imgSrc + '" alt="' + nameTxt + '" draggable="false"/>' +
      '</div>' +
      '<div class="card-overlay"></div>' +
      '<div class="card-number">0' + (i + 1) + '</div>' +
      '<div class="card-corner"></div>' +
      '<div class="card-info">' +
        '<div class="card-name" data-name-id="' + artist.id + '">' + nameTxt + '</div>' +
        '<div class="card-years">' + artist.years + '</div>' +
        '<div class="bio-panel" id="bio-panel-' + artist.id + '">' +
          '<div class="bio-text" data-bio-id="' + artist.id + '">' + bioTxt + '</div>' +
        '</div>' +
        '<button class="enter-btn" id="enter-btn-' + artist.id + '">' +
          '<span data-i18n="enter">' + tr('enter') + '</span>' +
          '<span class="enter-arrow">&#8594;</span>' +
        '</button>' +
      '</div>';

    track.appendChild(card);

    // Кнопка «Войти в зал»
    card.querySelector('.enter-btn').addEventListener('click', e => {
      e.stopPropagation();
      if (typeof onEnterRoom === 'function') onEnterRoom(i);
    });

    // ---- Точка-индикатор ----
    const dot = document.createElement('button');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Artist ' + (i + 1));
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  // Стрелки
  document.getElementById('prev-btn').addEventListener('click', () => goTo(currentIndex - 1));
  document.getElementById('next-btn').addEventListener('click', () => goTo(currentIndex + 1));

  setupDrag();
  startAuto();

  // Показать биографию первой карточки с задержкой
  setTimeout(() => showBio(0), 500);
}

// ---- Перейти к карточке с индексом i ----
function goTo(i) {
  const artists = window._museumsArtists;
  if (!artists) return;

  hideBio(currentIndex);
  currentIndex = (i + artists.length) % artists.length;

  document.getElementById('slider-track').style.transform =
    'translateX(-' + (currentIndex * 100) + '%)';

  document.querySelectorAll('.artist-card').forEach((c, j) =>
    c.classList.toggle('current', j === currentIndex)
  );
  document.querySelectorAll('.dot').forEach((d, j) =>
    d.classList.toggle('active', j === currentIndex)
  );

  setTimeout(() => showBio(currentIndex), 420);
}

// ---- Показать/скрыть биографию и кнопку на карточке ----
function showBio(i) {
  const a = window._museumsArtists?.[i];
  if (!a) return;
  document.getElementById('bio-panel-' + a.id)?.classList.add('visible');
  document.getElementById('enter-btn-' + a.id)?.classList.add('visible');
}

function hideBio(i) {
  const a = window._museumsArtists?.[i];
  if (!a) return;
  document.getElementById('bio-panel-' + a.id)?.classList.remove('visible');
  document.getElementById('enter-btn-' + a.id)?.classList.remove('visible');
}

// ---- Авторотация ----
function startAuto() {
  clearInterval(autoTimer);
  autoTimer = setInterval(() => goTo(currentIndex + 1), AUTO_INTERVAL);
}
function stopAuto() {
  clearInterval(autoTimer);
  autoTimer = null;
}

// ---- Свайп / перетаскивание мышью ----
function setupDrag() {
  const container = document.getElementById('slider-container');
  let startX = 0;
  let dragging = false;

  // Touch
  container.addEventListener('touchstart', e => {
    startX   = e.touches[0].clientX;
    dragging = true;
    stopAuto();
  }, { passive: true });

  container.addEventListener('touchend', e => {
    if (!dragging) return;
    dragging = false;
    const delta = startX - e.changedTouches[0].clientX;
    if (Math.abs(delta) > SWIPE_THRESHOLD) {
      delta > 0 ? goTo(currentIndex + 1) : goTo(currentIndex - 1);
    }
    startAuto();
  }, { passive: true });

  // Mouse
  container.addEventListener('mousedown', e => {
    startX   = e.clientX;
    dragging = true;
    stopAuto();
  });
  container.addEventListener('mouseup', e => {
    if (!dragging) return;
    dragging = false;
    const delta = startX - e.clientX;
    if (Math.abs(delta) > SWIPE_THRESHOLD) {
      delta > 0 ? goTo(currentIndex + 1) : goTo(currentIndex - 1);
    }
    startAuto();
  });
  container.addEventListener('mouseleave', () => {
    if (dragging) { dragging = false; startAuto(); }
  });

  // Пауза при наведении мышью
  container.addEventListener('mouseenter', stopAuto);
  container.addEventListener('mouseleave', startAuto);
}

// ---- Получить текущий индекс (для Room) ----
function getCurrentIndex() { return currentIndex; }
