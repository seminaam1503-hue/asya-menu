(function () {
  var M = window.MENU || [];
  var COL = ['#8A4A6C', '#3F7563', '#C07A60', '#3F4D74'];
  var DSH = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var $ = function (id) { return document.getElementById(id); };

  // бегущая строка: только хиты, которые и так показаны на странице
  if ($('mq')) {
    var names = [];
    M.forEach(function (w) { names = names.concat(w.hits); });
    var line = names.map(function (n) { return '<span>' + esc(n) + '</span><i>✦</i>'; }).join('');
    $('mq').innerHTML = line + line;
  }

  // кафе vs Ася
  var FL = [
    { img: 'w1-tomyam', cafe: 'Том-ям', hand: 'куриный бульон, грибы, помидор и лимон', c: '#C2186B', note: 'Тайское кафе на твоей кухне, и лететь никуда не надо.' },
    { img: 'w1-cinnabon-lavash', cafe: 'Синнабон', hand: 'лаваш, масло, сахар и корица', c: '#F2552C', note: 'Булочка с корицей без теста и без нервов.' },
    { img: 'w2-kiev-restoran', cafe: 'Котлета по-киевски', hand: 'куриная грудка с кусочком масла внутри', c: '#00875F', note: 'Режешь, а оттуда течёт масло. Ресторан, да и только.' },
    { img: 'w1-peatoast', cafe: 'Авокадо-тост', hand: 'зелёный горошек на хлебе', c: '#2F3FD9', note: 'Зелёный, модный, и никакого авокадо.' },
    { img: 'w2-chowder', cafe: 'Чаудер в хлебной тарелке', hand: 'минтай, картошка, молоко и круглая булочка', c: '#C2186B', note: 'Сливочный суп прямо в булке. Посуды меньше, восторга больше.' },
    { img: 'w4-onionsoup', cafe: 'Луковый суп по-французски', hand: 'лук, батон и немного сыра', c: '#F2552C', note: 'Парижское бистро из самого копеечного овоща.' }
  ];
  if ($('flips')) {
    $('flips').innerHTML = FL.map(function (f) {
      return '<button class="flip" type="button" aria-label="Перевернуть карточку: ' + esc(f.cafe) + '"><div class="flip-in">' +
        '<div class="face front"><img src="img/dishes/' + f.img + '.jpg" alt="' + esc(f.cafe) + '" loading="lazy"><span class="tap">нажми ↻</span><div class="lbl"><small>В кафе</small><b>' + esc(f.cafe) + '</b></div></div>' +
        '<div class="face back" style="background:' + f.c + '"><small>А у Аси это</small><p class="hand">' + esc(f.hand) + '</p><p>' + esc(f.note) + '</p></div>' +
        '</div></button>';
    }).join('');
    document.querySelectorAll('.flip').forEach(function (b) { b.addEventListener('click', function () { b.classList.toggle('on'); }); });
  }

  // загляни внутрь: открыт один день в каждой неделе
  var wt = $('wtabs'), dt = $('dtabs'), dayEl = $('day');
  var wi = 0, di = M.length ? M[0].openDay : 0;
  function renderTabs() {
    wt.innerHTML = M.map(function (w, i) {
      return '<button class="wtab' + (i === wi ? ' on' : '') + '" style="--c:' + COL[i] + '" data-w="' + i + '"><small>Неделя ' + (i + 1) + '</small>' + esc(w.theme) + '</button>';
    }).join('');
    dt.innerHTML = DSH.map(function (d, i) {
      var open = M[wi].days[i].open;
      return '<button class="dtab' + (i === di ? ' on' : '') + (open ? ' open' : ' locked') + '" data-d="' + i + '">' + d + '<small>' + (open ? 'открыт' : '🔒') + '</small></button>';
    }).join('');
  }
  function renderDay() {
    var d = M[wi].days[di], c = COL[wi];
    if (!d.open) {
      var cards = '';
      for (var k = 0; k < d.n; k++) cards += '<div class="rc ghost"><div class="ph"><img src="img/locked-w' + (wi + 1) + '.jpg" alt=""></div><div class="bd"><i></i><i></i><i class="s"></i></div></div>';
      dayEl.innerHTML = '<div class="lockwrap" style="--c:' + c + '">' + cards +
        '<div class="lock"><b>День ' + (wi * 7 + di + 1) + ' из 28</b><p>Блюда этого дня, граммовка и шаги — в меню на месяц.</p><a class="btn" href="#kupit">Открыть все 28 дней</a></div></div>';
      return;
    }
    dayEl.innerHTML = d.recipes.map(function (r) {
      var meal = r.meal.split(' · ')[0];
      return '<article class="rc" style="--c:' + c + '"><div class="ph"><img src="img/dishes/' + r.photo + '.jpg" alt="' + esc(r.title) + '" loading="lazy"><span class="meal">' + esc(meal) + '</span>' +
        (r.hit ? '<span class="hit"><b>★</b>хит<br>недели</span>' : '') + '</div>' +
        '<div class="bd"><h3>' + esc(r.title) + '</h3><div class="meta">' + (r.time ? '<span>⏱ ' + esc(r.time) + '</span>' : '') + (r.level ? '<span>' + esc(r.level) + '</span>' : '') + '<span>на 4 человека</span></div>' +
        (r.quote ? '<div class="q"><img src="img/ava.jpg" alt=""><small>Ася говорит</small>«' + esc(r.quote) + '»</div>' : '') +
        '</div></article>';
    }).join('');
  }
  if (wt) {
    wt.addEventListener('click', function (e) { var b = e.target.closest('.wtab'); if (!b) return; wi = +b.dataset.w; di = M[wi].openDay; renderTabs(); renderDay(); });
    dt.addEventListener('click', function (e) { var b = e.target.closest('.dtab'); if (!b) return; di = +b.dataset.d; renderTabs(); renderDay(); });
    renderTabs(); renderDay();
  }

  // листалка страниц
  if ($('strip')) {
    var st = ''; for (var i = 1; i <= 14; i++) st += '<img src="img/pages/pg' + (i < 10 ? '0' : '') + i + '.jpg" alt="Страница меню" loading="lazy">';
    $('strip').innerHTML = st;
    var stp = $('strip'), imgs = stp.querySelectorAll('img');
    // какая страница сейчас ближе всего к центру
    var cur = function () { var c = stp.scrollLeft + stp.clientWidth / 2, best = 0, d = 1e9; imgs.forEach(function (im, i) { var m = im.offsetLeft + im.offsetWidth / 2, x = Math.abs(m - c); if (x < d) { d = x; best = i; } }); return best; };
    // ставим страницу ровно по центру
    var go = function (dir) { var i = Math.max(0, Math.min(imgs.length - 1, cur() + dir)), im = imgs[i]; stp.scrollTo({ left: im.offsetLeft - (stp.clientWidth - im.offsetWidth) / 2, behavior: 'smooth' }); };
    $('swPrev').addEventListener('click', function () { go(-1); });
    $('swNext').addEventListener('click', function () { go(1); });
  }

  // недели
  if ($('wklist')) {
    $('wklist').innerHTML = M.map(function (w, i) {
      return '<div class="wk" style="--c:' + COL[i] + '"><div class="wk-pic"><img src="img/big-' + w.cover + '.jpg" alt="' + esc(w.theme) + '" loading="lazy"></div>' +
        '<div class="wk-t"><span class="wk-n">' + (i + 1) + '</span><small>Неделя ' + (i + 1) + '</small><h3>' + esc(w.theme) + '</h3><p>' + esc(w.sub) + '.</p>' +
        '<div class="hits">' + w.hits.map(function (h) { return '<span>★ ' + esc(h) + '</span>'; }).join('') + '<span class="more-n">и ещё ' + w.more + ' блюд в меню</span></div>' +
        '<button class="go" data-w="' + i + '">Открытый день этой недели →</button></div></div>';
    }).join('');
    $('wklist').addEventListener('click', function (e) {
      var b = e.target.closest('.go'); if (!b) return; wi = +b.dataset.w; di = M[wi].openDay; renderTabs(); renderDay();
      $('vnutri').scrollIntoView({ behavior: 'smooth' });
    });
  }

  // плавающая кнопка прячется у блока покупки
  var fb = document.querySelector('.float-buy'), buy = $('kupit');
  if (fb && buy && 'IntersectionObserver' in window) new IntersectionObserver(function (en) { fb.classList.toggle('hide', en[0].isIntersecting); }).observe(buy);

  // оплата
  // Ссылка на оплату ЮKassa появится после подключения магазина
  var PAY_URL = "";
  var cb = $('agree'), btn = $('paybtn'), hint = $('payhint');
  if (cb) {
    var upd = function () {
      var ok = cb.checked;
      btn.classList.toggle('disabled', !ok);
      btn.setAttribute('aria-disabled', String(!ok));
      if (ok && PAY_URL) { btn.href = PAY_URL; hint.textContent = ''; }
      else if (ok) { btn.href = 'mailto:asya.menu@yandex.ru?subject=' + encodeURIComponent('Хочу меню «Система Аси»'); hint.textContent = 'Оплата картой скоро заработает. Пока напиши на почту, и мы пришлём ссылку на оплату.'; }
      else { btn.href = '#'; hint.textContent = 'Отметь галочку, чтобы перейти к оплате.'; }
    };
    cb.addEventListener('change', upd);
    btn.addEventListener('click', function (e) { if (!cb.checked) e.preventDefault(); });
  }
})();
