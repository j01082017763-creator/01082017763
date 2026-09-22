// HIGHZONE BIO & GARDEN Master Portal Application Engine
// Developer & System Architect for Representative 010-8201-7763

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initCart();
  initDrGreenClinic();
  initFarmTokGenerator();
  initHzpCalculator();
});

// NAVIGATION LOGIC
function initNavigation() {
  const tabs = document.querySelectorAll('.bottom-tab, .nav-link');
  
  function switchTab(targetId) {
    if (navigator.vibrate) navigator.vibrate(15);
    
    // Update contents
    document.querySelectorAll('.tab-content').forEach(panel => {
      panel.classList.remove('active');
    });
    const activePanel = document.getElementById(targetId);
    if (activePanel) activePanel.classList.add('active');

    // Update active tab buttons
    document.querySelectorAll('.bottom-tab, .nav-link').forEach(btn => {
      if (btn.getAttribute('data-target') === targetId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  tabs.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = btn.getAttribute('data-target');
      if (target) {
        switchTab(target);
        window.location.hash = target;
      }
    });
  });

  // Handle hash on load
  const currentHash = window.location.hash.replace('#', '');
  if (currentHash && document.getElementById(currentHash)) {
    switchTab(currentHash);
  }
}

// SHOPPING CART LOGIC
let cart = [];
const PRODUCTS = {
  root: { id: 'root', name: '하이존 루트 (발근촉진제)', price: 35000, img: 'assets/prod-root.png' },
  grow: { id: 'grow', name: '하이존 그로우 (생육/엽면성장)', price: 38000, img: 'assets/prod-grow.png' },
  mineral: { id: 'mineral', name: '하이존 미네랄 (광합성/미량요소)', price: 42000, img: 'assets/prod-mineral.png' },
  shield: { id: 'shield', name: '하이존 쉴드 (병충해 방어/면역)', price: 45000, img: 'assets/prod-shield.png' },
  color: { id: 'color', name: '하이존 칼라 (착색/당도증진)', price: 40000, img: 'assets/prod-color.png' },
  fifth: { id: 'fifth', name: '하이존 피프스 (토양개량/염류집적)', price: 48000, img: 'assets/prod-fifth.png' }
};

function initCart() {
  const cartBtn = document.getElementById('cartBtn');
  const cartModal = document.getElementById('cartModal');
  const closeModal = document.getElementById('closeCartModal');
  const checkoutBtn = document.getElementById('checkoutBtn');

  if (cartBtn && cartModal) {
    cartBtn.addEventListener('click', () => {
      renderCartItems();
      cartModal.style.display = 'flex';
    });
  }

  if (closeModal && cartModal) {
    closeModal.addEventListener('click', () => {
      cartModal.style.display = 'none';
    });
  }

  // Add to cart buttons
  document.querySelectorAll('.btn-add-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const prodId = btn.getAttribute('data-id');
      addToCart(prodId);
    });
  });

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        alert('장바구니가 비어 있습니다.');
        return;
      }
      let summary = cart.map(item => `${item.name} (${item.qty}개)`).join(', ');
      let total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
      
      const confirmMsg = `[주문 상담 신청]\n품목: ${summary}\n총 합계: ${total.toLocaleString()}원\n\n대표 직통 번호(010-8201-7763)로 즉시 전화 또는 문자로 상담을 연결하시겠습니까?`;
      if (confirm(confirmMsg)) {
        window.location.href = `tel:01082017763`;
      }
    });
  }
}

function addToCart(prodId) {
  const product = PRODUCTS[prodId];
  if (!product) return;

  const existing = cart.find(item => item.id === prodId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  updateCartBadge();
  if (navigator.vibrate) navigator.vibrate(20);
  
  // Quick visual toast
  const cartBtn = document.getElementById('cartBtn');
  if (cartBtn) {
    cartBtn.style.transform = 'scale(1.15)';
    setTimeout(() => { cartBtn.style.transform = 'scale(1)'; }, 200);
  }
}

function updateCartBadge() {
  const badge = document.getElementById('cartBadge');
  const count = cart.reduce((acc, item) => acc + item.qty, 0);
  if (badge) badge.textContent = count;
}

function renderCartItems() {
  const list = document.getElementById('cartList');
  const totalEl = document.getElementById('cartTotal');
  if (!list || !totalEl) return;

  if (cart.length === 0) {
    list.innerHTML = '<p style="color:#94a3b8; text-align:center; padding:30px 0;">장바구니에 담긴 상품이 없습니다.</p>';
    totalEl.textContent = '0원';
    return;
  }

  let html = '';
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.qty;
    html += `
      <div style="display:flex; align-items:center; justify-content:space-between; padding:12px 0; border-bottom:1px solid rgba(255,255,255,0.08);">
        <div>
          <div style="font-weight:700; font-size:0.95rem;">${item.name}</div>
          <div style="color:#34d399; font-size:0.85rem;">${(item.price * item.qty).toLocaleString()}원</div>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <button onclick="changeQty(${index}, -1)" style="background:#1e293b; color:#fff; border:none; width:26px; height:26px; border-radius:4px; cursor:pointer;">-</button>
          <span style="font-weight:700; font-size:0.9rem;">${item.qty}</span>
          <button onclick="changeQty(${index}, 1)" style="background:#1e293b; color:#fff; border:none; width:26px; height:26px; border-radius:4px; cursor:pointer;">+</button>
          <button onclick="removeItem(${index})" style="background:none; border:none; color:#ef4444; margin-left:8px; cursor:pointer;">✕</button>
        </div>
      </div>
    `;
  });

  list.innerHTML = html;
  totalEl.textContent = total.toLocaleString() + '원';
}

window.changeQty = function(index, delta) {
  if (!cart[index]) return;
  cart[index].qty += delta;
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }
  updateCartBadge();
  renderCartItems();
};

window.removeItem = function(index) {
  cart.splice(index, 1);
  updateCartBadge();
  renderCartItems();
};

// DOCTOR GREEN AI CLINIC
function initDrGreenClinic() {
  const btnDiagnose = document.getElementById('btnDiagnose');
  const resultBox = document.getElementById('clinicResult');

  if (btnDiagnose && resultBox) {
    btnDiagnose.addEventListener('click', () => {
      const crop = document.getElementById('clinicCrop').value;
      const symptom = document.getElementById('clinicSymptom').value;

      btnDiagnose.innerHTML = 'AI 진단 엔진 분석 중... ⏳';
      btnDiagnose.disabled = true;

      setTimeout(() => {
        btnDiagnose.innerHTML = 'AI 닥터그린 진단 시작';
        btnDiagnose.disabled = false;

        let prescription = '';
        let targetProd = 'grow';

        if (symptom === 'yellow') {
          prescription = `<strong>[진단 결과] ${crop} 엽록소 결핍 및 미량원소 결핍 증상</strong><br>광합성 효율이 저하되어 잎맥 사이 황화현상이 진행 중입니다.<br><strong>[추천 처방]</strong> <span style="color:#34d399;">하이존 미네랄 + 하이존 루트</span> 혼합 엽면 시비 권장 (희석배수 1,000배)`;
          targetProd = 'mineral';
        } else if (symptom === 'growth') {
          prescription = `<strong>[진단 결과] ${crop} 초기 뿌리 활착 저조 및 세포분열 정체</strong><br>야간 저온 또는 염류 집적으로 인해 양분 흡수가 억제되었습니다.<br><strong>[추천 처방]</strong> <span style="color:#34d399;">하이존 루트 (발근촉진) + 피프스</span> 관주 처리`;
          targetProd = 'root';
        } else if (symptom === 'pest') {
          prescription = `<strong>[진단 결과] ${crop} 곰팡이성 진균 감염 초기 단계</strong><br>잎 표면 왁스층 파괴로 병원균 침투 위험이 높습니다.<br><strong>[추천 처방]</strong> <span style="color:#34d399;">하이존 쉴드</span> 500배 희석 즉시 방제`;
          targetProd = 'shield';
        } else {
          prescription = `<strong>[진단 결과] ${crop} 칼슘/칼륨 결핍 및 조직 연약화</strong><br>생장점 팁번 및 낙과 우려가 있습니다.<br><strong>[추천 처방]</strong> <span style="color:#34d399;">하이존 칼라 + 그로우</span> 교호 시비 권장`;
          targetProd = 'color';
        }

        resultBox.innerHTML = `
          ${prescription}
          <div style="margin-top:14px;">
            <button onclick="addToCart('${targetProd}')" style="background:#10b981; color:#064e3b; border:none; padding:8px 16px; border-radius:6px; font-weight:800; cursor:pointer;">추천 비료 장바구니 담기 🛒</button>
          </div>
        `;
        resultBox.style.display = 'block';
        if (navigator.vibrate) navigator.vibrate(25);
      }, 700);
    });
  }
}

// FARM-TOK MINI-HOMEPAGE CREATOR
function initFarmTokGenerator() {
  const farmNameInput = document.getElementById('ftFarmName');
  const ownerInput = document.getElementById('ftOwner');
  const cropInput = document.getElementById('ftCrop');
  const phoneInput = document.getElementById('ftPhone');
  const introInput = document.getElementById('ftIntro');

  const pvTitle = document.getElementById('pvTitle');
  const pvOwner = document.getElementById('pvOwner');
  const pvCrop = document.getElementById('pvCrop');
  const pvIntro = document.getElementById('pvIntro');

  function updatePreview() {
    if (pvTitle) pvTitle.textContent = farmNameInput.value || '햇살가득 스마트농장';
    if (pvOwner) pvOwner.textContent = (ownerInput.value || '김대표') + ' 농부';
    if (pvCrop) pvCrop.textContent = cropInput.value || '유기농 완숙 토마토';
    if (pvIntro) pvIntro.textContent = introInput.value || '탄소나노 바이오 농법으로 키운 정직한 프리미엄 농산물입니다.';
  }

  [farmNameInput, ownerInput, cropInput, phoneInput, introInput].forEach(el => {
    if (el) el.addEventListener('input', updatePreview);
  });

  const btnCreateFt = document.getElementById('btnCreateFarmtok');
  if (btnCreateFt) {
    btnCreateFt.addEventListener('click', () => {
      const name = farmNameInput.value || '하이존 농장';
      alert(`[${name}] 팜톡 미니홈피가 성공적으로 개설되었습니다!\n\n생성된 고유 주소: https://01082017763.vercel.app/producer\nQR코드와 직거래 링크가 활성화되었습니다.`);
    });
  }
}

// HZP DIVIDEND CALCULATOR
function initHzpCalculator() {
  const amountInput = document.getElementById('hzpAmount');
  const divYield = document.getElementById('hzpYield');
  const divReward = document.getElementById('hzpReward');

  if (amountInput && divYield && divReward) {
    amountInput.addEventListener('input', () => {
      const val = parseInt(amountInput.value) || 0;
      const annualDividend = Math.round(val * 0.184);
      const tokenReward = Math.round(val / 1000);

      divYield.textContent = annualDividend.toLocaleString() + ' 원 (연 18.4%)';
      divReward.textContent = tokenReward.toLocaleString() + ' HZP 토큰';
    });
  }
}
