
const API_URL = "http://127.0.0.1:8001";
const hasRegistered = localStorage.getItem("registered") === "true";
const loggedInCustomer = localStorage.getItem("customer");

if (!hasRegistered) {

    alert(
        "Please register before accessing MiniStore."
    );

    window.location.href = "../LandingPage/landing.html";

}
else if (!loggedInCustomer) {

    alert(
        "Please sign in before accessing our products."
    );

    window.location.href =
        "../Auth/signin.html";

}

const signoutButton =
    document.querySelector("#signout-button");

if (signoutButton) {

    signoutButton.addEventListener(
        "click",
        handleSignOut
    );

}

async function handleSignOut() {

    const customerData =
        localStorage.getItem("customer");

    if (!customerData) {

        alert(
            "You are already signed out."
        );

        window.location.href =
            "../LandingPage/landing.html";

        return;

    }


    let customer;

    try {

        customer =
            JSON.parse(customerData);

    }
    catch (error) {

        console.error(
            "Unable to read customer data:",
            error
        );

        localStorage.removeItem(
            "customer"
        );

        window.location.href =
            "../LandingPage/landing.html";

        return;

    }

    if (!customer.email) {

        alert(
            "Unable to sign out. Customer information is missing."
        );

        return;

    }


    try {

        signoutButton.disabled = true;

        signoutButton.textContent =
            "Signing Out...";

        const response =
            await fetch(
                `${API_URL}/auth/customers/logout`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        email:
                            customer.email

                    })

                }
            );

        if (response.ok) {

            localStorage.removeItem(
                "customer"
            );

            localStorage.removeItem(
                "cart"
            );

            alert(
                "Sign out suucesssful"
            );

            window.location.href =
                "../LandingPage/landing.html";

            return;

        }

        let errorMessage =
            "Unable to sign out. Please try again.";


        try {

            const errorData =
                await response.json();

            if (errorData.detail) {

                errorMessage =
                    errorData.detail;

            }

        }
        catch (error) {

            console.error(
                "Could not read logout error:",
                error
            );

        }


        alert(errorMessage);

    }
    catch (error) {

        /*
         * This normally means the frontend
         * could not communicate with the backend.
         */

        console.error(
            "Logout error:",
            error
        );


        alert(
            "Unable to connect to the server. Please make sure the backend is running."
        );

    }
    finally {

        /*
         * Restore the button.
         */

        signoutButton.disabled =
            false;

        signoutButton.textContent =
            "Sign Out";

    }

}

const productCards = document.querySelectorAll(".product-card");
const cartHeading = document.querySelector("#cart-heading");
const cartContent = document.querySelector("#cart-content");
const orderModal = document.querySelector("#order-modal");
const orderDetails = document.querySelector("#order-details");
const modalTotal = document.querySelector("#modal-total");
const startNewOrderButton = document.querySelector("#start-new-order-btn");
let cart = JSON.parse(localStorage.getItem("cart")) || [];

addProductButtonEvents();
updatePage();

function addProductButtonEvents() {

    const addButtons =
        document.querySelectorAll(
            ".add-cart-btn"
        );


    addButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const productCard =
                        button.closest(
                            ".product-card"
                        );


                    addProductToCart(
                        productCard
                    );

                }
            );

        }
    );

}

// ADD PRODUCT TO CART

function addProductToCart(
    productCard
) {

    const product = {

        id:
            productCard.dataset.id,

        name:
            productCard.dataset.name,

        category:
            productCard.dataset.category,

        price:
            Number(
                productCard.dataset.price
            ),

        image:
            productCard.querySelector(
                ".product-image"
            ).src,

        quantity: 1

    };


    const existingProduct =
        cart.find(
            function (cartItem) {

                return cartItem.id ===
                    product.id;

            }
        );


    if (existingProduct) {

        existingProduct.quantity++;

    }

    else {

        cart.push(product);

    }


    saveCart();

    updatePage();

}

// INCREASE QUANTITY

function increaseQuantity(
    productId
) {

    const product =
        cart.find(
            function (cartItem) {

                return cartItem.id ===
                    productId;

            }
        );


    if (product) {

        product.quantity++;

    }


    saveCart();

    updatePage();

}

// DECREASE QUANTITY

function decreaseQuantity(
    productId
) {

    const product =
        cart.find(
            function (cartItem) {

                return cartItem.id ===
                    productId;

            }
        );


    if (!product) {

        return;

    }


    product.quantity--;


    if (product.quantity === 0) {

        cart =
            cart.filter(
                function (cartItem) {

                    return cartItem.id !==
                        productId;

                }
            );

    }


    saveCart();

    updatePage();

}

// REMOVE PRODUCT

function removeProduct(
    productId
) {

    cart =
        cart.filter(
            function (cartItem) {

                return cartItem.id !==
                    productId;

            }
        );


    saveCart();

    updatePage();

}

// SAVE CART TO LOCAL STORAGE

function saveCart() {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

}

// UPDATE PAGE

function updatePage() {

    displayCart();

    updateProductButtons();

}

// DISPLAY CART

function displayCart() {

    const totalQuantity =
        getTotalQuantity();


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


    cart.forEach(
        function (product) {

            const subtotal =
                product.price *
                product.quantity;


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

        }
    );


    const orderTotal =
        calculateOrderTotal();


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


        <button
            class="confirm-order-btn"
        >
            Confirm Order
        </button>

    `;


    cartContent.innerHTML =
        cartHTML;


    addRemoveButtonEvents();

    addConfirmOrderEvent();

}

// UPDATE PRODUCT BUTTONS

function updateProductButtons() {

    productCards.forEach(
        function (productCard) {

            const productId =
                productCard.dataset.id;


            const productAction =
                productCard.querySelector(
                    ".product-action"
                );


            const cartProduct =
                cart.find(
                    function (cartItem) {

                        return cartItem.id ===
                            productId;

                    }
                );


            if (cartProduct) {

                productCard.classList.add(
                    "selected"
                );


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

            }

            else {

                productCard.classList.remove(
                    "selected"
                );


                productAction.innerHTML = `

                    <button
                        class="add-cart-btn"
                    >

                        <span>

                            <img
                                src="../assets/images/icon-add-to-cart.svg"
                                alt="Add to cart"
                            >

                        </span>

                        Add to Cart

                    </button>

                `;

            }

        }
    );


    addProductButtonEvents();

    addQuantityButtonEvents();

}

// ADD QUANTITY BUTTON EVENTS

function addQuantityButtonEvents() {

    const increaseButtons =
        document.querySelectorAll(
            ".increase-btn"
        );


    const decreaseButtons =
        document.querySelectorAll(
            ".decrease-btn"
        );


    increaseButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const productId =
                        button.dataset.id;


                    increaseQuantity(
                        productId
                    );

                }
            );

        }
    );


    decreaseButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const productId =
                        button.dataset.id;


                    decreaseQuantity(
                        productId
                    );

                }
            );

        }
    );

}

// ADD REMOVE BUTTON EVENTS

function addRemoveButtonEvents() {

    const removeButtons =
        document.querySelectorAll(
            ".remove-cart-item"
        );


    removeButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const productId =
                        button.dataset.id;


                    removeProduct(
                        productId
                    );

                }
            );

        }
    );

}

// GET TOTAL QUANTITY

function getTotalQuantity() {

    let totalQuantity = 0;


    cart.forEach(
        function (product) {

            totalQuantity +=
                product.quantity;

        }
    );


    return totalQuantity;

}

// CALCULATE ORDER TOTAL

function calculateOrderTotal() {

    let total = 0;


    cart.forEach(
        function (product) {

            total +=
                product.price *
                product.quantity;

        }
    );


    return total;

}

// FORMAT PRICE

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

// ADD CONFIRM ORDER EVENT

function addConfirmOrderEvent() {

    const confirmOrderButton =
        document.querySelector(
            ".confirm-order-btn"
        );


    if (!confirmOrderButton) {

        return;

    }


    confirmOrderButton.addEventListener(
        "click",
        function () {

            showOrderModal();

        }
    );

}

// SHOW ORDER MODAL

function showOrderModal() {

    let orderHTML = "";


    cart.forEach(
        function (product) {

            const subtotal =
                product.price *
                product.quantity;


            orderHTML += `

                <div class="modal-order-item">

                    <div class="modal-product-left">

                        <img
                            src="${product.image}"
                            alt="${product.name}"
                            class="modal-product-image"
                        >


                        <div class="modal-product-info">

                            <h3>
                                ${product.name}
                            </h3>


                            <div
                                class="modal-product-price-info"
                            >

                                <span class="quantity">
                                    ${product.quantity}x
                                </span>


                                <span class="unit-price">
                                    @ ${formatPrice(product.price)}
                                </span>

                            </div>

                        </div>

                    </div>


                    <strong
                        class="modal-item-total"
                    >
                        ${formatPrice(subtotal)}
                    </strong>

                </div>

            `;

        }
    );


    orderDetails.innerHTML =
        orderHTML;


    modalTotal.textContent =
        formatPrice(
            calculateOrderTotal()
        );


    orderModal.classList.add(
        "active"
    );

}

if (startNewOrderButton) {

    startNewOrderButton.addEventListener(
        "click",
        function () {

            cart = [];


            saveCart();


            updatePage();


            orderModal.classList.remove(
                "active"
            );

        }
    );

}