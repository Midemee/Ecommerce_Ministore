const signupLink = document.querySelector("#signup-link");
const signinLink = document.querySelector("#signin-link");
const productsLink = document.querySelector("#products-link");
const heroButton = document.querySelector("#hero-button");
const footerProductsLink = document.querySelector("#footer-products-link");
const footerSigninLink = document.querySelector("#footer-signin-link");
const footerSignupLink = document.querySelector("#footer-signup-link");
const currentYear = document.querySelector("#current-year");
const hasRegistered = localStorage.getItem("registered") === "true";
const loggedInCustomer = localStorage.getItem("customer");
const isLoggedIn = loggedInCustomer !== null;

currentYear.textContent = new Date().getFullYear();

if (hasRegistered) {

    heroButton.textContent =
        "Sign In";

    heroButton.href =
        "../Auth/signin.html";

}

else {

    heroButton.textContent =
        "Sign Up";

    heroButton.href =
        "../Auth/register.html";

}

signupLink.textContent =
    "Sign Up";

signupLink.href =
    "../Auth/register.html";

footerSignupLink.textContent =
    "Sign Up";

footerSignupLink.href =
    "../Auth/register.html";

signupLink.addEventListener(
    "click",
    function (event) {

        if (hasRegistered) {

            event.preventDefault();

            alert(
                "You have already registered. Please sign in."
            );

            window.location.href =
                "../Auth/signin.html";

        }

    }
);

footerSignupLink.addEventListener(
    "click",
    function (event) {

        if (hasRegistered) {

            event.preventDefault();

            alert(
                "You have already registered. Please sign in."
            );

            window.location.href =
                "../Auth/signin.html";

        }

    }
);

function handleProductsClick(event) {


    if (!hasRegistered) {

        event.preventDefault();

        alert(
            "Please register before accessing our products."
        );

        window.location.href =
            "../Auth/register.html";

        return;

    }

    if (!isLoggedIn) {

        event.preventDefault();

        alert(
            "Please sign in before accessing our products."
        );

        window.location.href =
            "../Auth/signin.html";

        return;

    }

}

productsLink.addEventListener(
    "click",
    handleProductsClick
);


footerProductsLink.addEventListener(
    "click",
    handleProductsClick
);

function handleSigninClick(event) {

    if (!hasRegistered) {

        event.preventDefault();

        alert(
            "Please register before signing in."
        );

        window.location.href =
            "../Auth/register.html";

        return;

    }

}

signinLink.addEventListener(
    "click",
    handleSigninClick
);


footerSigninLink.addEventListener(
    "click",
    handleSigninClick
);