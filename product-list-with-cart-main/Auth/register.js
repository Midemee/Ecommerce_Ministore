const form = document.querySelector("#register-form");
const emailInput = document.querySelector("#email");
const nameInput = document.querySelector("#fullname");
const passwordInput = document.querySelector("#password");
const confirmPasswordInput = document.querySelector("#confirm-password");
const signupButton = document.querySelector(".signup-button");
const passwordToggle = document.querySelector("#password-toggle");
const confirmPasswordToggle = document.querySelector("#confirm-password-toggle");

// BACKEND URL
const API_URL = "http://127.0.0.1:8001";

// CHECK REGISTRATION STATUS

const hasRegistered =
    localStorage.getItem("registered") === "true";


if (hasRegistered) {

    alert(
        "You have already registered. Please sign in."
    );

    window.location.href =
        "signin.html";
}

// SHOW / HIDE PASSWORD

function togglePasswordVisibility(
    input,
    button
) {

    if (input.type === "password") {

        input.type = "text";

        button.setAttribute(
            "aria-label",
            "Hide password"
        );

    } else {

        input.type = "password";

        button.setAttribute(
            "aria-label",
            "Show password"
        );

    }

}

passwordToggle.addEventListener(
    "click",
    function () {

        togglePasswordVisibility(
            passwordInput,
            passwordToggle
        );

    }
);

confirmPasswordToggle.addEventListener(
    "click",
    function () {

        togglePasswordVisibility(
            confirmPasswordInput,
            confirmPasswordToggle
        );

    }
);


form.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        clearErrors();


        const name =
            nameInput.value.trim();

        const email =
            emailInput.value.trim();

        const password =
            passwordInput.value;

        const confirmPassword =
            confirmPasswordInput.value;


        let hasError = false;

        // NAME VALIDATION

        if (name === "") {

            showError(
                nameInput,
                "Please enter your full name."
            );

            hasError = true;

        }

        else if (name.length < 3) {

            showError(
                nameInput,
                "Name must be at least 3 characters."
            );

            hasError = true;

        }

        else if (name.length > 20) {

            showError(
                nameInput,
                "Name must not exceed 20 characters."
            );

            hasError = true;

        }

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
                "Please enter a password."
            );

            hasError = true;

        }

        else if (password.length < 8) {

            showError(
                passwordInput,
                "Password must be at least 8 characters."
            );

            hasError = true;

        }

        else if (password.length > 20) {

            showError(
                passwordInput,
                "Password must not exceed 20 characters."
            );

            hasError = true;

        }

        if (confirmPassword === "") {

            showError(
                confirmPasswordInput,
                "Please confirm your password."
            );

            hasError = true;

        }

        else if (
            password !== confirmPassword
        ) {

            showError(
                confirmPasswordInput,
                "Passwords do not match."
            );

            hasError = true;

        }

        if (hasError) {

            return;

        }

        await registerCustomer(
            name,
            email,
            password
        );

    }
);

async function registerCustomer(
    name,
    email,
    password
) {

    try {

        signupButton.disabled = true;

        signupButton.textContent =
            "Creating Account...";


        const response =
            await fetch(
                `${API_URL}/auth/customers/register`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        name: name,

                        email: email,

                        password: password

                    })

                }
            );

        if (response.ok) {

            const customer =
                await response.json();


            console.log(
                "Customer registered successfully:",
                customer
            );


            localStorage.setItem(
                "registered",
                "true"
            );


            alert(
                "Account created successfully! Please sign in."
            );

            window.location.href =
                "signin.html";
            return;

        }

        // BACKEND ERROR

        const errorData =
            await response.json();


        const errorMessage =
            errorData.detail ||
            "Registration failed. Please try again.";


        if (response.status === 409) {

            showError(
                emailInput,
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
            "Registration error:",
            error
        );


        showFormError(
            "Unable to connect to the server. Please make sure the backend is running."
        );

    }

    finally {

        signupButton.disabled = false;

        signupButton.textContent =
            "Sign up";

    }

}

// EMAIL VALIDATION

function isValidEmail(email) {

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(email);

}

// SHOW FIELD ERROR

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

// SHOW GENERAL FORM ERROR

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
        signupButton
    );

}

// CLEAR ERRORS

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

// HANDLE FASTAPI VALIDATION ERRORS

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


                if (field === "name") {

                    showError(
                        nameInput,
                        message
                    );

                }

                else if (field === "email") {

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