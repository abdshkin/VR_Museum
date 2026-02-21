let currentRoom = null;
let currentLang = 'ru';
let sliderIndex = 0;
const artistsCount = 5;
const track = document.getElementById('slider-track');

// Данные комнат
const roomsData = {
  telzhanov: { model: 'telzhanov_room.glb', name: 'К. Тельжанов' },
  galimbaeva: { model: 'galimbaeva_room.glb', name: 'А. Галимбаева' },
  mullashev: { model: 'mullashev_room.glb', name: 'К. Муллашев' },
  ismailova: { model: 'ismailova_room.glb', name: 'Г. Исмаилова' },
  kasteev: { model: 'kasteev_room.glb', name: 'А. Кастеев' }
};

function enterRoom(roomId) {
  currentRoom = roomId;
  document.getElementById('artist-slider').style.display = 'none';
  document.getElementById('back-btn').style.display = 'block';
  document.getElementById('main-scene').style.display = 'block';
  
  const scene = document.querySelector('a-scene');
  scene.innerHTML = `
    <!-- Комната -->
    <a-entity gltf-model="${roomsData[roomId].model}" position="0 0 0" scale="1 1 1"></a-entity>
    
    <!-- Инфографика -->
    <a-plane id="info1" position="-3 1.5 0" width="2.5" height="1.8" rotation="0 90 0" 
             material="src: ${roomId}_info1_${currentLang}.jpg; transparent: true"></a-plane>
    <a-plane id="info2" position="3 1.5 0" width="2.5" height="1.8" rotation="0 -90 0" 
             material="src: ${roomId}_info2_${currentLang}.jpg"></a-plane>
    
    <!-- Свет -->
    <a-light type="ambient" color="#444" intensity="0.5"></a-light>
    <a-light type="directional" color="#fff" intensity="0.8" position="-1 2 1"></a-light>
    
    <!-- Орбиталка -->
    <a-entity orbit-controls="target: 0 1.6 0; minDistance: 1; maxDistance: 15; enableDamping: true" position="0 1.6 5">
      <a-entity camera look-controls="enabled: false"></a-entity>
    </a-entity>
  `;
  
  document.getElementById('back-btn').textContent = `← Назад (${roomsData[roomId].name})`;
}

function goBack() {
  currentRoom = null;
  document.getElementById('artist-slider').style.display = 'flex';
  document.getElementById('back-btn').style.display = 'none';
  document.getElementById('main-scene').style.display = 'none';
}

function setLanguage(lang) {
  currentLang = lang;
  if (currentRoom) enterRoom(currentRoom);
}

// Слайдер
function updateSlider() {
  const card = track.querySelector('.artist-card');
  if (!card) return;
  const cardWidth = card.getBoundingClientRect().width + 8;
  track.style.transform = `translateX(-${sliderIndex * cardWidth}px)`;
}

function nextArtist() {
  sliderIndex = (sliderIndex + 1) % artistsCount;
  updateSlider();
}

function prevArtist() {
  sliderIndex = (sliderIndex - 1 + artistsCount) % artistsCount;
  updateSlider();
}

// Свайпы
let startX = 0;
let isSwiping = false;

track.addEventListener('touchstart', (e) => {
  startX = e.touches[0].clientX;
  isSwiping = true;
}, { passive: true });

track.addEventListener('touchend', (e) => {
  if (!isSwiping) return;
  const endX = e.changedTouches[0].clientX;
  const dx = endX - startX;
  if (Math.abs(dx) > 50) {
    if (dx > 0) prevArtist();
    else nextArtist();
  }
  isSwiping = false;
}, { passive: true });

// Инициализация
window.addEventListener('load', () => {
  updateSlider();
  setTimeout(updateSlider, 100);
});
window.addEventListener('resize', updateSlider);
