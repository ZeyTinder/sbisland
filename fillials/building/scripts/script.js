// Общий «мастер‑обработчик»
document.addEventListener('DOMContentLoaded', () => {
  initCarouselAnchors();
  initHeaderScroll();
  initSubmenu();
  initBurgerMenu('.js-header-burger', '.js-header-nav');
  initContactsPanel();
  enableSwipeToClose(document.getElementById('contacts-panel'));
});

// 1) плавный скролл по клику на карточки
function initCarouselAnchors() {
  const map = {
    'складской учет': 'sklad',
    'маркировка':      'marking',
    'crm':             'crm',
    'аналитика':       'analytics'
  };
  document.querySelectorAll('.sbisru-Carousel-item-wrapper').forEach(wrapper => {
    const label = wrapper
      .querySelector('.sbisru-Carousel-item > div:last-child')
      .childNodes[0]
      .textContent
      .trim()
      .toLowerCase();
    const targetId = map[label];
    if (!targetId) return;
    wrapper.style.cursor = 'pointer';
    wrapper.addEventListener('click', () => {
      const el = document.getElementById(targetId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

// 2) скролл‑слушатель для header
function initHeaderScroll() {
  const scrollContainer = document.querySelector('[data-qa="controls-Scroll__content"]');
  const header = document.querySelector('.sbisru-Header-sticky');
  if (!scrollContainer || !header) return;
  scrollContainer.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', scrollContainer.scrollTop > 10);
  });
}


/* подменю */
function initSubmenu() {
  const menu = document.querySelector('.sbisru-Header-Submenu.js-submenu');
  if (!menu) return;

  const longest = menu.querySelector('.sbisru-Header-Submenu__longest-value');
  const items   = menu.querySelector('.sbisru-Header-Submenu__items');

  // прячем сразу же при инициализации
  if (longest) longest.style.display = 'none';
  if (items)   items.style.display   = 'none';

  menu.addEventListener('click', e => {
    e.stopPropagation();
    const isOpen = menu.classList.toggle('open');

    if (isOpen) {
      if (longest) longest.style.display = 'flex';
      if (items)   items.style.display   = 'block';
    } else {
      if (longest) longest.style.display = 'none';
      if (items)   items.style.display   = 'none';
    }
  });

  document.addEventListener('click', () => {
    if (menu.classList.contains('open')) {
      menu.classList.remove('open');
      if (longest) longest.style.display = 'none';
      if (items)   items.style.display   = 'none';
    }
  });
}

/* гамбургер */
function initBurgerMenu() {
  const burger = document.getElementById('burger-toggle');
  const menu = document.getElementById('mobile-menu');
  if (!burger || !menu) return;

  burger.addEventListener('click', e => {
    e.stopPropagation();
    menu.classList.toggle('open');
    burger.classList.toggle('open');
  });

  document.addEventListener('click', () => {
    if (menu.classList.contains('open')) {
      menu.classList.remove('open');
      burger.classList.remove('open');
    }
  });

  menu.addEventListener('click', e => {
    e.stopPropagation();

    const link = e.target.closest('a');
    if (link && link.getAttribute('href')?.startsWith('#')) {
      e.preventDefault();

      const targetId = link.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }

      menu.classList.remove('open');
      burger.classList.remove('open');
    }
  });
}


/* контакт подменю */

function initContactsPanel() {
  const trigger = document.querySelector('.js-ContactsMenu');
  const panel = document.getElementById('contacts-panel');

  if (!trigger || !panel) return;

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    panel.classList.toggle('hidden');
  });

  // Клик вне панели — закрытие
  document.addEventListener('click', (e) => {
    if (!panel.contains(e.target) && !trigger.contains(e.target)) {
      panel.classList.add('hidden');
    }
  });
}

function enableSwipeToClose(panel) {
  let startY = 0;
  let isSwiping = false;

  panel.addEventListener('touchstart', e => {
    startY = e.touches[0].clientY;
    isSwiping = true;
  });

  panel.addEventListener('touchmove', e => {
    if (!isSwiping) return;
    const deltaY = e.touches[0].clientY - startY;

    // если пользователь свайпает вниз
    if (deltaY > 80) {
      panel.classList.add('hidden');
      isSwiping = false;
    }
  });

  panel.addEventListener('touchend', () => {
    isSwiping = false;
  });
}
