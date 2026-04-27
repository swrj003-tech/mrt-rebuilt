var e=class{constructor(){this.allProducts=[],this.activeCategory=new URLSearchParams(window.location.search).get(`c`),this.init(),window.openQuickView=e=>this.openQuickView(e),window.closeQuickView=()=>this.closeQuickView()}async syncCollectionsGrid(){let e=document.getElementById(`categories-grid`);if(e)try{e.innerHTML=(await(await fetch(`/api/categories?_t=`+Date.now())).json()).map(e=>`
        <a href="category.html?c=${e.slug}" class="category-card-v2" id="cat-card-${e.id}">
          <div class="category-card-v2-img">
            <img src="${e.image||`/assets/placeholder-category.jpg`}" alt="${e.name}" onerror="this.src='/assets/editorial_v3/discovery_bg.png'">
          </div>
          <div class="category-card-v2-content">
            <h3>${e.name}</h3>
            <p>${e.description||`Discover our curated selection of `+e.name+` products.`}</p>
            <div class="category-card-v2-footer">
              <span>EXPLORE</span>
              <span class="material-symbols-outlined">arrow_forward</span>
            </div>
          </div>
        </a>
      `).join(``)}catch(e){console.error(`Failed to sync collections grid:`,e)}}async init(){`serviceWorker`in navigator&&navigator.serviceWorker.getRegistrations().then(e=>e.forEach(e=>e.unregister())),this.setupMobileMenu(),this.setupContactForm(),this.handleScroll(),this.createQuickViewModal(),this.syncGlobalNavigation(),document.getElementById(`categories-grid`);let e=document.getElementById(`products-home-grid`)||document.getElementById(`featured-products`),t=document.getElementById(`category-products-container`),n=document.getElementById(`community-grid`),r=document.getElementById(`blog-posts-container`),i=document.getElementById(`blog-post-container`);if(e)await this.fetchAndRender(e,8);else if(t){await this.fetchAndRender(t,50);try{let e=(await(await fetch(`/api/categories`)).json()).find(e=>e.slug===this.activeCategory);e&&this.updateCategoryUI(e)}catch{}}else r?await this.fetchAndRenderBlog(r):i&&await this.fetchAndRenderBlogPost(i);n&&this.renderTestimonials(n)}async fetchProducts(e=null){try{let t=e?`/api/products?category=${e}&_t=${Date.now()}&limit=100`:`/api/products?_t=${Date.now()}&limit=100`,n=await(await fetch(t)).json();this.products=n.products||(Array.isArray(n)?n:[]),this.renderProducts()}catch(e){console.error(`Fetch Error:`,e)}}async syncGlobalNavigation(){try{let e=await(await fetch(`/api/categories?_t=`+Date.now())).json();if(!e||e.length===0)return;let t=document.getElementById(`nav-categories-dropdown`);t&&(t.innerHTML=e.map(e=>`
          <a href="category.html?c=${e.slug}" class="nav-dropdown-item">${e.name}</a>
        `).join(``));let n=document.getElementById(`mobile-categories-list`);n&&(n.innerHTML=e.map(e=>`
          <a href="category.html?c=${e.slug}">
            <span class="material-symbols-outlined" style="font-size:18px;">label</span> ${e.name}
          </a>
        `).join(``));let r=document.getElementById(`categories-grid`);r&&(r.innerHTML=e.map(e=>`
          <a href="category.html?c=${e.slug}" class="avory-cat-card">
            <div class="cat-img-wrapper">
              <img src="${e.image||`/assets/editorial_v3/hero.png`}" alt="${e.name}" class="cat-img">
            </div>
            <div class="cat-meta">
              <h3 class="cat-title">${e.name}</h3>
              <p class="cat-subtitle">${e.theme?.subtitle||e.description||`Explore our curated selection.`}</p>
            </div>
          </a>
        `).join(``))}catch(e){console.warn(`[MRT] Navigation sync failed:`,e)}}setupMobileMenu(){let e=document.getElementById(`mobileMenuToggle`),t=document.getElementById(`mobileNav`),n=document.getElementById(`mobileNavClose`),r=document.getElementById(`mobileNavBackdrop`);if(e&&t&&n&&r){e.addEventListener(`click`,()=>{t.style.display=`flex`,setTimeout(()=>t.classList.add(`open`),10)});let i=()=>{t.classList.remove(`open`),setTimeout(()=>t.style.display=`none`,300)};n.addEventListener(`click`,i),r.addEventListener(`click`,i)}}setupContactForm(){let e=document.getElementById(`contact-form`);if(!e)return;let t=document.getElementById(`form-status`),n=e.querySelector(`button[type="submit"]`);e.addEventListener(`submit`,async r=>{r.preventDefault();let i=n?.textContent||`SEND MESSAGE`;n&&(n.disabled=!0,n.textContent=`SENDING...`),t&&(t.style.display=`block`,t.textContent=`Sending your message...`);try{let n=Object.fromEntries(new FormData(e).entries()),r=await fetch(`/api/contact`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(n)}),i=await r.json().catch(()=>({}));if(!r.ok||i.success===!1)throw Error(i.error||`Unable to send message`);e.reset(),t&&(t.textContent=`Message sent. We will get back to you soon.`)}catch(e){t&&(t.textContent=e.message||`Message failed. Please email us directly.`)}finally{n&&(n.disabled=!1,n.textContent=i)}})}handleScroll(){let e=document.querySelector(`.mrt-nav`);e&&window.addEventListener(`scroll`,()=>{window.scrollY>50?e.classList.add(`scrolled`):e.classList.remove(`scrolled`)})}createQuickViewModal(){if(document.getElementById(`quickViewModal`))return;let e=document.createElement(`div`);e.id=`quickViewModal`,e.className=`qv-overlay`,e.innerHTML=`
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
    `,document.body.appendChild(e),e.addEventListener(`click`,t=>{t.target===e&&this.closeQuickView()}),document.addEventListener(`keydown`,e=>{e.key===`Escape`&&this.closeQuickView()})}openQuickView(e){let t=this.allProducts.find(t=>t.id===e);if(!t)return;let n=document.getElementById(`quickViewModal`);document.getElementById(`qv-image`).src=t.image||``,document.getElementById(`qv-title`).textContent=t.name||``;let r=document.getElementById(`qv-badge`);t.badge?(r.textContent=t.badge,r.style.display=`inline-block`):r.style.display=`none`;let i=t.ratingValue||5,a=Array(Math.round(i)).fill(`<span class="material-symbols-outlined testimonial-star">star</span>`).join(``);document.getElementById(`qv-rating`).innerHTML=a+`<span class="qv-rating-text">${i.toFixed(1)}</span>`;let o=document.getElementById(`qv-price`);t.price&&t.price>0?(o.textContent=`$${t.price.toFixed(2)}`,o.style.display=`block`):o.style.display=`none`,document.getElementById(`qv-description`).textContent=t.description||t.shortBenefit||`Discover this premium curated product.`;let s=document.getElementById(`qv-benefits`),c=Array.isArray(t.keyBenefits)?t.keyBenefits:[];c.length>0?(s.innerHTML=c.map(e=>`<div class="qv-benefit-item"><span class="material-symbols-outlined">check_circle</span>${e}</div>`).join(``),s.style.display=`block`):s.style.display=`none`;let l=document.getElementById(`qv-buy-btn`);l.href=t.affiliateUrl&&t.affiliateUrl.length>5?t.affiliateUrl:`#`,n.classList.add(`active`),document.body.style.overflow=`hidden`}closeQuickView(){let e=document.getElementById(`quickViewModal`);e&&(e.classList.remove(`active`),document.body.style.overflow=``)}async fetchAndRenderCategories(e){try{this.showLoading(e);let t=await(await fetch(`/api/categories?_t=`+Date.now())).json();if(!t||t.length===0){e.innerHTML=`<p class="no-products">No categories found in database.</p>`;return}e.innerHTML=t.map(e=>`
        <a href="category.html?c=${e.slug}" class="avory-cat-card group">
          <div class="avory-cat-bg" style="background-image: url('${e.image||`/assets/editorial_v3/hero.png`}');"></div>
          <div class="avory-cat-overlay"></div>
          <div class="avory-cat-content">
            <h3 class="avory-cat-title">${e.name}</h3>
            <p class="avory-cat-desc">${e.theme?.seoIntro||e.description||`Explore our curated selection.`}</p>
            <span class="avory-cat-btn">Explore Now</span>
          </div>
        </a>
      `).join(``)}catch(t){console.error(`[MRT] Categories sync failed:`,t),e.innerHTML=`<p class="no-products">Database Syncing...</p>`}}async fetchAndRender(e,t=50){try{this.showLoading(e);let n=`/api/products`,r=new URLSearchParams;this.activeCategory&&r.append(`category`,this.activeCategory),r.append(`_t`,Date.now()),n+=`?`+r.toString();let i=new AbortController,a=setTimeout(()=>i.abort(),8e3);try{let r=await fetch(n,{signal:i.signal});if(clearTimeout(a),!r.ok)throw Error(`HTTP ${r.status}`);let o=r.headers.get(`content-type`);if(!o||!o.includes(`application/json`))throw Error(`API returned non-JSON response`);let s=await r.json(),c=Array.isArray(s)?s:s.products||[];if(c.length>0)this.allProducts=c,this.renderProducts(e,c.slice(0,t));else throw Error(`No products in DB`)}catch(t){console.warn(`[MRT] API Failed:`,t.message),e.innerHTML=`<p class="no-products">Database connectivity issue. Please check back later.</p>`}}catch(t){console.error(`MRT CMS Error:`,t),e.innerHTML=`<p class="no-products">Connection Error.</p>`}}showLoading(e){e.innerHTML=`
      <div style="grid-column: 1/-1; padding: 100px 0; text-align: center; opacity: 0.4;">
        <span class="material-symbols-outlined animate-spin" style="font-size: 48px; margin-bottom: 20px;">refresh</span>
        <p style="font-weight: 500;">Curating your collection...</p>
      </div>
    `}renderProducts(e,t){if(this.activeCategory&&e.id===`category-products-container`){let n=t.filter(e=>e.badge===`Top Pick`),r=t.filter(e=>e.badge===`Trending Now`),i=t.filter(e=>e.badge===`Editor's Choice`),a=t.filter(e=>![`Top Pick`,`Trending Now`,`Editor's Choice`].includes(e.badge)),o=``;n.length>0&&(o+=`<div class="category-section-title">⭐ Top Picks</div>`,o+=`<div class="products-grid">${n.map(e=>this.createProductCard(e)).join(``)}</div>`),r.length>0&&(o+=`<div class="category-section-title">🔥 Trending Now</div>`,o+=`<div class="products-grid">${r.map(e=>this.createProductCard(e)).join(``)}</div>`),i.length>0&&(o+=`<div class="category-section-title">💡 Editor’s Choice</div>`,o+=`<div class="products-grid">${i.map(e=>this.createProductCard(e)).join(``)}</div>`),a.length>0&&o===``&&(o+=`<div class="products-grid">${a.map(e=>this.createProductCard(e)).join(``)}</div>`),e.innerHTML=o||`<p class="no-products">No products found in this selection.</p>`}else e.innerHTML=`<div class="products-grid">${t.map(e=>this.createProductCard(e)).join(``)}</div>`}updateCategoryUI(e){let t=document.getElementById(`category-title-display`),n=document.getElementById(`category-desc-display`),r=document.getElementById(`category-hero`);e&&(t&&(t.innerText=e.theme?.title||e.name,t.classList.add(`seo-title`)),n&&(n.innerText=e.theme?.seoIntro||e.description||`Explore our curated selection.`,n.classList.add(`seo-intro`)),r&&e.image&&(r.style.backgroundImage=`url('${e.image}')`))}createProductCard(e){let t=e.affiliateUrl||`#`,n=e.secondaryUrl||t,r=Number.parseFloat(e.ratingValue),i=Number.isFinite(r)&&r>0?`${r.toFixed(1)}/5 Recommended`:e.ratingText||`4.8/5 Recommended`,a=e.badge?`<span class="pc-badge ${e.badge.toLowerCase().replace(/\s+/g,`-`)}">${e.badge}</span>`:``,o=Array.isArray(e.keyBenefits)?e.keyBenefits:[],s=o.length>0?`<ul class="pc-benefits-list">
          ${o.map(e=>`<li><span class="material-symbols-outlined">check_circle</span> ${e}</li>`).join(``)}
         </ul>`:``,c=e.image||`/assets/placeholder-product.jpg`;return`
      <article class="pc-card affiliate-card" data-id="${e.id}">
        <div class="pc-img-wrap">
          <img src="${c}" alt="${e.name}" loading="lazy" onerror="this.src='/assets/placeholder-product.jpg';this.onerror=null;">
          ${a}
        </div>
        <div class="pc-info">
          <div class="pc-header">
            <div class="pc-rating-tag">⭐ ${i}</div>
            <h3 class="pc-name">${e.name}</h3>
          </div>
          
          <p class="pc-description">${e.shortDescription||``}</p>
          
          ${s}
          
          <div class="pc-actions">
            ${e.price&&e.price>0?`<div class="pc-price-row"><span class="pc-price">$${Number(e.price).toFixed(2)}</span><span class="pc-price-note">via Amazon</span></div>`:``}
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
    `}async fetchAndRenderBlog(e){try{this.showLoading(e);let t=await(await fetch(`/api/blog?_t=`+Date.now())).json();if(!t||t.length===0){let t=document.getElementById(`blogEmpty`);t&&(t.style.display=`flex`),e.innerHTML=``;return}e.innerHTML=`
        <div class="blog-grid">
          ${t.map((e,n)=>{let r=n===0&&t.length>2,i=e.createdAt?new Date(e.createdAt).toLocaleDateString(`en-US`,{month:`short`,day:`numeric`,year:`numeric`}):``,a=e.author||`MRT Editorial`,o=e.tag||e.category||`Editorial`;return`
            <article class="blog-card${r?` blog-card-featured`:``}">
              <div class="blog-card-img">
                ${e.coverImage?`<img src="${e.coverImage}" alt="${e.title}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'blog-card-img-placeholder\\'><span class=\\'material-symbols-outlined\\'>article</span></div>'">`:`<div class="blog-card-img-placeholder"><span class="material-symbols-outlined">article</span></div>`}
                <span class="blog-card-tag">${o}</span>
              </div>
              <div class="blog-card-body">
                <div class="blog-card-meta">
                  <span class="blog-card-author">${a}</span>
                  <span class="blog-card-dot">·</span>
                  <span>${i}</span>
                </div>
                <h3 class="blog-card-title">${e.title}</h3>
                <p class="blog-card-excerpt">${e.excerpt||``}</p>
                <a href="blog-post.html?slug=${encodeURIComponent(e.slug)}" class="blog-card-cta">
                  Read Story <span class="material-symbols-outlined" style="font-size:16px;">arrow_forward</span>
                </a>
              </div>
            </article>`}).join(``)}
        </div>
      `}catch(t){console.error(`Blog Fetch Error:`,t),e.innerHTML=`<p class="no-products">Connection issue. Please try again later.</p>`}}async fetchAndRenderBlogPost(e){let t=new URLSearchParams(window.location.search).get(`slug`);if(!t){e.innerHTML=this.blogPostNotFound();return}try{this.showLoading(e);let n=await fetch(`/api/blog/${encodeURIComponent(t)}?_t=${Date.now()}`);if(!n.ok){e.innerHTML=this.blogPostNotFound();return}let r=await n.json(),i=r.createdAt?new Date(r.createdAt).toLocaleDateString(`en-US`,{month:`long`,day:`numeric`,year:`numeric`}):``,a=r.author||`MRT Editorial`;e.innerHTML=`
        <a href="blog.html" class="blog-back-link">
          <span class="material-symbols-outlined" style="font-size:18px;">arrow_back</span>
          Back to Blog
        </a>
        ${r.coverImage?`<img src="${r.coverImage}" alt="${r.title}" class="blog-post-cover" onerror="this.style.display='none'">`:``}
        <div class="blog-post-meta">
          <span>${a}</span>
          ${i?`<span>·</span><span>${i}</span>`:``}
        </div>
        <h1 class="blog-post-title">${r.title}</h1>
        <article class="blog-post-body">
          ${r.content||`<p>${r.excerpt||``}</p>`}
        </article>
      `,document.title=`${r.title} | MRT International`}catch(t){console.error(`Blog Post Fetch Error:`,t),e.innerHTML=`<p class="no-products">Connection issue. Please try again later.</p>`}}blogPostNotFound(){return`
      <a href="blog.html" class="blog-back-link">
        <span class="material-symbols-outlined" style="font-size:18px;">arrow_back</span>
        Back to Blog
      </a>
      <h1 class="blog-post-title">Article Not Found</h1>
      <div class="blog-post-body">
        <p>This article is unavailable or has not been published yet.</p>
      </div>
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
    `}};document.addEventListener(`DOMContentLoaded`,()=>{new e});