// ============================================================
// js/lang.js — модуль переключения языков
//
// CUSTOMIZE: добавьте переводы в объект TRANSLATIONS ниже.
// Чтобы добавить новый язык:
//   1. Добавьте его в TRANSLATIONS
//   2. Добавьте кнопку в index.html: <button class="lang-btn" data-lang="xx">XX</button>
// ============================================================

// Переводы статических строк интерфейса
const TRANSLATIONS = {
  kz: {
    enter: 'Залға кіру',
    back:  'Артқа',
    hint:  '📱 Экранды айналдыр',
    hintSub: 'Бөлмені зерттеу үшін сүйре',
  },
  ru: {
    enter: 'Войти в зал',
    back:  'Назад',
    hint:  '📱 Перетяни для осмотра',
    hintSub: 'Drag to explore room',
  },
  en: {
    enter: 'Enter Room',
    back:  'Back',
    hint:  '📱 Drag to explore',
    hintSub: 'Rotate to look around',
  },
};

// Текущий язык — экспортируем для других модулей
let currentLang = 'ru';

// Вернуть строку по ключу для текущего языка
function tr(key) {
  return TRANSLATIONS[currentLang]?.[key] || TRANSLATIONS.ru[key] || key;
}

// Вернуть локализованное поле объекта {kz, ru, en}
function localize(obj) {
  return obj[currentLang] || obj.ru || obj.en || '';
}

// Применить язык: обновить кнопки и все data-атрибуты в DOM
function applyLang(lang, onUpdate) {
  currentLang = lang;

  // Подсветить активную кнопку
  document.querySelectorAll('.lang-btn').forEach(btn =>
    btn.classList.toggle('active', btn.dataset.lang === lang)
  );

  // Обновить кнопку «Войти в зал»
  document.querySelectorAll('[data-i18n="enter"]').forEach(el =>
    (el.textContent = tr('enter'))
  );

  // Обновить кнопку «Назад»
  const backLabel = document.getElementById('back-label');
  if (backLabel) backLabel.textContent = tr('back');

  // Обновить биографии
  document.querySelectorAll('[data-bio-id]').forEach(el => {
    const artist = window._museumsArtists?.find(a => a.id === el.dataset.bioId);
    if (artist) el.textContent = localize(artist.bios);
  });

  // Обновить имена художников
  document.querySelectorAll('[data-name-id]').forEach(el => {
    const artist = window._museumsArtists?.find(a => a.id === el.dataset.nameId);
    if (artist) el.textContent = localize(artist.names);
  });

  // Вызвать коллбэк (Room обновит текстуру при смене языка)
  if (typeof onUpdate === 'function') onUpdate(lang);
}

// Инициализация: навесить обработчики на кнопки языков
function initLang(onUpdate) {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => applyLang(btn.dataset.lang, onUpdate));
  });
  // Применить язык по умолчанию
  applyLang(currentLang, null);
}
