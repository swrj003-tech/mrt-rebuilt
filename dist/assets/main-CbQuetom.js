var e=[],t=[],n=class{constructor(){this.allProducts=[],this.activeCategory=new URLSearchParams(window.location.search).get(`c`),this.init(),window.openQuickView=e=>this.openQuickView(e),window.closeQuickView=()=>this.closeQuickView()}async init(){`serviceWorker`in navigator&&navigator.serviceWorker.getRegistrations().then(e=>e.forEach(e=>e.unregister())),this.setupMobileMenu(),this.handleScroll(),this.createQuickViewModal();let e=document.getElementById(`categories-grid`),t=document.getElementById(`products-home-grid`)||document.getElementById(`featured-products`),n=document.getElementById(`category-products-container`),r=document.getElementById(`community-grid`);e&&await this.fetchAndRenderCategories(e),t?await this.fetchAndRender(t,8):n&&(await this.fetchAndRender(n,50),this.updateCategoryUI()),r&&this.renderTestimonials(r)}setupMobileMenu(){let e=document.getElementById(`mobileMenuToggle`),t=document.getElementById(`mobileNav`),n=document.getElementById(`mobileNavClose`),r=document.getElementById(`mobileNavBackdrop`);if(e&&t&&n&&r){e.addEventListener(`click`,()=>{t.style.display=`flex`,setTimeout(()=>t.classList.add(`open`),10)});let i=()=>{t.classList.remove(`open`),setTimeout(()=>t.style.display=`none`,300)};n.addEventListener(`click`,i),r.addEventListener(`click`,i)}}handleScroll(){let e=document.querySelector(`.mrt-nav`);e&&window.addEventListener(`scroll`,()=>{window.scrollY>50?e.classList.add(`scrolled`):e.classList.remove(`scrolled`)})}createQuickViewModal(){if(document.getElementById(`quickViewModal`))return;let e=document.createElement(`div`);e.id=`quickViewModal`,e.className=`qv-overlay`,e.innerHTML=`
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
    `,document.body.appendChild(e),e.addEventListener(`click`,t=>{t.target===e&&this.closeQuickView()}),document.addEventListener(`keydown`,e=>{e.key===`Escape`&&this.closeQuickView()})}openQuickView(e){let t=this.allProducts.find(t=>t.id===e);if(!t)return;let n=document.getElementById(`quickViewModal`);document.getElementById(`qv-image`).src=t.image||``,document.getElementById(`qv-title`).textContent=t.name||``;let r=document.getElementById(`qv-badge`);t.badge?(r.textContent=t.badge,r.style.display=`inline-block`):r.style.display=`none`;let i=t.ratingValue||5,a=Array(Math.round(i)).fill(`<span class="material-symbols-outlined testimonial-star">star</span>`).join(``);document.getElementById(`qv-rating`).innerHTML=a+`<span class="qv-rating-text">${i.toFixed(1)}</span>`;let o=document.getElementById(`qv-price`);t.price&&t.price>0?(o.textContent=`$${t.price.toFixed(2)}`,o.style.display=`block`):o.style.display=`none`,document.getElementById(`qv-description`).textContent=t.description||t.shortBenefit||`Discover this premium curated product.`;let s=document.getElementById(`qv-benefits`),c=Array.isArray(t.keyBenefits)?t.keyBenefits:[];c.length>0?(s.innerHTML=c.map(e=>`<div class="qv-benefit-item"><span class="material-symbols-outlined">check_circle</span>${e}</div>`).join(``),s.style.display=`block`):s.style.display=`none`;let l=document.getElementById(`qv-buy-btn`);l.href=t.affiliateUrl&&t.affiliateUrl.length>5?t.affiliateUrl:`#`,n.classList.add(`active`),document.body.style.overflow=`hidden`}closeQuickView(){let e=document.getElementById(`quickViewModal`);e&&(e.classList.remove(`active`),document.body.style.overflow=``)}async fetchAndRenderCategories(e){let n=[];try{let e=await fetch(`/api/categories`);e.ok&&(n=await e.json())}catch{console.warn(`[MRT] Categories fetch failed, using fallback.`)}(!n||n.length===0)&&(n=t),e.innerHTML=n.map(e=>`
      <a href="category.html?c=${e.slug}" class="avory-cat-card group">
        <div class="avory-cat-bg" style="background-image: url('${e.image}');"></div>
        <div class="avory-cat-overlay"></div>
        <div class="avory-cat-content">
          <h3 class="avory-cat-title">${e.name}</h3>
          <p class="avory-cat-desc">${e.theme?.seoIntro||`Explore our curated selection.`}</p>
          <span class="avory-cat-btn">Explore Now</span>
        </div>
      </a>
    `).join(``)}async fetchAndRender(e,t=50){try{this.showLoading(e);let n=`/api/products`,r=new URLSearchParams;this.activeCategory&&r.append(`category`,this.activeCategory),r.append(`_t`,Date.now()),n+=`?`+r.toString();let i=new AbortController,a=setTimeout(()=>i.abort(),8e3);try{let r=await fetch(n,{signal:i.signal});if(clearTimeout(a),!r.ok)throw Error(`HTTP ${r.status}`);let o=r.headers.get(`content-type`);if(!o||!o.includes(`application/json`))throw Error(`API returned non-JSON response`);let s=await r.json(),c=Array.isArray(s)?s:s.products||[];if(c.length>0)this.allProducts=c,this.renderProducts(e,c.slice(0,t));else throw Error(`No products in DB`)}catch(t){console.warn(`[MRT] API Failed:`,t.message),e.innerHTML=`<p class="no-products">Database connectivity issue. Please check back later.</p>`}}catch(t){console.error(`MRT CMS Error:`,t),e.innerHTML=`<p class="no-products">Connection Error.</p>`}}useFallback(t,n){let r=[...e];this.activeCategory&&(r=r.filter(e=>e.category.slug===this.activeCategory)),r.length===0&&(r=e),this.allProducts=r,this.renderProducts(t,r.slice(0,n))}showLoading(e){e.innerHTML=`
      <div style="grid-column: 1/-1; padding: 100px 0; text-align: center; opacity: 0.4;">
        <span class="material-symbols-outlined animate-spin" style="font-size: 48px; margin-bottom: 20px;">refresh</span>
        <p style="font-weight: 500;">Curating your collection...</p>
      </div>
    `}renderProducts(e,t){if(this.activeCategory){let n={"Top Pick":t.filter(e=>e.badge===`Top Pick`),"Trending Now":t.filter(e=>e.badge===`Trending Now`),"Editor’s Choice":t.filter(e=>e.badge===`Editor’s Choice`)},r=``;n[`Top Pick`].length>0&&(r+=`
          <div class="category-section">
            <h2 class="section-heading">⭐ Top Picks</h2>
            <div class="products-grid">
              ${n[`Top Pick`].map(e=>this.createProductCard(e)).join(``)}
            </div>
          </div>
        `),n[`Trending Now`].length>0&&(r+=`
          <div class="category-section">
            <h2 class="section-heading">🔥 Trending Now</h2>
            <div class="products-grid">
              ${n[`Trending Now`].map(e=>this.createProductCard(e)).join(``)}
            </div>
          </div>
        `),n[`Editor’s Choice`].length>0&&(r+=`
          <div class="category-section">
            <h2 class="section-heading">💡 Editor’s Choice</h2>
            <div class="products-grid">
              ${n[`Editor’s Choice`].map(e=>this.createProductCard(e)).join(``)}
            </div>
          </div>
        `),e.innerHTML=r||`<p class="no-products">No products found in this category.</p>`}else e.innerHTML=`<div class="products-grid">${t.map(e=>this.createProductCard(e)).join(``)}</div>`}updateCategoryUI(e){let t=document.getElementById(`category-title-display`),n=document.getElementById(`category-desc-display`),r=document.getElementById(`category-hero`);e&&(t&&(t.innerText=e.theme?.title||e.name,t.classList.add(`seo-title`)),n&&(n.innerText=e.theme?.seoIntro||e.description||`Explore our curated selection.`,n.classList.add(`seo-intro`)),r&&e.image&&(r.style.backgroundImage=`url('${e.image}')`))}createProductCard(e){let t=e.affiliateUrl||`#`,n=e.secondaryUrl||t,r=e.ratingText||`4.8/5 Recommended`,i=e.badge?`<span class="pc-badge ${e.badge.toLowerCase().replace(/\s+/g,`-`)}">${e.badge}</span>`:``,a=Array.isArray(e.keyBenefits)?e.keyBenefits:[],o=a.length>0?`<ul class="pc-benefits-list">
          ${a.map(e=>`<li><span class="material-symbols-outlined">check_circle</span> ${e}</li>`).join(``)}
         </ul>`:``;return`
      <article class="pc-card affiliate-card" data-id="${e.id}">
        <div class="pc-img-wrap">
          <img src="${e.image}" alt="${e.name}" loading="lazy">
          ${i}
        </div>
        <div class="pc-info">
          <div class="pc-header">
            <div class="pc-rating-tag">⭐ ${r}</div>
            <h3 class="pc-name">${e.name}</h3>
          </div>
          
          <p class="pc-description">${e.shortDescription||``}</p>
          
          ${o}
          
          <div class="pc-actions">
            <a href="${t}" target="_blank" rel="noopener" class="pc-btn primary-btn">
              Check Latest Price
              <span class="material-symbols-outlined">open_in_new</span>
            </a>
            <a href="${n}" target="_blank" rel="noopener" class="pc-btn secondary-btn">
              View Deal
            </a>
          </div>
          
          <p class="pc-disclaimer">Price and availability may vary. As an Amazon Associate, we earn from qualifying purchases.</p>
        </div>
      </article>
    `}async renderTestimonials(e){try{let t=await(await fetch(`/api/testimonials`)).json();if(t&&t.length>0){let n=t.filter(e=>e.region===`us`),r=t.filter(e=>e.region===`ae`),i=``;n.length>0&&(i+=`
            <div class="testimonial-region">
              <h3 class="region-header">🇺🇸 United States Customers</h3>
              <div class="testimonial-grid">
                ${n.map(e=>this.createTestimonialCard(e)).join(``)}
              </div>
            </div>
          `),r.length>0&&(i+=`
            <div class="testimonial-region">
              <h3 class="region-header">🇦🇪 United Arab Emirates Customers</h3>
              <div class="testimonial-grid">
                ${r.map(e=>this.createTestimonialCard(e)).join(``)}
              </div>
            </div>
          `),e.innerHTML=i,e.classList.remove(`testimonial-grid`)}}catch(e){console.error(`Testimonials Error:`,e)}}createTestimonialCard(e){let t={us:`🇺🇸`,ae:`🇦🇪`,uk:`🇬🇧`,ca:`🇨🇦`}[(e.region||``).toLowerCase()]||`🌍`;return`
      <div class="testimonial-card">
        <div class="testimonial-badge">
          <span class="material-symbols-outlined" style="font-size: 14px;">verified</span>
          Verified Buyer
        </div>
        <div class="testimonial-stars-wrap">${Array(e.rating||5).fill(`<span class="material-symbols-outlined testimonial-star">star</span>`).join(``)}</div>
        ${e.quote&&e.quote!==`null`?`<p class="testimonial-quote">"${e.quote}"</p>`:``}
        ${e.text&&e.text!==`null`?`<p class="testimonial-text">${e.text}</p>`:``}
        <div class="testimonial-author">
          <div class="author-flag">${t}</div>
          <div class="author-info">
            <h4>${e.name||`Anonymous`}</h4>
            <p>${e.location||``}</p>
          </div>
        </div>
      </div>
    `}};document.addEventListener(`DOMContentLoaded`,()=>{new n});