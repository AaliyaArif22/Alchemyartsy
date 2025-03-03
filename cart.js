document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll('.cart-btn').forEach((button, index) => {
        button.addEventListener('click', function (event) {
            event.preventDefault();

            const productName = button.closest('.box').querySelector('.content h3').textContent;
            const productPrice = button.closest('.box').querySelector('.content .price').textContent;
            const productImg = button.closest('.box').querySelector('.image img').src;

            const product = {
                id: index + 1,
                name: productName,
                price: productPrice,
                img: productImg,
                quantity: 1
            };

            let cartData = localStorage.getItem('cart');
            cartData = cartData ? JSON.parse(cartData) : [];

            const existingProductIndex = cartData.findIndex(item => item.id === product.id);

            if (existingProductIndex !== -1) {
                cartData[existingProductIndex].quantity += 1;
            } else {
                cartData.push(product);
            }

            localStorage.setItem('cart', JSON.stringify(cartData));

            updateCartItemCount();
            showSnackbar(`${productName} added to cart!`);
        });
    });

    function showSnackbar(message) {
        const snackbar = document.createElement("div");
        snackbar.classList.add("snackbar");
        snackbar.textContent = message;
        document.body.appendChild(snackbar);
        setTimeout(() => snackbar.classList.add("show"), 100);
        setTimeout(() => {
            snackbar.classList.remove("show");
            document.body.removeChild(snackbar);
        }, 3000);
    }

    function updateCartItemCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
        const cartIcon = document.querySelector('.cart-count');

        if (cartIcon) {
            cartIcon.textContent = cartCount > 0 ? cartCount : '';
        }
    }

    updateCartItemCount();
});

function getCartData() {
    let cartData = localStorage.getItem("cart");
    return cartData ? JSON.parse(cartData) : [];
}

function updateCart() {
    const cartItems = getCartData();
    const cartItemsContainer = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cartItems.forEach(item => {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("cart-item");
        itemDiv.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <p>Price: ${item.price}</p>
                <div class="cart-item-quantity">
                    <button class="minus-item" onclick="decreaseQuantity(${item.id})">-</button>
                    <span class="item-quantity">${item.quantity}</span>
                    <button class="plus-item" onclick="increaseQuantity(${item.id})">+</button>
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
        `;
        cartItemsContainer.appendChild(itemDiv);
        total += parseInt(item.price.replace("Rs ", "")) * item.quantity;
    });

    cartTotal.textContent = `Rs ${total}`;
}

function removeFromCart(itemId) {
    let cartData = getCartData();
    cartData = cartData.filter(item => item.id !== itemId);
    localStorage.setItem("cart", JSON.stringify(cartData));
    updateCart();
}

function decreaseQuantity(itemId) {
    let cartData = getCartData();
    const itemIndex = cartData.findIndex(item => item.id === itemId);

    if (itemIndex !== -1 && cartData[itemIndex].quantity > 1) {
        cartData[itemIndex].quantity -= 1
    } else if (itemIndex !== -1) {
        cartData.splice(itemIndex, 1);
    }

    localStorage.setItem("cart", JSON.stringify(cartData));
    updateCart();
}

function increaseQuantity(itemId) {
    let cartData = getCartData();
    const itemIndex = cartData.findIndex(item => item.id === itemId);

    if (itemIndex !== -1) {
        cartData[itemIndex].quantity += 1;
    }

    localStorage.setItem("cart", JSON.stringify(cartData));
    updateCart();
}

window.onload = function () {
    updateCart();
};
