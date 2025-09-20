// JavaScript for Image Gallery

        //sidebar functionality
        const openSidebarBtn = document.getElementById('openSidebar');
        const closeSidebarBtn = document.getElementById('closeSidebar');
        const sidebar = document.getElementById('sidebar');
        openSidebarBtn.addEventListener('click', () => {
            sidebar.classList.add('open');
        });
        closeSidebarBtn.addEventListener('click', () => {
            sidebar.classList.remove('open');
        });
        // Optional: Close sidebar when clicking outside
        window.addEventListener('click', (e) => {
            if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && e.target !== openSidebarBtn) {
                sidebar.classList.remove('open');
            }
        });
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelector('.filter-btn.active').classList.remove('active');
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter');
            galleryItems.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.style.display = '';
                    setTimeout(() => item.style.opacity = 1, 50);
                } else {
                    item.style.opacity = 0;
                    setTimeout(() => item.style.display = 'none', 300);
                }
            });
        });
    });

    // Lightbox functionality
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    const zoomInBtn = document.getElementById('zoomIn');
    const zoomOutBtn = document.getElementById('zoomOut');
    const zoomResetBtn = document.getElementById('zoomReset');
    let currentIndex = 0;
    let visibleItems = [];
    let scale = 1;
    const SCALE_STEP = 0.2;
    const SCALE_MIN = 0.4;
    const SCALE_MAX = 3;

    function updateVisibleItems() {
        visibleItems = Array.from(document.querySelectorAll('.gallery-item')).filter(item => item.style.display !== 'none');
    }

    function openLightbox(index) {
        updateVisibleItems();
        currentIndex = index;
        const img = visibleItems[currentIndex].querySelector('img');
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        resetZoom();
        lightbox.classList.add('active');
    }

    document.querySelectorAll('.gallery-item').forEach((item, idx) => {
        item.addEventListener('click', () => {
            updateVisibleItems();
            const visibleIdx = visibleItems.indexOf(item);
            openLightbox(visibleIdx);
        });
    });

    closeBtn.addEventListener('click', () => {
        lightbox.classList.remove('active');
    });

    prevBtn.addEventListener('click', () => {
        updateVisibleItems();
        currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
        const img = visibleItems[currentIndex].querySelector('img');
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        resetZoom();
    });

    nextBtn.addEventListener('click', () => {
        updateVisibleItems();
        currentIndex = (currentIndex + 1) % visibleItems.length;
        const img = visibleItems[currentIndex].querySelector('img');
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        resetZoom();
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
            resetZoom();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'ArrowLeft') prevBtn.click();
        if (e.key === 'ArrowRight') nextBtn.click();
        if (e.key === 'Escape') closeBtn.click();
        // Zoom keyboard shortcuts: +, -, 0
        if (e.key === '+' || e.key === '=' ) { // = key is often shift+/
            e.preventDefault(); zoomIn();
        }
        if (e.key === '-' || e.key === '_') { e.preventDefault(); zoomOut(); }
        if (e.key === '0') { e.preventDefault(); resetZoom(); }
    });

// Zoom functions
function applyScale(){
    lightboxImg.style.transform = `scale(${scale})`;
    lightboxImg.style.transition = 'transform 160ms ease';
}
function zoomIn(){
    scale = Math.min(SCALE_MAX, +(scale + SCALE_STEP).toFixed(2));
    applyScale();
}
function zoomOut(){
    scale = Math.max(SCALE_MIN, +(scale - SCALE_STEP).toFixed(2));
    applyScale();
}
function resetZoom(){
    scale = 1;
    applyScale();
}

if(zoomInBtn) zoomInBtn.addEventListener('click', zoomIn);
if(zoomOutBtn) zoomOutBtn.addEventListener('click', zoomOut);
if(zoomResetBtn) zoomResetBtn.addEventListener('click', resetZoom);

    // Upload Modal functionality
    const uploadBtn = document.getElementById('uploadBtn');
    const uploadModal = document.getElementById('uploadModal');
    const closeUpload = document.querySelector('.close-upload');
    const uploadForm = document.getElementById('uploadForm');
    const galleryGrid = document.querySelector('.gallery-grid');
    uploadBtn.addEventListener('click', () => {
        uploadModal.classList.add('active');
    });
    closeUpload.addEventListener('click', () => {
        uploadModal.classList.remove('active');
        uploadForm.reset();
    });
    uploadModal.addEventListener('click', (e) => {
        if (e.target === uploadModal) {
            uploadModal.classList.remove('active');
            uploadForm.reset();
        }
    });

    uploadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const fileInput = document.getElementById('imageInput');
        const genreSelect = document.getElementById('genreSelect');
        const file = fileInput.files[0];
        const genre = genreSelect.value;
        if (file && genre) {
            const reader = new FileReader();
            reader.onload = function(ev) {
                const div = document.createElement('div');
                div.className = 'gallery-item';
                div.setAttribute('data-category', genre);
                const img = document.createElement('img');
                img.src = ev.target.result;
                img.alt = file.name;
                div.appendChild(img);
                galleryGrid.appendChild(div);

                // Add click event for new item
                div.addEventListener('click', () => {
                    updateVisibleItems();
                    const visibleIdx = visibleItems.indexOf(div);
                    openLightbox(visibleIdx);
                });

                uploadModal.classList.remove('active');
                uploadForm.reset();
            };
            reader.readAsDataURL(file);
        }
    });