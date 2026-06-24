const friends = [
  {
    name: "Nitah",
    accent: "#f5c542",
    photo: "assets/Nitah.png",
    description: "Nitah is my friend from SMKN 7 Batam. She is one of the friends I met at school and a part of my everyday school life.",
    memory: "Studying, laughing, and spending time together at school."
  },
  {
    name: "Erika",
    accent: "#00d2a0",
    photo: "assets/Erika.png",
    description: "Erika is my friend from SMKN 7 Batam. She is one of the friends who makes my school experience more memorable.",
    memory: "Sharing stories and enjoying school moments together."
  },
  {
    name: "Asna",
    accent: "#8b7cf7",
    photo: "assets/Asna.png",
    description: "Asna is my friend from SMKN 7 Batam. She is part of my circle of friends at school and one of the people I know from SMKN 7 Batam.",
    memory: "Spending time together and creating simple memories at school."
  },
  {
    name: "Dicky",
    accent: "#5b8def",
    photo: "assets/Dicky.png",
    description: "Dicky is my friend from SMKN 7 Batam. He is one of the friends I met during my school days.",
    memory: "Learning, talking, and sharing school experiences together."
  }
];

const container = document.getElementById('cards-container');
const overlay = document.getElementById('modal-overlay');
const modalImg = document.getElementById('modal-img');
const modalName = document.getElementById('modal-name');
const modalDesc = document.getElementById('modal-desc');
const modalMemory = document.getElementById('modal-memory');
const modalTags = document.getElementById('modal-tags');
const modalAvatar = document.getElementById('modal-avatar');
const closeBtn = document.getElementById('modal-close');
const prevBtn = document.getElementById('modal-prev');
const nextBtn = document.getElementById('modal-next');
const searchInput = document.getElementById('search-input');
const emptyState = document.getElementById('empty-state');

let currentIndex = 0;

function renderCards() {
  container.innerHTML = '';
  friends.forEach((friend, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.index = index;
    card.style.setProperty('--ca', friend.accent);
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `View ${friend.name} details`);

    card.innerHTML = `
      <div class="co">
        <div class="ci">
          <div class="ca">
            <img src="${friend.photo}" alt="${friend.name}" loading="lazy">
          </div>
          <h3 class="cn">${friend.name}</h3>
          <span class="card-subtitle">Friend from SMKN 7 Batam</span>
          <div class="card-tags">
            <span class="card-tag">Classmate</span>
            <span class="card-tag">Friend</span>
          </div>
        </div>
      </div>
    `;

    card.addEventListener('click', () => openModal(index));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(index);
      }
    });

    container.appendChild(card);
  });
}

function openModal(index) {
  currentIndex = index;
  const friend = friends[index];
  modalImg.src = friend.photo;
  modalImg.alt = friend.name;
  modalName.textContent = friend.name;
  modalDesc.textContent = friend.description;
  modalMemory.textContent = friend.memory;
  modalAvatar.style.setProperty('--modal-accent', friend.accent);
  modalTags.innerHTML = '<span class="modal-tag">Classmate</span><span class="modal-tag">Friend</span>';
  overlay.classList.remove('closing');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  closeBtn.focus();
}

function closeModal() {
  overlay.classList.add('closing');
  setTimeout(() => {
    overlay.classList.remove('active', 'closing');
    document.body.style.overflow = '';
  }, 300);
}

function navigate(direction) {
  const cards = container.querySelectorAll('.card:not(.hidden)');
  if (cards.length === 0) return;
  const visibleIndices = [];
  cards.forEach(c => visibleIndices.push(parseInt(c.dataset.index, 10)));
  const pos = visibleIndices.indexOf(currentIndex);
  let nextPos;
  if (direction === 'prev') {
    nextPos = pos <= 0 ? visibleIndices.length - 1 : pos - 1;
  } else {
    nextPos = pos >= visibleIndices.length - 1 ? 0 : pos + 1;
  }
  openModal(visibleIndices[nextPos]);
}

function filterCards(query) {
  const cards = container.querySelectorAll('.card');
  const trimmed = query.trim().toLowerCase();
  let visibleCount = 0;
  let visibleIndex = -1;

  cards.forEach((card, i) => {
    const name = friends[i].name.toLowerCase();
    if (!trimmed || name.includes(trimmed)) {
      card.classList.remove('hidden');
      visibleCount++;
      visibleIndex = i;
    } else {
      card.classList.add('hidden');
    }
  });

  if (trimmed && visibleCount === 1) {
    openModal(visibleIndex);
  } else if (!trimmed) {
    if (overlay.classList.contains('active')) closeModal();
  } else if (visibleCount !== 1) {
    if (overlay.classList.contains('active')) closeModal();
  }

  if (trimmed && visibleCount === 0) {
    emptyState.classList.add('visible');
  } else {
    emptyState.classList.remove('visible');
  }
}

renderCards();

closeBtn.addEventListener('click', closeModal);

overlay.addEventListener('click', e => {
  if (e.target === overlay) closeModal();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && overlay.classList.contains('active')) closeModal();
});

prevBtn.addEventListener('click', () => navigate('prev'));
nextBtn.addEventListener('click', () => navigate('next'));

searchInput.addEventListener('input', () => filterCards(searchInput.value));
