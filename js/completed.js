document.addEventListener('DOMContentLoaded', function() {
  const completedWishesContainer = document.getElementById('completed-wishes-container');
  const emptyState = document.getElementById('empty-state');
  const searchInput = document.getElementById('search');
  const categoryFilter = document.getElementById('category-filter');
  const sortBy = document.getElementById('sort-by');
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  
  let completedWishes = [];
  let isMobileMenuOpen = false;
  init();
  
  function init() {
      loadCompletedWishes();
      setupEventListeners();
      setupMobileMenu();
  }

  function setupEventListeners() {
      searchInput.addEventListener('input', function() {
          filterWishes();
      });
      categoryFilter.addEventListener('change', function() {
          filterWishes();
      });
      sortBy.addEventListener('change', function() {
          filterWishes();
      });
      completedWishesContainer.addEventListener('click', function(e) {
          const button = e.target.closest('button');
          if (!button) return;
          
          const action = button.getAttribute('data-action');
          const wishId = button.getAttribute('data-wish-id');
          
          if (!action || !wishId) return;
          
          if (action === 'restore') {
              restoreWish(wishId);
          } else if (action === 'delete') {
              deleteWish(wishId);
          }
      });
  }
  
  function setupMobileMenu() {
      if (!mobileMenuButton || !mobileMenu) return;
      
      mobileMenuButton.addEventListener('click', () => {
          isMobileMenuOpen = !isMobileMenuOpen;
          mobileMenu.classList.toggle('hidden');
          const icon = mobileMenuButton.querySelector('i');
          if (icon) {
              icon.classList.toggle('fa-bars');
              icon.classList.toggle('fa-times');
          }
      });
      document.addEventListener('click', (e) => {
          if (isMobileMenuOpen && 
              !mobileMenu.contains(e.target) && 
              !mobileMenuButton.contains(e.target)) {
              isMobileMenuOpen = false;
              mobileMenu.classList.add('hidden');
              const icon = mobileMenuButton.querySelector('i');
              if (icon) {
                  icon.classList.add('fa-bars');
                  icon.classList.remove('fa-times');
              }
          }
      });
  }

  async function loadCompletedWishes() {
      try {
          const response = await fetch('../php/get_wishes.php?status=completed');
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          
          const wishes = await response.json();
          
          if (wishes && Array.isArray(wishes)) {
              completedWishes = wishes;
              if (wishes.length === 0) {
                  showEmptyState();
              } else {
                  renderCompletedWishes(wishes);
              }
          } else {
              showEmptyState();
          }
      } catch (error) {
          console.error('Error loading completed wishes:', error);
          showAlert('Failed to load completed wishes. Please try again.', 'error');
          showEmptyState();
      }
  }

  function renderCompletedWishes(wishes) {
      if (!completedWishesContainer || !emptyState) {
          console.error('Required DOM elements not found');
          return;
      }
      
      if (!wishes || wishes.length === 0) {
          showEmptyState();
          return;
      }
      emptyState.classList.add('hidden');
      completedWishesContainer.classList.remove('hidden');
      completedWishesContainer.innerHTML = '';
      wishes.forEach(wish => {
          const card = createWishCard(wish);
          completedWishesContainer.appendChild(card);
      });
  }

  function createWishCard(wish) {
      const card = document.createElement('div');
      card.className = 'bg-white rounded-2xl neu-shadow p-6 border-4 border-black transition duration-300 hover:shadow-lg';
      card.setAttribute('data-wish-id', wish.id);
      
      const imageContainer = document.createElement('div');
      imageContainer.className = 'h-48 bg-gray-200  relative rounded-xl overflow-hidden border-2 border-black ';
      
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
      
      const completedBadge = document.createElement('div');
      completedBadge.className = 'absolute top-3 right-3';
      completedBadge.innerHTML = '<span class="bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">Completed</span>';
      
      const content = document.createElement('div');
      content.className = 'mt-4';
      
      const titlePrice = document.createElement('div');
      titlePrice.className = 'flex justify-between items-start mb-2';
      titlePrice.innerHTML = `
          <h3 class="text-xl font-bold text-gray-800 dark:text-white">${wish.name}</h3>
          <span class="text-lg font-bold text-purple-600 dark:text-purple-400">${WishGrid.formatPrice(wish.price)}</span>
      `;
      
      const description = document.createElement('p');
      description.className = 'text-gray-600 mb-4 text-sm min-h-[3rem]';
      description.textContent = wish.description || '';
      
      const footer = document.createElement('div');
      footer.className = 'flex justify-between items-center mt-4';
      
      const categoryBadge = document.createElement('span');
      categoryBadge.className = 'bg-purple-100  text-purple-800 text-xs font-medium px-2.5 py-1 rounded border-2 border-black';
      categoryBadge.textContent = wish.category;
      
      const actionsDiv = document.createElement('div');
      actionsDiv.className = 'flex justify-end gap-1';
      
      const restoreButton = document.createElement('button');
      restoreButton.className = 'p-2 hover:bg-blue-400  rounded-lg transition-colors border-2 border-black ';
      restoreButton.innerHTML = '<i class="fas fa-undo"></i>';
      restoreButton.setAttribute('data-action', 'restore');
      restoreButton.setAttribute('data-wish-id', wish.id);
      
      const deleteButton = document.createElement('button');
      deleteButton.className = 'p-2 hover:bg-red-400  rounded-lg transition-colors border-2 border-black';
      deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
      deleteButton.setAttribute('data-action', 'delete');
      deleteButton.setAttribute('data-wish-id', wish.id);
      
      actionsDiv.appendChild(restoreButton);
      actionsDiv.appendChild(deleteButton);
      
      imageContainer.appendChild(image);
      imageContainer.appendChild(completedBadge);
      content.appendChild(titlePrice);
      content.appendChild(description);
      footer.appendChild(categoryBadge);
      footer.appendChild(actionsDiv);
      content.appendChild(footer);
      
      card.appendChild(imageContainer);
      card.appendChild(content);
      
      return card;
  }
  
  function filterWishes() {
      const searchTerm = searchInput.value.toLowerCase();
      const categoryValue = categoryFilter.value;
      const sortValue = sortBy.value;
      
      let filteredWishes = completedWishes.filter(wish => {
          const matchesSearch = 
              wish.name.toLowerCase().includes(searchTerm) || 
              (wish.description && wish.description.toLowerCase().includes(searchTerm));
          
          const matchesCategory = !categoryValue || wish.category === categoryValue;
          
          return matchesSearch && matchesCategory;
      });
      
      filteredWishes = sortWishes(filteredWishes, sortValue);
      renderCompletedWishes(filteredWishes);
  }

  function sortWishes(wishes, sortOption) {
      const sortedWishes = [...wishes]; 
      switch(sortOption) {
          case 'newest':
              sortedWishes.sort((a, b) => b.id - a.id);
              break;
          case 'oldest':
              sortedWishes.sort((a, b) => a.id - b.id);
              break;
          case 'price-high':
              sortedWishes.sort((a, b) => b.price - a.price);
              break;
          case 'price-low':
              sortedWishes.sort((a, b) => a.price - b.price);
              break;
          default:
              sortedWishes.sort((a, b) => b.id - a.id);
      }
      
      return sortedWishes;
  }
  
  async function restoreWish(wishId) {
      if (confirm('Are you sure you want to move this wish back to your active wishlist?')) {
          try {
              const response = await fetch('../php/update_wish_status.php', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                      id: wishId,
                      status: 'pending'
                  })
              });

              const data = await response.json();
              if (data.success) {
                  completedWishes = completedWishes.filter(wish => wish.id !== wishId);
                  renderCompletedWishes();
                  showNotification('Wish moved back to active wishlist', 'success');
              } else {
                  throw new Error(data.message);
              }
          } catch (error) {
              console.error('Error restoring wish:', error);
              showNotification('Failed to move wish back: ' + error.message, 'error');
          }
      }
  }
  
  async function deleteWish(wishId) {
      if (!confirm('Are you sure you want to permanently delete this item? This action cannot be undone.')) {
          return;
      }
      
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
          
          const data = await response.json();
          
          if (data.success) {
              completedWishes = completedWishes.filter(wish => wish.id != wishId);
              if (completedWishes.length === 0) {
                  showEmptyState();
              } else {
                  renderCompletedWishes(completedWishes);
              }
              
              showMessage('Wish permanently deleted.', 'success');
          } else {
              throw new Error(data.message || 'Failed to delete wish');
          }
      } catch (error) {
          console.error('Error deleting wish:', error);
          showMessage('Failed to delete wish. Please try again.', 'error');
      }
  }
  function showMessage(message, type) {
      let messageElement = document.getElementById('message-toast');
      if (!messageElement) {
          messageElement = document.createElement('div');
          messageElement.id = 'message-toast';
          messageElement.className = 'fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 transform translate-y-full opacity-0';
          document.body.appendChild(messageElement);
      }
      messageElement.textContent = message;
      messageElement.className = 'fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 transform translate-y-full opacity-0';
      
      if (type === 'success') {
          messageElement.classList.add('bg-green-600', 'text-white');
      } else {
          messageElement.classList.add('bg-red-600', 'text-white');
      }

      setTimeout(() => {
          messageElement.classList.remove('translate-y-full', 'opacity-0');
      }, 10);
      
      setTimeout(() => {
          messageElement.classList.add('translate-y-full', 'opacity-0');
      }, 3000);
  }

  function showEmptyState() {
      if (!emptyState || !completedWishesContainer) {
          console.error('Empty state or wishes container elements not found');
          return;
      }
      
      completedWishesContainer.innerHTML = '';
      completedWishesContainer.classList.add('hidden');
      emptyState.classList.remove('hidden');
      
      emptyState.innerHTML = `
          <div class="bg-white dark:bg-gray-800 rounded-2xl neu-shadow border-4 border-black dark:border-gray-700 p-8 max-w-lg mx-auto">
              <div class="text-gray-400 dark:text-gray-500 mb-4">
                  <i class="fas fa-check-circle text-6xl"></i>
              </div>
              <h3 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  No completed wishes yet
              </h3>
              <p class="text-gray-600 dark:text-gray-300 mb-6">
                  When you mark wishes as completed, they'll appear here.
              </p>
              <a href="dashboard.html" class="neu-button bg-purple-600 text-white px-6 py-3 rounded-lg font-bold inline-block">
                  <i class="fas fa-plus mr-2"></i> Add New Wish
              </a>
          </div>
      `;
  }
});