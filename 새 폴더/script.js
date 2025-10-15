/* products: 12 items, no images (icons used) */
const products = [
  {id:'p1', name:'Eco Tumbler', price:25, desc:'스테인리스 텀블러', category:'tumbler'},
  {id:'p2', name:'Reusable Bag', price:18, desc:'재사용 가방', category:'bag'},
  {id:'p3', name:'Glass Bottle', price:22, desc:'유리 물병', category:'home'},
  {id:'p4', name:'Bamboo Straw', price:5, desc:'대나무 빨대', category:'home'},
  {id:'p5', name:'Solar Charger', price:45, desc:'태양광 충전기', category:'home'},
  {id:'p6', name:'Eco Notebook', price:12, desc:'재생지 노트', category:'home'},
  {id:'p7', name:'Plant Seed Kit', price:15, desc:'씨앗 키트', category:'home'},
  {id:'p8', name:'Organic Soap', price:8, desc:'유기농 비누', category:'home'},
  {id:'p9', name:'Reusable Cup', price:20, desc:'재사용 컵', category:'tumbler'},
  {id:'p10', name:'Eco Pen', price:3, desc:'친환경 펜', category:'home'},
  {id:'p11', name:'Canvas Tote', price:18, desc:'캔버스 토트', category:'bag'},
  {id:'p12', name:'LED Lamp', price:35, desc:'에너지 절약 LED', category:'home'}
];

/* store all so filter can read */
localStorage.setItem('allProducts', JSON.stringify(products));

/* render grid safely */
function displayProducts(list){
  const grid = document.getElementById('product-grid');
  if(!grid) return;
  grid.innerHTML = ''; // clear
  list.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product';
    card.innerHTML = `
      <div class="icon" aria-hidden="true">📦</div>
      <h2>${escapeHtml(p.name)}</h2>
      <div class="price">$${p.price}</div>
      <div class="desc">${escapeHtml(p.desc)}</div>
      <div class="card-actions">
        <button class="small" onclick="viewDetails('${p.id}')">Details</button>
        <button class="primary" onclick="quickBuy('${p.id}')">Buy</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

/* defensive HTML escape */
function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])); }

/* initial load */
window.addEventListener('DOMContentLoaded', ()=>{
  const grid = document.getElementById('product-grid');
  if(grid) displayProducts(products);

  // Back-to-top visibility
  window.addEventListener('scroll', ()=>{
    const btn = document.getElementById('back-top');
    if(!btn) return;
    btn.style.display = (window.scrollY > 200) ? 'block' : 'none';
  });

  // product page load
  const pname = document.getElementById('p-name');
  if(pname){
    const raw = localStorage.getItem('selectedProduct');
    if(!raw){ window.location.href='index.html'; return; }
    const prod = JSON.parse(raw);
    document.getElementById('p-name').textContent = prod.name;
    document.getElementById('p-desc').textContent = prod.desc;
    document.getElementById('p-price').textContent = '$' + prod.price;
    document.querySelector('.back-btn')?.addEventListener('click', ()=> window.location.href='index.html');
    document.getElementById('buy-btn')?.addEventListener('click', ()=>{
      localStorage.setItem('checkoutProduct', JSON.stringify(prod));
      window.location.href = 'checkout.html';
    });
  }

  // checkout page
  const checkoutItem = document.getElementById('checkout-item');
  if(checkoutItem){
    const prod = JSON.parse(localStorage.getItem('checkoutProduct') || localStorage.getItem('selectedProduct') || 'null');
    if(!prod){ window.location.href='index.html'; return; }
    checkoutItem.textContent = `${prod.name} - $${prod.price}`;
    document.getElementById('back-to-product')?.addEventListener('click', ()=> window.location.href='product.html');
    document.getElementById('to-payment')?.addEventListener('click', ()=> window.location.href='payment.html');
  }

  // payment page
  const payItem = document.getElementById('pay-item');
  if(payItem){
    const prod = JSON.parse(localStorage.getItem('checkoutProduct') || localStorage.getItem('selectedProduct') || 'null');
    if(!prod){ window.location.href='index.html'; return; }
    payItem.textContent = `${prod.name} - $${prod.price}`;
    document.getElementById('back-to-checkout')?.addEventListener('click', ()=> window.location.href='checkout.html');
    document.getElementById('payment-form')?.addEventListener('submit', (e)=>{
      e.preventDefault();
      // simulate order id
      const orderId = 'EL' + Date.now();
      localStorage.setItem('latestOrder', JSON.stringify({orderId, product:prod}));
      window.location.href = 'success.html';
    });
  }

  // success page
  const orderItem = document.getElementById('order-item');
  if(orderItem){
    const ord = JSON.parse(localStorage.getItem('latestOrder') || 'null');
    if(!ord){ window.location.href='index.html'; return; }
    document.getElementById('order-item').textContent = ord.product.name;
    document.getElementById('order-total').textContent = '$' + ord.product.price;
    document.getElementById('order-id') && (document.getElementById('order-id').textContent = ord.orderId);
  }
});

/* actions */
function viewDetails(id){
  const prod = products.find(p=>p.id===id);
  if(!prod) return alert('상품을 찾을 수 없습니다.');
  localStorage.setItem('selectedProduct', JSON.stringify(prod));
  window.location.href = 'product.html';
}
function quickBuy(id){
  const prod = products.find(p=>p.id===id);
  localStorage.setItem('selectedProduct', JSON.stringify(prod));
  localStorage.setItem('checkoutProduct', JSON.stringify(prod));
  window.location.href = 'checkout.html';
}
function filterCategory(cat){
  if(cat==='all') displayProducts(products);
  else displayProducts(products.filter(p=>p.category===cat));
}
function scrollToProducts(){ document.getElementById('product-grid')?.scrollIntoView({behavior:'smooth'}); }
function scrollToTop(){ window.scrollTo({top:0,behavior:'smooth'}); }
