// RECIPE FINDER

// VARIABLE

let allRecipes = [];

let favoriteRecipes =
    JSON.parse(
        localStorage.getItem("favoriteRecipes")
    ) || [];


// AMBIL ELEMENT HTML


const recipeContainer =
    document.querySelector("#recipeContainer");

const searchInput =
    document.querySelector("#searchInput");

const searchBtn =
    document.querySelector("#searchBtn");

const cuisineFilter =
    document.querySelector("#cuisineFilter");

const difficultyFilter =
    document.querySelector("#difficultyFilter");

const recipeTotal =
    document.querySelector("#recipeTotal");

const favoriteBtn =
    document.querySelector("#favoriteBtn");

const favoriteCount =
    document.querySelector("#favoriteCount");

const recipeModal =
    document.querySelector("#recipeModal");

const modalBody =
    document.querySelector("#modalBody");

const closeModal =
    document.querySelector("#closeModal");


// AMBIL DATA DARI API


async function getRecipes() {

    try {

        recipeContainer.innerHTML =
            `<p class="no-result">
                Loading recipes...
            </p>`;


        const response =
            await fetch(
                "https://dummyjson.com/recipes?limit=30"
            );


        const data =
            await response.json();


        allRecipes =
            data.recipes;


        displayRecipes(
            allRecipes
        );


        createCuisineFilter();


        updateFavoriteCount();


    } catch (error) {

        console.log(error);


        recipeContainer.innerHTML =
            `<p class="no-result">
                Gagal mengambil data recipe.
            </p>`;

    }

}


// TAMPILKAN RECIPE

function displayRecipes(recipes) {

    recipeContainer.innerHTML = "";


    recipeTotal.textContent =
        `${recipes.length} recipes`;


    if (recipes.length === 0) {

        recipeContainer.innerHTML =
            `<p class="no-result">
                Recipe tidak ditemukan 😢
            </p>`;

        return;
    }


    recipes.forEach(recipe => {

        const isFavorite =
            favoriteRecipes.some(
                item => item.id === recipe.id
            );


        const card =
            document.createElement("div");


        card.classList.add(
            "recipe-card"
        );


        card.innerHTML = `

            <img
                src="${recipe.image}"
                alt="${recipe.name}"
            >

            <div class="recipe-content">

                <p class="recipe-cuisine">
                    ${recipe.cuisine}
                </p>

                <h3>
                    ${recipe.name}
                </h3>

                <div class="recipe-info">

                    <span>
                        ⭐ ${recipe.rating}
                    </span>

                    <span>
                        ◷ ${recipe.totalTimeMinutes} min
                    </span>

                    <span>
                        ${recipe.difficulty}
                    </span>

                </div>


                <div class="card-buttons">

                    <button
                        class="detail-btn"
                        onclick="showDetail(${recipe.id})"
                    >
                        View Detail
                    </button>


                    <button
                        class="favorite-card-btn
                        ${isFavorite ? "active" : ""}"
                        onclick="toggleFavorite(${recipe.id})"
                    >
                        ${isFavorite ? "❤️" : "♡"}
                    </button>

                </div>

            </div>

        `;


        recipeContainer.appendChild(card);

    });

}

// BUAT CUISINE FILTER

function createCuisineFilter() {

    const cuisines = [];


    allRecipes.forEach(recipe => {

        if (
            !cuisines.includes(
                recipe.cuisine
            )
        ) {

            cuisines.push(
                recipe.cuisine
            );

        }

    });


    cuisines.sort();


    cuisines.forEach(cuisine => {

        const option =
            document.createElement("option");


        option.value =
            cuisine;


        option.textContent =
            cuisine;


        cuisineFilter.appendChild(
            option
        );

    });

}

// SEARCH BUTTON

searchBtn.addEventListener(
    "click",
    function () {

        filterRecipes();

    }
);


// SEARCH DENGAN ENTER

searchInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            filterRecipes();

        }

    }
);


// ==========================================
// SEARCH SAAT MENGETIK
// ==========================================

searchInput.addEventListener(
    "input",
    function () {

        filterRecipes();

    }
);


// ==========================================
// FILTER CUISINE
// ==========================================

cuisineFilter.addEventListener(
    "change",
    function () {

        filterRecipes();

    }
);


// ==========================================
// FILTER DIFFICULTY
// ==========================================

difficultyFilter.addEventListener(
    "change",
    function () {

        filterRecipes();

    }
);


// ==========================================
// SEARCH + FILTER
// ==========================================

function filterRecipes() {

    const keyword =
        searchInput.value
            .toLowerCase()
            .trim();


    const selectedCuisine =
        cuisineFilter.value;


    const selectedDifficulty =
        difficultyFilter.value;


    const filteredRecipes =
        allRecipes.filter(recipe => {


            // SEARCH

            const matchName =
                recipe.name
                    .toLowerCase()
                    .includes(keyword);


            // CUISINE

            const matchCuisine =
                selectedCuisine === "all" ||
                recipe.cuisine === selectedCuisine;


            // DIFFICULTY

            const matchDifficulty =
                selectedDifficulty === "all" ||
                recipe.difficulty === selectedDifficulty;


            return (
                matchName &&
                matchCuisine &&
                matchDifficulty
            );

        });


    displayRecipes(
        filteredRecipes
    );

}


// ==========================================
// DETAIL RECIPE
// ==========================================

function showDetail(id) {

    const recipe =
        allRecipes.find(
            item => item.id === id
        );


    if (!recipe) return;


    const isFavorite =
        favoriteRecipes.some(
            item => item.id === id
        );


    modalBody.innerHTML = `

        <img
            class="modal-image"
            src="${recipe.image}"
            alt="${recipe.name}"
        >


        <h2>
            ${recipe.name}
        </h2>


        <div class="modal-info">

            <span>
                ⭐ ${recipe.rating}
            </span>

            <span>
                🍽️ ${recipe.cuisine}
            </span>

            <span>
                ${recipe.difficulty}
            </span>

        </div>


        <p>
            Preparation:
            ${recipe.prepTimeMinutes} minutes
        </p>


        <p>
            Cooking:
            ${recipe.cookTimeMinutes} minutes
        </p>


        <h3>
            🥕 Ingredients
        </h3>


        <ul>

            ${recipe.ingredients
                .map(
                    ingredient =>
                        `<li>${ingredient}</li>`
                )
                .join("")
            }

        </ul>


        <h3>
            👨‍🍳 Instructions
        </h3>


        <ol>

            ${recipe.instructions
                .map(
                    instruction =>
                        `<li>${instruction}</li>`
                )
                .join("")
            }

        </ol>


        <button
            class="modal-favorite"
            onclick="toggleFavorite(${recipe.id})"
        >
            ${
                isFavorite
                ? "💔 Remove Favorite"
                : "❤️ Add to Favorite"
            }
        </button>

    `;


    recipeModal.classList.add(
        "show"
    );

}


// ==========================================
// CLOSE MODAL
// ==========================================

closeModal.addEventListener(
    "click",
    function () {

        recipeModal.classList.remove(
            "show"
        );

    }
);


// ==========================================
// CLOSE MODAL KLIK LUAR
// ==========================================

recipeModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            recipeModal
        ) {

            recipeModal.classList.remove(
                "show"
            );

        }

    }
);


// ==========================================
// FAVORITE
// ==========================================

function toggleFavorite(id) {

    const recipe =
        allRecipes.find(
            item => item.id === id
        );


    if (!recipe) return;


    const index =
        favoriteRecipes.findIndex(
            item => item.id === id
        );


    if (index === -1) {

        // TAMBAH FAVORITE

        favoriteRecipes.push(
            recipe
        );

    } else {

        // HAPUS FAVORITE

        favoriteRecipes.splice(
            index,
            1
        );

    }


    // SIMPAN KE LOCAL STORAGE

    localStorage.setItem(
        "favoriteRecipes",
        JSON.stringify(
            favoriteRecipes
        )
    );


    updateFavoriteCount();


    // TAMPILKAN ULANG DATA

    filterRecipes();


    // Kalau modal sedang terbuka,
    // update detailnya

    if (
        recipeModal.classList.contains(
            "show"
        )
    ) {

        showDetail(id);

    }

}


// ==========================================
// UPDATE JUMLAH FAVORITE
// ==========================================

function updateFavoriteCount() {

    favoriteCount.textContent =
        favoriteRecipes.length;

}


// ==========================================
// TOMBOL FAVORITE DI NAVBAR
// ==========================================

favoriteBtn.addEventListener(
    "click",
    function () {

        if (
            favoriteRecipes.length === 0
        ) {

            recipeContainer.innerHTML =
                `
                <p class="no-result">
                    Belum ada recipe favorite ❤️
                </p>
                `;

            recipeTotal.textContent =
                "0 recipes";

            return;

        }


        displayRecipes(
            favoriteRecipes
        );

    }
);


// ==========================================
// JALANKAN PROGRAM
// ==========================================

getRecipes();