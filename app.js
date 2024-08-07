document.addEventListener('DOMContentLoaded', () => {
    const config = {
        accountId: '', ///YOUR accountId
        accessToken: '' ///YOUR  accessToken
    };
    
    const Contact = {
        phone: 'YOUR_PHONE_NUMBER', // YOUR PHONE NUMBER
        email: 'YOUR_EMAIL_ADDRESS', // YOUR EMAIL ADDRESS 
        description: 'YOUR_DESCRIPTION' // YOUR DESCRIPTION
    };

    let currentLanguage = 'en'; // Default language

    const apiUrl = 'https://api.dkon.app/api/v3/method/market.getMyItems';
    const productsContainer = document.getElementById('products');
    const modal = document.getElementById('product-modal');
    const modalContent = document.getElementById('modal-body');
    const closeModal = document.querySelector('.close');
    const contactInfo = document.getElementById('contact-info');

    function loadTranslations(language) {
        return fetch(`translations/${language}.json`)
            .then(response => response.json())
            .then(data => {
                return data;
            });
    }

    function fetchProducts() {
        const formData = new FormData();
        formData.append('accountId', config.accountId);
        formData.append('accessToken', config.accessToken);

        fetch(apiUrl, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.error === false) {
                displayProducts(data.items);
            } else {
                console.error('Error fetching products:', data.error_code);
            }
        })
        .catch(error => console.error('Error:', error));
    }

    function displayProducts(items) {
        loadTranslations(currentLanguage).then(translations => {
            productsContainer.innerHTML = '';

            items.forEach(item => {
                const productElement = document.createElement('div');
                productElement.classList.add('product');

                productElement.innerHTML = `
                    <img src="${item.previewImgUrl}" alt="${item.itemTitle}">
                    <h2>${item.itemTitle}</h2>
                    <p>${translations.priceLabel}: $${item.price}</p>
                `;

                productElement.addEventListener('click', () => showProductDetails(item));

                productsContainer.appendChild(productElement);
            });
        });
    }

    function showProductDetails(item) {
        loadTranslations(currentLanguage).then(translations => {
            modalContent.innerHTML = `
                <img src="${item.previewImgUrl}" alt="${item.itemTitle}">
                <h2>${item.itemTitle}</h2>
                <p>${item.itemContent}</p>
                <p>${translations.priceLabel}: $${item.price}</p>
                <button class="call-button" onclick="callSeller()">${translations.callButton}</button>
            `;
            modal.style.display = 'block';
        });
    }

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.onclick = event => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };

    window.callSeller = function() {
        loadTranslations(currentLanguage).then(translations => {
            window.location.href = `tel:${Contact.phone}`;
        });
    };

    function updateContactInfo(translations) {
        contactInfo.innerHTML = `
            <p>${translations.contactInfo.phone}: ${Contact.phone}</p>
            <p>${translations.contactInfo.email}: ${Contact.email}</p>
            <p>${translations.contactInfo.description}</p>
        `;
    }

    function changeLanguage(event) {
        currentLanguage = event.target.value;
        loadTranslations(currentLanguage).then(translations => {
            updateContactInfo(translations);
            fetchProducts(); // Refetch products to apply translations
        });
    }

    // Initial load
    loadTranslations(currentLanguage).then(translations => {
        updateContactInfo(translations);
        fetchProducts();
    });
});
