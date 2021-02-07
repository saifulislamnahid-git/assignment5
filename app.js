// Variable Declare
const input = document.getElementById("input");
const submit = document.getElementById("submit");
const mealsElement = document.getElementById('mealsElement');
const singleElement = document.getElementById("singleElement");

// Submit Button Event Handler
submit.addEventListener('click', function() {
    const searchFor = document.getElementById('searchFor');
    const inputValue = input.value;
    if (inputValue == '') {
        searchFor.innerText = "Field Must Not Be Empty"
        mealsElement.innerText = '';
        singleElement.innerText = '';
    } else {
        searchFor.innerText = "";
        searchFor.innerHTML = `Search Result For "${inputValue}"`;
        singleElement.innerText = '';

        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${inputValue}`)
            .then(res => res.json())
            .then(data => displayMeals(data))
    }
})


// Search Result
const searchResult = document.getElementById("searchResult");
const displayMeals = mealsItem => {
    if (mealsItem.meals == null) {
        searchResult.innerText = 'There are no search result. Try again';
        mealsElement.innerText = '';
    } else {
        searchResult.innerText = "";
        mealsElement.innerHTML = mealsItem.meals.map(meal => `
            <div class="meals">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                <div class="meal-info" data-mealID="${meal.idMeal}">
                    <h3>${meal.strMeal}</h3>
                </div>
            </div>

        `)
            .join('')
    }
    input.value = '';
}

// Get Meal ID clicked by Title
mealsElement.addEventListener('click', e => {
    const mealInfo = e.path.find(item => {
        if (item.classList) {
            return item.classList.contains('meal-info');
        } else {
            return false;
        }
    })

    if (mealInfo) {
        const mealID = mealInfo.getAttribute('data-mealID');
        getMealByID(mealID);
    }
})


// Fetch Meal By ID
function getMealByID(mealID) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
        .then(res => res.json())
        .then(data => {
            const meal = data.meals[0];
            addMealToDOM(meal);
        })
}

// Add meal to DOM
const addMealToDOM = meal => {
        const ingredients = [];
        for (let i = 1; i <= 20; i++) {
            if (meal[`strIngredient${i}`]) {
                ingredients.push(`${meal[`strIngredient${i}`]}`)
        } else {
            break;
        }
    }

    singleElement.innerHTML = `
        <div class="single-meal">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
            <h1>${meal.strMeal}</h2>
            <div class="main">
                <h3>Ingredients</h3>
                <ul>
                    ${ingredients.map(ing => `<li>${ing}</li>`).join("")}
                </ul>
            </div>
        </div>
    `;
}