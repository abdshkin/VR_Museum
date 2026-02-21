// ============================================================
// js/main.js — точка входа, связывает все модули
//
// Порядок загрузки скриптов в index.html:
//   1. data/artists.js   → ARTISTS_DATA
//   2. js/lang.js        → tr(), localize(), applyLang()
//   3. js/slider.js      → buildSlider(), goTo(), showBio()...
//   4. js/room.js        → openRoom(), closeRoom()...
//   5. js/main.js        → инициализация (этот файл)
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // 1. Сохранить данные в глобальной переменной (используется модулями)
  window._museumsArtists = ARTISTS_DATA;

  // 2. Инициализировать язык.
  //    Коллбэк вызывается при смене языка: обновляет плашку в зале и текстуру.
  initLang((newLang) => {
    const idx = getCurrentIndex();
    const artist = ARTISTS_DATA[idx];
    if (artist && document.getElementById('room-view').classList.contains('active')) {
      updateRoomLabel(artist);
      swapWallTexture(artist);
    }
  });

  // 3. Построить слайдер.
  //    При клике «Войти в зал» открывается 3D-зал нужного художника.
  buildSlider(ARTISTS_DATA, (artistIndex) => {
    openRoom(artistIndex);
  });

  // 4. Кнопка «Назад» в 3D-зале
  document.getElementById('back-btn').addEventListener('click', closeRoom);

  // 5. Показать слайдер (скрыть лоадер)
  document.getElementById('slider-view').classList.add('active');
  setTimeout(() => document.getElementById('loader').classList.add('gone'), 600);

});
