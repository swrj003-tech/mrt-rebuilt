import './style.css';
import { FALLBACK_PRODUCTS } from './fallback-data.js';

/**
 * MRTApp - Main application class for MRT International Storefront
 * Manages navigation, product rendering, Quick View modal, and testimonials.
 */
class MRTApp {
  constructor() {
    this.allProducts = [];
    this.activeCategory = new URLSearchParams(window.location.search).get('c');
    this.init();

    // Bind global functions for inline onclick handlers
    window.openQuickView = (id) => this.openQuickView(id);
    window.closeQuickView = () => this.closeQuickView();
  }

  async init() {
    this.setupMobileMenu();
    this.handleScroll();
    this.createQuickViewModal();

    const homeGrid = document.getElementById('bestsellers-grid');
    const categoryGrid = document.getElementById('category-products-container');
    const communityGrid = document.getElementById('community-grid');

    if (homeGrid) {
      await this.fetchAndRender(homeGrid, 8);
    } else if (categoryGrid) {
      await this.fetchAndRender(categoryGrid, 50);
      this.updateCategoryUI();
    }

    if (communityGrid) {
      this.renderTestimonials(communityGrid);
    }
  }

  setupMobileMenu() {
    const menuBtn   = document.getElementById('mobileMenuToggle');
    const mobileNav = document.getElementById('mobileNav');
    const closeBtn  = document.getElementById('mobileNavClose');
    const backdrop  = document.getElementById('mobileNavBackdrop');

    if (menuBtn && mobileNav && closeBtn && backdrop) {
      menuBtn.addEventListener('click', () => {
        mobileNav.style.display = 'flex';
        setTimeout(() => mobileNav.classList.add('open'), 10);
      });

      const close = () => {
        mobileNav.classList.remove('open');
        setTimeout(() => mobileNav.style.display = 'none', 300);
      };

      closeBtn.addEventListener('click', close);
      backdrop.addEventListener('click', close);
    }
  }

  handleScroll() {
    const nav = document.querySelector('.mrt-nav');
    if (!nav) return;
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    });
  }

  // ── Quick View Modal ──
  createQuickViewModal() {
    if (document.getElementById('quickViewModal')) return;
    const modal = document.createElement('div');
    modal.id = 'quickViewModal';
    modal.className = 'qv-overlay';
    modal.innerHTML = `
      <div class="qv-panel">
        <button class="qv-close" onclick="closeQuickView()">
          <span class="material-symbols-outlined">close</span>
        </button>
        <div class="qv-body">
          <div class="qv-image-col">
            <img id="qv-image" src="" alt="Product">
          </div>
          <div class="qv-info-col">
            <span class="qv-badge" id="qv-badge"></span>
            <h2 class="qv-title" id="qv-title"></h2>
            <div class="qv-rating" id="qv-rating"></div>
            <p class="qv-price" id="qv-price"></p>
            <p class="qv-description" id="qv-description"></p>
            <div class="qv-benefits" id="qv-benefits"></div>
            <a id="qv-buy-btn" href="#" target="_blank" class="qv-buy-btn">
              <span class="material-symbols-outlined">shopping_bag</span>
              Buy Now
            </a>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) this.closeQuickView();
    });
    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeQuickView();
    });
  }

  openQuickView(productId) {
    const product = this.allProducts.find(p => p.id === productId);
    if (!product) return;

    const modal = document.getElementById('quickViewModal');
    document.getElementById('qv-image').src = product.image || '';
    document.getElementById('qv-title').textContent = product.name || '';
    
    const badgeEl = document.getElementById('qv-badge');
    if (product.badge) {
      badgeEl.textContent = product.badge;
      badgeEl.style.display = 'inline-block';
    } else {
      badgeEl.style.display = 'none';
    }

    // Rating stars
    const rating = product.ratingValue || 5;
    const starsHtml = Array(Math.round(rating))
      .fill('<span class="material-symbols-outlined testimonial-star">star</span>')
      .join('');
    document.getElementById('qv-rating').innerHTML = starsHtml + `<span class="qv-rating-text">${rating.toFixed(1)}</span>`;

    // Price
    const priceEl = document.getElementById('qv-price');
    if (product.price && product.price > 0) {
      priceEl.textContent = `$${product.price.toFixed(2)}`;
      priceEl.style.display = 'block';
    } else {
      priceEl.style.display = 'none';
    }

    // Description
    document.getElementById('qv-description').textContent = product.description || product.shortBenefit || 'Discover this premium curated product.';

    // Key benefits
    const benefitsEl = document.getElementById('qv-benefits');
    const benefits = Array.isArray(product.keyBenefits) ? product.keyBenefits : [];
    if (benefits.length > 0) {
      benefitsEl.innerHTML = benefits.map(b =>
        `<div class="qv-benefit-item"><span class="material-symbols-outlined">check_circle</span>${b}</div>`
      ).join('');
      benefitsEl.style.display = 'block';
    } else {
      benefitsEl.style.display = 'none';
    }

    // Buy button
    const buyBtn = document.getElementById('qv-buy-btn');
    const isAffiliate = product.affiliateUrl && product.affiliateUrl.length > 5;
    buyBtn.href = isAffiliate ? product.affiliateUrl : `#`;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeQuickView() {
    const modal = document.getElementById('quickViewModal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // ── Data Fetching ──
  async fetchAndRender(container, limit) {
    try {
      this.showLoading(container);
      
      let url = '/api/products';
      const params = new URLSearchParams();
      if (this.activeCategory) params.append('category', this.activeCategory);
      params.append('_t', Date.now());
      url += '?' + params.toString();

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      try {
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('API returned non-JSON response');
        }

        const data = await res.json();
        const products = Array.isArray(data) ? data : (data.products || []);
        
        if (products.length > 0) {
          this.allProducts = products;
          this.renderProducts(container, products.slice(0, limit));
        } else {
          throw new Error('No products in DB');
        }
      } catch (innerErr) {
        console.warn('[MRT] API Failed, switching to Fail-Safe:', innerErr.message);
        this.useFallback(container, limit);
      }

      if (this.activeCategory) this.fetchCategoryTheme(this.activeCategory);

    } catch (err) {
      console.error('MRT CMS Error:', err);
      this.useFallback(container, limit);
    }
  }

  useFallback(container, limit) {
    let products = [...FALLBACK_PRODUCTS];
    if (this.activeCategory) {
      products = products.filter(p => p.category.slug === this.activeCategory);
    }
    if (products.length === 0) products = FALLBACK_PRODUCTS;
    
    this.allProducts = products;
    this.renderProducts(container, products.slice(0, limit));
  }

  showLoading(container) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; padding: 100px 0; text-align: center; opacity: 0.4;">
        <span class="material-symbols-outlined animate-spin" style="font-size: 48px; margin-bottom: 20px;">refresh</span>
        <p style="font-weight: 500;">Curating your collection...</p>
      </div>
    `;
  }

  renderProducts(container, products) {
    container.innerHTML = products.map(p => this.createProductCard(p)).join('');
  }

  updateCategoryUI(categoryData) {
    const titleEl = document.getElementById('category-title-display');
    const descEl = document.getElementById('category-desc-display');

    if (categoryData && categoryData.theme) {
      const theme = categoryData.theme;
      if (titleEl) titleEl.innerText = theme.seoTitle || categoryData.name.toUpperCase();
      if (descEl)  descEl.innerText  = theme.seoIntro || theme.subtitle || '';
    }

    const hero = document.getElementById('category-hero');
    if (hero) {
      const assetMap = {
        'home-kitchen': '/assets/editorial_v3/cat_home.png',
        'beauty-personal-care': '/assets/editorial_v3/cat_beauty.png',
        'health-wellness': '/assets/editorial_v3/cat_health.png',
        'baby-kids-essentials': '/assets/editorial_v3/cat_kids.png',
        'electronics-accessories': '/assets/editorial_v3/cat_tech.png',
        'sports-fitness': '/assets/editorial_v3/cat_men.png',
        'pet-supplies': '/assets/editorial_v3/cat_pets.png'
      };
      const bg = assetMap[this.activeCategory] || '/assets/editorial_v3/hero.png';
      hero.style.backgroundImage = `url('${bg}')`;
    }
  }

  // ── Product Card (Avory Style) ──
  createProductCard(p) {
    const isAffiliate = p.affiliateUrl && p.affiliateUrl.length > 5;
    const buyUrl = isAffiliate ? p.affiliateUrl : `#`;
    const rating = p.ratingValue || 5;
    const stars = Array(Math.round(rating))
      .fill('<span class="material-symbols-outlined pc-star">star</span>')
      .join('');
    const priceHtml = p.price && p.price > 0 
      ? `<span class="pc-price">$${p.price.toFixed(2)}</span>` 
      : '';
    const badgeHtml = p.badge 
      ? `<span class="pc-badge">${p.badge}</span>` 
      : '';
    const benefitHtml = p.shortBenefit 
      ? `<p class="pc-benefit">${p.shortBenefit}</p>` 
      : '';

    return `
      <article class="pc-card" data-id="${p.id}">
        <div class="pc-img-wrap">
          <img src="${p.image}" alt="${p.name}" loading="lazy">
          ${badgeHtml}
          <div class="pc-hover-actions">
            <button class="pc-quickview-btn" onclick="openQuickView(${p.id})" title="Quick View">
              <span class="material-symbols-outlined">visibility</span>
            </button>
          </div>
        </div>
        <div class="pc-info">
          <div class="pc-rating">${stars}<span class="pc-rating-num">${rating.toFixed(1)}</span></div>
          <h3 class="pc-name">${p.name}</h3>
          ${benefitHtml}
          <div class="pc-footer">
            ${priceHtml}
            <a href="${buyUrl}" target="_blank" rel="noopener" class="pc-buy-btn">
              <span class="material-symbols-outlined" style="font-size:16px">shopping_bag</span>
              Buy Now
            </a>
          </div>
        </div>
      </article>
    `;
  }

  // ── Testimonials ──
  async renderTestimonials(container) {
    try {
      const res = await fetch('/api/testimonials');
      const data = await res.json();

      if (data && data.length > 0) {
        const usTestimonials = data.filter(t => t.region === 'us');
        const uaeTestimonials = data.filter(t => t.region === 'ae');

        let html = '';

        if (usTestimonials.length > 0) {
          html += `
            <div class="testimonial-region">
              <h3 class="region-header">🇺🇸 United States Customers</h3>
              <div class="testimonial-grid">
                ${usTestimonials.map(t => this.createTestimonialCard(t)).join('')}
              </div>
            </div>
          `;
        }

        if (uaeTestimonials.length > 0) {
          html += `
            <div class="testimonial-region">
              <h3 class="region-header">🇦🇪 United Arab Emirates Customers</h3>
              <div class="testimonial-grid">
                ${uaeTestimonials.map(t => this.createTestimonialCard(t)).join('')}
              </div>
            </div>
          `;
        }

        container.innerHTML = html;
        container.classList.remove('testimonial-grid');
      }
    } catch (err) {
      console.error('Testimonials Error:', err);
    }
  }

  createTestimonialCard(t) {
    const flags = { 'us': '🇺🇸', 'ae': '🇦🇪', 'uk': '🇬🇧', 'ca': '🇨🇦' };
    const flag = flags[(t.region || '').toLowerCase()] || '🌍';
    const stars = Array(t.rating || 5)
      .fill('<span class="material-symbols-outlined testimonial-star">star</span>')
      .join('');

    const quoteHtml = t.quote && t.quote !== 'null' ? `<p class="testimonial-quote">"${t.quote}"</p>` : '';
    const textHtml = t.text && t.text !== 'null' ? `<p class="testimonial-text">${t.text}</p>` : '';

    return `
      <div class="testimonial-card">
        <div class="testimonial-badge">
          <span class="material-symbols-outlined" style="font-size: 14px;">verified</span>
          Verified Buyer
        </div>
        <div class="testimonial-stars-wrap">${stars}</div>
        ${quoteHtml}
        ${textHtml}
        <div class="testimonial-author">
          <div class="author-flag">${flag}</div>
          <div class="author-info">
            <h4>${t.name || 'Anonymous'}</h4>
            <p>${t.location || ''}</p>
          </div>
        </div>
      </div>
    `;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new MRTApp();
});
