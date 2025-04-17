const API_ENDPOINTS = {
  GET_WISHES: 'php/get_wishes.php',
  ADD_WISH: 'php/add_wish.php',
  UPDATE_WISH: 'php/update_wish.php',
  DELETE_WISH: 'php/delete_wish.php',
  COMPLETE_WISH: 'php/complete_wish.php',
  EXPORT_DATA: 'php/export_data.php'
};

async function fetchGet(url, params = {}) {
  const queryString = new URLSearchParams(params).toString();
  const urlWithParams = queryString ? `${url}?${queryString}` : url;
  
  try {
      const response = await fetch(urlWithParams);
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
  } catch (error) {
      console.error('Fetch error:', error);
      showAlert('Error fetching data. Please try again.', 'error');
      return null;
  }
}

async function fetchPost(url, data = {}) {
  try {
      const response = await fetch(url, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
      });
      
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
  } catch (error) {
      console.error('Fetch error:', error);
      showAlert('Error saving data. Please try again.', 'error');
      return null;
  }
}

function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
  }).format(price);
}

function getPriorityStyles(priority) {
  switch (priority.toLowerCase()) {
      case 'high':
          return {
              bgColor: 'bg-red-500',
              textColor: 'text-red-500',
              icon: 'fa-arrow-up'
          };
      case 'medium':
          return {
              bgColor: 'bg-yellow-500',
              textColor: 'text-yellow-500',
              icon: 'fa-minus'
          };
      case 'low':
          return {
              bgColor: 'bg-green-500',
              textColor: 'text-green-500',
              icon: 'fa-arrow-down'
          };
      default:
          return {
              bgColor: 'bg-gray-500',
              textColor: 'text-gray-500',
              icon: 'fa-minus'
          };
  }
}

function getCategoryStyle(category) {
  return 'bg-purple-100 text-purple-800';
}

function showAlert(message, type = 'success') {
  const alertElement = document.getElementById('alert');
  if (!alertElement) return;
  const scrollPosition = window.scrollY;
  if (type === 'success') {
      alertElement.className = 'absolute p-4 rounded-lg bg-green-100 text-green-800 z-50 shadow-lg border-2 border-green-200';
  } else if (type === 'error') {
      alertElement.className = 'absolute p-4 rounded-lg bg-red-100 text-red-800 z-50 shadow-lg border-2 border-red-200';
  } else {
      alertElement.className = 'absolute p-4 rounded-lg bg-blue-100 text-blue-800 z-50 shadow-lg border-2 border-blue-200';
  }

  alertElement.style.top = `${scrollPosition + 20}px`;
  alertElement.style.right = '20px';
  
  alertElement.textContent = message;
  alertElement.classList.remove('hidden');

  setTimeout(() => {
      alertElement.classList.add('hidden');
  }, 5000);
}

function getUrlParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    const menuButton = document.querySelector('.md\\:hidden button');
    if (menuButton) {
      const mobileMenu = document.getElementById('mobile-menu');
      const icon = menuButton.querySelector('i');
      
      menuButton.addEventListener('click', function() {
        if (mobileMenu) {
          mobileMenu.classList.toggle('hidden');
          if (icon.classList.contains('fa-bars')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
          } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
          }
        }
      });

      if (mobileMenu) {
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
          link.addEventListener('click', function() {
            mobileMenu.classList.add('hidden');
            if (icon) {
              icon.classList.remove('fa-times');
              icon.classList.add('fa-bars');
            }
          });
        });
      }
    }
});
function initNavigation() {
    const isLoggedIn = localStorage.getItem('user_id') !== null;
    const authElements = document.querySelectorAll('.auth-required');
    
    if (isLoggedIn) {
        authElements.forEach(element => {
            element.classList.remove('hidden');
        });
    } else {
        authElements.forEach(element => {
            element.classList.add('hidden');
        });
    }
}
window.WishGrid = {
  API_ENDPOINTS,
  fetchGet,
  fetchPost,
  formatPrice,
  getPriorityStyles,
  getCategoryStyle,
  showAlert,
  getUrlParam,
  initNavigation
};