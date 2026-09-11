const hasRegistered = localStorage.getItem("registered") === "true";

if (!hasRegistered) {

    alert(
        "Please register before signing in."
    );

    window.location.href =
        "register.html";
}

const form = document.querySelector("#signin-form");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const signinButton = document.querySelector(".signin-button");
const passwordToggle = document.querySelector("#password-toggle");
const API_URL = "http://127.0.0.1:8001";

// SHOW / HIDE PASSWORD

passwordToggle.addEventListener(
    "click",
    function () {

        if (passwordInput.type === "password") {

            passwordInput.type = "text";

            passwordToggle.setAttribute(
                "aria-label",
                "Hide password"
            );

        } else {

            passwordInput.type = "password";

            passwordToggle.setAttribute(
                "aria-label",
                "Show password"
            );

        }

    }
);

form.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        clearErrors();


        const email =
            emailInput.value.trim();

        const password =
            passwordInput.value;


        let hasError = false;


        if (email === "") {

            showError(
                emailInput,
                "Please enter your email."
            );

            hasError = true;

        }

        else if (!isValidEmail(email)) {

            showError(
                emailInput,
                "Please enter a valid email address."
            );

            hasError = true;

        }

        if (password === "") {

            showError(
                passwordInput,
                "Please enter your password."
            );

            hasError = true;

        }

        if (hasError) {

            return;

        }

        await loginCustomer(
            email,
            password
        );

    }
);

async function loginCustomer(
    email,
    password
) {

    try {

        signinButton.disabled = true;

        signinButton.textContent =
            "Signing In...";


        const response =
            await fetch(
                `${API_URL}/auth/customers/login`,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

                        email: email,

                        password: password

                    })

                }
            );


        if (response.ok) {

            const customer =
                await response.json();


            console.log(
                "Customer logged in successfully:",
                customer
            );

            localStorage.setItem(
                "customer",
                JSON.stringify(customer)
            );


            alert(
                "Login successful!"
            );

            window.location.href =
                "../Cart/cart.html";

            return;

        }

        const errorData =
            await response.json();


        const errorMessage =
            errorData.detail ||
            "Invalid email or password.";


        if (response.status === 401) {

            showFormError(
                errorMessage
            );

        }

        else if (response.status === 422) {

            handleValidationError(
                errorData
            );

        }

        else {

            showFormError(
                errorMessage
            );

        }

    }

    catch (error) {

        console.error(
            "Login error:",
            error
        );


        showFormError(
            "Unable to connect to the server. Please make sure the backend is running."
        );

    }

    finally {

        signinButton.disabled = false;

        signinButton.textContent =
            "Sign In";

    }

}


function isValidEmail(email) {

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(email);

}


function showError(
    input,
    message
) {

    input.classList.add(
        "input-error"
    );


    const errorMessage =
        document.createElement("small");


    errorMessage.classList.add(
        "error-message"
    );


    errorMessage.textContent =
        message;


    input.parentElement.appendChild(
        errorMessage
    );

}

function showFormError(message) {

    const errorMessage =
        document.createElement("div");


    errorMessage.classList.add(
        "form-error-message"
    );


    errorMessage.textContent =
        message;


    form.insertBefore(
        errorMessage,
        signinButton
    );

}

function clearErrors() {

    const inputs =
        form.querySelectorAll("input");


    inputs.forEach(
        function (input) {

            input.classList.remove(
                "input-error"
            );

        }
    );


    const errors =
        form.querySelectorAll(
            ".error-message"
        );


    errors.forEach(
        function (error) {

            error.remove();

        }
    );


    const formErrors =
        form.querySelectorAll(
            ".form-error-message"
        );


    formErrors.forEach(
        function (error) {

            error.remove();

        }
    );

}

function handleValidationError(
    errorData
) {

    if (!errorData.detail) {

        showFormError(
            "Please check your information and try again."
        );

        return;

    }


    if (Array.isArray(errorData.detail)) {

        errorData.detail.forEach(
            function (error) {

                const field =
                    error.loc?.[1];

                const message =
                    error.msg;


                if (field === "email") {

                    showError(
                        emailInput,
                        message
                    );

                }

                else if (field === "password") {

                    showError(
                        passwordInput,
                        message
                    );

                }

                else {

                    showFormError(
                        message
                    );

                }

            }
        );

    }

    else {

        showFormError(
            errorData.detail
        );

    }

}