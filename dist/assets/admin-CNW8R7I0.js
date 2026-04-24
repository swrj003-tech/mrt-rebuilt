import"./modulepreload-polyfill-EeOZK34R.js";var e=`/api`,t=localStorage.getItem(`mrt_admin_token`),n=`dashboard`;async function r(n,r={}){let i={"Content-Type":`application/json`};t&&(i.Authorization=`Bearer ${t}`);let a=n,s=n.includes(`/products`)||n.includes(`/categories`)||n.includes(`/stats`)||n.includes(`/reviews`)||n.includes(`/messages`);(!r.method||r.method===`GET`)&&s&&(a+=(n.includes(`?`)?`&`:`?`)+`_t=${Date.now()}`);try{let t=await fetch(`${e}${a}`,{...r,headers:i});if(t.status===401)return o(),null;if(t.status===204)return{success:!0};if(t.headers.get(`content-length`)===`0`)return t.ok?{success:!0}:{error:`Request failed`};let n=await t.text();if(!n||n.trim()===``)return t.ok?{success:!0}:{error:`Empty response`};let s;try{s=JSON.parse(n)}catch{return t.ok?{success:!0}:{error:n}}return t.ok||console.error(`API Error [${t.status}]:`,s),s}catch(e){return console.error(`API Fetch Error [${n}]:`,e),{error:`Network or parse error`}}}function i(e,t=`success`){document.querySelectorAll(`.toast`).forEach(e=>e.remove());let n=document.createElement(`div`);n.className=`toast ${t}`,n.innerHTML=`<span class="material-symbols-outlined">${t===`success`?`check_circle`:`error`}</span> ${e}`,document.body.appendChild(n),setTimeout(()=>n.remove(),3200)}function a(e){n=e,s()}function o(){t=null,localStorage.removeItem(`mrt_admin_token`),s()}function s(){let e=document.getElementById(`app`);if(!t){c(e);return}l(e)}function c(e){e.innerHTML=`
    <div class="login-container">
      <div class="login-card">
        <h1>MRT Admin</h1>
        <p>Sign in to manage your affiliate platform</p>
        <form id="login-form">
          <div class="form-group">
            <label>Email</label>
            <input type="email" id="login-email" placeholder="admin@example.com" required autocomplete="email">
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" id="login-password" placeholder="••••••••" required autocomplete="current-password">
          </div>
          <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;padding:0.875rem;">
            <span class="material-symbols-outlined">login</span> Sign In
          </button>
        </form>
      </div>
    </div>
  `,document.getElementById(`login-form`).addEventListener(`submit`,async e=>{e.preventDefault();let n=document.getElementById(`login-email`).value,a=document.getElementById(`login-password`).value,o=e.target.querySelector(`button[type="submit"]`);o.disabled=!0,o.innerHTML=`<div class="loading-spinner"></div>`;try{let e=await r(`/auth/login`,{method:`POST`,body:JSON.stringify({email:n,password:a})});e?.token?(t=e.token,localStorage.setItem(`mrt_admin_token`,t),i(`Welcome back!`),s()):(i(e?.error||`Login failed`,`error`),o.disabled=!1,o.innerHTML=`<span class="material-symbols-outlined">login</span> Sign In`)}catch{i(`Connection error`,`error`),o.disabled=!1,o.innerHTML=`<span class="material-symbols-outlined">login</span> Sign In`}})}function l(e){if(e.querySelector(`.admin-layout`)){u(),d();return}e.innerHTML=`
    <div class="admin-layout">
      <div class="admin-overlay" id="admin-overlay"></div>
      <button class="mobile-nav-toggle" id="mobile-nav-toggle" aria-label="Toggle Menu">
        <span class="material-symbols-outlined">menu</span>
      </button>
      <aside class="admin-sidebar" id="admin-sidebar"></aside>
      <main class="main-content" id="main-content"></main>
    </div>
  `,u(),d();let t=document.getElementById(`mobile-nav-toggle`),n=document.getElementById(`admin-overlay`),r=document.getElementById(`admin-sidebar`);t&&t.addEventListener(`click`,()=>{r.classList.toggle(`show`),n.classList.toggle(`show`)}),n&&n.addEventListener(`click`,()=>{r.classList.remove(`show`),n.classList.remove(`show`)})}function u(){let e=document.getElementById(`admin-sidebar`);e&&(e.innerHTML=`
    <div class="sidebar-logo">
      <div class="logo-icon">M</div>
      <span>MRT Admin</span>
    </div>
    <div class="sidebar-section">
      <div class="sidebar-section-title">Overview</div>
      <a class="nav-item ${n===`dashboard`?`active`:``}" data-view="dashboard">
        <span class="material-symbols-outlined">dashboard</span> Dashboard
      </a>
      <a class="nav-item ${n===`analytics`?`active`:``}" data-view="analytics">
        <span class="material-symbols-outlined">analytics</span> Analytics
      </a>
    </div>
    <div class="sidebar-section">
      <div class="sidebar-section-title">Content</div>
      <a class="nav-item ${n===`blog`?`active`:``}" data-view="blog">
        <span class="material-symbols-outlined">article</span> Blog
      </a>
      <a class="nav-item ${n===`products`?`active`:``}" data-view="products">
        <span class="material-symbols-outlined">inventory_2</span> Products
      </a>
      <a class="nav-item ${n===`categories`?`active`:``}" data-view="categories">
        <span class="material-symbols-outlined">category</span> Categories
      </a>
      <a class="nav-item ${n===`reviews`?`active`:``}" data-view="reviews">
        <span class="material-symbols-outlined">rate_review</span> Reviews
      </a>
      <a class="nav-item ${n===`testimonials`?`active`:``}" data-view="testimonials">
        <span class="material-symbols-outlined">reviews</span> Testimonials
      </a>
    </div>
    <div class="sidebar-section">
      <div class="sidebar-section-title">Marketing</div>
      <a class="nav-item ${n===`messages`?`active`:``}" data-view="messages">
        <span class="material-symbols-outlined">forum</span> Messages
      </a>
      <a class="nav-item ${n===`newsletter`?`active`:``}" data-view="newsletter">
        <span class="material-symbols-outlined">mail</span> Newsletter
      </a>
    </div>
    <div class="sidebar-section" style="margin-top:auto;padding-top:1rem;border-top:1px solid var(--border);">
      <a class="nav-item" data-view="logout">
        <span class="material-symbols-outlined">logout</span> Sign Out
      </a>
      <a class="nav-item" href="/" target="_blank">
        <span class="material-symbols-outlined">open_in_new</span> View Site
      </a>
    </div>
  `,e.querySelectorAll(`.nav-item[data-view]`).forEach(t=>{t.addEventListener(`click`,()=>{let n=t.dataset.view;if(n===`logout`){o();return}a(n),e.classList.remove(`show`);let r=document.getElementById(`admin-overlay`);r&&r.classList.remove(`show`)})}))}async function d(){let e=document.getElementById(`main-content`);if(!e)return;let t=document.getElementById(`view-${n}`);switch(t||(t=document.createElement(`div`),t.id=`view-${n}`,t.className=`view-container`,e.appendChild(t)),document.querySelectorAll(`.view-container`).forEach(e=>e.style.display=`none`),t.style.display=`block`,t.innerHTML=`<div class="text-center mt-2"><div class="loading-spinner"></div></div>`,n){case`dashboard`:await f(t);break;case`blog`:await _(t);break;case`products`:await p(t);break;case`categories`:await h(t);break;case`testimonials`:await y(t);break;case`analytics`:await C(t);break;case`reviews`:await w(t);break;case`messages`:await S(t);break;case`newsletter`:await b(t);break;default:await f(t)}}async function f(e){let t=await r(`/admin/stats`);t&&(e.innerHTML=`
    <div class="page-header">
      <div><h2>Dashboard</h2><div class="subtitle">Welcome to MRT International Admin</div></div>
    </div>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon"><span class="material-symbols-outlined">inventory_2</span></div>
        <div class="stat-label">Total Products</div>
        <div class="stat-value">${t.productCount||0}</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><span class="material-symbols-outlined">category</span></div>
        <div class="stat-label">Categories</div>
        <div class="stat-value">${t.categoryCount||0}</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><span class="material-symbols-outlined">ads_click</span></div>
        <div class="stat-label">Affiliate Clicks</div>
        <div class="stat-value">${t.clickCount||0}</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><span class="material-symbols-outlined">mail</span></div>
        <div class="stat-label">Subscribers</div>
        <div class="stat-value">${t.subscriberCount||0}</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><span class="material-symbols-outlined">forum</span></div>
        <div class="stat-label">Messages</div>
        <div class="stat-value">${t.messageCount||0}</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><span class="material-symbols-outlined">reviews</span></div>
        <div class="stat-label">Testimonials</div>
        <div class="stat-value">${t.testimonialCount||0}</div>
      </div>
    </div>
    <div class="table-container">
      <div class="table-header">
        <h3>Recent Activity</h3>
      </div>
      <table>
        <thead><tr><th>Product</th><th>Event</th><th>Time</th></tr></thead>
        <tbody>
          ${(t.recentClicks||[]).map(e=>`
            <tr>
              <td>
                <div class="flex gap-1" style="align-items:center">
                  <img src="${e.productImage||e.product?.image||`/assets/placeholder.png`}" class="product-thumb" alt="" onerror="this.src='/assets/placeholder.png'">
                  <span>${e.productName||e.product?.name||`Unknown`}</span>
                </div>
              </td>
              <td><span class="badge badge-info">Affiliate Click</span></td>
              <td class="text-muted text-sm">${new Date(e.clickedAt||e.createdAt).toLocaleString()}</td>
            </tr>
          `).join(``)||`<tr><td colspan="3" class="text-center text-muted" style="padding:2rem">No recent activity</td></tr>`}
        </tbody>
      </table>
    </div>
  `)}async function p(e){let t=await r(`/products`),n=await r(`/categories`);if(!t)return;let a=t.products||[];window._allProducts=a,e.innerHTML=`
    <div class="page-header">
      <div><h2>Products</h2><div class="subtitle">${t.total||0} products total</div></div>
      <button class="btn btn-primary" id="btn-add-product"><span class="material-symbols-outlined">add</span> Add Product</button>
    </div>
    <div class="table-container">
      <table>
        <thead><tr><th></th><th>Name</th><th class="hide-xs">Category</th><th class="hide-xs">Price</th><th class="hide-sm">Badge</th><th class="hide-sm">Rating</th><th>Actions</th></tr></thead>
        <tbody>
          ${a.map(e=>`
            <tr>
              <td><img src="${e.image||`/assets/placeholder.png`}" class="product-thumb" alt="${e.name}" onerror="this.src='/assets/placeholder.png'"></td>
              <td>
                <strong>${e.name}</strong>
                <br><span class="text-muted text-sm">${e.slug}</span>
                <div class="mobile-meta hide-desktop">
                  <span class="badge badge-info" style="margin-right:4px">${e.category?.name||e.categoryId}</span>
                  <span style="font-size:0.8rem;color:var(--accent)">$${e.price}</span>
                </div>
              </td>
              <td class="hide-xs"><span class="badge badge-info">${e.category?.name||e.categoryId}</span></td>
              <td class="hide-xs">
                ${e.price?`<span style="font-weight:700">${{USD:`$`,INR:`₹`,AED:`د.إ`,EUR:`€`,GBP:`£`,SAR:`﷼`,JPY:`¥`,CAD:`CA$`,AUD:`A$`,SGD:`S$`}[e.currency]||`$`}${e.price}</span>
                     ${e.originalPrice&&e.originalPrice>e.price?`<br><span style="font-size:0.75rem;text-decoration:line-through;opacity:0.45">${{USD:`$`,INR:`₹`,AED:`د.إ`,EUR:`€`,GBP:`£`,SAR:`﷼`,JPY:`¥`,CAD:`CA$`,AUD:`A$`,SGD:`S$`}[e.currency]||`$`}${e.originalPrice}</span>`:``}`:`<span style="opacity:0.5;font-size:0.8rem">Ask for price</span>`}
              </td>
              <td class="hide-sm"><span class="badge badge-warning">${e.badge||`-`}</span></td>
              <td class="hide-sm">${e.ratingValue||`-`}</td>
              <td>
                <div class="action-btns">
                  <button class="btn btn-sm btn-secondary btn-edit-product" data-id="${e.id}" title="Edit"><span class="material-symbols-outlined">edit</span></button>
                  <button class="btn btn-sm btn-danger btn-delete-product" data-id="${e.id}" title="Delete"><span class="material-symbols-outlined">delete</span></button>
                </div>
              </td>
            </tr>
          `).join(``)}
        </tbody>
      </table>
    </div>
  `,document.querySelectorAll(`.btn-edit-product`).forEach(e=>{e.addEventListener(`click`,t=>{t.preventDefault();let r=e.dataset.id,o=a.find(e=>String(e.id)===String(r));o?m(o,n):i(`Product not found in current list`,`error`)})}),document.querySelectorAll(`.btn-delete-product`).forEach(e=>{e.addEventListener(`click`,async t=>{t.preventDefault();let n=e.dataset.id;if(!confirm(`Are you sure you want to delete this product?`))return;let a=await r(`/products/${n}`,{method:`DELETE`});if(a?.error)return i(`Delete failed: `+a.error,`error`);i(`Product deleted`),d()})}),document.getElementById(`btn-add-product`)?.addEventListener(`click`,()=>{m(null,n)})}function m(e,t){let n=!!e,a=document.createElement(`div`);a.className=`modal-overlay`,a.innerHTML=`
    <div class="modal">
      <div class="modal-header">
        <h3>${n?`Edit Product`:`Add Product`}</h3>
        <button class="modal-close-btn" id="modal-close-x" type="button">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
      <form id="product-form">
        <div class="form-group">
          <label>Name</label>
          <input type="text" name="name" value="${e?.name||``}" required placeholder="Product name">
        </div>

        <!-- PRICING SECTION -->
        <h4 class="section-divider">Pricing & Currency</h4>
        <div class="grid-2">
          <div class="form-group">
            <label>Currency</label>
            <select name="currency">
              <option value="USD" ${(e?.currency||`USD`)===`USD`?`selected`:``}>$ USD — US Dollar</option>
              <option value="INR" ${e?.currency===`INR`?`selected`:``}>₹ INR — Indian Rupee</option>
              <option value="AED" ${e?.currency===`AED`?`selected`:``}>د.إ AED — UAE Dirham</option>
              <option value="EUR" ${e?.currency===`EUR`?`selected`:``}>€ EUR — Euro</option>
              <option value="GBP" ${e?.currency===`GBP`?`selected`:``}>£ GBP — British Pound</option>
              <option value="SAR" ${e?.currency===`SAR`?`selected`:``}>﷼ SAR — Saudi Riyal</option>
              <option value="JPY" ${e?.currency===`JPY`?`selected`:``}>¥ JPY — Japanese Yen</option>
              <option value="CAD" ${e?.currency===`CAD`?`selected`:``}>CA$ CAD — Canadian Dollar</option>
              <option value="AUD" ${e?.currency===`AUD`?`selected`:``}>A$ AUD — Australian Dollar</option>
              <option value="SGD" ${e?.currency===`SGD`?`selected`:``}>S$ SGD — Singapore Dollar</option>
            </select>
          </div>
          <div class="form-group">
            <label>Sale Price <span style="opacity:0.5;font-weight:400">(leave blank = "Ask for price")</span></label>
            <input type="number" name="price" value="${e?.price||``}" step="0.01" min="0" placeholder="0.00" id="sale-price-input">
          </div>
        </div>
        <div class="grid-2">
          <div class="form-group">
            <label>Original Price <span style="opacity:0.5;font-weight:400">(for discount — optional)</span></label>
            <input type="number" name="originalPrice" value="${e?.originalPrice||``}" step="0.01" min="0" placeholder="Higher original price" id="original-price-input">
          </div>
          <div class="form-group">
            <label>Discount Preview</label>
            <div id="discount-preview" style="padding:0.75rem 1rem;background:var(--bg-secondary);border:1px solid var(--border);border-radius:var(--radius-md);font-size:0.875rem;color:var(--text-secondary);min-height:44px;display:flex;align-items:center">
              —
            </div>
          </div>
        </div>

        <div class="grid-2">
          <div class="form-group">
            <label>Category</label>
            <select name="categoryId" required>
              ${(t||[]).map(t=>`<option value="${t.id}" ${e?.categoryId===t.id?`selected`:``}>${t.name}</option>`).join(``)}
            </select>
          </div>
          <div class="form-group">
            <label>Badge</label>
            <select name="badge">
              <option value="">None</option>
              <option value="Top Pick" ${e?.badge===`Top Pick`?`selected`:``}>Top Pick</option>
              <option value="Trending Now" ${e?.badge===`Trending Now`?`selected`:``}>Trending Now</option>
              <option value="Editor's Choice" ${e?.badge===`Editor's Choice`?`selected`:``}>Editor's Choice</option>
              <option value="Best Deal" ${e?.badge===`Best Deal`?`selected`:``}>Best Deal</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label>Short Description</label>
          <input type="text" name="shortDescription" value="${e?.shortDescription||``}" placeholder="One-line selling point">
        </div>

        <!-- ENHANCED IMAGE SECTION with URL Fetch + Upload -->
        <div class="form-group">
          <label>Image</label>
          <div class="image-section">
            <div class="image-url-row">
              <input type="text" name="image" id="product-image-path" value="${e?.image||``}" placeholder="https://example.com/image.jpg or /assets/uploads/image.jpg">
              <button type="button" class="btn btn-secondary btn-sm" id="btn-fetch-image" title="Preview image from URL">
                <span class="material-symbols-outlined">preview</span>
                <span class="btn-label">Preview</span>
              </button>
            </div>
            <div id="image-preview-wrap" style="display:none;margin:0.5rem 0;">
              <img id="preview-img" style="max-height:90px;max-width:180px;border-radius:8px;border:1px solid var(--border);object-fit:contain;background:var(--bg-secondary);" alt="Preview">
            </div>
            <div id="product-dropzone" class="dropzone dropzone-wide">
              <span class="material-symbols-outlined">upload_file</span>
              <span>Or drag &amp; drop / click to upload a file</span>
            </div>
          </div>
        </div>

        <div class="grid-2">
          <div class="form-group">
            <label>Affiliate URL</label>
            <input type="url" name="affiliateUrl" value="${e?.affiliateUrl||``}" placeholder="https://amazon.com/...">
          </div>
          <div class="form-group">
            <label>Rating Value</label>
            <input type="number" name="ratingValue" value="${e?.ratingValue||``}" step="0.1" max="5" placeholder="4.8">
          </div>
        </div>
        <div class="form-group">
          <label>Key Benefits (one per line)</label>
          <textarea name="keyBenefits" placeholder="Fast charging&#10;Compact design&#10;Universal compatibility">${(e?.keyBenefits||[]).join(`
`)}</textarea>
        </div>

        <div class="modal-actions">
          <button type="button" class="btn btn-secondary" id="modal-cancel">Cancel</button>
          <button type="submit" class="btn btn-primary" id="modal-submit">
            <span class="material-symbols-outlined">${n?`save`:`add_circle`}</span>
            ${n?`Update`:`Create`} Product
          </button>
        </div>
      </form>
    </div>
  `,document.body.appendChild(a),a.querySelector(`#modal-cancel`).addEventListener(`click`,()=>a.remove()),a.querySelector(`#modal-close-x`).addEventListener(`click`,()=>a.remove()),a.addEventListener(`click`,e=>{e.target===a&&a.remove()});let o=a.querySelector(`#product-image-path`),s=a.querySelector(`#image-preview-wrap`),c=a.querySelector(`#preview-img`);a.querySelector(`#btn-fetch-image`).addEventListener(`click`,()=>{let e=o.value.trim();if(!e){i(`Enter an image URL first`,`error`);return}c.src=e,c.onerror=()=>{i(`Could not load image — check URL or CORS policy`,`error`),s.style.display=`none`},c.onload=()=>{s.style.display=`block`,i(`Image preview loaded`)}}),e?.image&&(c.src=e.image,c.onload=()=>{s.style.display=`block`}),T(a.querySelector(`#product-dropzone`),e=>{o.value=e,c.src=e,c.onload=()=>{s.style.display=`block`},i(`Image uploaded successfully`)});let l=a.querySelector(`#sale-price-input`),u=a.querySelector(`#original-price-input`),f=a.querySelector(`#discount-preview`);function p(){let e=parseFloat(l?.value)||0,t=parseFloat(u?.value)||0;f&&(e>0&&t>e?f.innerHTML=`<span style="color:var(--success);font-weight:700;font-size:1rem">${Math.round((1-e/t)*100)}% OFF</span>&nbsp;<span style="color:var(--text-muted)">· Save ${(t-e).toFixed(2)}</span>`:e>0&&t>0&&t<=e?f.innerHTML=`<span style="color:var(--warning)">Original price must be higher than sale price</span>`:e===0?f.innerHTML=`<span style="color:var(--accent)">"Ask for price" card shown to visitors</span>`:f.innerHTML=`<span style="color:var(--text-muted)">Set Original Price above to show discount</span>`)}l?.addEventListener(`input`,p),u?.addEventListener(`input`,p),p(),a.querySelector(`#product-form`).addEventListener(`submit`,async t=>{t.preventDefault();let o=a.querySelector(`#modal-submit`);o.disabled=!0,o.innerHTML=`<div class="loading-spinner" style="width:16px;height:16px"></div> Saving...`;let s=new FormData(t.target),c=Object.fromEntries(s.entries());c.keyBenefits=c.keyBenefits.split(`
`).filter(Boolean),c.price=c.price?parseFloat(c.price):null,c.originalPrice=c.originalPrice?parseFloat(c.originalPrice):null,c.ratingValue=parseFloat(c.ratingValue)||0,c.currency=c.currency||`USD`;let l;if(n){if(l=await r(`/products/${e.id}`,{method:`PUT`,body:JSON.stringify(c)}),l?.error){i(l.error,`error`),o.disabled=!1,o.innerHTML=`<span class="material-symbols-outlined">save</span> Update Product`;return}i(`Product updated`)}else{if(l=await r(`/products`,{method:`POST`,body:JSON.stringify(c)}),l?.error){i(l.error,`error`),o.disabled=!1,o.innerHTML=`<span class="material-symbols-outlined">add_circle</span> Create Product`;return}i(`Product created`)}a.remove(),setTimeout(()=>d(),100)})}async function h(e){let t=await r(`/categories`);t&&(e.innerHTML=`
    <div class="page-header">
      <div><h2>Categories</h2><div class="subtitle">${t.length} categories</div></div>
      <button class="btn btn-primary" id="btn-add-cat"><span class="material-symbols-outlined">add</span> Add Category</button>
    </div>
    <div class="table-container">
      <table>
        <thead><tr><th>Name</th><th class="hide-xs">Slug</th><th>Products</th><th class="hide-sm">Theme</th><th>Actions</th></tr></thead>
        <tbody>
          ${t.map(e=>`
            <tr>
              <td><strong>${e.name}</strong></td>
              <td class="text-muted hide-xs">${e.slug}</td>
              <td><span class="badge badge-info">${e._count?.products||0}</span></td>
              <td class="hide-sm"><span style="display:inline-block;width:20px;height:20px;border-radius:50%;background:${e.theme?.primary||`#999`};vertical-align:middle"></span></td>
              <td>
                <div class="action-btns">
                  <button class="btn btn-sm btn-secondary btn-edit-cat" data-id="${e.id}" title="Edit"><span class="material-symbols-outlined">edit</span></button>
                  <button class="btn btn-sm btn-danger btn-delete-cat" data-id="${e.id}" title="Delete"><span class="material-symbols-outlined">delete</span></button>
                </div>
              </td>
            </tr>
          `).join(``)}
        </tbody>
      </table>
    </div>
  `,document.getElementById(`btn-add-cat`)?.addEventListener(`click`,()=>g(null)),document.querySelectorAll(`.btn-edit-cat`).forEach(e=>e.addEventListener(`click`,()=>{let n=t.find(t=>String(t.id)===String(e.dataset.id));n&&g(n)})),document.querySelectorAll(`.btn-delete-cat`).forEach(e=>e.addEventListener(`click`,async()=>{if(!confirm(`Delete this category? This will also remove all associated products.`))return;let t=e.dataset.id;e.disabled=!0,e.innerHTML=`<div class="loading-spinner" style="width:14px;height:14px"></div>`;let n=await r(`/categories/${t}`,{method:`DELETE`});if(n?.error){i(`Delete failed: `+n.error,`error`),e.disabled=!1,e.innerHTML=`<span class="material-symbols-outlined">delete</span>`;return}i(`Category deleted`),await d()})))}function g(e){let t=!!e,n=document.createElement(`div`);n.className=`modal-overlay`,n.innerHTML=`
    <div class="modal">
      <div class="modal-header">
        <h3>${t?`Edit Category`:`Add Category`}</h3>
        <button class="modal-close-btn" id="modal-close-x" type="button">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
      <form id="cat-form">
        <div class="grid-2">
          <div class="form-group"><label>Name</label><input type="text" name="name" value="${e?.name||``}" required placeholder="Category name"></div>
          <div class="form-group"><label>Slug</label><input type="text" name="slug" value="${e?.slug||``}" placeholder="auto-generated"></div>
        </div>
        <div class="form-group">
          <label>Image & Media</label>
          <div class="image-section">
            <div class="image-url-row">
              <input type="text" name="image" id="cat-image-path" value="${e?.image||``}" placeholder="https://example.com/image.jpg or /assets/uploads/image.jpg">
              <button type="button" class="btn btn-secondary btn-sm" id="btn-fetch-cat-image" title="Preview image from URL">
                <span class="material-symbols-outlined">preview</span>
                <span class="btn-label">Preview</span>
              </button>
            </div>
            <div id="cat-image-preview-wrap" style="display:none;margin:0.5rem 0;">
              <img id="cat-preview-img" style="max-height:80px;max-width:160px;border-radius:8px;border:1px solid var(--border);object-fit:contain;background:var(--bg-secondary);" alt="Preview">
            </div>
            <div id="cat-dropzone" class="dropzone dropzone-wide">
              <span class="material-symbols-outlined">upload_file</span>
              <span>Or drag &amp; drop / click to upload</span>
            </div>
          </div>
        </div>
        <div class="form-group"><label>Description</label><textarea name="description" placeholder="Category description...">${e?.description||``}</textarea></div>
        <h4 class="section-divider">Theme</h4>
        <div class="grid-2">
          <div class="form-group"><label>Primary Color</label><input type="text" name="primary" value="${e?.theme?.primary||`#914d00`}" placeholder="#914d00"></div>
          <div class="form-group"><label>Secondary Color</label><input type="text" name="secondary" value="${e?.theme?.secondary||`#f28c28`}" placeholder="#f28c28"></div>
        </div>
        <div class="grid-2">
          <div class="form-group"><label>Theme Title</label><input type="text" name="title" value="${e?.theme?.title||``}" placeholder="Category title"></div>
          <div class="form-group"><label>Subtitle</label><input type="text" name="subtitle" value="${e?.theme?.subtitle||``}" placeholder="Category subtitle"></div>
        </div>
        <h4 class="section-divider">SEO</h4>
        <div class="form-group"><label>SEO Title</label><input type="text" name="seoTitle" value="${e?.theme?.seoTitle||``}"></div>
        <div class="form-group"><label>SEO Intro</label><textarea name="seoIntro" placeholder="SEO-friendly intro text...">${e?.theme?.seoIntro||``}</textarea></div>
        <div class="modal-actions">
          <button type="button" class="btn btn-secondary" id="modal-cancel">Cancel</button>
          <button type="submit" class="btn btn-primary">${t?`Update`:`Create`} Category</button>
        </div>
      </form>
    </div>
  `,document.body.appendChild(n),n.querySelector(`#modal-cancel`).addEventListener(`click`,()=>n.remove()),n.querySelector(`#modal-close-x`).addEventListener(`click`,()=>n.remove()),n.addEventListener(`click`,e=>{e.target===n&&n.remove()});let a=n.querySelector(`#cat-image-path`),o=n.querySelector(`#cat-image-preview-wrap`),s=n.querySelector(`#cat-preview-img`);n.querySelector(`#btn-fetch-cat-image`).addEventListener(`click`,()=>{let e=a.value.trim();if(!e){i(`Enter an image URL first`,`error`);return}s.src=e,s.onerror=()=>{i(`Could not load image from URL`,`error`),o.style.display=`none`},s.onload=()=>{o.style.display=`block`,i(`Image preview loaded`)}}),e?.image&&(s.src=e.image,s.onload=()=>{o.style.display=`block`}),T(n.querySelector(`#cat-dropzone`),e=>{a.value=e,s.src=e,s.onload=()=>{o.style.display=`block`},i(`Category image uploaded`)}),n.querySelector(`#cat-form`).addEventListener(`submit`,async a=>{a.preventDefault();let o=new FormData(a.target),s=Object.fromEntries(o.entries()),c={name:s.name,slug:s.slug,image:s.image,description:s.description,theme:{primary:s.primary,secondary:s.secondary,title:s.title||s.name,subtitle:s.subtitle,seoTitle:s.seoTitle,seoIntro:s.seoIntro}};t?(await r(`/categories/${e.id}`,{method:`PUT`,body:JSON.stringify(c)}),i(`Category updated`)):(await r(`/categories`,{method:`POST`,body:JSON.stringify(c)}),i(`Category created`)),n.remove(),d()})}async function _(e){let t=await r(`/blog/admin/all`);t&&(e.innerHTML=`
    <div class="page-header">
      <div><h2>Blog Posts</h2><div class="subtitle">${t.length} posts total</div></div>
      <button class="btn btn-primary" id="btn-add-blog"><span class="material-symbols-outlined">add</span> Add Post</button>
    </div>
    <div class="admin-blog-list">
      ${t.map(e=>`
        <div class="admin-blog-card">
          <div class="admin-blog-img">
            <img src="${e.coverImage||``}" alt="" onerror="this.style.opacity='0.2'">
          </div>
          <div class="admin-blog-content">
            <div class="admin-blog-main">
              <div class="admin-blog-info">
                <h3 class="admin-blog-title">${e.title}</h3>
                <div class="admin-blog-meta">
                  <span class="badge ${e.isPublished?`badge-success`:`badge-warning`}">${e.isPublished?`Published`:`Draft`}</span>
                  <span class="text-muted text-sm">${new Date(e.createdAt).toLocaleDateString()}</span>
                  <span class="text-muted text-sm">· By ${e.author}</span>
                </div>
                <p class="admin-blog-excerpt">${e.content?e.content.replace(/<[^>]*>?/gm,``):e.excerpt||`No content provided.`}</p>
              </div>
              <div class="action-btns">
                <button class="btn btn-sm btn-secondary btn-edit-blog" data-id="${e.id}" title="Edit"><span class="material-symbols-outlined">edit</span> <span class="btn-label">Edit</span></button>
                <button class="btn btn-sm btn-danger btn-delete-blog" data-id="${e.id}" title="Delete"><span class="material-symbols-outlined">delete</span></button>
              </div>
            </div>
          </div>
        </div>
      `).join(``)||`<div class="text-center text-muted" style="padding:4rem">No posts yet</div>`}
    </div>
  `,document.getElementById(`btn-add-blog`)?.addEventListener(`click`,()=>v(null)),document.querySelectorAll(`.btn-edit-blog`).forEach(e=>e.addEventListener(`click`,()=>{let n=t.find(t=>String(t.id)===String(e.dataset.id));n&&v(n)})),document.querySelectorAll(`.btn-delete-blog`).forEach(e=>e.addEventListener(`click`,async()=>{if(!confirm(`Delete this blog post?`))return;e.disabled=!0,e.innerHTML=`<div class="loading-spinner" style="width:14px;height:14px"></div>`;let t=await r(`/blog/${e.dataset.id}`,{method:`DELETE`});if(t?.error){i(`Delete failed: `+t.error,`error`),e.disabled=!1,e.innerHTML=`<span class="material-symbols-outlined">delete</span>`;return}i(`Post deleted`),await d()})))}function v(e){let t=!!e,n=document.createElement(`div`);n.className=`modal-overlay`,n.innerHTML=`
    <div class="modal" style="max-width:800px; width:95%;">
      <div class="modal-header">
        <h3>${t?`Edit Blog Post`:`Add Blog Post`}</h3>
        <button class="modal-close-btn" id="modal-close-x" type="button"><span class="material-symbols-outlined">close</span></button>
      </div>
      <form id="blog-form">
        <div class="grid-2">
          <div class="form-group"><label>Title</label><input type="text" name="title" value="${e?.title||``}" required></div>
          <div class="form-group"><label>Slug</label><input type="text" name="slug" value="${e?.slug||``}" placeholder="auto-generated"></div>
        </div>
        <div class="form-group">
          <label>Cover Image URL</label>
          <input type="text" name="coverImage" value="${e?.coverImage||``}" placeholder="https://example.com/image.jpg">
        </div>
        <div class="grid-2">
          <div class="form-group"><label>Author</label><input type="text" name="author" value="${e?.author||`MRT Editorial`}"></div>
          <div class="form-group" style="display:flex;align-items:center;gap:0.5rem;padding-top:2rem">
            <input type="checkbox" id="isPublished" name="isPublished" ${e?.isPublished?`checked`:``} style="width:auto;height:auto;transform:scale(1.2)">
            <label for="isPublished" style="margin:0;font-weight:700;color:var(--ink)">Published & Visible on Site</label>
          </div>
        </div>
        <div class="form-group"><label>Excerpt</label><textarea name="excerpt" style="height:60px">${e?.excerpt||``}</textarea></div>
        <div class="form-group"><label>HTML Content</label><textarea name="content" required style="height:350px;font-family:monospace;font-size:13px">${e?.content||``}</textarea></div>
        
        <div class="modal-actions">
          <button type="button" class="btn btn-secondary" id="modal-cancel">Cancel</button>
          <button type="submit" class="btn btn-primary">${t?`Update`:`Create`} Post</button>
        </div>
      </form>
    </div>
  `,document.body.appendChild(n),n.querySelector(`#modal-cancel`).addEventListener(`click`,()=>n.remove()),n.querySelector(`#modal-close-x`).addEventListener(`click`,()=>n.remove()),n.addEventListener(`click`,e=>{e.target===n&&n.remove()}),n.querySelector(`#blog-form`).addEventListener(`submit`,async a=>{a.preventDefault();let o=new FormData(a.target),s=Object.fromEntries(o.entries());s.isPublished=a.target.querySelector(`#isPublished`).checked;let c=a.target.querySelector(`button[type="submit"]`);c.disabled=!0,c.innerHTML=`<div class="loading-spinner" style="width:16px;height:16px"></div> Saving...`;let l;if(l=t?await r(`/blog/${e.id}`,{method:`PUT`,body:JSON.stringify(s)}):await r(`/blog`,{method:`POST`,body:JSON.stringify(s)}),l?.error){i(l.error,`error`),c.disabled=!1,c.innerHTML=t?`Update Post`:`Create Post`;return}i(`Post ${t?`updated`:`created`}`),n.remove(),d()})}async function y(e){let t=await r(`/testimonials`);t&&(e.innerHTML=`
    <div class="page-header">
      <div><h2>Testimonials</h2><div class="subtitle">${t.length} reviews</div></div>
      <button class="btn btn-primary" id="btn-add-test"><span class="material-symbols-outlined">add</span> Add</button>
    </div>
    <div class="table-container">
      <table>
        <thead><tr><th>Name</th><th class="hide-xs">Location</th><th>Region</th><th class="hide-sm">Text</th><th>Actions</th></tr></thead>
        <tbody>
          ${t.map(e=>`
            <tr>
              <td><strong>${e.name}</strong></td>
              <td class="text-muted hide-xs">${e.location}</td>
              <td><span class="badge badge-info">${e.region.toUpperCase()}</span></td>
              <td class="text-sm hide-sm" style="max-width:300px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${e.text}</td>
              <td><button class="btn btn-sm btn-danger btn-del-test" data-id="${e.id}"><span class="material-symbols-outlined">delete</span></button></td>
            </tr>
          `).join(``)}
        </tbody>
      </table>
    </div>
  `,document.querySelectorAll(`.btn-del-test`).forEach(e=>e.addEventListener(`click`,async()=>{if(confirm(`Delete?`)){if((await r(`/testimonials/${e.dataset.id}`,{method:`DELETE`}))?.error){i(`Delete failed`,`error`);return}i(`Deleted`),d()}})),document.getElementById(`btn-add-test`)?.addEventListener(`click`,()=>{let e=document.createElement(`div`);e.className=`modal-overlay`,e.innerHTML=`
      <div class="modal">
        <div class="modal-header">
          <h3>Add Testimonial</h3>
          <button class="modal-close-btn" id="modal-close-x" type="button"><span class="material-symbols-outlined">close</span></button>
        </div>
        <form id="test-form">
          <div class="grid-2">
            <div class="form-group"><label>Name</label><input type="text" name="name" required placeholder="John Doe"></div>
            <div class="form-group"><label>Location</label><input type="text" name="location" required placeholder="Dubai, UAE"></div>
          </div>
          <div class="grid-2">
            <div class="form-group"><label>Region</label><select name="region"><option value="us">US</option><option value="ae">UAE</option></select></div>
            <div class="form-group"><label>Quote Title</label><input type="text" name="quote" placeholder="Great product!"></div>
          </div>
          <div class="form-group"><label>Review Text</label><textarea name="text" required placeholder="Customer's review text..."></textarea></div>
          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" id="modal-cancel">Cancel</button>
            <button type="submit" class="btn btn-primary">Create</button>
          </div>
        </form>
      </div>
    `,document.body.appendChild(e),e.querySelector(`#modal-cancel`).addEventListener(`click`,()=>e.remove()),e.querySelector(`#modal-close-x`).addEventListener(`click`,()=>e.remove()),e.addEventListener(`click`,t=>{t.target===e&&e.remove()}),e.querySelector(`#test-form`).addEventListener(`submit`,async t=>{t.preventDefault();let n=Object.fromEntries(new FormData(t.target).entries());await r(`/testimonials`,{method:`POST`,body:JSON.stringify(n)}),i(`Created`),e.remove(),d()})}))}async function b(e){let t=await r(`/newsletter/subscribers`);if(!t)return;let n=t.subscribers||t||[];e.innerHTML=`
    <div class="page-header">
      <div><h2>Newsletter</h2><div class="subtitle">${n.length} subscribers</div></div>
    </div>
    <div class="table-container">
      <table>
        <thead><tr><th>Email</th><th class="hide-xs">Date</th><th>Actions</th></tr></thead>
        <tbody>
          ${n.map(e=>`
            <tr>
              <td>${e.email}</td>
              <td class="text-muted text-sm hide-xs">${new Date(e.createdAt||e.date).toLocaleDateString()}</td>
              <td><button class="btn btn-sm btn-danger btn-del-sub" data-id="${e.id}"><span class="material-symbols-outlined">delete</span></button></td>
            </tr>
          `).join(``)||`<tr><td colspan="3" class="text-center text-muted" style="padding:2rem">No subscribers yet</td></tr>`}
        </tbody>
      </table>
    </div>
  `,document.querySelectorAll(`.btn-del-sub`).forEach(e=>e.addEventListener(`click`,async()=>{if(confirm(`Remove subscriber?`)){if((await r(`/newsletter/subscribers/${e.dataset.id}`,{method:`DELETE`}))?.error){i(`Remove failed`,`error`);return}i(`Subscriber removed`),d()}}))}async function x(){let e=await r(`/admin/messages`);return Array.isArray(e)?e:[]}async function S(e){let t=await x();e.innerHTML=`
    <div class="page-header">
      <div><h2>Messages</h2><div class="subtitle">${t.length} contact submissions</div></div>
    </div>
    <div class="table-container">
      <table>
        <thead><tr><th>Name</th><th class="hide-xs">Contact</th><th class="hide-sm">Subject</th><th>Status</th><th>Date</th><th class="hide-sm">Message</th></tr></thead>
        <tbody id="messages-table-body">
          ${t.map(e=>`
            <tr>
              <td>
                <strong>${e.name}</strong>
                <br><span class="text-muted text-sm">${e.email}</span>
              </td>
              <td class="hide-xs">${e.phone||`-`}</td>
              <td class="hide-sm">${e.subject||`-`}</td>
              <td><span class="badge badge-info">${e.status||`new`}</span></td>
              <td class="text-muted text-sm">${new Date(e.createdAt).toLocaleString()}</td>
              <td class="hide-sm" style="max-width:320px;white-space:normal;line-height:1.5">${e.message}</td>
            </tr>
          `).join(``)||`<tr><td colspan="6" class="text-center text-muted" style="padding:2rem">No messages yet</td></tr>`}
        </tbody>
      </table>
    </div>
  `}async function C(e){let t=await r(`/admin/analytics`),n=await r(`/admin/stats`);!t||!n||(e.innerHTML=`
    <div class="page-header">
      <div><h2>Analytics</h2><div class="subtitle">Platform performance & engagement metrics</div></div>
    </div>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon"><span class="material-symbols-outlined">ads_click</span></div>
        <div class="stat-label">Total Affiliate Clicks</div>
        <div class="stat-value">${n.clickCount||0}</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><span class="material-symbols-outlined">rate_review</span></div>
        <div class="stat-label">Product Reviews</div>
        <div class="stat-value">${n.reviewCount||0}</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><span class="material-symbols-outlined">mail</span></div>
        <div class="stat-label">Conversion Rate</div>
        <div class="stat-value">${(n.clickCount/(n.productCount||1)*100).toFixed(1)}%</div>
      </div>
    </div>

    <div class="stat-card" style="margin-bottom:1.5rem">
      <h3 style="font-size:1rem;opacity:0.6;margin-bottom:1.5rem">Category Distribution</h3>
      <div class="chart-container" style="height:200px;display:flex;align-items:flex-end;gap:1rem;padding-bottom:1rem;border-bottom:1px solid var(--border);overflow-x:auto">
        ${(t.categoryDistribution||[]).map(e=>`
          <div class="chart-bar-group" style="flex:1;min-width:40px;display:flex;flex-direction:column;align-items:center;gap:0.5rem">
            <div class="chart-bar" style="width:100%;background:var(--primary);height:${e._count/(n.productCount||1)*180}px;border-radius:4px 4px 0 0;min-height:4px;transition:height 1s ease"></div>
            <span style="font-size:9px;text-transform:uppercase;letter-spacing:-0.02em;opacity:0.4;text-align:center;width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${e.categoryId}</span>
          </div>
        `).join(``)}
      </div>
    </div>

    <div class="table-container">
      <div class="table-header"><h3>Click Stream (Recent)</h3></div>
      <table>
        <thead><tr><th>Product</th><th class="hide-xs">Source</th><th class="hide-sm">User Agent</th><th>Time</th></tr></thead>
        <tbody>
          ${(t.clicks||[]).slice(0,10).map(e=>`
            <tr>
              <td><strong>${e.product?.name||`Unknown`}</strong></td>
              <td class="hide-xs"><span class="badge badge-info">${e.source||`Direct`}</span></td>
              <td class="text-xs hide-sm" style="opacity:0.5;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${e.userAgent||`-`}</td>
              <td class="text-xs">${new Date(e.clickedAt||e.createdAt).toLocaleString()}</td>
            </tr>
          `).join(``)||`<tr><td colspan="4" class="text-center text-muted" style="padding:2rem">No clicks recorded</td></tr>`}
        </tbody>
      </table>
    </div>
  `)}async function w(e){let t=await r(`/admin/reviews`);t&&(e.innerHTML=`
    <div class="page-header">
      <div><h2>Reviews</h2><div class="subtitle">${t.length} customer reviews total</div></div>
    </div>
    <div class="table-container">
      <table>
        <thead><tr><th>Product</th><th class="hide-xs">User</th><th>Rating</th><th class="hide-sm">Comment</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          ${t.map(e=>`
            <tr>
              <td>
                <div style="display:flex;align-items:center;gap:0.5rem">
                  <img src="${e.product?.image||``}" class="product-thumb" style="width:30px;height:30px" onerror="this.style.opacity='0.2'">
                  <span class="text-sm font-bold">${e.product?.name||`Unknown`}</span>
                </div>
              </td>
              <td class="hide-xs"><strong>${e.userName}</strong></td>
              <td><span class="badge badge-warning">${e.rating}/5</span></td>
              <td class="text-sm hide-sm" style="font-style:italic;opacity:0.8;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${e.comment}">"${e.comment}"</td>
              <td><span class="badge ${e.isVerified?`badge-success`:`badge-info`}">${e.isVerified?`Verified`:`Pending`}</span></td>
              <td>
                <div class="action-btns">
                  ${e.isVerified?``:`<button class="btn btn-sm btn-primary btn-verify-review" data-id="${e.id}" title="Verify"><span class="material-symbols-outlined">verified</span></button>`}
                  <button class="btn btn-sm btn-danger btn-delete-review" data-id="${e.id}" title="Delete"><span class="material-symbols-outlined">delete</span></button>
                </div>
              </td>
            </tr>
          `).join(``)||`<tr><td colspan="6" class="text-center text-muted" style="padding:2rem">No reviews to manage</td></tr>`}
        </tbody>
      </table>
    </div>
  `,document.querySelectorAll(`.btn-verify-review`).forEach(e=>e.addEventListener(`click`,async()=>{await r(`/admin/reviews/${e.dataset.id}/verify`,{method:`POST`}),i(`Review verified`),d()})),document.querySelectorAll(`.btn-delete-review`).forEach(e=>e.addEventListener(`click`,async()=>{if(confirm(`Delete this review?`)){if((await r(`/reviews/${e.dataset.id}`,{method:`DELETE`}))?.error){i(`Delete failed`,`error`);return}i(`Review deleted`),d()}})))}function T(n,r){[`dragenter`,`dragover`,`dragleave`,`drop`].forEach(e=>{n.addEventListener(e,e=>{e.preventDefault(),e.stopPropagation()})}),n.addEventListener(`dragover`,()=>n.classList.add(`drag-active`)),n.addEventListener(`dragleave`,()=>n.classList.remove(`drag-active`)),n.addEventListener(`drop`,async a=>{n.classList.remove(`drag-active`);let o=Array.from(a.dataTransfer.files);if(!o.length)return;let s=new FormData;o.forEach(e=>s.append(`files`,e)),n.innerHTML=`<div class="loading-spinner"></div>`;try{let n=await(await fetch(`${e}/media/upload`,{method:`POST`,headers:{Authorization:`Bearer ${t}`},body:s})).json();n&&n[0]?r(n[0].url):i(`Upload failed`,`error`)}catch{i(`Upload error`,`error`)}finally{n.innerHTML=`<span class="material-symbols-outlined">upload_file</span><span>Upload Completed ✓</span>`}}),n.addEventListener(`click`,()=>{let a=document.createElement(`input`);a.type=`file`,a.accept=`image/*`,a.onchange=async()=>{let o=a.files[0];if(!o)return;let s=new FormData;s.append(`files`,o),n.innerHTML=`<div class="loading-spinner"></div>`;try{let n=await(await fetch(`${e}/media/upload`,{method:`POST`,headers:{Authorization:`Bearer ${t}`},body:s})).json();n&&n[0]&&r(n[0].url)}catch{i(`Upload error`,`error`)}finally{n.innerHTML=`<span class="material-symbols-outlined">upload_file</span><span>Upload Completed ✓</span>`}},a.click()})}s();