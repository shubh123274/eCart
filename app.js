const priceInput = document.getElementById("priceInput");
const searchBtn = document.getElementById("searchBtn");
const results = document.getElementById("results");

const rangeSearchBtn = document.getElementById("rangeSearchBtn");
const minPriceInput = document.getElementById("minPrice");
const maxPriceInput = document.getElementById("maxPrice");




function getAllProducts() {

    const products = [];

    storeData.categories.forEach(category => {

        category.subcategories.forEach(subcategory => {

            subcategory.products.forEach(product => {

                products.push(product);

            });

        });

    });

    return products;
}




const allProducts = getAllProducts();



const productsByPrice = [...allProducts].sort(
    (a, b) => a.price - b.price
);




function lowerBound(products, target) {

    let left = 0;
    let right = products.length;

    while (left < right) {

        const mid = Math.floor((left + right) / 2);

        if (products[mid].price < target) {

            left = mid + 1;

        } else {

            right = mid;

        }
    }

    return left;
}




function findClosestProducts(targetPrice) {

    const index = lowerBound(productsByPrice, targetPrice);

    let left = index - 1;
    let right = index;

    const closest = [];

   
    while (closest.length < 3 && (left >= 0 || right < productsByPrice.length)) {

        if (left < 0) {

            closest.push(productsByPrice[right]);
            right++;

        } else if (right >= productsByPrice.length) {

            closest.push(productsByPrice[left]);
            left--;

        } else {

            const leftDifference =
                Math.abs(productsByPrice[left].price - targetPrice);

            const rightDifference =
                Math.abs(productsByPrice[right].price - targetPrice);


            if (leftDifference <= rightDifference) {

                closest.push(productsByPrice[left]);
                left--;

            } else {

                closest.push(productsByPrice[right]);
                right++;

            }
        }
    }

    return closest;
}




function displayProducts(products) {

    results.innerHTML = "";


    if (products.length === 0) {

        results.innerHTML = `
            <p class="message">
                No products found.
            </p>
        `;

        return;
    }


    products.forEach(product => {

        const card = document.createElement("div");

        card.className = "product-card";


        card.innerHTML = `

            <h3>${product.name}</h3>

            <p>
                <strong>Brand:</strong>
                ${product.brand}
            </p>

            <p class="price">
                ₹${product.price.toLocaleString("en-IN")}
            </p>

            <p class="rating">
                ⭐ ${product.rating}
                (${product.reviews} reviews)
            </p>

            <p>
                <strong>Stock:</strong>
                ${product.stock}
            </p>

            <button
                class="view-btn"
                onclick="viewProduct('${product.id}')"
            >
                View Product
            </button>

            <button onclick="addToCart('${product.id}')">
    Add to Cart
</button>

        `;


        results.appendChild(card);

    });
}




function viewProduct(productId) {

    const product = allProducts.find(
        product => product.id === productId
    );


    if (product) {

        addToRecentlyViewed(product);

        alert(
            `${product.name}\n\n` +
            `Brand: ${product.brand}\n` +
            `Price: ₹${product.price.toLocaleString("en-IN")}\n` +
            `Rating: ⭐ ${product.rating}`
        );

    }
}



searchBtn.addEventListener("click", () => {

    const targetPrice = Number(priceInput.value);


    if (
        priceInput.value.trim() === "" ||
        !Number.isFinite(targetPrice) ||
        targetPrice <= 0
    ) {

        results.innerHTML = `
            <p class="message">
                Please enter a valid price.
            </p>
        `;

        return;
    }


    const closestProducts =
        findClosestProducts(targetPrice);


    displayProducts(closestProducts);

});




rangeSearchBtn.addEventListener("click", () => {

    const minPrice = Number(minPriceInput.value);
    const maxPrice = Number(maxPriceInput.value);


    

    if (
        minPriceInput.value.trim() === "" ||
        maxPriceInput.value.trim() === "" ||
        !Number.isFinite(minPrice) ||
        !Number.isFinite(maxPrice) ||
        minPrice < 0 ||
        maxPrice < 0
    ) {

        results.innerHTML = `
            <p class="message">
                Please enter valid minimum and maximum prices.
            </p>
        `;

        return;
    }


    

    if (minPrice > maxPrice) {

        results.innerHTML = `
            <p class="message">
                Minimum price cannot be greater than maximum price.
            </p>
        `;

        return;
    }


   

    const startIndex =
        lowerBound(productsByPrice, minPrice);


   

    const endIndex =
        lowerBound(productsByPrice, maxPrice + 0.01);


    const matchingProducts =
        productsByPrice.slice(startIndex, endIndex);


    displayProducts(matchingProducts);

});

const topK = document.getElementById("topK");
const popularProductsContainer =
    document.getElementById("popularProducts");


function getPopularProducts(k) {

    const productsWithPopularity = allProducts.map(product => {

        return {
            ...product,
            popularity: product.rating * product.reviews
        };

    });


    productsWithPopularity.sort(
        (a, b) => b.popularity - a.popularity
    );


    return productsWithPopularity.slice(0, k);
}



function displayPopularProducts() {

    const k = Number(topK.value);

    const popularProducts = getPopularProducts(k);

    popularProductsContainer.innerHTML = "";


    popularProducts.forEach((product, index) => {

        const card = document.createElement("div");

        card.className = "product-card popular-card";


        card.innerHTML = `

            <div class="rank">
                #${index + 1}
            </div>

            <h3>${product.name}</h3>

            <p>
                <strong>Brand:</strong>
                ${product.brand}
            </p>

            <p class="price">
                ₹${product.price.toLocaleString("en-IN")}
            </p>

            <p class="rating">
                ⭐ ${product.rating}
                (${product.reviews} reviews)
            </p>

            <p>
                <strong>Popularity:</strong>
                ${product.popularity.toLocaleString("en-IN")}
            </p>

            <button
                class="view-btn"
                onclick="viewProduct('${product.id}')"
            >
                View Product
            </button>

            <button onclick="addToCart('${product.id}')">
    Add to Cart
</button>

        `;


        popularProductsContainer.appendChild(card);

    });

}



topK.addEventListener("change", displayPopularProducts);


displayPopularProducts();

const recentProductsContainer =
    document.getElementById("recentProducts");

const clearHistoryBtn =
    document.getElementById("clearHistoryBtn");


const recentHistory = [];

const recentHistorySet = new Set();


function addToRecentlyViewed(product) {

    if (recentHistorySet.has(product.id)) {

        const oldIndex =
            recentHistory.findIndex(
                item => item.id === product.id
            );

        recentHistory.splice(oldIndex, 1);

    } else {

        recentHistorySet.add(product.id);

    }


    recentHistory.unshift(product);


    if (recentHistory.length > 5) {

        const removedProduct =
            recentHistory.pop();

        recentHistorySet.delete(
            removedProduct.id
        );

    }


    displayRecentlyViewed();
}


function displayRecentlyViewed() {

    recentProductsContainer.innerHTML = "";


    if (recentHistory.length === 0) {

        recentProductsContainer.innerHTML = `
            <p class="message">
                No recently viewed products.
            </p>
        `;

        return;
    }


    recentHistory.forEach(product => {

        const card =
            document.createElement("div");

        card.className =
            "product-card recent-card";


        card.innerHTML = `

            <h3>${product.name}</h3>

            <p>
                <strong>Brand:</strong>
                ${product.brand}
            </p>

            <p class="price">
                ₹${product.price.toLocaleString("en-IN")}
            </p>

            <p class="rating">
                ⭐ ${product.rating}
                (${product.reviews} reviews)
            </p>

            <button
                class="view-btn"
                onclick="viewProduct('${product.id}')"
            >
                View Product
            </button>

            <button onclick="addToCart('${product.id}')">
    Add to Cart
</button>

        `;


        recentProductsContainer.appendChild(card);

    });
}


clearHistoryBtn.addEventListener("click", () => {

    recentHistory.length = 0;

    recentHistorySet.clear();

    displayRecentlyViewed();

});


displayRecentlyViewed();


const cartItemsContainer = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");
const undoBtn = document.getElementById("undo-btn");
const redoBtn = document.getElementById("redo-btn");
const cartHistory = document.getElementById("cart-history");

let cart = [];
let undoStack = [];
let redoStack = [];
let operationHistory = [];

function saveCartState(action) {
    undoStack.push(JSON.stringify(cart));
    redoStack = [];
    operationHistory.push(action);
    displayCart();
}

function addToCart(productId) {
    const product = allProducts.find(
        item => String(item.id) === String(productId)
    );

    if (!product) return;

    saveCartState(`Added ${product.name}`);

    const existing = cart.find(
        item => String(item.id) === String(productId)
    );

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    displayCart();
}

function changeQuantity(productId, amount) {
    const item = cart.find(
        product => String(product.id) === String(productId)
    );

    if (!item) return;

    saveCartState(
        `${amount > 0 ? "Increased" : "Decreased"} quantity of ${item.name}`
    );

    item.quantity += amount;

    if (item.quantity <= 0) {
        cart = cart.filter(
            product => String(product.id) !== String(productId)
        );
    }

    displayCart();
}

function removeFromCart(productId) {
    const item = cart.find(
        product => String(product.id) === String(productId)
    );

    if (!item) return;

    saveCartState(`Removed ${item.name}`);

    cart = cart.filter(
        product => String(product.id) !== String(productId)
    );

    displayCart();
}

function undoCart() {
    if (undoStack.length === 0) return;

    redoStack.push(JSON.stringify(cart));
    cart = JSON.parse(undoStack.pop());
    operationHistory.push("Undo operation");
    displayCart();
}

function redoCart() {
    if (redoStack.length === 0) return;

    undoStack.push(JSON.stringify(cart));
    cart = JSON.parse(redoStack.pop());
    operationHistory.push("Redo operation");
    displayCart();
}

function displayCart() {
    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
        cartItemsContainer.innerHTML =
            '<p class="empty-cart">Your cart is empty.</p>';
    }

    let totalItems = 0;
    let totalPrice = 0;

    cart.forEach(item => {
        totalItems += item.quantity;
        totalPrice += item.price * item.quantity;

        const row = document.createElement("div");
        row.className = "cart-item";

        const name = document.createElement("h3");
        name.textContent = item.name;

        const price = document.createElement("p");
        price.textContent =
            `₹${item.price.toLocaleString("en-IN")} × ${item.quantity}`;

        const decrease = document.createElement("button");
        decrease.textContent = "−";
        decrease.onclick = () => changeQuantity(item.id, -1);

        const quantity = document.createElement("span");
        quantity.textContent = ` ${item.quantity} `;

        const increase = document.createElement("button");
        increase.textContent = "+";
        increase.onclick = () => changeQuantity(item.id, 1);

        const remove = document.createElement("button");
        remove.textContent = "Remove";
        remove.onclick = () => removeFromCart(item.id);

        row.append(name, price, decrease, quantity, increase, remove);
        cartItemsContainer.appendChild(row);
    });

    cartCount.textContent = totalItems;
    cartTotal.textContent = totalPrice.toLocaleString("en-IN");

    undoBtn.disabled = undoStack.length === 0;
    redoBtn.disabled = redoStack.length === 0;

    cartHistory.innerHTML = "";

    if (operationHistory.length === 0) {
        cartHistory.innerHTML = "<li>No operations yet.</li>";
    } else {
        operationHistory.slice(-10).forEach(action => {
            const li = document.createElement("li");
            li.textContent = action;
            cartHistory.appendChild(li);
        });
    }
}

undoBtn.addEventListener("click", undoCart);
redoBtn.addEventListener("click", redoCart);

displayCart();


// Challenge 5: Personalized Recommendations

const recommendationContainer =
    document.getElementById("recommendationProducts");

const refreshRecommendationsBtn =
    document.getElementById("refreshRecommendationsBtn");

function getRecommendations() {
    // Recently viewed product IDs ko exclude karo
    const viewedIds = new Set(
        recentHistory.map(product => String(product.id))
    );

    // Recently viewed products se related brand/category identify karo
    const viewedProducts = [...recentHistory];

    if (viewedProducts.length === 0) {
        return allProducts.slice(0, 3);
    }

    const recommended = allProducts
        .filter(product => !viewedIds.has(String(product.id)))
        .map(product => {
            let score = 0;

            viewedProducts.forEach(viewed => {
                if (product.brand === viewed.brand) {
                    score += 3;
                }

                if (product.category &&
                    product.category === viewed.category) {
                    score += 5;
                }

                if (product.subcategory &&
                    product.subcategory === viewed.subcategory) {
                    score += 4;
                }
            });

            return { ...product, recommendationScore: score };
        });

    recommended.sort(
        (a, b) =>
            b.recommendationScore - a.recommendationScore ||
            b.rating - a.rating
    );

    return recommended.slice(0, 3);
}

function displayRecommendations() {
    const recommendations = getRecommendations();

    recommendationContainer.innerHTML = "";

    if (recommendations.length === 0) {
        recommendationContainer.innerHTML =
            '<p class="message">No recommendations available.</p>';
        return;
    }

    recommendations.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";

        const heading = document.createElement("h3");
        heading.textContent = product.name;

        const brand = document.createElement("p");
        brand.textContent = `Brand: ${product.brand}`;

        const price = document.createElement("p");
        price.className = "price";
        price.textContent =
            `₹${product.price.toLocaleString("en-IN")}`;

        const rating = document.createElement("p");
        rating.className = "rating";
        rating.textContent =
            `⭐ ${product.rating} (${product.reviews} reviews)`;

        const reason = document.createElement("p");
        reason.className = "recommendation-reason";
        reason.textContent =
            "Recommended based on popularity and your interests.";

        const viewButton = document.createElement("button");
        viewButton.className = "view-btn";
        viewButton.textContent = "View Product";
        viewButton.onclick = () => {
            viewProduct(product.id);
            displayRecommendations();
        };

        const addButton = document.createElement("button");
        addButton.className = "add-cart-btn";
        addButton.textContent = "Add to Cart";
        addButton.onclick = () => addToCart(product.id);

        card.append(
            heading,
            brand,
            price,
            rating,
            reason,
            viewButton,
            addButton
        );

        recommendationContainer.appendChild(card);
    });
}

refreshRecommendationsBtn.addEventListener(
    "click",
    displayRecommendations
);

// Recently Viewed change hone par recommendations update karo
const originalAddToRecentlyViewed = addToRecentlyViewed;

addToRecentlyViewed = function(product) {
    originalAddToRecentlyViewed(product);
    displayRecommendations();
};

displayRecommendations();
