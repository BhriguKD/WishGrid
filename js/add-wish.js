const urlParams = new URLSearchParams(window.location.search);
const wishId = urlParams.get('id');

const form = document.getElementById('wish-form');
const formTitle = document.getElementById('form-title');
const wishIdInput = document.getElementById('wish-id');
const nameInput = document.getElementById('name');
const descriptionInput = document.getElementById('description');
const priceInput = document.getElementById('price');
const categoryInput = document.getElementById('category');
const priorityInputs = document.querySelectorAll('input[name="priority"]');
const imageUrlInput = document.getElementById('image-url');
const itemLinkInput = document.getElementById('item-link');
const alertDiv = document.getElementById('alert');

async function loadWishData() {
    if (!wishId) return;

    try {
        const response = await fetch(`../php/get_wishes.php?id=${wishId}`);
        if (!response.ok) {
            throw new Error('Failed to load wish data');
        }

        const data = await response.json();
        const wish = Array.isArray(data) ? data[0] : data;
        
        if (wish && wish.id) {
            formTitle.textContent = 'Edit Wish';
            wishIdInput.value = wish.id;
            nameInput.value = wish.name || '';
            descriptionInput.value = wish.description || '';
            priceInput.value = wish.price || '';
            categoryInput.value = wish.category || '';
            
            if (wish.priority) {
                priorityInputs.forEach(input => {
                    if (input.value.toLowerCase() === wish.priority.toLowerCase()) {
                        input.checked = true;
                    }
                });
            }
            
            if (wish.image_url) imageUrlInput.value = wish.image_url;
            if (wish.item_link) itemLinkInput.value = wish.item_link;
        } else {
            throw new Error('Invalid wish data');
        }
    } catch (error) {
        showAlert('Failed to load wish data. Please try again.', 'error');
    }
}

async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(form);
    const data = {
        name: formData.get('name'),
        description: formData.get('description'),
        price: parseFloat(formData.get('price')),
        category: formData.get('category'),
        priority: formData.get('priority'),
        image_url: formData.get('image_url') || null,
        item_link: formData.get('item_link') || null
    };
    if (wishId) {
        data.id = parseInt(wishId);
    }

    try {
        const endpoint = wishId ? '../php/update_wish.php' : '../php/add_wish.php';
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Failed to save wish');
        }

        const result = await response.json();
        
        if (result.success) {
            showAlert(wishId ? 'Wish updated successfully!' : 'Wish added successfully!', 'success');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        } else {
            showAlert('Failed to save wish. Please try again.', 'error');
        }
    } catch (error) {
        showAlert('An error occurred. Please try again.', 'error');
    }
}

function showAlert(message, type = 'success') {
    alertDiv.textContent = message;
    alertDiv.className = `text-${type === 'success' ? 'green' : 'red'}-600 text-sm mb-4`;
    alertDiv.classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadWishData();
    form.addEventListener('submit', handleSubmit);
}); 