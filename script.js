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
            btn.addEventListener('click', function () {
                const card = this.closest('.offer-card');
                const category = card.getAttribute('data-category');
                const productName = card.querySelector('.product-name').innerText;

                // First time add pannum pothu 'No items' message-ah remove pannuvom
                const emptyMsg = savedContainer.querySelector('.empty-msg');
                if (emptyMsg) emptyMsg.remove();

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
                    if (itemToRemove) itemToRemove.remove();

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
    // ================= 7. AUTHENTICATION HANDLERS =================
    const loginForm = document.querySelector('#login-form form');
    const signupForm = document.querySelector('#signup-form form');

    // Helper: Show Feedback
    const showFeedback = (form, message, type) => {
        let feedback = form.querySelector('.feedback-msg');
        if (!feedback) {
            feedback = document.createElement('div');
            feedback.className = 'feedback-msg';
            feedback.style.marginTop = '10px';
            feedback.style.fontSize = '0.9rem';
            form.appendChild(feedback);
        }
        feedback.textContent = message;
        feedback.style.color = type === 'error' ? 'red' : 'green';
    };

    // Helper: Update UI on Login
    const updateUIOnLogin = (user) => {
        if (loginTrigger) {
            loginTrigger.innerText = `Hi, ${user.name}`;
            loginTrigger.href = "#profile"; // Or create a profile section

            // Optional: Change Login click behavior to Logout or Profile
            loginTrigger.removeEventListener('click', openModalHandler); // Remove default modal opener if needed
            loginTrigger.addEventListener('click', (e) => {
                e.preventDefault();
                const confirmLogout = confirm("Do you want to logout?");
                if (confirmLogout) {
                    localStorage.removeItem('user');
                    window.location.reload();
                }
            });
        }
        if (modal) modal.style.display = 'none';

        // Hide auth buttons inside modal if you want to reuse it, or just close it
    };

    // Function to handle modal opening (saved to remove later if needed)
    const openModalHandler = (e) => {
        e.preventDefault();
        modal.style.display = 'flex';
    };

    // Re-attach initial listener to save reference
    if (loginTrigger) {
        // Remove old listener (anonymous function in original code can't be removed easily, 
        // but we can override or just let it be if we handle the logged-in state check first)
    }

    // Check LocalStorage on Load
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) {
        updateUIOnLogin(savedUser);
    }

    // Handle Signup
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const inputs = signupForm.querySelectorAll('input');
            const name = inputs[0].value;
            const email = inputs[1].value;
            const password = inputs[2].value;

            try {
                const res = await fetch('http://localhost:3000/api/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password })
                });
                const data = await res.json();

                if (res.ok) {
                    showFeedback(signupForm, 'Account created! Please sign in.', 'success');
                    inputs.forEach(i => i.value = ''); // Clear form
                    // Switch to login tab automatically
                    setTimeout(() => {
                        document.querySelector('[data-target="login-form"]').click();
                    }, 1500);
                } else {
                    showFeedback(signupForm, data.error || 'Signup failed', 'error');
                }
            } catch (err) {
                showFeedback(signupForm, 'Server error. Is the backend running?', 'error');
            }
        });
    }

    // Handle Login
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const inputs = loginForm.querySelectorAll('input');
            const email = inputs[0].value;
            const password = inputs[1].value;

            try {
                const res = await fetch('http://localhost:3000/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await res.json();

                if (res.ok) {
                    showFeedback(loginForm, 'Login successful!', 'success');
                    localStorage.setItem('user', JSON.stringify(data.user));
                    setTimeout(() => {
                        updateUIOnLogin(data.user);
                    }, 1000);
                } else {
                    showFeedback(loginForm, data.error || 'Login failed', 'error');
                }
            } catch (err) {
                showFeedback(loginForm, 'Server error. Is the backend running?', 'error');
            }
        });
    }
    // ================= 8. JOBS FEED LOGIC =================
    const jobListContainer = document.getElementById('jobList');

    // Function to Create Job Card HTML
    const createJobCard = (job) => {
        // Calculate days ago (Simple logic)
        const posted = new Date(job.posted_date);
        const now = new Date();
        const diffTime = Math.abs(now - posted);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const timeText = diffDays <= 1 ? "Just posted" : `${diffDays} days ago`;

        return `
            <div class="job-card" data-id="${job.id}">
                <h3>${job.title}</h3>
                <div class="company-name">${job.company}</div>
                <div class="job-location">${job.location}</div>
                <div class="job-badges">
                    <span class="salary-tag"><i class="fas fa-rupee-sign"></i> ${job.salary || "Not disclosed"}</span>
                    <span class="badge">${job.type}</span>
                </div>
                <div class="posted-date">
                    <span>${timeText}</span>
                </div>
            </div>
        `;
    };

    // Fetch Jobs from Backend
    const loadJobs = async () => {
        if (!jobListContainer) return;

        try {
            const res = await fetch('http://localhost:3000/api/jobs');
            const data = await res.json();

            if (data.jobs && data.jobs.length > 0) {
                jobListContainer.innerHTML = data.jobs.map(job => createJobCard(job)).join('');
            } else {
                jobListContainer.innerHTML = '<p>No jobs found at the moment.</p>';
            }
        } catch (err) {
            jobListContainer.innerHTML = '<p style="color:red">Failed to load jobs. Server might be down.</p>';
            console.error(err);
        }
    };

    // Initialize Jobs
    loadJobs();

    // Delegate click to open job detail page
    if (jobListContainer) {
        jobListContainer.addEventListener('click', (e) => {
            const card = e.target.closest('.job-card');
            if (card && card.dataset.id) {
                window.location.href = `job.html?id=${card.dataset.id}`;
            }
        });
    }
});