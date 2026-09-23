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

        `;


        results.appendChild(card);

    });
}




function viewProduct(productId) {

    const product = allProducts.find(
        product => product.id === productId
    );


    if (product) {

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
