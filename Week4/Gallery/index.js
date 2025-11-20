// Constants
const NUMBER_OF_IMAGES = 100;
const ZOOM_MIN = 0.5;
const ZOOM_MAX = 3;
const ZOOM_STEP = 0.25;
const ROTATION_STEP = 90;

// Elements
const root = document.querySelector(':root');
const slider = document.getElementById('slider');
const sliderButtons = document.querySelectorAll('.slider-button');
const helpBtn = document.getElementById('help-btn');
const helpModal = document.getElementById('help-modal');
const helpClose = document.getElementById('help-close');
const photoWrappers = document.querySelectorAll('.photo-wrapper');
const photoModal = document.getElementById('photo-modal');
const modalImage = document.querySelector('#photo-modal-wrapper>img');
const modalPrevBtn = document.getElementById('modal-prev');
const modalNextBtn = document.getElementById('modal-next');
const modalLeaveBtn = document.querySelector('#modal-leave .button-wrapper');
const rotateLeftBtn = document.getElementById('rotate-left');
const rotateRightBtn = document.getElementById('rotate-right');
const zoomButtons = document.querySelectorAll('#config-bar .button-wrapper');

// State
let currentImageIndex = 1;
let currentZoom = 1;
let currentRotation = 0;

// Slider fill background
function updateSliderFill() {
    const min = parseInt(slider.min, 10);
    const max = parseInt(slider.max, 10);
    const val = parseInt(slider.value, 10);
    const percentage = ((val - min) / (max - min)) * 100;
    slider.style.backgroundSize = `${percentage}% 100%`;
}

// Update grid columns
function updateGalleryColumns() {
    root.style.setProperty('--gallery-imagePerRow', slider.value);
}

// Change slider value
function adjustSlider(delta) {
    const min = parseInt(slider.min, 10);
    const max = parseInt(slider.max, 10);
    const current = parseInt(slider.value, 10);
    const newValue = Math.min(max, Math.max(min, current + delta));
    if (newValue !== current) {
        slider.value = newValue;
        updateGalleryColumns();
        updateSliderFill();
    }
}

// Slider input
slider.addEventListener('input', () => {
    updateGalleryColumns();
    updateSliderFill();
});

// Slider buttons
sliderButtons.forEach((btn, index) => {
    const delta = index === 0 ? -1 : 1;
    btn.addEventListener('click', () => adjustSlider(delta));
});

// Mobile slider defaults
function applyResponsiveSliderSettings() {
    const isMobile = window.matchMedia('(max-width: 600px)').matches || /Mobi|Android/i.test(navigator.userAgent);
    if (isMobile) {
        slider.max = '10';
        slider.value = '5';
        updateGalleryColumns();
        updateSliderFill();
    }
}
applyResponsiveSliderSettings();
updateSliderFill();
updateGalleryColumns();

// Show help modal
function showHelpModal() {
    helpModal.classList.add('show');
}

// Hide help modal
function hideHelpModal() {
    helpModal.classList.remove('show');
}

// Help modal events
helpBtn.addEventListener('click', showHelpModal);
helpClose.addEventListener('click', hideHelpModal);
helpModal.addEventListener('click', (e) => {
    if (e.target === helpModal) hideHelpModal();
});

// Reset image transform
function resetTransform() {
    currentZoom = 1;
    currentRotation = 0;
    applyTransform();
}

// Apply transform
function applyTransform(withTransition = false) {
    modalImage.style.transition = withTransition ? 'transform 0.2s ease' : 'none';
    modalImage.style.transform = `scale(${currentZoom}) rotate(${currentRotation}deg)`;
}

// Update nav button opacity
function updateNavigationButtonVisibility() {
    modalPrevBtn.style.opacity = currentImageIndex <= 1 ? 0 : 100;
    modalNextBtn.style.opacity = currentImageIndex >= NUMBER_OF_IMAGES ? 0 : 100;
}

// Open photo modal
function showPhotoModal(e) {
    const imageSrc = e.target.getAttribute('src');
    const match = imageSrc.match(/image-(\d+)\.jpg/);
    if (match) currentImageIndex = parseInt(match[1], 10);
    modalImage.setAttribute('src', imageSrc);
    resetTransform();
    photoModal.classList.add('show-photo-modal');
    updateNavigationButtonVisibility();
}

// Close photo modal
function hidePhotoModal() {
    photoModal.classList.remove('show-photo-modal');
    resetTransform();
}

// Navigate images
function navigateImage(direction) {
    const newIndex = currentImageIndex + direction;
    if (newIndex < 1 || newIndex > NUMBER_OF_IMAGES) return;
    currentImageIndex = newIndex;
    modalImage.setAttribute('src', `./images/image-${currentImageIndex}.jpg`);
    resetTransform();
    updateNavigationButtonVisibility();
}

// Zoom image
function adjustZoom(delta) {
    currentZoom = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, currentZoom + delta * ZOOM_STEP));
    applyTransform(true);
}

// Rotate image
function rotateImage(degrees) {
    currentRotation += degrees;
    applyTransform(false);
}

// Image click
photoWrappers.forEach(w => w.addEventListener('click', showPhotoModal));

// Navigation buttons
modalLeaveBtn.addEventListener('click', hidePhotoModal);
modalPrevBtn.addEventListener('click', () => navigateImage(-1));
modalNextBtn.addEventListener('click', () => navigateImage(1));

// Rotate buttons
rotateLeftBtn.addEventListener('click', () => rotateImage(-ROTATION_STEP));
rotateRightBtn.addEventListener('click', () => rotateImage(ROTATION_STEP));

// Zoom buttons (skip rotate buttons)
zoomButtons.forEach((btn, index) => {
    if (index < 2) return;
    const delta = index === 2 ? -1 : 1;
    btn.addEventListener('click', () => adjustZoom(delta));
});

// Keyboard shortcuts
document.addEventListener('keydown', (event) => {
    if (!photoModal.classList.contains('show-photo-modal')) return;
    switch (event.key) {
        case 'ArrowLeft':
            navigateImage(-1); break;
        case 'ArrowRight':
            navigateImage(1); break;
        case '-':
        case '_':
            adjustZoom(-1); break;
        case '=':
        case '+':
            adjustZoom(1); break;
        case '0':
            resetTransform();
            applyTransform(true); break;
        case 'j':
        case 'J':
            rotateImage(-ROTATION_STEP); break;
        case 'k':
        case 'K':
            rotateImage(ROTATION_STEP); break;
        case 'Escape':
            hidePhotoModal(); break;
    }
});