// IIFE:: set default value as empty array in localStorage
(function() {
    if(localStorage.getItem("favoriteMealsList") === null) {
        localStorage.setItem("favoriteMealsList", JSON.stringify([]))
    }
})();

// show all meals based on user query
async function showMealList() {
    let searchInput = document.getElementById("my-search").value
    let favoriteMeals = JSON.parse(localStorage.getItem("favoriteMealsList"))
    let html = ""
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchInput}`)
    let data = await response.json()
    // show NO meal to user if the input is empty
    if(searchInput === "") {
        html = `<div id="main-no-content"><i class="fa-solid fa-burger"></i>Search Results Will Be Visible Here</div>`
        document.getElementById("heading-text").innerHTML = `<h5></h5>`
    }
    // show meals to user based upon user input
    else if(data.meals !== null) {
        // iterating over each 'meal' in the 'data.meals' array
        data.meals.forEach((meal) => {
            // if 'meal' is 'favorite', then showing color-filled heart icon in html
            if (favoriteMeals.indexOf(parseInt(meal.idMeal)) !== -1) {
                html += `<div id="card" class="card mb-3" style="width: 20rem;">
                    <div id="card-img-container"><img src="${meal.strMealThumb}" class="card-img-top" alt="..."></div>
                    <div class="card-body">
                        <h5 class="card-title">${meal.strMeal}</h5>
                        <div class="d-flex justify-content-between mt-5">
                            <button type="button" class="btn btn-outline-light" onclick="showMealDetails(${meal.idMeal})">More Details</button>
                            <button id="main${meal.idMeal}" class="btn" onclick="addRemoveToFavList(${meal.idMeal})" style="border-radius:50%; color: rgb(255, 91, 91);"><i class="fa-solid fa-heart"></i></button>
                        </div>
                    </div>
                </div>`
            } 
            // else, empty heart icon
            else {
                html += `<div id="card" class="card mb-3" style="width: 20rem;">
                    <div id="card-img-container"><img src="${meal.strMealThumb}" class="card-img-top" alt="..."></div>
                    <div class="card-body">
                        <h5 class="card-title">${meal.strMeal}</h5>
                        <div class="d-flex justify-content-between mt-5">
                            <button type="button" class="btn btn-outline-light" onclick="showMealDetails(${meal.idMeal})">More Details</button>
                            <button id="main${meal.idMeal}" class="btn" onclick="addRemoveToFavList(${meal.idMeal})" style="border-radius:50%; color: white; "><i class="fa-solid fa-heart"></i></button>
                        </div>
                    </div>
                </div>`
            }
        })
        document.getElementById("heading-text").innerHTML = `<h5>${data.meals.length} meal${data.meals.length>1 ? 's' : ''} found <i class="fa-solid fa-circle-check"></i></h5>`
    }  
    // no meal found
    else {
        html = `<div id="main-no-content"><i class="fa-solid fa-circle-exclamation"></i>Looks like we couldn't find what you're looking for</div>`
        document.getElementById("heading-text").innerHTML = `<h5></h5>`
    }
    document.getElementById("main").innerHTML = html;
}

// meal details function
async function showMealDetails(id) {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    let data = await response.json()
    let html = `<div id="meal-details" class="mb-5">
                    <button onclick="showMealList()" id="meal-details-back-btn" type="button" class="btn btn-light">Back</button>
                    <div id="meal-header" class="d-flex justify-content-around flex-wrap">
                    <div id="meal-thumbail">
                        <img class="mb-2" src="${data.meals[0].strMealThumb}" alt="" srcset="">
                    </div>
                    <div id="details">
                        <h3>${data.meals[0].strMeal}</h3>
                        <h6>Category : ${data.meals[0].strCategory}</h6>
                        <h6>Area : ${data.meals[0].strArea}</h6>
                    </div>
                    </div>
                    <div id="meal-instruction" class="mt-3">
                    <p>${data.meals[0].strInstructions}</p>
                    </div>
                    <div class="text-center">
                    <a href="${data.meals[0].strYoutube}" target="_blank" class="btn btn-outline-light mt-3">Watch Video</a>
                    </div>
                </div>`
    document.getElementById("main").innerHTML=html
}

// favorite meals
async function showFavMealList() {
    // get 'favorite meals' array from local storage
    let favoriteMeals = JSON.parse(localStorage.getItem("favoriteMealsList"))
    let html = ""
    if(favoriteMeals.length == 0) {
        html += `<div class="page-wrap d-flex flex-row align-items-center">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-md-12 text-center">
                            <div class="mb-4 lead" style="opacity: 75%">
                                Favorite meals will be visible here <i class="fa-regular fa-heart"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
    } else {
        for(let mealId of favoriteMeals) {
            let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
            let data = await response.json()
            html += `<div id="card" class="card mb-3" style="width: 20rem;">
                        <div id="card-img-container"><img src="${data.meals[0].strMealThumb}" class="card-img-top" alt="..."></div>
                        <div class="card-body">
                            <h5 class="card-title">${data.meals[0].strMeal}</h5>
                            <div class="d-flex justify-content-between mt-5">
                                <button type="button" class="btn btn-outline-light" onclick="showMealDetails(${data.meals[0].idMeal})">More Details</button>
                                <button id="main${data.meals[0].idMeal}" class="btn" onclick="addRemoveToFavList(${data.meals[0].idMeal})" style="border-radius:50%; color: rgb(255, 91, 91);"><i class="fa-solid fa-heart"></i></button>
                            </div>
                        </div>
                    </div>`
        }
    }
    document.getElementById("offcanvasNavbarLabel").innerHTML = `<span>Favorites (${favoriteMeals.length})</span>`
    document.getElementById("favorites-body").innerHTML=html;
}

function addRemoveToFavList(id) {
    let favoriteMeals = JSON.parse(localStorage.getItem("favoriteMealsList"))
    let index = favoriteMeals.indexOf(id)
    index >= 0 ? favoriteMeals.splice(index, 1) : favoriteMeals.push(id)
    localStorage.setItem("favoriteMealsList", JSON.stringify(favoriteMeals))
    showMealList()
    showFavMealList()
}