// Signature gauge: sweeps a cooling diagnosis, then settles
  const arc = document.getElementById('gaugeArc');
  const dot = document.getElementById('gaugeDot');
  const tempVal = document.getElementById('tempVal');
  const diagText = document.getElementById('diagText');
  const status = document.getElementById('gaugeStatus');
  const footRight = document.getElementById('footRight');

  const stages = [
    {temp: 32, offset: 283, dotAngle: 0,  diag: "Diagnosing cooling fault…", status: "● scanning"},
    {temp: 24, offset: 170, dotAngle: 90, diag: "Gas pressure low — refilling…", status: "● servicing"},
    {temp: 16, offset: 40,  dotAngle: 170, diag: "Cooling restored.", status: "● done"}
  ];

  function polar(cx, cy, r, angleDeg){
    const rad = (angleDeg - 180) * Math.PI / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  let i = 0;
  function step(){
    const s = stages[i];
    arc.style.transition = 'stroke-dashoffset 1.4s ease';
    arc.style.strokeDashoffset = s.offset;
    tempVal.textContent = s.temp;
    diagText.textContent = s.diag;
    status.textContent = s.status;
    footRight.textContent = i === stages.length - 1 ? "STATUS: RESOLVED" : "STATUS: PENDING";
    const p = polar(110, 120, 90, s.dotAngle);
    dot.style.transition = 'cx 1.4s ease, cy 1.4s ease';
    dot.setAttribute('cx', p.x);
    dot.setAttribute('cy', p.y);
    i = (i + 1) % stages.length;
  }
  step();
  setInterval(step, 3200);

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    clearInterval;
  }

/* ===== Booking modal logic ===== */
(function(){
  const overlay = document.getElementById('modalOverlay');
  const closeBtn = document.getElementById('modalClose');
  const nameEl = document.getElementById('modalServiceName');
  const priceEl = document.getElementById('modalServicePrice');
  const form = document.getElementById('bookingForm');
  const custName = document.getElementById('custName');
  const custPhone = document.getElementById('custPhone');
  const custLocation = document.getElementById('custLocation');
  const custNote = document.getElementById('custNote');

  const BUSINESS_WHATSAPP = '923182821473';
  const BUSINESS_EMAIL = 'mohammadanisurrehman972@gmail.com';

  let currentService = '';
  let currentPrice = '';

  document.querySelectorAll('.service-card').forEach(card => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    function openForCard(){
      currentService = card.getAttribute('data-service');
      currentPrice = card.getAttribute('data-price');
      nameEl.textContent = currentService;
      priceEl.textContent = currentPrice;
      overlay.classList.add('open');
      custName.focus();
    }
    card.addEventListener('click', openForCard);
    card.addEventListener('keydown', (e) => {
      if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); openForCard(); }
    });
  });

  function closeModal(){
    overlay.classList.remove('open');
    form.reset();
  }
  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => { if(e.target === overlay) closeModal(); });

  form.addEventListener('submit', function(e){
    e.preventDefault();
    const via = e.submitter ? e.submitter.getAttribute('data-via') : 'whatsapp';

    if(!custName.value || !custPhone.value || !custLocation.value){
      return;
    }

    const lines = [
      'New booking request — Cooling Doctor',
      '',
      'Service: ' + currentService,
      'Price: ' + currentPrice,
      'Name: ' + custName.value,
      'Phone: ' + custPhone.value,
      'Location: ' + custLocation.value,
      'Problem: ' + (custNote.value || 'Not specified')
    ];
    const message = lines.join('\n');

    if(via === 'email'){
      const subject = encodeURIComponent('Booking request: ' + currentService);
      const body = encodeURIComponent(message);
      window.location.href = 'mailto:' + BUSINESS_EMAIL + '?subject=' + subject + '&body=' + body;
    } else {
      const waText = encodeURIComponent(message);
      window.open('https://wa.me/' + BUSINESS_WHATSAPP + '?text=' + waText, '_blank');
    }

    closeModal();
  });
})();