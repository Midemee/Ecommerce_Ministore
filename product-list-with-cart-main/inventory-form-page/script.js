const API_URL = "http://127.0.0.1:8000";

const addProductForm = document.querySelector("#addProductForm");
const updateProductForm = document.querySelector("#updateProductForm");
const getProductForm = document.querySelector("#getProductForm");
const deleteProductForm = document.querySelector("#deleteProductForm");
const getProductsButton = document.querySelector("#getProductsButton");

const productList = document.querySelector("#productList");
const productResult = document.querySelector("#productResult");


async function addProduct() {

    const productName = document.querySelector("#productName").value.trim();
    const productDescription =
        document.querySelector("#productDescription").value.trim();
    const productPrice =
        Number(document.querySelector("#productPrice").value);
    const productQuantity =
        Number(document.querySelector("#productQuantity").value);
    const storeKeeperEmail =
        document.querySelector("#addStoreKeeperEmail").value.trim();


    if (!productName || !productDescription || !productPrice || !productQuantity || !storeKeeperEmail) {
        alert("Please fill in all the product details");
        return;
    }


    const product = {
        name: productName,
        description: productDescription,
        price: productPrice,
        quantity: productQuantity,
        store_keeper_email: storeKeeperEmail    
    };


    try {

        const response = await fetch(
            `${API_URL}/inventory/create_product`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(product)
            }
        );


        const data = await response.json();


        if (!response.ok) {
            alert(data.detail || "Failed to add product");
            return;
        }


        alert("Product added successfully");

        addProductForm.reset();

        getAllProducts();

    } catch (error) {

    console.log(error);
        alert("Could not connect to the server");

    }
}


async function updateProduct() {

    const product = {
        id: Number(document.querySelector("#updateProductId").value),
        name: document.querySelector("#updateProductName").value.trim(),
        description:
            document.querySelector("#updateProductDescription").value.trim(),
        price:
            Number(document.querySelector("#updateProductPrice").value),
        quantity:
            Number(document.querySelector("#updateProductQuantity").value),
        store_keeper_email:
            document.querySelector("#updateStoreKeeperEmail").value.trim()
    };


    if (!product.id || !product.name || !product.description ||
        !product.price || !product.quantity || !product.store_keeper_email) {

        alert("Please fill in all the product details");
        return;
    }


    try {

        const response = await fetch(
            `${API_URL}/inventory/update_product`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(product)
            }
        );


        const data = await response.json();


        if (!response.ok) {
            alert(data.detail || "Failed to update product");
            return;
        }


        alert("Product updated successfully");

        updateProductForm.reset();

        getAllProducts();

    } catch (error) {

        console.log(error);
        alert("Could not connect to the server");

    }
}


async function getProduct() {

    const id = document.querySelector("#getProductId").value;
    const email = document.querySelector("#getProductEmail").value.trim();


    if (!id || !email) {
        alert("Enter the product ID and email");
        return;
    }


    try {

        const response = await fetch(
            `${API_URL}/inventory/get_product?id=${encodeURIComponent(id)}&store_keeper_email=${encodeURIComponent(email)}`
        );


        const product = await response.json();


        if (!response.ok) {
            alert(product.detail || "Product not found");
            return;
        }


        displayProduct(product);

    } catch (error) {

        console.log(error);
        alert("Could not connect to the server");

    }
}


function displayProduct(product) {

    productResult.innerHTML = `
        <h3>Product Information</h3>

        <p><strong>ID:</strong> ${product.id}</p>

        <p><strong>Name:</strong> ${product.name}</p>

        <p><strong>Description:</strong> ${product.description}</p>

        <p><strong>Price:</strong> ₦${product.price}</p>

        <p><strong>Quantity:</strong> ${product.quantity}</p>
    `;
}


async function deleteProduct() {

    const id = document.querySelector("#deleteProductId").value;
    const email = document.querySelector("#deleteProductEmail").value.trim();


    if (!id || !email) {
        alert("Enter the product ID and email");
        return;
    }


    const confirmed = confirm(
        "Are you sure you want to delete this product?"
    );


    if (!confirmed) {
        return;
    }


    try {

        const response = await fetch(
            `${API_URL}/inventory/delete_product?id=${encodeURIComponent(id)}&store_keeper_email=${encodeURIComponent(email)}`,
            {
                method: "DELETE"
            }
        );


        const data = await response.json();


        if (!response.ok) {
            alert(data.detail || "Failed to delete product");
            return;
        }


        alert("Product deleted successfully");

        deleteProductForm.reset();

        getAllProducts();

    } catch (error) {

        console.log(error);
        alert("Could not connect to the server");

    }
}


async function getAllProducts() {
    console.log(document.querySelector("#storeKeeperEmail").value.trim())

    const email = document.querySelector("#storeKeeperEmail").value.trim();


    if (!email) {
        alert("Enter the store keeper email first");
        return;
    }
    try {

        const response = await fetch(
            `${API_URL}/inventory/get_all_products?store_keeper_email=${encodeURIComponent(email)}`
        );


        const products = await response.json();


        if (!response.ok) {
            alert(products.detail || "Failed to get products");
            return;
        }


        displayProducts(products);

    } catch (error) {

        console.log(error);
        alert("Could not connect to the server");

    }
}


function displayProducts(products) {

    productList.innerHTML = "";


    if (products.length == 0) {

        productList.innerHTML = `
            <tr>
                <td colspan="5">
                    No products in inventory.
                </td>
            </tr>
        `;

        return;
    }


    products.forEach((product) => {

        const {
            id,
            name,
            description,
            price,
            quantity
        } = product;


        const row = document.createElement("tr");


        row.innerHTML = `
            <td>${id}</td>
            <td>${name}</td>
            <td>${description}</td>
            <td>₦${price}</td>
            <td>${quantity}</td>
        `;


        productList.appendChild(row);

    });
}


addProductForm.addEventListener("submit", (event) => {

    event.preventDefault();

    addProduct();

});


updateProductForm.addEventListener("submit", (event) => {

    event.preventDefault();

    updateProduct();

});


getProductForm.addEventListener("submit", (event) => {

    event.preventDefault();

    getProduct();

});


deleteProductForm.addEventListener("submit", (event) => {

    event.preventDefault();

    deleteProduct();

});


getProductsButton.addEventListener("click", () => {

    getAllProducts();

});