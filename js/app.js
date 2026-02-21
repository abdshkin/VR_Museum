/**
 * KAZAKH ARTISTS VIRTUAL MUSEUM — app.js
 * Clean rewrite: no smart quotes, defensive init, quaternion gyro, pinch-zoom, back button in room
 */

// ─── LANGUAGE STRINGS ────────────────────────────────────────────────────────
var LANG = {
  kz: { back: '\u2190 \u0410\u0440\u0442\u049b\u0430', enterRoom: '\u0417\u0430\u043b\u0493\u0430 \u043a\u0456\u0440\u0443', explore: '\u0416\u0430\u043b\u0493\u0430\u0441\u0442\u044b\u0440', dragHint: '\ud83d\udcf1 \u0410\u0439\u043d\u0430\u043b\u0434\u044b\u0440\u0443 \u04af\u0448\u0456\u043d \u0441\u04af\u0439\u0440\u0435\u043f \u0430\u043f\u0430\u0440\u044b\u04a3\u044b\u0437', bio: '\u0421\u0443\u0440\u0435\u0442\u0448\u0456 \u0442\u0443\u0440\u0430\u043b\u044b' },
  ru: { back: '\u2190 \u041d\u0430\u0437\u0430\u0434',  enterRoom: '\u0412\u043e\u0439\u0442\u0438 \u0432 \u0437\u0430\u043b', explore: '\u041f\u0440\u043e\u0434\u043e\u043b\u0436\u0438\u0442\u044c', dragHint: '\ud83d\udcf1 \u041f\u0435\u0440\u0435\u0442\u044f\u043d\u0438 \u0434\u043b\u044f \u043e\u0441\u043c\u043e\u0442\u0440\u0430', bio: '\u041e \u0445\u0443\u0434\u043e\u0436\u043d\u0438\u043a\u0435' },
  en: { back: '\u2190 Back',   enterRoom: 'Enter Room',  explore: 'Explore', dragHint: '\ud83d\udcf1 Drag to explore room', bio: 'About the Artist' },
};

// ─── ARTIST DATA (inline fallback — works without server / file://) ──────────
var ARTISTS = [
  {
    id: 'telzhanov', years: '1927 \u2013 2013', color: '#c4843a',
    name: { kz: '\u041c\u04b1\u0445\u0430\u043c\u0435\u0434\u0445\u0430\u043d\u0430\u0444\u0438\u044f \u0422\u0435\u043b\u044c\u0436\u0430\u043d\u043e\u0432', ru: '\u041c\u0443\u0445\u0430\u043c\u0435\u0434\u0445\u0430\u043d\u0430\u0444\u0438\u044f \u0422\u0435\u043b\u044c\u0436\u0430\u043d\u043e\u0432', en: 'Mukhamedhanafia Telzhanov' },
    bio: {
      kz: '\u049a\u0430\u0437\u0430\u049b \u041a\u0421\u0420 \u0436\u04d9\u043d\u0435 \u041a\u0421\u0420\u041e \u0445\u0430\u043b\u044b\u049b \u0441\u0443\u0440\u0435\u0442\u0448\u0456\u0441\u0456 (1978). \u041e\u043c\u0441\u043a\u0456\u0434\u0435 \u0442\u0443\u044b\u043b\u0493\u0430\u043d, \u041b\u0435\u043d\u0438\u043d\u0433\u0440\u0430\u0434\u0442\u0430 \u0420\u0435\u043f\u0438\u043d \u0430\u0442\u044b\u043d\u0434\u0430\u0493\u044b \u0438\u043d\u0441\u0442\u0438\u0442\u0443\u0442\u0442\u044b \u0431\u0456\u0442\u0456\u0440\u0433\u0435\u043d (1953). \u00ab\u0416\u0430\u043c\u0430\u043b\u00bb, \u00ab\u0414\u043e\u043c\u0431\u044b\u0440\u0430\u043d\u044b\u04a3 \u04af\u043d\u0456\u00bb, \u00ab\u0410\u0442\u0430\u043c\u0435\u043a\u0435\u043d\u00bb \u0442\u0443\u044b\u043d\u0434\u044b\u043b\u0430\u0440\u044b \u049b\u0430\u0437\u0430\u049b \u043a\u0435\u0441\u043a\u0456\u043d\u0434\u0435\u043c\u0435\u0441\u0456\u043d\u0456\u04a3 \u043a\u043b\u0430\u0441\u0441\u0438\u043a\u0430\u0441\u044b\u043d\u0430 \u0430\u0439\u043d\u0430\u043b\u0434\u044b. \u049a\u0430\u0437\u0430\u049b\u0441\u0442\u0430\u043d \u0441\u0443\u0440\u0435\u0442\u0448\u0456\u043b\u0435\u0440 \u043e\u0434\u0430\u0493\u044b\u043d \u0431\u0430\u0441\u049b\u0430\u0440\u0493\u0430\u043d (1964\u20131968).',
      ru: '\u041d\u0430\u0440\u043e\u0434\u043d\u044b\u0439 \u0445\u0443\u0434\u043e\u0436\u043d\u0438\u043a \u041a\u0430\u0437\u0421\u0421\u0420 \u0438 \u0421\u0421\u0421\u0420 (1978). \u0420\u043e\u0434\u0438\u043b\u0441\u044f \u0432 \u041e\u043c\u0441\u043a\u0435, \u043e\u043a\u043e\u043d\u0447\u0438\u043b \u0418\u043d\u0441\u0442\u0438\u0442\u0443\u0442 \u0436\u0438\u0432\u043e\u043f\u0438\u0441\u0438 \u0438\u043c. \u0420\u0435\u043f\u0438\u043d\u0430 \u0432 \u041b\u0435\u043d\u0438\u043d\u0433\u0440\u0430\u0434\u0435 (1953). \u0415\u0433\u043e \u0440\u0430\u0431\u043e\u0442\u044b \u00ab\u0416\u0430\u043c\u0430\u043b\u00bb, \u00ab\u0417\u0432\u0443\u043a\u0438 \u0434\u043e\u043c\u0431\u0440\u044b\u00bb, \u00ab\u041d\u0430 \u0437\u0435\u043c\u043b\u0435 \u0434\u0435\u0434\u043e\u0432\u00bb \u2014 \u043a\u043b\u0430\u0441\u0441\u0438\u043a\u0430 \u043a\u0430\u0437\u0430\u0445\u0441\u043a\u043e\u0439 \u0436\u0438\u0432\u043e\u043f\u0438\u0441\u0438. \u0412\u043e\u0437\u0433\u043b\u0430\u0432\u043b\u044f\u043b \u0421\u043e\u044e\u0437 \u0445\u0443\u0434\u043e\u0436\u043d\u0438\u043a\u043e\u0432 \u041a\u0430\u0437\u0430\u0445\u0441\u0442\u0430\u043d\u0430 (1964\u20131968) \u0438 \u041c\u0443\u0437\u0435\u0439 \u0438\u0441\u043a\u0443\u0441\u0441\u0442\u0432 \u0438\u043c. \u041a\u0430\u0441\u0442\u0435\u0435\u0432\u0430.',
      en: "People's Artist of the Kazakh SSR and USSR (1978). Born in Omsk, graduated from the Repin Institute in Leningrad (1953). His works Zhamal, Sounds of the Dombra and Native Land are classics of Kazakh painting. Led the Union of Artists of Kazakhstan (1964-1968).",
    },
    thumb: 'assets/images/thumbs/telzhanov_thumb.jpg',
    infographic: { kz: 'assets/images/infographics/telzhanov_kz.jpg', ru: 'assets/images/infographics/telzhanov_ru.jpg', en: 'assets/images/infographics/telzhanov_en.jpg' },
  },
  {
    id: 'galimbayeva', years: '1917 \u2013 2008', color: '#7a5c9e',
    name: { kz: '\u0410\u0439\u0448\u0430 \u0492\u0430\u043b\u044b\u043c\u0431\u0430\u0435\u0432\u0430', ru: '\u0410\u0439\u0448\u0430 \u0413\u0430\u043b\u0438\u043c\u0431\u0430\u0435\u0432\u0430', en: 'Aisha Galimbayeva' },
    bio: {
      kz: '\u049a\u0430\u0437\u0430\u049b\u0441\u0442\u0430\u043d\u043d\u044b\u04a3 \u0430\u043b\u0493\u0430\u0448\u049b\u044b \u043a\u04d9\u0441\u0456\u0431\u0438 \u0441\u0443\u0440\u0435\u0442\u0448\u0456 \u04d9\u0439\u0435\u043b\u0456, \u049a\u0430\u0437\u041a\u0421\u0420 \u0445\u0430\u043b\u044b\u049b \u0441\u0443\u0440\u0435\u0442\u0448\u0456\u0441\u0456 (1967). \u0415\u0441\u0456\u043a \u049b\u0430\u043b\u0430\u0441\u044b\u043d\u0434\u0430 \u0442\u0443\u044b\u043b\u0493\u0430\u043d. \u0412\u0413\u0418\u041a-\u0442\u0456 \u0431\u0456\u0442\u0456\u0440\u0433\u0435\u043d (1949). \u00ab\u049a\u0430\u0437\u0430\u049b \u0445\u0430\u043b\u044b\u049b \u043a\u043e\u0441\u0442\u044e\u043c\u0456\u00bb \u0430\u043b\u044c\u0431\u043e\u043c\u044b\u043d\u044b\u04a3 \u0430\u0432\u0442\u043e\u0440\u044b. \u0412\u0430\u043b\u0438\u0445\u0430\u043d\u043e\u0432 \u0430\u0442\u044b\u043d\u0434\u0430\u0493\u044b \u043c\u0435\u043c\u043b\u0435\u043a\u0435\u0442\u0442\u0456\u043a \u0441\u044b\u0439\u043b\u044b\u049b\u044b\u043d\u044b\u04a3 \u043b\u0430\u0443\u0440\u0435\u0430\u0442\u044b (1972).',
      ru: '\u041f\u0435\u0440\u0432\u0430\u044f \u043f\u0440\u043e\u0444\u0435\u0441\u0441\u0438\u043e\u043d\u0430\u043b\u044c\u043d\u0430\u044f \u0445\u0443\u0434\u043e\u0436\u043d\u0438\u0446\u0430-\u043a\u0430\u0437\u0430\u0448\u043a\u0430, \u043d\u0430\u0440\u043e\u0434\u043d\u044b\u0439 \u0445\u0443\u0434\u043e\u0436\u043d\u0438\u043a \u041a\u0430\u0437\u0421\u0421\u0420 (1967). \u0420\u043e\u0434\u0438\u043b\u0430\u0441\u044c \u0432 \u0418\u0441\u0441\u044b\u043a\u0435. \u041e\u043a\u043e\u043d\u0447\u0438\u043b\u0430 \u0412\u0413\u0418\u041a (1949). \u0410\u0432\u0442\u043e\u0440 \u0430\u043b\u044c\u0431\u043e\u043c\u0430 \u00ab\u041a\u0430\u0437\u0430\u0445\u0441\u043a\u0438\u0439 \u043d\u0430\u0440\u043e\u0434\u043d\u044b\u0439 \u043a\u043e\u0441\u0442\u044e\u043c\u00bb. \u041b\u0430\u0443\u0440\u0435\u0430\u0442 \u0413\u043e\u0441\u043f\u0440\u0435\u043c\u0438\u0438 \u0438\u043c. \u0412\u0430\u043b\u0438\u0445\u0430\u043d\u043e\u0432\u0430 (1972). \u0421\u0440\u0435\u0434\u0438 \u043f\u043e\u0440\u0442\u0440\u0435\u0442\u043e\u0432 \u2014 \u043e\u0431\u0440\u0430\u0437\u044b \u0410\u0431\u0430\u044f, \u0411\u0430\u0439\u0441\u0435\u0438\u0442\u043e\u0432\u043e\u0439, \u041c\u0443\u0441\u0442\u0430\u0444\u0438\u043d\u0430.',
      en: "The first professional Kazakh female artist, People's Artist of the Kazakh SSR (1967). Born in Issyk. Graduated from VGIK (1949). Author of the album Kazakh National Costume. State Prize laureate (1972). Her portraits include Abai, Baisseitova and Mustafin.",
    },
    thumb: 'assets/images/thumbs/galimbayeva_thumb.jpg',
    infographic: { kz: 'assets/images/infographics/galimbayeva_kz.jpg', ru: 'assets/images/infographics/galimbayeva_ru.jpg', en: 'assets/images/infographics/galimbayeva_en.jpg' },
  },
  {
    id: 'mullashev', years: '1944 \u2013 \u043d.\u0432.', color: '#3a7a5c',
    name: { kz: '\u041a\u0430\u043c\u0438\u043b\u044c \u041c\u0443\u043b\u043b\u0430\u0448\u0435\u0432', ru: '\u041a\u0430\u043c\u0438\u043b\u044c \u041c\u0443\u043b\u043b\u0430\u0448\u0435\u0432', en: 'Kamil Mullashev' },
    bio: {
      kz: '\u049a\u0430\u0437\u0430\u049b\u0441\u0442\u0430\u043d \u043c\u0435\u043d \u0422\u0430\u0442\u0430\u0440\u0441\u0442\u0430\u043d\u043d\u044b\u04a3 \u0435\u04a3\u0431\u0435\u043a \u0441\u0456\u04a3\u0456\u0440\u0433\u0435\u043d \u0441\u0443\u0440\u0435\u0442\u0448\u0456\u0441\u0456. \u049a\u044b\u0442\u0430\u0439\u0434\u044b\u04a3 \u04ae\u0440\u0456\u043c\u0436\u0456 \u049b\u0430\u043b\u0430\u0441\u044b\u043d\u0434\u0430 \u0442\u0443\u044b\u043b\u0493\u0430\u043d (1944), \u0421\u0443\u0440\u0438\u043a\u043e\u0432 \u0430\u0442\u044b\u043d\u0434\u0430\u0493\u044b \u041c\u041a\u04e8\u0418-\u0434\u0456 \u0431\u0456\u0442\u0456\u0440\u0433\u0435\u043d (1978). \u00ab\u0416\u0435\u0440 \u0436\u04d9\u043d\u0435 \u0443\u0430\u049b\u044b\u0442. \u049a\u0430\u0437\u0430\u049b\u0441\u0442\u0430\u043d\u00bb \u0442\u0440\u0438\u043f\u0442\u0438\u0445\u0456 \u041f\u0430\u0440\u0438\u0436\u0434\u0435\u0433\u0456 \u0413\u0440\u0430\u043d\u0434-\u041f\u0430\u043b\u0435\u0434\u0435 \u043a\u04e9\u0440\u0441\u0435\u0442\u0456\u043b\u0434\u0456. \u0424\u0440\u0430\u043d\u0446\u0438\u044f \u04e8\u043d\u0435\u0440 \u0430\u043a\u0430\u0434\u0435\u043c\u0438\u044f\u0441\u044b\u043d\u044b\u04a3 \u043a\u04af\u043c\u0456\u0441 \u043c\u0435\u0434\u0430\u043b\u0456.',
      ru: '\u0417\u0430\u0441\u043b\u0443\u0436\u0435\u043d\u043d\u044b\u0439 \u0434\u0435\u044f\u0442\u0435\u043b\u044c \u0438\u0441\u043a\u0443\u0441\u0441\u0442\u0432 \u041a\u0430\u0437\u0430\u0445\u0441\u0442\u0430\u043d\u0430 \u0438 \u043d\u0430\u0440\u043e\u0434\u043d\u044b\u0439 \u0445\u0443\u0434\u043e\u0436\u043d\u0438\u043a \u0422\u0430\u0442\u0430\u0440\u0441\u0442\u0430\u043d\u0430. \u0420\u043e\u0434\u0438\u043b\u0441\u044f \u0432 \u0423\u0440\u0443\u043c\u0447\u0438 (\u041a\u041d\u0420, 1944), \u043e\u043a\u043e\u043d\u0447\u0438\u043b \u041c\u0413\u0425\u0418 \u0438\u043c. \u0421\u0443\u0440\u0438\u043a\u043e\u0432\u0430 (1978). \u0422\u0440\u0438\u043f\u0442\u0438\u0445 \u00ab\u0417\u0435\u043c\u043b\u044f \u0438 \u0432\u0440\u0435\u043c\u044f. \u041a\u0430\u0437\u0430\u0445\u0441\u0442\u0430\u043d\u00bb \u044d\u043a\u0441\u043f\u043e\u043d\u0438\u0440\u043e\u0432\u0430\u043b\u0441\u044f \u0432 \u0413\u0440\u0430\u043d\u0434-\u041f\u0430\u043b\u0435 \u0432 \u041f\u0430\u0440\u0438\u0436\u0435, \u0441\u0435\u0440\u0435\u0431\u0440\u044f\u043d\u0430\u044f \u043c\u0435\u0434\u0430\u043b\u044c \u0410\u043a\u0430\u0434\u0435\u043c\u0438\u0438 \u0445\u0443\u0434\u043e\u0436\u0435\u0441\u0442\u0432 \u0424\u0440\u0430\u043d\u0446\u0438\u0438.',
      en: "Honored Artist of Kazakhstan and People's Artist of Tatarstan. Born in Urumqi, China (1944), graduated from the Surikov Art Institute in Moscow (1978). His triptych Land and Time. Kazakhstan was shown at the Grand Palais in Paris, earning a silver medal from the French Academy of Arts.",
    },
    thumb: 'assets/images/thumbs/mullashev_thumb.jpg',
    infographic: { kz: 'assets/images/infographics/mullashev_kz.jpg', ru: 'assets/images/infographics/mullashev_ru.jpg', en: 'assets/images/infographics/mullashev_en.jpg' },
  },
  {
    id: 'ismailova', years: '1929 \u2013 2013', color: '#c44a4a',
    name: { kz: '\u0413\u04af\u043b\u0444\u0430\u0439\u0440\u0443\u0441 \u042b\u0441\u043c\u0430\u0439\u044b\u043b\u043e\u0432\u0430', ru: '\u0413\u0443\u043b\u044c\u0444\u0430\u0439\u0440\u0443\u0441 \u0418\u0441\u043c\u0430\u0438\u043b\u043e\u0432\u0430', en: 'Gulfairous Ismailova' },
    bio: {
      kz: '\u049a\u0430\u0437\u041a\u0421\u0420 \u0445\u0430\u043b\u044b\u049b \u0441\u0443\u0440\u0435\u0442\u0448\u0456\u0441\u0456 (1987), \u0430\u043a\u0442\u0440\u0438\u0441\u0430. \u0410\u043b\u043c\u0430\u0442\u044b\u0434\u0430 \u0442\u0443\u044b\u043b\u0493\u0430\u043d. \u0420\u0435\u043f\u0438\u043d \u0430\u0442\u044b\u043d\u0434\u0430\u0493\u044b \u041b\u0416\u0421\u041a\u0410-\u043d\u044b \u0431\u0456\u0442\u0456\u0440\u0433\u0435\u043d (1956). \u00ab\u049a\u0430\u0437\u0430\u049b \u0432\u0430\u043b\u044c\u0441\u0456\u00bb \u2014 \u041a\u0430\u0441\u0442\u0435\u0435\u0432 \u043c\u04b1\u0440\u0430\u0436\u0430\u0439\u044b\u043d\u044b\u04a3 \u0433\u0430\u0443\u04bb\u0430\u0440\u044b. \u0410\u0431\u0430\u0439 \u0430\u0442\u044b\u043d\u0434\u0430\u0493\u044b \u043e\u043f\u0435\u0440\u0430 \u0442\u0435\u0430\u0442\u0440\u044b\u043d\u044b\u04a3 \u0431\u0430\u0441 \u0441\u0443\u0440\u0435\u0442\u0448\u0456\u0441\u0456 (16 \u0436\u044b\u043b). \u00ab\u049a\u044b\u0437 \u0416\u0456\u0431\u0435\u043a\u00bb \u0444\u0438\u043b\u044c\u043c\u0456\u043d\u0456\u04a3 \u0431\u0435\u0437\u0435\u043d\u0434\u0456\u0440\u0443\u0448\u0456\u0441\u0456.',
      ru: '\u041d\u0430\u0440\u043e\u0434\u043d\u044b\u0439 \u0445\u0443\u0434\u043e\u0436\u043d\u0438\u043a \u041a\u0430\u0437\u0421\u0421\u0420 (1987), \u0430\u043a\u0442\u0440\u0438\u0441\u0430. \u0420\u043e\u0434\u0438\u043b\u0430\u0441\u044c \u0432 \u0410\u043b\u043c\u0430-\u0410\u0442\u0435. \u041e\u043a\u043e\u043d\u0447\u0438\u043b\u0430 \u041b\u0418\u0416\u0421\u0410 \u0438\u043c. \u0420\u0435\u043f\u0438\u043d\u0430 (1956). \u00ab\u041a\u0430\u0437\u0430\u0445\u0441\u043a\u0438\u0439 \u0432\u0430\u043b\u044c\u0441\u00bb \u2014 \u0436\u0435\u043c\u0447\u0443\u0436\u0438\u043d\u0430 \u043c\u0443\u0437\u0435\u044f \u0438\u043c. \u041a\u0430\u0441\u0442\u0435\u0435\u0432\u0430. 16 \u043b\u0435\u0442 \u2014 \u0433\u043b\u0430\u0432\u043d\u044b\u0439 \u0445\u0443\u0434\u043e\u0436\u043d\u0438\u043a \u0442\u0435\u0430\u0442\u0440\u0430 \u0438\u043c. \u0410\u0431\u0430\u044f. \u0425\u0443\u0434\u043e\u0436\u043d\u0438\u043a-\u043f\u043e\u0441\u0442\u0430\u043d\u043e\u0432\u0449\u0438\u043a \u0444\u0438\u043b\u044c\u043c\u0430 \u00ab\u041a\u044b\u0437 \u0416\u0438\u0431\u0435\u043a\u00bb, \u043b\u0430\u0443\u0440\u0435\u0430\u0442 \u0412\u0441\u0435\u0441\u043e\u044e\u0437\u043d\u043e\u0433\u043e \u043a\u0438\u043d\u043e\u0444\u0435\u0441\u0442\u0438\u0432\u0430\u043b\u044f.',
      en: "People's Artist of the Kazakh SSR (1987), actress and theatre designer. Born in Alma-Ata. Graduated from the Repin Institute in Leningrad (1956). Her Kazakh Waltz is the centrepiece of the Kasteev Museum. Chief designer of the Abai Opera Theatre for 16 years. Production designer of the film Kyz Zhibek.",
    },
    thumb: 'assets/images/thumbs/ismailova_thumb.jpg',
    infographic: { kz: 'assets/images/infographics/ismailova_kz.jpg', ru: 'assets/images/infographics/ismailova_ru.jpg', en: 'assets/images/infographics/ismailova_en.jpg' },
  },
  {
    id: 'kasteev', years: '1904 \u2013 1973', color: '#4a6e9e',
    name: { kz: '\u04d8\u0431\u0456\u043b\u0445\u0430\u043d \u049a\u0430\u0441\u0442\u0435\u0435\u0432', ru: '\u0410\u0431\u044b\u043b\u0445\u0430\u043d \u041a\u0430\u0441\u0442\u0435\u0435\u0432', en: 'Abylkhan Kasteev' },
    bio: {
      kz: '\u049a\u0430\u0437\u0430\u049b \u043a\u04d9\u0441\u0456\u0431\u0438 \u043a\u0435\u0441\u043a\u0456\u043d\u0434\u0435\u043c\u0435\u0441\u0456\u043d\u0456\u04a3 \u043d\u0435\u0433\u0456\u0437\u0456\u043d \u049b\u0430\u043b\u0430\u0443\u0448\u044b, \u049a\u0430\u0437\u041a\u0421\u0420 \u0445\u0430\u043b\u044b\u049b \u0441\u0443\u0440\u0435\u0442\u0448\u0456\u0441\u0456 (1944). \u0416\u0430\u0440\u043a\u0435\u043d\u0442 \u043c\u0430\u04a3\u044b\u043d\u0434\u0430\u0493\u044b \u0428\u0438\u0436\u0456\u043d \u0430\u0443\u044b\u043b\u044b\u043d\u0434\u0430 \u0442\u0443\u044b\u043b\u0493\u0430\u043d. \u04e8\u0437\u0434\u0456\u0433\u0456\u043d\u0435\u043d \u0441\u0443\u0440\u0435\u0442\u0448\u0456 \u0431\u043e\u043b\u0493\u0430\u043d. 1100-\u0434\u0435\u043d \u0430\u0441\u0442\u0430\u043c \u0442\u0443\u044b\u043d\u0434\u044b \u0436\u0430\u0441\u0430\u0493\u0430\u043d. \u0410\u043b\u043c\u0430\u0442\u044b\u0434\u0430\u0493\u044b \u041c\u0435\u043c\u043b\u0435\u043a\u0435\u0442\u0442\u0456\u043a \u04e8\u043d\u0435\u0440 \u041c\u04b1\u0440\u0430\u0436\u0430\u0439\u044b \u043e\u043d\u044b\u04a3 \u0430\u0442\u044b\u043c\u0435\u043d \u0430\u0442\u0430\u043b\u0493\u0430\u043d.',
      ru: '\u041e\u0441\u043d\u043e\u0432\u043e\u043f\u043e\u043b\u043e\u0436\u043d\u0438\u043a \u043a\u0430\u0437\u0430\u0445\u0441\u043a\u043e\u0433\u043e \u043f\u0440\u043e\u0444\u0435\u0441\u0441\u0438\u043e\u043d\u0430\u043b\u044c\u043d\u043e\u0433\u043e \u0438\u0437\u043e\u0431\u0440\u0430\u0437\u0438\u0442\u0435\u043b\u044c\u043d\u043e\u0433\u043e \u0438\u0441\u043a\u0443\u0441\u0441\u0442\u0432\u0430, \u043d\u0430\u0440\u043e\u0434\u043d\u044b\u0439 \u0445\u0443\u0434\u043e\u0436\u043d\u0438\u043a \u041a\u0430\u0437\u0421\u0421\u0420 (1944). \u0420\u043e\u0434\u0438\u043b\u0441\u044f \u0432 \u0430\u0443\u043b\u0435 \u0427\u0438\u0436\u0438\u043d \u0431\u043b\u0438\u0437 \u0416\u0430\u0440\u043a\u0435\u043d\u0442\u0430. \u0421\u0430\u043c\u043e\u0443\u0447\u043a\u0430: \u0441\u0442\u0443\u0434\u0438\u044f \u041d. \u0425\u043b\u0443\u0434\u043e\u0432\u0430 (1929\u201331) \u0438 \u0441\u0442\u0443\u0434\u0438\u044f \u0438\u043c. \u041a\u0440\u0443\u043f\u0441\u043a\u043e\u0439 \u0432 \u041c\u043e\u0441\u043a\u0432\u0435 (1934\u201337). \u0421\u043e\u0437\u0434\u0430\u043b \u0441\u0432\u044b\u0448\u0435 1100 \u043f\u0440\u043e\u0438\u0437\u0432\u0435\u0434\u0435\u043d\u0438\u0439. \u0418\u043c\u0435\u043d\u0435\u043c \u0445\u0443\u0434\u043e\u0436\u043d\u0438\u043a\u0430 \u043d\u0430\u0437\u0432\u0430\u043d \u0413\u043e\u0441\u0443\u0434\u0430\u0440\u0441\u0442\u0432\u0435\u043d\u043d\u044b\u0439 \u043c\u0443\u0437\u0435\u0439 \u0438\u0441\u043a\u0443\u0441\u0441\u0442\u0432 \u0432 \u0410\u043b\u043c\u0430\u0442\u044b.',
      en: "Pioneer of Kazakh professional fine art, People's Artist of the Kazakh SSR (1944). Born in the Chizhin aul near Zharkent. Self-taught: studied under N. Khludov (1929-31) and at the Krupskaya Studio in Moscow (1934-37). Created over 1,100 works. The State Museum of Arts in Almaty bears his name.",
    },
    thumb: 'assets/images/thumbs/kasteev_thumb.jpg',
    infographic: { kz: 'assets/images/infographics/kasteev_kz.jpg', ru: 'assets/images/infographics/kasteev_ru.jpg', en: 'assets/images/infographics/kasteev_en.jpg' },
  },
];

// ─── STATE ───────────────────────────────────────────────────────────────────
var S = { artists: [], lang: 'ru', current: 0, autoTimer: null, view: 'slider', activeArtist: null };
var D = {};  // DOM refs

// ─── LOAD DATA ───────────────────────────────────────────────────────────────
async function loadArtists() {
  try {
    var res = await fetch('data/artists.json');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    var data = await res.json();
    if (Array.isArray(data.artists) && data.artists.length) return data.artists;
    throw new Error('empty');
  } catch (e) {
    console.warn('Using built-in data:', e.message);
    return ARTISTS;
  }
}

// ─── SLIDER ──────────────────────────────────────────────────────────────────
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
    card.addEventListener('click', function() { goTo(i); showBio(); });
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
  D.dots.querySelectorAll('.dot').forEach(function(d, i) { d.classList.toggle('active', i === S.current); });
  S.activeArtist = S.artists[S.current];
  refreshBio();
}
function next() { goTo(S.current + 1); }
function prev() { goTo(S.current - 1); }
function startAuto() { stopAuto(); S.autoTimer = setInterval(next, 10000); }
function stopAuto()  { if (S.autoTimer) { clearInterval(S.autoTimer); S.autoTimer = null; } }

function initSwipe() {
  var el = D.trackWrap, startX = 0;
  el.addEventListener('touchstart', function(e) { startX = e.touches[0].clientX; stopAuto(); }, { passive: true });
  el.addEventListener('touchend',   function(e) {
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) { dx > 0 ? prev() : next(); }
    startAuto();
  }, { passive: true });
}

// ─── BIO PANEL ───────────────────────────────────────────────────────────────
function refreshBio() {
  var a = S.activeArtist;
  if (!a) return;
  D.bioName.textContent  = a.name[S.lang]  || a.name.en  || '';
  D.bioYears.textContent = a.years || '';
  D.bioText.textContent  = a.bio[S.lang]   || a.bio.en   || '';
}
function showBio()  { D.bioPanel.classList.add('visible'); }
function hideBio()  { D.bioPanel.classList.remove('visible'); }

// ─── LANGUAGE ─────────────────────────────────────────────────────────────────
function setLang(lang) {
  S.lang = lang;
  D.langBtns.forEach(function(btn) { btn.classList.toggle('active', btn.dataset.lang === lang); });
  D.backBtn.textContent     = LANG[lang].back;
  D.bioEnterBtn.textContent = LANG[lang].enterRoom;
  D.bioLabel.textContent    = LANG[lang].bio;
  D.gyroHint.innerHTML      = LANG[lang].dragHint + '<br><small>Drag to explore</small>';
  if (D.roomBackBtn) D.roomBackBtn.textContent = LANG[lang].back;
  updateCardText();
  refreshBio();
  if (S.view === 'room' && S.activeArtist && threeCtx) buildRoom(S.activeArtist);
}

// ─── VIEW SWITCH ──────────────────────────────────────────────────────────────
function showView(name) {
  S.view = name;
  D.sliderView.classList.toggle('hidden', name !== 'slider');
  D.roomView.classList.toggle('hidden',   name !== 'room');
}

function enterRoom(artist) {
  S.activeArtist = artist;
  hideBio(); stopAuto();
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

// ─── THREE.JS ROOM ────────────────────────────────────────────────────────────
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

  var scene  = new THREE.Scene();
  scene.background = new THREE.Color(0x1a1510);
  scene.fog        = new THREE.Fog(0x1a1510, 8, 20);

  var camera = new THREE.PerspectiveCamera(65, W / H, 0.1, 50);
  camera.position.set(0, 1.62, 0);

  scene.add(new THREE.AmbientLight(0xfff5e0, 0.55));
  var dir = new THREE.DirectionalLight(0xffe8c0, 1.3);
  dir.position.set(2, 5, 3); dir.castShadow = true; scene.add(dir);
  scene.add(Object.assign(new THREE.PointLight(0xd4a853, 0.9, 8), { position: new THREE.Vector3(0, 3.5, 0) }));

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
    scene.add(m); return m;
  }

  box(rW, 0.05, rD,  0, 0,    0,      mFloor, true);
  box(rW, 0.05, rD,  0, rH,   0,      mCeil);
  box(rW, rH,   0.1, 0, rH/2, -rD/2,  mWall);
  box(rW, rH,   0.1, 0, rH/2,  rD/2,  mWall);
  box(0.1, rH,  rD, -rW/2, rH/2, 0,   mWall);
  box(0.1, rH,  rD,  rW/2, rH/2, 0,   mWall);
  box(rW, 0.06, 0.06, 0, 0.03,    -rD/2+0.05, mMold);
  box(rW, 0.06, 0.06, 0, rH-0.03, -rD/2+0.05, mMold);

  var fw = 4.15, fh = 2.75, fz = -rD/2+0.11, ft = 0.12;
  box(fw, ft, ft,  0,    fh/2,  fz, mFrame);
  box(fw, ft, ft,  0,   -fh/2,  fz, mFrame);
  box(ft, fh, ft, -fw/2, 0,     fz, mFrame);
  box(ft, fh, ft,  fw/2, 0,     fz, mFrame);

  var infPath = artist.infographic && artist.infographic[S.lang] ? artist.infographic[S.lang] : null;
  if (infPath) {
    new THREE.TextureLoader().load(infPath,
      function(tex) {
        var m = new THREE.Mesh(new THREE.BoxGeometry(4, 2.6, 0.01), new THREE.MeshLambertMaterial({ map: tex }));
        m.position.set(0, 2.2, -rD/2+0.12); scene.add(m);
      },
      undefined,
      function() { addFallback(); }
    );
  } else { addFallback(); }

  function addFallback() {
    box(4, 2.6, 0.01, 0, 2.2, -rD/2+0.12, new THREE.MeshLambertMaterial({ color: new THREE.Color(artist.color || '#c4843a') }));
  }

  box(0.05, 0.04, 1.2, -rW/2+0.79, 2.0, -1.5, mMold);
  box(0.05, 0.04, 1.2, -rW/2+0.79, 1.3, -1.5, mMold);
  var bColors = [0x8b2020, 0x205080, 0x206040, 0x806020, 0x602080];
  for (var bi = 0; bi < 5; bi++) {
    var bw = 0.06 + bi * 0.008, bh = 0.22 + bi * 0.02;
    box(bw, bh, 0.18, -rW/2+0.38+bi*0.13, 2.0+bh/2, -1.5, new THREE.MeshLambertMaterial({ color: bColors[bi] }));
    box(bw, bh, 0.18, -rW/2+0.38+bi*0.13, 1.3+bh/2, -1.5, new THREE.MeshLambertMaterial({ color: bColors[(bi+2)%5] }));
  }
  box(0.4, 0.9, 0.4, 2.5, 0.45, -2.5, mDark, true);
  var sphere = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), new THREE.MeshLambertMaterial({ color: new THREE.Color(artist.color || '#c4843a') }));
  sphere.position.set(2.5, 1.08, -2.5); scene.add(sphere);

  var orbit   = createOrbit(camera, renderer.domElement);
  var onResize = function() {
    var w = container.clientWidth || window.innerWidth;
    var h = container.clientHeight || window.innerHeight;
    camera.aspect = w / h; camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  window.addEventListener('resize', onResize);
  threeCtx = { renderer: renderer, animId: null, onResize: onResize, orbit: orbit };

  (function animate() {
    threeCtx.animId = requestAnimationFrame(animate);
    orbit.update();
    renderer.render(scene, camera);
  })();
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

// ─── ORBIT + QUATERNION GYRO ──────────────────────────────────────────────────
function createOrbit(camera, canvas) {
  var FOV_DEF = 65, FOV_MIN = 20, FOV_MAX = 65;
  var SENS = 0.010, DAMP = 0.82;

  var fov = FOV_DEF;
  var vX = 0, vY = 0;
  var dragOffX = 0, dragOffY = 0;
  var lastX = 0, lastY = 0;
  var isDown = false, isTouching = false, isPinch = false, lastPinch = 0;

  var Q     = new THREE.Quaternion();
  var QGyro = new THREE.Quaternion();
  var zee   = new THREE.Vector3(0, 0, 1);
  var euler = new THREE.Euler();
  var q0    = new THREE.Quaternion();
  var q1    = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5));

  var gyroActive = false, hasGyro = false;
  var fallTheta  = 0, fallPhi = Math.PI / 2;
  var listeners  = [];

  function on(el, type, fn, opt) { el.addEventListener(type, fn, opt); listeners.push([el, type, fn, opt]); }

  function getPinchDist(e) {
    var dx = e.touches[0].clientX - e.touches[1].clientX;
    var dy = e.touches[0].clientY - e.touches[1].clientY;
    return Math.sqrt(dx*dx + dy*dy);
  }

  on(canvas, 'touchstart', function(e) {
    e.preventDefault();
    if (e.touches.length === 2) { isPinch = true; isDown = false; isTouching = true; lastPinch = getPinchDist(e); return; }
    if (e.touches.length === 1) {
      isPinch = false; isDown = true; isTouching = true;
      lastX = e.touches[0].clientX; lastY = e.touches[0].clientY;
      vX = 0; vY = 0;
    }
  }, { passive: false });

  on(canvas, 'touchmove', function(e) {
    e.preventDefault();
    if (e.touches.length === 2) {
      isPinch = true; isDown = false;
      var d = getPinchDist(e), delta = lastPinch - d;
      fov = Math.max(FOV_MIN, Math.min(FOV_MAX, fov + delta * 0.15));
      camera.fov = fov; camera.updateProjectionMatrix();
      lastPinch = d; return;
    }
    if (!isDown || isPinch) return;
    var dx = e.touches[0].clientX - lastX, dy = e.touches[0].clientY - lastY;
    vX = dx * SENS; vY = dy * SENS;
    if (gyroActive) {
      dragOffX -= dx * SENS;
      dragOffY  = Math.max(-1.2, Math.min(1.2, dragOffY + dy * SENS));
    } else {
      fallTheta -= dx * SENS;
      fallPhi    = Math.max(0.15, Math.min(Math.PI - 0.15, fallPhi + dy * SENS));
    }
    lastX = e.touches[0].clientX; lastY = e.touches[0].clientY;
  }, { passive: false });

  on(canvas, 'touchend',    function() { isPinch = false; isDown = false; isTouching = false; }, { passive: true });
  on(canvas, 'touchcancel', function() { isPinch = false; isDown = false; isTouching = false; vX = 0; vY = 0; }, { passive: true });

  on(canvas, 'mousedown', function(e) { isDown = true; lastX = e.clientX; lastY = e.clientY; vX = 0; vY = 0; canvas.style.cursor = 'grabbing'; });
  on(canvas, 'wheel', function(e) {
    e.preventDefault();
    fov = Math.max(FOV_MIN, Math.min(FOV_MAX, fov + e.deltaY * 0.05));
    camera.fov = fov; camera.updateProjectionMatrix();
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
  on(document, 'mousemove', onMM);
  on(document, 'mouseup',   function() { isDown = false; canvas.style.cursor = 'grab'; });
  canvas.style.cursor = 'grab';

  var onOrient = function(e) {
    if (!hasGyro || e.alpha == null) return;
    var alpha  = THREE.MathUtils.degToRad(e.alpha  || 0);
    var beta   = THREE.MathUtils.degToRad(e.beta   || 0);
    var gamma  = THREE.MathUtils.degToRad(e.gamma  || 0);
    var orient = THREE.MathUtils.degToRad(window.screen && window.screen.orientation ? (window.screen.orientation.angle || 0) : 0);
    euler.set(beta, alpha, -gamma, 'YXZ');
    QGyro.setFromEuler(euler);
    QGyro.multiply(q1);
    q0.setFromAxisAngle(zee, -orient);
    QGyro.multiply(q0);
    gyroActive = true;
  };
  on(window, 'deviceorientation', onOrient);

  if (typeof DeviceOrientationEvent !== 'undefined') {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      on(canvas, 'touchend', function askPerm() {
        DeviceOrientationEvent.requestPermission().then(function(r) { if (r === 'granted') hasGyro = true; }).catch(function() {});
        canvas.removeEventListener('touchend', askPerm);
      }, { passive: true });
    } else { hasGyro = true; }
  }

  return {
    update: function() {
      if (gyroActive && hasGyro) {
        var qH = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), dragOffX);
        var qV = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), dragOffY);
        Q.copy(QGyro).multiply(qH).multiply(qV);
        if (!isDown) {
          dragOffX -= vX * 0.3; vX *= DAMP;
          dragOffY  = Math.max(-1.2, Math.min(1.2, dragOffY + vY * 0.3)); vY *= DAMP;
          if (Math.abs(vX) < 0.0001) vX = 0;
          if (Math.abs(vY) < 0.0001) vY = 0;
        }
        camera.position.set(0, 1.62, 0);
        camera.quaternion.copy(Q);
      } else {
        if (!isDown) {
          fallTheta -= vX; vX *= DAMP;
          fallPhi    = Math.max(0.15, Math.min(Math.PI - 0.15, fallPhi + vY)); vY *= DAMP;
          if (Math.abs(vX) < 0.0001) vX = 0;
          if (Math.abs(vY) < 0.0001) vY = 0;
        }
        var R = 3.0, sp = Math.sin(fallPhi), cp = Math.cos(fallPhi), st = Math.sin(fallTheta), ct = Math.cos(fallTheta);
        camera.position.set(0, 1.62, 0);
        camera.lookAt(sp * st * R, 1.62 + cp * R * 0.5, -sp * ct * R);
      }
    },
    destroy: function() {
      listeners.forEach(function(l) { l[0].removeEventListener(l[1], l[2], l[3]); });
      listeners = []; canvas.style.cursor = '';
    },
  };
}

// ─── INIT ─────────────────────────────────────────────────────────────────────
async function init() {
  D.loader        = document.getElementById('loader');
  D.sliderView    = document.getElementById('slider-view');
  D.roomView      = document.getElementById('room-view');
  D.track         = document.getElementById('slider-track');
  D.trackWrap     = document.getElementById('slider-track-wrapper');
  D.dots          = document.getElementById('slider-dots');
  D.prevBtn       = document.getElementById('prev-arrow');
  D.nextBtn       = document.getElementById('next-arrow');
  D.backBtn       = document.getElementById('back-btn');
  D.bioPanel      = document.getElementById('bio-panel');
  D.bioName       = document.getElementById('bio-name');
  D.bioYears      = document.getElementById('bio-years');
  D.bioText       = document.getElementById('bio-text');
  D.bioEnterBtn   = document.getElementById('bio-enter-btn');
  D.bioLabel      = document.getElementById('bio-label');
  D.roomContainer = document.getElementById('aframe-container');
  D.roomLabelName  = document.getElementById('room-label-name');
  D.roomLabelYears = document.getElementById('room-label-years');
  D.gyroHint      = document.getElementById('gyro-hint');
  D.langBtns      = document.querySelectorAll('.lang-btn');
  D.roomBackBtn   = document.getElementById('room-back-btn');  // новая кнопка

  var missing = ['track','trackWrap','dots','bioPanel','roomContainer'].filter(function(k) { return !D[k]; });
  if (missing.length) {
    console.error('Missing DOM:', missing);
    if (D.loader) D.loader.innerHTML = '<div style="color:#c44;padding:20px;text-align:center">DOM error: ' + missing.join(', ') + '</div>';
    return;
  }

  S.artists = await loadArtists();
  S.lang    = 'ru';
  S.current = 0;
  S.activeArtist = S.artists[0];

  buildSlider();
  initSwipe();
  D.langBtns.forEach(function(btn) { btn.classList.toggle('active', btn.dataset.lang === 'ru'); });
  D.track.style.transform = 'translateX(0%)';
  refreshBio();
  startAuto();

  if (D.prevBtn)    D.prevBtn.addEventListener('click',    function() { prev(); stopAuto(); startAuto(); });
  if (D.nextBtn)    D.nextBtn.addEventListener('click',    function() { next(); stopAuto(); startAuto(); });
  if (D.backBtn)    D.backBtn.addEventListener('click',    goBack);
  if (D.roomBackBtn) D.roomBackBtn.addEventListener('click', goBack);

  if (D.bioEnterBtn) D.bioEnterBtn.addEventListener('click', function() {
    if (S.activeArtist) enterRoom(S.activeArtist);
  });
  D.langBtns.forEach(function(btn) { btn.addEventListener('click', function() { setLang(btn.dataset.lang); }); });

  setTimeout(function() { if (D.loader) D.loader.classList.add('hidden'); }, 400);
}

document.addEventListener('DOMContentLoaded', function() {
  init().catch(function(err) {
    console.error('Init failed:', err);
    var loader = document.getElementById('loader');
    if (loader) loader.innerHTML = '<div style="color:#c44;font-family:sans-serif;padding:20px;text-align:center">Error: ' + err.message + '</div>';
  });
});
