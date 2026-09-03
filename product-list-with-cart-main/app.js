const productCards = document.querySelectorAll(".product-card");
const cartHeading = document.querySelector("#cart-heading");
const cartContent = document.querySelector("#cart-content");

let cart = [];

productCards.forEach(function (productCard) {

    const addToCartButton =
        productCard.querySelector(".add-cart-btn");

    addToCartButton.addEventListener("click", function () {

        addProductToCart(productCard);

    });

});


function addProductToCart(productCard) {

    const product = {
        id: productCard.dataset.id,
        name: productCard.dataset.name,
        category: productCard.dataset.category,
        price: Number(productCard.dataset.price),
        quantity: 1
    };


    const existingProduct = cart.find(function (cartItem) {

        return cartItem.id === product.id;

    });


    if (existingProduct) {

        existingProduct.quantity++;

    } else {

        cart.push(product);

    }


    updatePage();

}



function increaseQuantity(productId) {

    const product = cart.find(function (cartItem) {

        return cartItem.id === productId;

    });

    if (product) {

        product.quantity++;

    }
    updatePage();

}



function decreaseQuantity(productId) {

    const product = cart.find(function (cartItem) {

        return cartItem.id === productId;

    });


    if (!product) {
        return;
    }


    product.quantity--;


    if (product.quantity === 0) {

        cart = cart.filter(function (cartItem) {

            return cartItem.id !== productId;

        });

    }


    updatePage();

}



function removeProduct(productId) {

    cart = cart.filter(function (cartItem) {

        return cartItem.id !== productId;

    });


    updatePage();

}



function updatePage() {

    displayCart();

    updateProductButtons();

}



function displayCart() {

    const totalQuantity = getTotalQuantity();


    cartHeading.textContent =
        `Your Cart (${totalQuantity})`;


    if (cart.length === 0) {

        cartContent.innerHTML = `

            <div class="empty-cart">

                <div class="empty-cart-icon">
                    🛍️
                </div>

                <h3>
                    Your cart is empty
                </h3>

                <p>
                    Your added items will appear here.
                </p>

            </div>

        `;

        return;

    }


    let cartHTML = "";


    cart.forEach(function (product) {

        const subtotal =
            product.price * product.quantity;


        cartHTML += `

            <div class="cart-item">

                <div class="cart-item-details">

                    <h3>
                        ${product.name}
                    </h3>

                    <div class="cart-item-price">

                        <span class="cart-item-quantity">
                            ${product.quantity}x
                        </span>

                        <span>
                            @ ${formatPrice(product.price)}
                        </span>

                        <strong>
                            ${formatPrice(subtotal)}
                        </strong>

                    </div>

                </div>


                <button
                    class="remove-cart-item"
                    data-id="${product.id}"
                >
                    ×
                </button>

            </div>

        `;

    });


    const orderTotal = calculateOrderTotal();


    cartHTML += `

        <div class="cart-total">

            <span>
                Order Total
            </span>

            <strong>
                ${formatPrice(orderTotal)}
            </strong>

        </div>


        <div class="delivery-message">

            <p>
                Continue.
            </p>

        </div>


        <button class="confirm-order-btn">
            Confirm Order
        </button>

    `;


    cartContent.innerHTML = cartHTML;


    addRemoveButtonEvents();

}



function updateProductButtons() {

    productCards.forEach(function (productCard) {

        const productId =
            productCard.dataset.id;


        const productAction =
            productCard.querySelector(".product-action");


        const cartProduct =
            cart.find(function (cartItem) {

                return cartItem.id === productId;

            });


        if (cartProduct) {

            productCard.classList.add("selected");


            productAction.innerHTML = `

                <div class="quantity-control">

                    <button
                        class="decrease-btn"
                        data-id="${productId}"
                    >
                        −
                    </button>


                    <span>
                        ${cartProduct.quantity}
                    </span>


                    <button
                        class="increase-btn"
                        data-id="${productId}"
                    >
                        +
                    </button>

                </div>

            `;

        } else {

            productCard.classList.remove("selected");


            productAction.innerHTML = `

                <button class="add-cart-btn">

                    <span>
                        <img src="/assets/images/icon-add-to-cart.svg">
                    </span>

                    Add to Cart

                </button>

            `;

        }

    });


    addProductButtonEvents();

    addQuantityButtonEvents();

}



function addProductButtonEvents() {

    const addButtons =
        document.querySelectorAll(".add-cart-btn");


    addButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const productCard =
                button.closest(".product-card");


            addProductToCart(productCard);

        });

    });

}



function addQuantityButtonEvents() {

    const increaseButtons =
        document.querySelectorAll(".increase-btn");


    const decreaseButtons =
        document.querySelectorAll(".decrease-btn");



    increaseButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const productId =
                button.dataset.id;


            increaseQuantity(productId);

        });

    });



    decreaseButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const productId =
                button.dataset.id;


            decreaseQuantity(productId);

        });

    });

}



function addRemoveButtonEvents() {

    const removeButtons =
        document.querySelectorAll(".remove-cart-item");


    removeButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const productId =
                button.dataset.id;


            removeProduct(productId);

        });

    });

}



function getTotalQuantity() {

    let totalQuantity = 0;


    cart.forEach(function (product) {

        totalQuantity += product.quantity;

    });


    return totalQuantity;

}



function calculateOrderTotal() {

    let total = 0;


    cart.forEach(function (product) {

        total += product.price * product.quantity;

    });


    return total;

}



function formatPrice(price) {

    return new Intl.NumberFormat(
        "en-NG",
        {
            style: "currency",
            currency: "NGN",
            minimumFractionDigits: 0
        }
    ).format(price);

}