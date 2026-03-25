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
    phoneHint: 'Телефонды тік ұстаңыз',
    phoneHintSub: '3D арқылы ынамдықты іс жүргіңіз',
  },
  ru: {
    back:      '← Назад',
    enterRoom: 'Войти в зал',
    explore:   'Продолжить',
    dragHint:  '📱 Перетяни для осмотра',
    bio:       'О художнике',
    eyebrow:   'Казахстан · Искусство · Art',
    title:     'Великие художники',
    phoneHint: 'Держите телефон прямо',
    phoneHintSub: 'Для лучшего взаимодействия с 3D',
  },
  en: {
    back:      '← Back',
    enterRoom: 'Enter Room',
    explore:   'Explore',
    dragHint:  '📱 Drag to explore room',
    bio:       'About the Artist',
    eyebrow:   'Kazakhstan · Өнер · Art',
    title:     'Great Artists',
    phoneHint: 'Hold your phone upright',
    phoneHintSub: 'For better 3D experience',
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
    infographic: { kz: 'assets/images/infographics/telzhanov/telzhanov_main', ru: 'assets/images/infographics/telzhanov/telzhanov_main', en: 'assets/images/infographics/telzhanov/telzhanov_main' },
  },
  {
    id: 'galymbaeva', years: '1917 – 2008', color: '#7a5c9e',
    name: { kz: 'Айша Ғалымбаева', ru: 'Айша Галимбаева', en: 'Aisha Galimbayeva' },
    bio: {
      kz: 'Қазақстанның алғашқы кәсіби суретші әйелі, ҚазКСР халық суретшісі (1967). ВГИК кино факультетін бітірген (1949). «Қазақ халық костюмі» альбомының авторы.',
      ru: 'Первая профессиональная художница-казашка, народный художник КазССР (1967). Окончила художественно-декоративный факультет ВГИКа (1949). Автор альбома «Казахский народный костюм».',
      en: "The first professional Kazakh female artist, People's Artist of the Kazakh SSR (1967). Graduated from VGIK (1949). Author of the album 'Kazakh National Costume'.",
    },
    thumb: 'assets/images/thumbs/galimbayeva_thumb.jpg',
    infographic: { kz: 'assets/images/infographics/galymbaeva/galymbaeva_main', ru: 'assets/images/infographics/galymbaeva/galymbaeva_main', en: 'assets/images/infographics/galymbaeva/galymbaeva_main' },
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
    infographic: { kz: 'assets/images/infographics/ismailova/ismailova_main', ru: 'assets/images/infographics/ismailova/ismailova_main', en: 'assets/images/infographics/ismailova/ismailova_main' },
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
    infographic: { kz: 'assets/images/infographics/kasteev/kasteev_main', ru: 'assets/images/infographics/kasteev/kasteev_main', en: 'assets/images/infographics/kasteev/kasteev_main' },
  },
  {
    id: 'hludov', years: '1850 – 1935', color: '#5a8c6a',
    name: { kz: 'Николай Гаврилович Хлудов', ru: 'Николай Гаврилович Хлудов', en: 'Nikolai Gavrilovich Khludov' },
    bio: {
      kz: 'Қазақ халқының өмірі мен өндіктемесіне өнігеген орыс портреттеу суретшісі және живопистсі (1850–1935). Брянскте туылған, XIX ғасырдың соңынан бастап Түркістанда жұмыс істеген, Тянь-Шань және Вернодағы жер сілінісін зерттеу экспедициясына қатысқан. Түркістан археология құлшысы шеңберінің мүшесі, Семиречелік Орыс географиялық қоғамының бөлімінің институторы, советтік кезінде сызба оқыту және Абылхан Қастеев сияқты алғашқы қазақ және қырғыз суретшілерін дайындап оқытушы болған.',
      ru: 'Русский художник-портретист и живописец (1850–1935), посвятивший творчество жизни и быту казахского народа. Родился в Брянске и с конца XIX века работал в Туркестане, участвуя в экспедициях по изучению Тянь-Шаня и землетрясения в Верном. Был членом Туркестанского кружка любителей археологии, учредителем Семиреченского отдела Русского географического общества. В советское время преподавал рисование и подготовил первых казахских и киргизских художников, таких как Абылхан Кастеев.',
      en: 'Russian portrait painter and artist (1850–1935) dedicated to the life and culture of the Kazakh people. Born in Bryansk and worked in Turkestan from the late 19th century, participating in expeditions studying the Tian-Shan and the Verny earthquake. Member of the Turkestan Circle of Archaeology Enthusiasts and founder of the Semirechensk Department of the Russian Geographical Society. In Soviet times he taught drawing and trained the first Kazakh and Kyrgyz artists, such as Abylkhan Kasteev.',
    },
    thumb: 'assets/images/thumbs/hludov_thumb.JPG',
    infographic: { kz: 'assets/images/infographics/hludov/hludov_main', ru: 'assets/images/infographics/hludov/hludov_main', en: 'assets/images/infographics/hludov/hludov_main' },
  },
  {
    id: 'mambeev', years: '1928 – 2017', color: '#8b4a6a',
    name: { kz: 'Сабур Абдырасұлы Мамбеев', ru: 'Сабур Абдурасулович Мамбеев', en: 'Sabur Abdurasulovich Mambeev' },
    bio: {
      kz: 'Кеңестік және қазақстандық суретші-живопистсі (1928–2017). Қазақ КСР халық суретшісі (1980), өнердің құрмет ісесі (1963). Н.В. Гоголь атындағы Алматы өнеркөл училищесін бітірген (1946) және И.Е. Репин атындағы Ленинград институтын бітірген (1953). 1953–1956 жылдар аралығында Алма-Ата өнеркөл училищесінде оқытушы болып, 1956 жылы КСРО суретшілер одағының мүшесі болған. Психологиялық портреттері және лаконикалық пейзаждарымен танымал.',
      ru: 'Советский и казахстанский художник-живописец (1928–2017), народный художник Казахской ССР (1980), заслуженный деятель искусств (1963). Окончил Алматинское художественное училище им. Н.В. Гоголя (1946) и Ленинградский институт им. И.Е. Репина (1953). С 1953 по 1956 год преподавал в Алма-Атинском художественном училище, стал членом Союза художников СССР в 1956 году. Известен психологическими портретами и лаконичными пейзажами.',
      en: 'Soviet and Kazakhstani painter (1928–2017), People\'s Artist of the Kazakh SSR (1980), Honored Figure of the Arts (1963). Graduated from the N.V. Gogol Almaty School of Art (1946) and the I.E. Repin Leningrad Institute (1953). From 1953 to 1956 he taught at the Alma-Ata School of Art, became a member of the Union of Soviet Artists in 1956. Known for his psychological portraits and concise landscapes.',
    },
    thumb: 'assets/images/thumbs/mambeev_thumb.JPG',
    infographic: { kz: 'assets/images/infographics/mambeev/mambeev_main', ru: 'assets/images/infographics/mambeev/mambeev_main', en: 'assets/images/infographics/mambeev/mambeev_main' },
  },
  {
    id: 'kenbaev', years: '1925 – 1993', color: '#c4843a',
    name: { kz: 'Молдахмет Сыздықұлы Кенбаев', ru: 'Молдахмет Сыздыкович Кенбаев', en: 'Moldakmet Syzdykovich Kenbaev' },
    bio: {
      kz: 'Қазақтың алғашқы кәсіби суретшілерінің бірі (1925–1993). Қазақ КСР халық суретшісі (1985), өнердің құрмет ісесі (1963), профессор. Қостанай облысының Сартол ауылында туылған, Алматы балалық ошағында өндіктелген. Алматы өнеркөл училищесін бітірген (1948) және Мәскеу өнер институтын бітірген (1956). Қазақстан суретшілер одағына басшылық істеген (1956–1959), Алма-Ата ҚАШ және архитектура-құрылыс институтында оқытушылық істеген.',
      ru: 'Один из первых казахских профессиональных художников (1925–1993), народный художник Казахской ССР (1985), заслуженный деятель искусств (1963), профессор. Родился в ауле Сартол Костанайской области, воспитывался в алматинском детском доме. Окончил Алматинское художественное училище (1948) и Московский художественный институт (1956). Возглавлял Казахстанский союз художников (1956–1959), преподавал в политехническом и архитектурно-строительном институтах Алма-Аты.',
      en: 'One of the first professional Kazakh artists (1925–1993), People\'s Artist of the Kazakh SSR (1985), Honored Figure of the Arts (1963), professor. Born in the aul of Sartol in Kostanay region, grew up in an Almaty orphanage. Graduated from the Almaty School of Art (1948) and the Moscow Institute of Art (1956). Led the Kazakhstan Union of Artists (1956–1959), taught at the Polytechnic and Architecture-Construction Institutes in Alma-Ata.',
    },
    thumb: 'assets/images/thumbs/kenbaev_thumb.JPG',
    infographic: { kz: 'assets/images/infographics/kenbaev/kenbaev_main', ru: 'assets/images/infographics/kenbaev/kenbaev_main', en: 'assets/images/infographics/kenbaev/kenbaev_main' },
  },
  {
    id: 'akanaev', years: '1948 – н.в.', color: '#9a6b3a',
    name: { kz: 'Амандос Әтібекұлы Аканаев', ru: 'Амандос Атибекович Аканаев', en: 'Amandos Atibekovich Akanaev' },
    bio: {
      kz: 'Қазақстандық суретші, Қазақстан Республикасының мемлекеттік сыйлығының лауреаты әндеулемінде және өнерде (2010). Мичурина елді мекенінде (қазіргі Энбекші) Алматы облысында туылған. Н.В. Гоголь атындағы Алматы өнеркөл училищесін бітірген (1967) және кейіннен живопись оқыту. \'Неотрадиционализм\' стилінің жүйелеушісі, еуропалық дәстүрлерді Азия номадтық өнеріндегі пластикасымен байланыстырса, құрылымдалған әндеулемені металл, теңткелі ұстақы және ағашпен пайдалану; \'Қазақстан Республикасы Өнер академиясы\' қорының ағымындағы мәдени мұра сақтау ынамындағы ағартушысы.',
      ru: 'Казахстанский художник, лауреат Государственной премии РК в области литературы и искусства (2010). Родился в поселке Мичурина (ныне Энбекши) Алматинской области. Окончил Алматинское художественное училище им. Н.В. Гоголя (1967), где позже преподавал живопись. Создатель стиля \'неотрадиционализм\', сочетающего европейские традиции с пластикой номадного искусства Азии, используя рельефную живопись с металлом, текстилем и деревом; инициатор фонда \'Академия художеств РК\' по сохранению культурного наследия.',
      en: 'Kazakhstani artist, laureate of the State Prize of the Republic of Kazakhstan in Literature and the Arts (2010). Born in the settlement of Michurina (now Enbekshi) in Almaty region. Graduated from the N.V. Gogol Almaty School of Art (1967), where he later taught painting. Creator of the \'neo-traditionalism\' style, combining European traditions with the plasticity of Asian nomadic art, using relief painting with metal, textiles and wood; initiator of the \'Academy of the Arts of the RK\' fund for the preservation of cultural heritage.',
    },
    thumb: 'assets/images/thumbs/akanaev_thumb.JPG',
    infographic: { kz: 'assets/images/infographics/akanaev/akanaev_main', ru: 'assets/images/infographics/akanaev/akanaev_main', en: 'assets/images/infographics/akanaev/akanaev_main' },
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

function showBio() { 
  D.bioPanel.classList.add('visible');
  var footer = document.getElementById('app-footer');
  if (footer) {
    footer.style.opacity = '0';
    footer.style.pointerEvents = 'none';
    footer.style.visibility = 'hidden';
  }
}

function hideBio() { 
  D.bioPanel.classList.remove('visible');
  var footer = document.getElementById('app-footer');
  if (footer) {
    footer.style.opacity = '1';
    footer.style.pointerEvents = 'auto';
    footer.style.visibility = 'visible';
  }
}

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
  updatePhoneOrientationHint(lang);

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
// ПОДСКАЗКА ОБ ОРИЕНТАЦИИ ТЕЛЕФОНА
// ============================================================
function isMobileDevice() {
  return window.innerWidth <= 640;
}

function updatePhoneOrientationHint(lang) {
  var hintText = document.getElementById('phone-orientation-text');
  var hintSubtext = document.getElementById('phone-orientation-subtext');
  if (hintText) hintText.textContent = LANG[lang].phoneHint;
  if (hintSubtext) hintSubtext.textContent = LANG[lang].phoneHintSub;
}

function hidePhoneOrientationHint() {
  var hint = document.getElementById('phone-orientation-hint');
  if (hint) {
    hint.classList.add('hidden');
  }
}

function showPhoneOrientationHint() {
  // Показываем только на мобильных устройствах
  if (!isMobileDevice()) return;
  
  var hint = document.getElementById('phone-orientation-hint');
  if (hint) {
    hint.classList.remove('hidden');
    updatePhoneOrientationHint(S.lang);
  }
}

function setupPhoneOrientationHintHandlers() {
  var hint = document.getElementById('phone-orientation-hint');
  if (!hint) return;
  
  // Закрытие по клику
  hint.addEventListener('click', function() {
    hidePhoneOrientationHint();
  });
  
  // Закрытие при повороте экрана (портретная ориентация)
  function checkOrientation() {
    var isPortrait = window.innerHeight >= window.innerWidth;
    if (isPortrait) {
      hidePhoneOrientationHint();
    }
  }
  
  window.addEventListener('orientationchange', function() {
    setTimeout(checkOrientation, 100);
  });
  
  window.addEventListener('resize', function() {
    // Переоценим является ли это мобильным устройством
    if (!isMobileDevice()) {
      hidePhoneOrientationHint();
    }
  });
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
var textureLoader = new THREE.TextureLoader();
textureLoader.setCrossOrigin('anonymous');
var textureCache = {};

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

// ── LOD Loader для инфографик ─────────────────────────────

/**
 * Загружает изображение с системой LOD (Level of Detail)
 * Сначала грузит 250kb (низкое качество), потом 1mb, потом original
 * @param {string} basePath - путь без размера/расширения (e.g., "assets/images/infographics/artist/artist_main_en")
 * @param {string} lang - язык (kz, ru, en)
 * @param {function} onLODLoad - callback(tex, lod) где lod = 1,2,3
 * @param {function} onError - callback на ошибку
 */
function loadTextureCached(fullPath, onLoad, onError) {
  var cached = textureCache[fullPath];
  if (cached) {
    if (cached.status === 'loaded') {
      onLoad(cached.texture);
      return;
    }
    if (cached.status === 'loading') {
      cached.callbacks.push({ onLoad: onLoad, onError: onError });
      return;
    }
  }

  textureCache[fullPath] = {
    status: 'loading',
    texture: null,
    callbacks: [{ onLoad: onLoad, onError: onError }]
  };

  textureLoader.load(
    fullPath,
    function(tex) {
      var entry = textureCache[fullPath];
      entry.status = 'loaded';
      entry.texture = tex;
      entry.callbacks.forEach(function(cb) {
        cb.onLoad(tex);
      });
      entry.callbacks = [];
    },
    undefined,
    function(err) {
      var entry = textureCache[fullPath];
      var callbacks = entry ? entry.callbacks : [];
      delete textureCache[fullPath];
      callbacks.forEach(function(cb) {
        if (cb.onError) cb.onError(err);
      });
    }
  );
}

function loadImageWithLOD(basePathWithLang, options) {
  options = options || {};
  var sizes = options.sizes || ['250kb', '1mb', 'original'];
  var currentLOD = 0;
  var cancelled = false;

  function loadNextLOD() {
    if (cancelled || currentLOD >= sizes.length) return;

    var size = sizes[currentLOD];
    var fullPath = basePathWithLang + '_' + size + '.png';

    loadTextureCached(
      fullPath,
      function(tex) {
        if (cancelled) return;
        currentLOD++;
        if (options.onLODLoad) options.onLODLoad(tex, currentLOD, size);
        if (options.progressive !== false) {
          loadNextLOD();
        }
      },
      function(err) {
        if (cancelled) return;
        if (currentLOD < sizes.length - 1) {
          currentLOD++;
          loadNextLOD();
        } else if (options.onError) {
          options.onError(err);
        }
      }
    );
  }

  loadNextLOD();

  return {
    cancel: function() {
      cancelled = true;
    }
  };
}

// ── Основная функция ───────────────────────────────────────

function buildRoom(artist) {
  destroyRoom();

  var container = D.roomContainer;
  var W = container.clientWidth  || window.innerWidth;
  var H = container.clientHeight || window.innerHeight;

  // Renderer
  var renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type    = THREE.PCFSoftShadowMap;
  renderer.toneMapping       = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  container.appendChild(renderer.domElement);

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

  // ── Геометрия ──────────────────────────────────────────

  var textures = []; // для dispose
  var rW = 8, rH = 4.8, rD = 10;
  var artColor = new THREE.Color(artist.color || '#c4843a');

  // Материалы
  var parquetTex = makeParquetTexture(512);
  textures.push(parquetTex);
  var wallTex    = makeWallTexture(512);
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

  var rugTex = makeRugTexture(artist.color, 256);
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

  // ── 4 стены с инфографикой (LOD система) ────────────────

  var framePad = 0.12;
  var panH = 2.8;

  // Определяем пути based на структуре папок (новые художники в папках)
  function getInflGraphicPath(position, lang) {
    var artistId = artist.id;
    var positionStr = position === 'main' ? 'main' : position;
    var folderPath = 'assets/images/infographics/' + artistId + '/' + artistId + '_' + positionStr + '_' + lang;
    return folderPath;
  }

  var paintingLoaders = [];

  function ensureWallFrame(position, wallConfig, panW) {
    if (!wallConfig.meshGroup) {
      wallConfig.meshGroup = new THREE.Group();
      wallConfig.meshGroup.position.copy(wallConfig.panelPos);
      if (wallConfig.rotation && wallConfig.rotation.y !== undefined) {
        wallConfig.meshGroup.rotation.y = wallConfig.rotation.y;
      }
      roomGroup.add(wallConfig.meshGroup);
    }

    while (wallConfig.meshGroup.children.length > 0) {
      wallConfig.meshGroup.remove(wallConfig.meshGroup.children[0]);
    }

    var frameColor = position === 'main' ? '#7a5512' : '#5a3512';
    var frameMat = createMaterial('lambert', { color: frameColor });
    var frame = new THREE.Mesh(
      new THREE.BoxGeometry(panW + framePad * 2, panH + framePad * 2, 0.05),
      frameMat
    );
    frame.position.set(0, 0, 0);
    frame.isFrame = true;
    wallConfig.meshGroup.add(frame);
  }

  // Функция для добавления картины на стену с оптимизированной LOD-загрузкой
  function addPaintingToWall(position, wallConfig, options) {
    var basePath = getInflGraphicPath(position, S.lang);
    if (!basePath) {
      return;
    }

    options = options || {};

    var loadTask = loadImageWithLOD(basePath, {
      sizes: options.sizes,
      progressive: options.progressive !== false,
      onLODLoad: function(tex, lod) {
        if (!threeCtx || threeCtx.roomGroup !== roomGroup) return;

        var imgWidth = tex.image.width;
        var imgHeight = tex.image.height;
        var aspectRatio = imgWidth / imgHeight;
        var panW = panH * aspectRatio;

        if (lod === 1 || !wallConfig.meshGroup) {
          ensureWallFrame(position, wallConfig, panW);
        }

        if (wallConfig.meshGroup.children.length > 1) {
          wallConfig.meshGroup.remove(wallConfig.meshGroup.children[wallConfig.meshGroup.children.length - 1]);
        }

        var panelMat = createMaterial('lambert', { map: tex });
        var panel = new THREE.Mesh(
          new THREE.BoxGeometry(panW, panH, 0.02),
          panelMat
        );
        panel.position.set(0, 0, 0.02);
        wallConfig.meshGroup.add(panel);
      },
      onError: function(err) {
        console.warn('Failed to load painting at position ' + position + ':', err);
      }
    });

    paintingLoaders.push(loadTask);
  }

  // Конфигурация для 4-х стен (передняя, боковые, задняя)
  var wallConfigs = {
    main: {
      framePos: new THREE.Vector3(0, 2.4, -rD/2 + 0.13),
      panelPos: new THREE.Vector3(0, 2.4, -rD/2 + 0.17),
      rotation: { y: 0 },  // передняя стена - без поворота
      meshGroup: null
    },
    left: {
      framePos: new THREE.Vector3(-rW/2 + 0.20, 2.4, -0.5),
      panelPos: new THREE.Vector3(-rW/2 + 0.18, 2.4, -0.5),
      rotation: { y: Math.PI / 2 },  // левая стена - поворот на 90 градусов
      meshGroup: null
    },
    right: {
      framePos: new THREE.Vector3(rW/2 - 0.20, 2.4, 0.5),
      panelPos: new THREE.Vector3(rW/2 - 0.18, 2.4, 0.5),
      rotation: { y: -Math.PI / 2 },  // правая стена - поворот на -90 градусов
      meshGroup: null
    },
    back: {
      framePos: new THREE.Vector3(0, 2.4, rD/2 - 0.13),
      panelPos: new THREE.Vector3(0, 2.4, rD/2 - 0.17),
      rotation: { y: Math.PI },  // задняя стена - поворот на 180 градусов
      meshGroup: null
    }
  };

  // Сначала грузим главную картину прогрессивно во всех качествах
  addPaintingToWall('main', wallConfigs.main, {
    sizes: ['250kb', '1mb', 'original'],
    progressive: true
  });

  // Боковые и заднюю стены сначала грузим только в лёгком качестве
  var sidePositions = ['left', 'right', 'back'];
  var sideNumbers = [1, 2, 3];

  sideNumbers.forEach(function(num, idx) {
    addPaintingToWall(num, wallConfigs[sidePositions[idx]], {
      sizes: ['250kb'],
      progressive: false
    });
  });

  // Затем догружаем улучшенное качество боковых стен с небольшой задержкой,
  // чтобы не конкурировать с первым рендером комнаты
  setTimeout(function() {
    if (!threeCtx || threeCtx.roomGroup !== roomGroup) return;

    sideNumbers.forEach(function(num, idx) {
      addPaintingToWall(num, wallConfigs[sidePositions[idx]], {
        sizes: ['1mb', 'original'],
        progressive: true
      });
    });
  }, 800);

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

  var orbit = createOrbit(camera, renderer.domElement);

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
    textures:       textures,
    paintingLoaders: paintingLoaders
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

  if (threeCtx.paintingLoaders) {
    threeCtx.paintingLoaders.forEach(function(loader) {
      if (loader && loader.cancel) loader.cancel();
    });
  }

  if (threeCtx.resizeObserver) {
    threeCtx.resizeObserver.disconnect();
  } else {
    window.removeEventListener('resize', threeCtx.onResize);
  }

  // Освобождаем геометрию и материалы
  if (threeCtx.scene) {
    threeCtx.scene.traverse(function(obj) {
      if (obj.isMesh) disposeMesh(obj);
    });
  }

  // Освобождаем текстуры
  if (threeCtx.textures) {
    threeCtx.textures.forEach(function(t) { t.dispose(); });
  }

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
  
  // Пытаемся запросить разрешение сразу при инициализации
  tryEnableGyro();
  
  // Повторяем запрос на первый touchstart если ещё не разрешено
  var gyroPermCheckHandler = function() {
    if (!hasGyro) {
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

  // Показываем подсказку об ориентации телефона на 5 секунд (только на мобиле)
  showPhoneOrientationHint();
  setupPhoneOrientationHintHandlers();
  setTimeout(function() {
    hidePhoneOrientationHint();
  }, 5000);

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
      'Ошибка ини<br><small>' + err.message + '</small></div>';
  });
});
