const elements = {
  wishesContainer: document.getElementById('wishes-container'),
  emptyState: document.getElementById('empty-state'),
  searchInput: document.getElementById('search'),
  categoryFilter: document.getElementById('category-filter'),
  priorityFilter: document.getElementById('priority-filter'),
  sortBy: document.getElementById('sort-by')
};

const state = {
  wishes: [],
  filteredWishes: [],
  filters: {
      search: '',
      category: '',
      priority: ''
  },
  sortOrder: 'newest'
};

// Load wishes from server
async function loadWishes() {
  try {
      const response = await fetch('../php/get_wishes.php?status=pending');
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      
      if (data && Array.isArray(data)) {
          if (data.length === 0) {
              showEmptyState();
          } else {
              state.wishes = data;
              state.filteredWishes = [...data];
              applyFiltersAndSort();
              renderWishes(state.filteredWishes);
          }
      } else {
          showEmptyState();
      }
  } catch (error) {
      console.error('Error loading wishes:', error);
      showAlert('Failed to load wishes. Please try again.', 'error');
      showEmptyState();
  }
}

// Render wishes to the grid
function renderWishes(wishes) {
  if (!elements.wishesContainer) return;
  
  if (!wishes || wishes.length === 0) {
      showEmptyState();
      return;
  }
  elements.emptyState.classList.add('hidden');
  elements.wishesContainer.classList.remove('hidden');
  elements.wishesContainer.innerHTML = '';
  
  wishes.forEach(wish => {
      const card = createWishCard(wish);
      elements.wishesContainer.appendChild(card);
  });
}

// Create a wish card element
function createWishCard(wish) {
  const priorityStyle = WishGrid.getPriorityStyles(wish.priority);
  
  const card = document.createElement('div');
  card.className = 'bg-white rounded-2xl neu-shadow p-6 border-4 border-black transition duration-300 hover:shadow-lg';
  card.setAttribute('data-wish-id', wish.id);
  
  const imageContainer = document.createElement('div');
  imageContainer.className = 'h-48 bg-gray-200 relative rounded-xl overflow-hidden border-2 border-black';
  
  const image = document.createElement('img');
  if (wish.image_url) {
      image.src = wish.image_url;
  } else {
      const categoryImages = {
          'Tech': '../assets/images/tech.png',
          'Clothes': '../assets/images/clothes.png',
          'Books': '../assets/images/books.png',
          'Home': '../assets/images/home.png',
          'Other': '../assets/images/others.png'
      };
      image.src = categoryImages[wish.category] || '../assets/images/others.png';
  }
  image.alt = wish.name;
  image.className = 'w-full h-full object-cover';
  
  const content = document.createElement('div');
  content.className = 'mt-4';
  
  const titlePrice = document.createElement('div');
  titlePrice.className = 'flex justify-between items-start mb-2';
  titlePrice.innerHTML = `
      <h3 class="text-xl font-bold text-gray-800">${wish.name}</h3>
      <span class="text-lg font-bold text-purple-600">${WishGrid.formatPrice(wish.price)}</span>
  `;
  
  const description = document.createElement('p');
  description.className = 'text-gray-600 mb-4 text-sm min-h-[3rem]';
  description.textContent = wish.description || '';
  
  const footer = document.createElement('div');
  footer.className = 'flex justify-between items-center mt-4';
  
  const categoryBadge = document.createElement('span');
  categoryBadge.className = 'bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-1 rounded border-2 border-black';
  categoryBadge.textContent = wish.category;
  
  const actionsDiv = document.createElement('div');
  actionsDiv.className = 'flex justify-end gap-1';
  
  const visitLinkButton = document.createElement('button');
  visitLinkButton.className = 'p-2 hover:bg-purple-400 rounded-lg transition-colors border-2 border-black';
  visitLinkButton.innerHTML = '<i class="fas fa-external-link-alt"></i>';
  visitLinkButton.setAttribute('data-action', 'visit-link');
  
  const editButton = document.createElement('button');
  editButton.className = 'p-2 hover:bg-blue-400 rounded-lg transition-colors border-2 border-black';
  editButton.innerHTML = '<i class="fas fa-edit"></i>';
  editButton.setAttribute('data-action', 'edit');
  
  const deleteButton = document.createElement('button');
  deleteButton.className = 'p-2 hover:bg-red-400 rounded-lg transition-colors border-2 border-black';
  deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
  deleteButton.setAttribute('data-action', 'delete');
  
  const completeButton = document.createElement('button');
  completeButton.className = 'p-2 hover:bg-green-400 rounded-lg transition-colors border-2 border-black';
  completeButton.innerHTML = '<i class="fas fa-check"></i>';
  completeButton.setAttribute('data-action', 'complete');
  
  actionsDiv.appendChild(visitLinkButton);
  actionsDiv.appendChild(editButton);
  actionsDiv.appendChild(deleteButton);
  actionsDiv.appendChild(completeButton);
  
  imageContainer.appendChild(image);
  content.appendChild(titlePrice);
  content.appendChild(description);
  footer.appendChild(categoryBadge);
  footer.appendChild(actionsDiv);
  content.appendChild(footer);
  
  card.appendChild(imageContainer);
  card.appendChild(content);
  
  setupCardEventListeners(card);
  
  return card;
}

function setupCardEventListeners(card) {
  const wishId = card.getAttribute('data-wish-id');
  const wish = state.wishes.find(w => w.id === parseInt(wishId));

  const visitLinkButton = card.querySelector('[data-action="visit-link"]');
  if (visitLinkButton) {
      visitLinkButton.addEventListener('click', () => {
          if (wish && wish.item_link) {
              window.open(wish.item_link, '_blank', 'noopener,noreferrer');
          } else {
              WishGrid.showAlert('No link added to this wish.', 'info');
          }
      });
  }
  const editButton = card.querySelector('[data-action="edit"]');
  if (editButton) {
      editButton.addEventListener('click', () => {
          window.location.href = `add-wish.html?id=${wishId}`;
      });
  }
  const completeButton = card.querySelector('[data-action="complete"]');
  if (completeButton) {
      completeButton.addEventListener('click', () => {
          markAsCompleted(wishId);
      });
  }
  const deleteButton = card.querySelector('[data-action="delete"]');
  if (deleteButton) {
      deleteButton.addEventListener('click', () => {
          deleteWish(wishId);
      });
  }
}

// Complete wish
async function markAsCompleted(wishId) {
  if (!confirm('Mark this wish as completed?')) return;
  
  try {
      const id = parseInt(wishId, 10);
      
      const response = await fetch('../php/complete_wish.php', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: id })
      });
      
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      
      const result = await response.json();
      
      if (result.success) {
          const cardToRemove = document.querySelector(`[data-wish-id="${wishId}"]`);
          if (cardToRemove) {
              cardToRemove.remove();
          }
          state.wishes = state.wishes.filter(wish => wish.id !== id);
          state.filteredWishes = state.filteredWishes.filter(wish => wish.id !== id);
          if (state.filteredWishes.length === 0) {
              showEmptyState();
          }
          
          showAlert('Wish marked as completed!', 'success');
          setTimeout(() => {
              window.location.href = 'completed.html';
          }, 1500); // 1.5 second delay 
      } else {
          showAlert(result.message || 'Failed to mark wish as completed.', 'error');
      }
  } catch (error) {
      console.error('Error completing wish:', error);
      showAlert('An error occurred. Please try again.', 'error');
  }
}

// Delete wish
async function deleteWish(wishId) {
  if (!confirm('Are you sure you want to delete this wish?')) return;
  
  try {
      const response = await fetch('../php/delete_wish.php', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: wishId })
      });
      
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      
      const result = await response.json();
      
      if (result.success) {
          const cardToRemove = document.querySelector(`[data-wish-id="${wishId}"]`);
          if (cardToRemove) {
              cardToRemove.remove();
          }
          state.wishes = state.wishes.filter(wish => wish.id !== wishId);
          state.filteredWishes = state.filteredWishes.filter(wish => wish.id !== wishId);
          if (state.filteredWishes.length === 0) {
              showEmptyState();
          }
          
          showAlert('Wish deleted successfully!', 'success');
      } else {
          showAlert(result.message || 'Failed to delete wish.', 'error');
      }
  } catch (error) {
      console.error('Error deleting wish:', error);
      showAlert('An error occurred. Please try again.', 'error');
  }
}

// Filters
function filterByCategory(category) {
  state.filters.category = category;
  applyFiltersAndSort();
}

function filterByPriority(priority) {
  state.filters.priority = priority;
  applyFiltersAndSort();
}

function searchWishes(query) {
  state.filters.search = query.trim().toLowerCase();
  applyFiltersAndSort();
}

function sortWishesBy(sortOrder) {
  state.sortOrder = sortOrder;
  applyFiltersAndSort();
}

function applyFiltersAndSort() {
  let filtered = [...state.wishes];

  if (state.filters.search) {
      filtered = filtered.filter(wish => 
          wish.name.toLowerCase().includes(state.filters.search) || 
          (wish.description && wish.description.toLowerCase().includes(state.filters.search))
      );
  }

  if (state.filters.category) {
      filtered = filtered.filter(wish => wish.category === state.filters.category);
  }
  
  if (state.filters.priority) {
      filtered = filtered.filter(wish => wish.priority.toLowerCase() === state.filters.priority.toLowerCase());
  }
  
  filtered.sort((a, b) => {
      switch (state.sortOrder) {
          case 'newest':
              return new Date(b.created_at) - new Date(a.created_at);
          case 'oldest':
              return new Date(a.created_at) - new Date(b.created_at);
          case 'price-high':
              return parseFloat(b.price) - parseFloat(a.price);
          case 'price-low':
              return parseFloat(a.price) - parseFloat(b.price);
          default:
              return 0;
      }
  });
  
  state.filteredWishes = filtered;
  renderWishes(filtered);
}

function showEmptyState() {
  if (!elements.emptyState || !elements.wishesContainer) return;
  
  elements.wishesContainer.classList.add('hidden');
  elements.emptyState.classList.remove('hidden');
  elements.wishesContainer.innerHTML = '';
}

// Initialize dashboard page
function setupEventListeners() {
  if (!elements.wishesContainer) {
      console.error('Wishes container not found');
      return;
  }
  if (elements.searchInput) {
      elements.searchInput.addEventListener('input', (e) => {
          searchWishes(e.target.value);
      });
  }
  
  if (elements.categoryFilter) {
      elements.categoryFilter.addEventListener('change', (e) => {
          filterByCategory(e.target.value);
      });
  }
  
  if (elements.priorityFilter) {
      elements.priorityFilter.addEventListener('change', (e) => {
          state.filters.priority = e.target.value;
          applyFiltersAndSort();
      });
  }
  
  if (elements.sortBy) {
      elements.sortBy.addEventListener('change', (e) => {
          sortWishesBy(e.target.value);
      });
  }
}

document.addEventListener('DOMContentLoaded', async function() {
  // Check auth status and update greeting
  const authState = await AuthManager.checkAuth();
  if (authState.logged_in && authState.username) {
    const greeting = document.getElementById('user-greeting');
    if (greeting) {
      greeting.textContent = `Welcome back, ${authState.username}!`;
    }
  }
  await loadWishes();
  setupEventListeners();
});