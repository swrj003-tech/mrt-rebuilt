var e=[{id:`f1`,name:`Elegant Marble Coaster Set`,price:45,image:`https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800`,category:{name:`Home & Kitchen`,slug:`home-kitchen`},badge:`Bestseller`,reviewCount:124,description:`Handcrafted natural marble coasters with gold-rimmed edges. Perfect for a luxury home aesthetic.`,keyBenefits:[`Natural Marble`,`Heat Resistant`,`Elegant Design`]},{id:`f2`,name:`Silk Sleep Mask & Pillowcase`,price:68,image:`https://images.unsplash.com/photo-1590736704610-d0966f36306c?auto=format&fit=crop&q=80&w=800`,category:{name:`Beauty & Personal Care`,slug:`beauty-personal-care`},badge:`Luxury`,reviewCount:420,description:`100% Mulberry silk for the ultimate beauty sleep and hair protection.`,keyBenefits:[`100% Mulberry Silk`,`Anti-aging`,`Hair Friendly`]},{id:`f3`,name:`Minimalist Ceramic Vase`,price:32,image:`https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&q=80&w=800`,category:{name:`Home & Kitchen`,slug:`home-kitchen`},badge:`Designer Choice`,reviewCount:89,description:`Hand-thrown ceramic vase with a matte finish. A versatile piece for any interior style.`,keyBenefits:[`Hand-thrown`,`Matte Finish`,`Versatile Style`]},{id:`f4`,name:`Organic Lavender Diffuser`,price:38,image:`https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800`,category:{name:`Health & Wellness`,slug:`health-wellness`},badge:`Top Rated`,reviewCount:256,description:`Sustainably sourced lavender essential oil diffuser to create a calming sanctuary in your home.`,keyBenefits:[`Sustainably Sourced`,`Calming Effect`,`Natural Oils`]},{id:`f5`,name:`Premium Leather Pet Carrier`,price:185,image:`https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?auto=format&fit=crop&q=80&w=800`,category:{name:`Pet Supplies`,slug:`pet-supplies`},badge:`New Arrival`,reviewCount:45,description:`Italian leather travel carrier for small pets. Durable, ventilating, and exceptionally stylish.`,keyBenefits:[`Italian Leather`,`Ventilated`,`Durable Hardware`]},{id:`f6`,name:`Minimalist Smart Watch`,price:249,image:`https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800`,category:{name:`Electronics & Accessories`,slug:`electronics-accessories`},badge:`Tech Award`,reviewCount:1530,description:`The ultimate blend of classic watch design and modern smart connectivity.`,keyBenefits:[`AMOLED Display`,`Health Tracking`,`7-Day Battery`]},{id:`f7`,name:`Golden Hour Scented Candle`,price:28,image:`https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=800`,category:{name:`Home & Kitchen`,slug:`home-kitchen`},badge:`Trending`,reviewCount:512,description:`Notes of sandalwood, amber, and vanilla to capture the essence of the golden hour.`,keyBenefits:[`Soy Wax`,`60hr Burn Time`,`Natural Scent`]},{id:`f8`,name:`Matte Black Yoga Mat`,price:75,image:`https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800`,category:{name:`Sports & Fitness`,slug:`sports-fitness`},badge:`Pro Grade`,reviewCount:302,description:`High-density natural rubber mat with stay-dry grip technology for professional yogis.`,keyBenefits:[`Natural Rubber`,`Non-Slip Grip`,`Extra Thick`]}],t=class{constructor(){this.allProducts=[],this.activeCategory=new URLSearchParams(window.location.search).get(`c`),this.init(),window.openQuickView=e=>this.openQuickView(e),window.closeQuickView=()=>this.closeQuickView()}async init(){this.setupMobileMenu(),this.handleScroll(),this.createQuickViewModal();let e=document.getElementById(`bestsellers-grid`),t=document.getElementById(`category-products-container`),n=document.getElementById(`community-grid`);e?await this.fetchAndRender(e,8):t&&(await this.fetchAndRender(t,50),this.updateCategoryUI()),n&&this.renderTestimonials(n)}setupMobileMenu(){let e=document.getElementById(`mobileMenuToggle`),t=document.getElementById(`mobileNav`),n=document.getElementById(`mobileNavClose`),r=document.getElementById(`mobileNavBackdrop`);if(e&&t&&n&&r){e.addEventListener(`click`,()=>{t.style.display=`flex`,setTimeout(()=>t.classList.add(`open`),10)});let i=()=>{t.classList.remove(`open`),setTimeout(()=>t.style.display=`none`,300)};n.addEventListener(`click`,i),r.addEventListener(`click`,i)}}handleScroll(){let e=document.querySelector(`.mrt-nav`);e&&window.addEventListener(`scroll`,()=>{window.scrollY>50?e.classList.add(`scrolled`):e.classList.remove(`scrolled`)})}createQuickViewModal(){if(document.getElementById(`quickViewModal`))return;let e=document.createElement(`div`);e.id=`quickViewModal`,e.className=`qv-overlay`,e.innerHTML=`
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
    `,document.body.appendChild(e),e.addEventListener(`click`,t=>{t.target===e&&this.closeQuickView()}),document.addEventListener(`keydown`,e=>{e.key===`Escape`&&this.closeQuickView()})}openQuickView(e){let t=this.allProducts.find(t=>t.id===e);if(!t)return;let n=document.getElementById(`quickViewModal`);document.getElementById(`qv-image`).src=t.image||``,document.getElementById(`qv-title`).textContent=t.name||``;let r=document.getElementById(`qv-badge`);t.badge?(r.textContent=t.badge,r.style.display=`inline-block`):r.style.display=`none`;let i=t.ratingValue||5,a=Array(Math.round(i)).fill(`<span class="material-symbols-outlined testimonial-star">star</span>`).join(``);document.getElementById(`qv-rating`).innerHTML=a+`<span class="qv-rating-text">${i.toFixed(1)}</span>`;let o=document.getElementById(`qv-price`);t.price&&t.price>0?(o.textContent=`$${t.price.toFixed(2)}`,o.style.display=`block`):o.style.display=`none`,document.getElementById(`qv-description`).textContent=t.description||t.shortBenefit||`Discover this premium curated product.`;let s=document.getElementById(`qv-benefits`),c=Array.isArray(t.keyBenefits)?t.keyBenefits:[];c.length>0?(s.innerHTML=c.map(e=>`<div class="qv-benefit-item"><span class="material-symbols-outlined">check_circle</span>${e}</div>`).join(``),s.style.display=`block`):s.style.display=`none`;let l=document.getElementById(`qv-buy-btn`);l.href=t.affiliateUrl&&t.affiliateUrl.length>5?t.affiliateUrl:`#`,n.classList.add(`active`),document.body.style.overflow=`hidden`}closeQuickView(){let e=document.getElementById(`quickViewModal`);e&&(e.classList.remove(`active`),document.body.style.overflow=``)}async fetchAndRender(e,t){try{this.showLoading(e);let n=`/api/products`,r=new URLSearchParams;this.activeCategory&&r.append(`category`,this.activeCategory),r.append(`_t`,Date.now()),n+=`?`+r.toString();let i=new AbortController,a=setTimeout(()=>i.abort(),8e3);try{let r=await fetch(n,{signal:i.signal});if(clearTimeout(a),!r.ok)throw Error(`HTTP ${r.status}`);let o=r.headers.get(`content-type`);if(!o||!o.includes(`application/json`))throw Error(`API returned non-JSON response`);let s=await r.json(),c=Array.isArray(s)?s:s.products||[];if(c.length>0)this.allProducts=c,this.renderProducts(e,c.slice(0,t));else throw Error(`No products in DB`)}catch(n){console.warn(`[MRT] API Failed, switching to Fail-Safe:`,n.message),this.useFallback(e,t)}this.activeCategory&&this.fetchCategoryTheme(this.activeCategory)}catch(n){console.error(`MRT CMS Error:`,n),this.useFallback(e,t)}}useFallback(t,n){let r=[...e];this.activeCategory&&(r=r.filter(e=>e.category.slug===this.activeCategory)),r.length===0&&(r=e),this.allProducts=r,this.renderProducts(t,r.slice(0,n))}showLoading(e){e.innerHTML=`
      <div style="grid-column: 1/-1; padding: 100px 0; text-align: center; opacity: 0.4;">
        <span class="material-symbols-outlined animate-spin" style="font-size: 48px; margin-bottom: 20px;">refresh</span>
        <p style="font-weight: 500;">Curating your collection...</p>
      </div>
    `}renderProducts(e,t){e.innerHTML=t.map(e=>this.createProductCard(e)).join(``)}updateCategoryUI(e){let t=document.getElementById(`category-title-display`),n=document.getElementById(`category-desc-display`);if(e&&e.theme){let r=e.theme;t&&(t.innerText=r.seoTitle||e.name.toUpperCase()),n&&(n.innerText=r.seoIntro||r.subtitle||``)}let r=document.getElementById(`category-hero`);if(r){let e={"home-kitchen":`/assets/editorial_v3/cat_home.png`,"beauty-personal-care":`/assets/editorial_v3/cat_beauty.png`,"health-wellness":`/assets/editorial_v3/cat_health.png`,"baby-kids-essentials":`/assets/editorial_v3/cat_kids.png`,"electronics-accessories":`/assets/editorial_v3/cat_tech.png`,"sports-fitness":`/assets/editorial_v3/cat_men.png`,"pet-supplies":`/assets/editorial_v3/cat_pets.png`}[this.activeCategory]||`/assets/editorial_v3/hero.png`;r.style.backgroundImage=`url('${e}')`}}createProductCard(e){let t=e.affiliateUrl&&e.affiliateUrl.length>5?e.affiliateUrl:`#`,n=e.ratingValue||5,r=Array(Math.round(n)).fill(`<span class="material-symbols-outlined pc-star">star</span>`).join(``),i=e.price&&e.price>0?`<span class="pc-price">$${e.price.toFixed(2)}</span>`:``,a=e.badge?`<span class="pc-badge">${e.badge}</span>`:``,o=e.shortBenefit?`<p class="pc-benefit">${e.shortBenefit}</p>`:``;return`
      <article class="pc-card" data-id="${e.id}">
        <div class="pc-img-wrap">
          <img src="${e.image}" alt="${e.name}" loading="lazy">
          ${a}
          <div class="pc-hover-actions">
            <button class="pc-quickview-btn" onclick="openQuickView(${e.id})" title="Quick View">
              <span class="material-symbols-outlined">visibility</span>
            </button>
          </div>
        </div>
        <div class="pc-info">
          <div class="pc-rating">${r}<span class="pc-rating-num">${n.toFixed(1)}</span></div>
          <h3 class="pc-name">${e.name}</h3>
          ${o}
          <div class="pc-footer">
            ${i}
            <a href="${t}" target="_blank" rel="noopener" class="pc-buy-btn">
              <span class="material-symbols-outlined" style="font-size:16px">shopping_bag</span>
              Buy Now
            </a>
          </div>
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
    `}};document.addEventListener(`DOMContentLoaded`,()=>{new t});