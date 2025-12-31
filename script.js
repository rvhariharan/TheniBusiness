document.addEventListener('DOMContentLoaded', () => {

    // ================= 1. CAROUSEL PROGRAM =================
    const carousel = document.getElementById('imageCarousel');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (carousel && prevBtn && nextBtn) {
        const getVisibleCount = () => window.innerWidth <= 768 ? 1 : 2;

        nextBtn.addEventListener('click', () => {
            const visibleCount = getVisibleCount();
            const scrollAmount = carousel.clientWidth / visibleCount;
            carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });

        prevBtn.addEventListener('click', () => {
            const visibleCount = getVisibleCount();
            const scrollAmount = carousel.clientWidth / visibleCount;
            carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
    }

    // ================= 2. SEARCH LOGIC =================
    const searchInput = document.getElementById('offerSearch');
    const allCards = document.querySelectorAll('.offer-card');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();

            allCards.forEach(card => {
                const productName = card.querySelector('.product-name').innerText.toLowerCase();
                const storeName = card.getAttribute('data-store').toLowerCase();
                const locationName = card.getAttribute('data-location').toLowerCase();
                const categoryName = card.getAttribute('data-category').toLowerCase();

                // Search filtering logic
                if (productName.includes(query) || 
                    storeName.includes(query) || 
                    locationName.includes(query) || 
                    categoryName.includes(query)) {
                    card.style.display = "block";
                } else {
                    card.style.display = "none";
                }
            });
        });
    }

    // ================= 3. CATEGORIZED ADD LOGIC =================
    const savedContainer = document.getElementById('savedItemsContainer');
    const addButtons = document.querySelectorAll('.js-add-btn');

    addButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.offer-card');
            const category = card.getAttribute('data-category');
            const productName = card.querySelector('.product-name').innerText;

            // Empty message remove panrom
            const emptyMsg = savedContainer.querySelector('.empty-msg');
            if(emptyMsg) emptyMsg.remove();

            // Category group check panrom
            let categoryGroup = document.getElementById(`group-${category}`);
            
            if (!categoryGroup) {
                categoryGroup = document.createElement('div');
                categoryGroup.id = `group-${category}`;
                categoryGroup.className = 'category-group';
                categoryGroup.innerHTML = `<h4>${category}</h4><div class="items-list"></div>`;
                savedContainer.appendChild(categoryGroup);
            }

            // Button Toggle and Item Add/Remove
            this.classList.toggle('added');
            const list = categoryGroup.querySelector('.items-list');
            const itemId = `saved-${productName.replace(/\s+/g, '')}`;

            if (this.classList.contains('added')) {
                this.innerHTML = 'Added! <i class="fa-solid fa-check"></i>';
                const itemRow = document.createElement('div');
                itemRow.className = 'saved-item-row';
                itemRow.id = itemId;
                itemRow.innerHTML = `<span>${productName}</span> <i class="fas fa-heart" style="color:red"></i>`;
                list.appendChild(itemRow);
            } else {
                this.innerHTML = 'Add +';
                const itemToRemove = document.getElementById(itemId);
                if(itemToRemove) itemToRemove.remove();
                
                // Category-la items illana andha heading-ayum remove pannalam
                if (list.children.length === 0) categoryGroup.remove();
                
                // Saved list full-ah empty-na message-ah thirumba kondu varom
                if (savedContainer.children.length === 0) {
                    savedContainer.innerHTML = `<p class="empty-msg">No items added yet. Click 'Add +' to categorize.</p>`;
                }
            }
        });
    });

    // ================= 4. MOBILE NAV TOGGLE =================
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');

    if (burger && navLinks) {
        burger.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            const icon = burger.querySelector('i');
            if (icon) icon.classList.toggle('fa-times');
        });

        // Ensure nav is visible correctly when resizing
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                navLinks.classList.remove('open');
                const icon = burger.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {

    // === CAROUSEL LOGIC ===
    const carousel = document.getElementById('imageCarousel');
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');

    if (carousel && nextBtn && prevBtn) {
        const scrollStep = () => {
            // Calculates width of one item + gap to scroll exactly by units
            const item = document.querySelector('.carousel-item');
            return item ? item.offsetWidth + 20 : 300; 
        };

        nextBtn.addEventListener('click', () => {
            carousel.scrollBy({
                left: scrollStep() * 2, // Scrolls 2 images at a time
                behavior: 'smooth'
            });
        });

        prevBtn.addEventListener('click', () => {
            carousel.scrollBy({
                left: -(scrollStep() * 2),
                behavior: 'smooth'
            });
        });
    }


});