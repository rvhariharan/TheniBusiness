/**
 * Theni Connect - Full Website Logic
 * Features: Carousel, Search, Categorized Saved List, Login Modal (Tabs + Social)
 */

document.addEventListener('DOMContentLoaded', () => {

    // ================= 1. CAROUSEL LOGIC =================
    // Row-la 2 images thallura maari set panniruken
    const carousel = document.getElementById('imageCarousel');
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');

    if (carousel && nextBtn && prevBtn) {
        const scrollStep = () => {
            const item = document.querySelector('.carousel-item');
            // Gap-oda sethu width calculate pannum (Responsive)
            return item ? item.offsetWidth + 20 : 300;
        };

        nextBtn.addEventListener('click', () => {
            // Next 2 images-ku scroll aagum
            carousel.scrollBy({ left: scrollStep() * 2, behavior: 'smooth' });
        });

        prevBtn.addEventListener('click', () => {
            // Previous 2 images-ku scroll aagum
            carousel.scrollBy({ left: -(scrollStep() * 2), behavior: 'smooth' });
        });
    }

    // ================= 2. SEARCH LOGIC =================
    // Product, Store, Location, Category - ellathayum search pannum
    const searchInput = document.getElementById('offerSearch');
    const allCards = document.querySelectorAll('.offer-card');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();

            allCards.forEach(card => {
                const productName = card.querySelector('.product-name')?.innerText.toLowerCase() || "";
                const storeName = card.getAttribute('data-store')?.toLowerCase() || "";
                const locationName = card.getAttribute('data-location')?.toLowerCase() || "";
                const categoryName = card.getAttribute('data-category')?.toLowerCase() || "";

                if (productName.includes(query) || storeName.includes(query) || 
                    locationName.includes(query) || categoryName.includes(query)) {
                    card.style.display = "block";
                } else {
                    card.style.display = "none";
                }
            });
        });
    }

    // ================= 3. CATEGORIZED ADD LOGIC =================
    // Add click panna 'Saved List'-la category wise (Food, Fashion) store aagum
    const savedContainer = document.getElementById('savedItemsContainer');
    const addButtons = document.querySelectorAll('.js-add-btn');

    if (savedContainer) {
        addButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const card = this.closest('.offer-card');
                const category = card.getAttribute('data-category');
                const productName = card.querySelector('.product-name').innerText;

                // First time add pannum pothu 'No items' message-ah remove pannuvom
                const emptyMsg = savedContainer.querySelector('.empty-msg');
                if(emptyMsg) emptyMsg.remove();

                // Check if Category header already exists
                let categoryGroup = document.getElementById(`group-${category}`);
                if (!categoryGroup) {
                    categoryGroup = document.createElement('div');
                    categoryGroup.id = `group-${category}`;
                    categoryGroup.className = 'category-group';
                    categoryGroup.innerHTML = `<h4>${category}</h4><div class="items-list"></div>`;
                    savedContainer.appendChild(categoryGroup);
                }

                // Toggle logic (Add/Remove)
                this.classList.toggle('added');
                const list = categoryGroup.querySelector('.items-list');
                const itemId = `saved-${productName.replace(/\s+/g, '')}`;

                if (this.classList.contains('added')) {
                    this.innerHTML = 'Added! <i class="fas fa-check"></i>';
                    const itemRow = document.createElement('div');
                    itemRow.className = 'saved-item-row';
                    itemRow.id = itemId;
                    itemRow.innerHTML = `<span>${productName}</span> <i class="fas fa-heart" style="color:red"></i>`;
                    list.appendChild(itemRow);
                } else {
                    this.innerHTML = '+ Add';
                    const itemToRemove = document.getElementById(itemId);
                    if(itemToRemove) itemToRemove.remove();
                    
                    // Category empty-na header-ah remove pannuvom
                    if (list.children.length === 0) categoryGroup.remove();
                    
                    // List full-ah empty-na 'No items' message-ah show pannuvom
                    if (savedContainer.children.length === 0) {
                        savedContainer.innerHTML = `<p class="empty-msg">No items added yet. Click 'Add +' to categorize.</p>`;
                    }
                }
            });
        });
    }

    // ================= 4. LOGIN MODAL & TABS =================
    // Sign In / Join Now toggle matthum Modal open/close logic
    const modal = document.getElementById('loginModal');
    const loginTrigger = document.getElementById('loginTrigger');
    const closeBtn = document.querySelector('.close-modal');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const authSections = document.querySelectorAll('.auth-section');

    if (loginTrigger && modal) {
        loginTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'flex';
        });

        closeBtn?.addEventListener('click', () => { modal.style.display = 'none'; });
        window.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });

        // Switch between Sign In and Join Now tabs
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                authSections.forEach(s => s.classList.remove('active'));
                btn.classList.add('active');
                const targetId = btn.getAttribute('data-target');
                document.getElementById(targetId).classList.add('active');
            });
        });
    }

    // ================= 5. SOCIAL LOGIN (GOOGLE & MS) =================
    const googleBtn = document.getElementById('googleLogin');
    const msBtn = document.getElementById('msLogin');

    googleBtn?.addEventListener('click', () => {
        alert("Google Login Triggered! (Firebase configuration required)");
    });

    msBtn?.addEventListener('click', () => {
        alert("Microsoft Login Triggered! (Azure/Firebase configuration required)");
    });

    // ================= 6. MOBILE NAV TOGGLE =================
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');

    if (burger && navLinks) {
        burger.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            const icon = burger.querySelector('i');
            if (icon) icon.classList.toggle('fa-times');
        });
    }
});