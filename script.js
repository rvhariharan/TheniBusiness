/**
 * Theni Connect – SAFE DEMO Frontend Logic
 * NOTE: This is a demo-only project.
 * No login, no authentication, no data collection.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ================= 1. CAROUSEL LOGIC ================= */
  const carousel = document.getElementById('imageCarousel');
  const nextBtn = document.querySelector('.next-btn');
  const prevBtn = document.querySelector('.prev-btn');

  if (carousel && nextBtn && prevBtn) {
    const scrollStep = () => {
      const item = document.querySelector('.carousel-item');
      return item ? item.offsetWidth + 20 : 300;
    };

    nextBtn.addEventListener('click', () => {
      carousel.scrollBy({ left: scrollStep() * 2, behavior: 'smooth' });
    });

    prevBtn.addEventListener('click', () => {
      carousel.scrollBy({ left: -(scrollStep() * 2), behavior: 'smooth' });
    });
  }

  /* ================= 2. SEARCH LOGIC ================= */
  const searchInput = document.getElementById('offerSearch');
  const allCards = document.querySelectorAll('.offer-card');

  if (searchInput) {
    searchInput.addEventListener('input', e => {
      const query = e.target.value.toLowerCase().trim();

      allCards.forEach(card => {
        const productName = card.querySelector('.product-name')?.innerText.toLowerCase() || "";
        const store = card.dataset.store?.toLowerCase() || "";
        const location = card.dataset.location?.toLowerCase() || "";
        const category = card.dataset.category?.toLowerCase() || "";

        card.style.display =
          productName.includes(query) ||
          store.includes(query) ||
          location.includes(query) ||
          category.includes(query)
            ? "block"
            : "none";
      });
    });
  }

  /* ================= 3. SAVED LIST (CATEGORY DEMO) ================= */
  const savedContainer = document.getElementById('savedItemsContainer');
  const addButtons = document.querySelectorAll('.js-add-btn');

  if (savedContainer) {
    addButtons.forEach(btn => {
      btn.addEventListener('click', function () {
        const card = this.closest('.offer-card');
        const category = card.dataset.category;
        const productName = card.querySelector('.product-name').innerText;

        savedContainer.querySelector('.empty-msg')?.remove();

        let group = document.getElementById(`group-${category}`);
        if (!group) {
          group = document.createElement('div');
          group.id = `group-${category}`;
          group.innerHTML = `<h4>${category}</h4><div class="items-list"></div>`;
          savedContainer.appendChild(group);
        }

        const list = group.querySelector('.items-list');
        const itemId = `saved-${productName.replace(/\s+/g, '')}`;
        this.classList.toggle('added');

        if (this.classList.contains('added')) {
          this.innerHTML = 'Added ✔';
          const row = document.createElement('div');
          row.id = itemId;
          row.innerHTML = `<span>${productName}</span>`;
          list.appendChild(row);
        } else {
          this.innerHTML = '+ Add';
          document.getElementById(itemId)?.remove();
          if (!list.children.length) group.remove();
          if (!savedContainer.children.length) {
            savedContainer.innerHTML = `<p class="empty-msg">No items added yet.</p>`;
          }
        }
      });
    });
  }

  /* ================= 4. MOBILE NAV ================= */
  const burger = document.querySelector('.burger');
  const navLinks = document.querySelector('.nav-links');

  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      burger.querySelector('i')?.classList.toggle('fa-times');
    });
  }

  /* ================= 5. JOBS DEMO (STATIC UI ONLY) ================= */
  const jobList = document.getElementById('jobList');

  if (jobList) {
    jobList.innerHTML = `
      <div class="job-card">
        <h3>Frontend Developer</h3>
        <p>Theni • Full Time</p>
        <span class="badge">Demo Job</span>
      </div>
      <div class="job-card">
        <h3>Sales Executive</h3>
        <p>Theni • Part Time</p>
        <span class="badge">Demo Job</span>
      </div>
    `;
  }

});
