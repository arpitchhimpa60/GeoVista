// ============================================
// DOM ELEMENTS
// ============================================
const searchButton = document.getElementById('searchButton');
const searchInput = document.getElementById('searchInput');
const regionFilter = document.getElementById('regionFilter');
const populationFilter = document.getElementById('populationFilter');
const sortBySelect = document.getElementById('sortBy');
const resetButton = document.getElementById('resetBtn');


// data --> {name: {common: "India"},
// flags: {png: "https://flagcdn.com/w320/in.png"},
// capital: ["New Delhi"],
// population: 1393409038,
// region: "Asia"}


// ============================================
// DATA STORAGE
// ============================================
let allCountries = [];
let currentCountries = [];

// ============================================
// FETCH DATA FROM API
// ============================================
function fetchCountries() {
    const url = "https://restcountries.com/v3.1/all?fields=name,flags,capital,population,region";
    return fetch(url).then(function(response) {
        return response.json();
    });
}

// ============================================
// CREATE ONE COUNTRY CARD
// ============================================
function createCountryCard(country) {
    // Create main card container
    const card = document.createElement('div');
    card.className = 'country-card';

    // Create flag image
    const flag = document.createElement('img');
    flag.src = country.flags.png;
    flag.alt = "Flag of " + country.name.common;
    flag.className = 'flag-image';

    // Create content section
    const content = document.createElement('div');
    content.className = 'card-content';

    // Create country name heading
    const name = document.createElement('h2');
    name.textContent = country.name.common;

    // Create capital text
    const capitalText = "Capital: " + (country.capital ? country.capital[0] : "N/A");
    const capital = document.createElement('p');
    capital.textContent = capitalText;

    // Create population text
    const populationText = "Population: " + country.population;
    const population = document.createElement('p');
    population.textContent = populationText;

    // Create region text
    const regionText = "Region: " + country.region;
    const region = document.createElement('p');
    region.textContent = regionText;

    // Add all text elements to content
    content.appendChild(name);
    content.appendChild(capital);
    content.appendChild(population);
    content.appendChild(region);

    // Add flag and content to card
    card.appendChild(flag);
    card.appendChild(content);

    return card;
}

// ============================================
// RENDER ALL COUNTRIES
// ============================================
function renderCountries(countries) {
    const container = document.querySelector('.countries-container');

    // Clear container
    container.innerHTML = '';

    // Show message if no countries found
    if (countries.length === 0) {
        const message = document.createElement('div');
        message.style.gridColumn = "1 / -1";
        message.style.textAlign = "center";
        message.style.padding = "40px";
        message.style.color = "#999";
        message.textContent = "No countries found";
        container.appendChild(message);
        return;
    }

    // Add each country card
    for (let i = 0; i < countries.length; i++) {
        const card = createCountryCard(countries[i]);
        container.appendChild(card);
    }
}

// ============================================
// FILTER BY REGION
// ============================================
function filterByRegion(countries) {
    const selectedRegion = regionFilter.value;

    if (selectedRegion === '') {
        return countries;
    }

    const filtered = [];
    for (let i = 0; i < countries.length; i++) {
        if (countries[i].region === selectedRegion) {
            filtered.push(countries[i]);
        }
    }

    return filtered;
}

// ============================================
// FILTER BY POPULATION
// ============================================
function filterByPopulation(countries) {
    const selectedPopulation = populationFilter.value;

    if (selectedPopulation === '') {
        return countries;
    }

    const filtered = [];

    for (let i = 0; i < countries.length; i++) {
        const country = countries[i];
        const pop = country.population;
        let matches = false;

        if (selectedPopulation === 'below-1m' && pop < 1000000) {
            matches = true;
        } else if (selectedPopulation === '1m-50m' && pop >= 1000000 && pop <= 50000000) {
            matches = true;
        } else if (selectedPopulation === 'above-50m' && pop > 50000000) {
            matches = true;
        }

        if (matches) {
            filtered.push(country);
        }
    }

    return filtered;
}

// ============================================
// SORT COUNTRIES
// ============================================
function sortCountries(countries) {
    const sortOption = sortBySelect.value;

    if (sortOption === '') {
        return countries;
    }

    const sorted = countries.slice();

    if (sortOption === 'name') {
        sorted.sort(function(a, b) {
            const nameA = a.name.common.toLowerCase();
            const nameB = b.name.common.toLowerCase();
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0;
        });
    } else if (sortOption === 'population') {
        sorted.sort(function(a, b) {
            return b.population - a.population;
        });
    }

    return sorted;
}

// ============================================
// SEARCH BY COUNTRY NAME
// ============================================
function searchByName(query) {
    if (query.trim() === '') {
        return allCountries;
    }

    const searchTerm = query.toLowerCase();
    const results = [];

    for (let i = 0; i < allCountries.length; i++) {
        const countryName = allCountries[i].name.common.toLowerCase();
        if (countryName.includes(searchTerm)) {
            results.push(allCountries[i]);
        }
    }

    return results;
}

// ============================================
// APPLY ALL FILTERS AND SORTING
// ============================================
function applyAllFilters() {
    // Start with all countries
    let results = allCountries.slice();

    // Apply region filter
    results = filterByRegion(results);

    // Apply population filter
    results = filterByPopulation(results);

    // Apply sorting
    results = sortCountries(results);

    // Update current countries and render
    currentCountries = results;
    renderCountries(currentCountries);
}

// ============================================
// SEARCH HANDLER
// ============================================
function handleSearch() {
    const query = searchInput.value;

    // Search by name
    let results = searchByName(query);

    // Apply filters to search results
    results = filterByRegion(results);
    results = filterByPopulation(results);

    // Apply sorting
    results = sortCountries(results);

    // Update current countries and render
    currentCountries = results;
    renderCountries(currentCountries);
}

// ============================================
// RESET ALL FILTERS
// ============================================
function resetAllFilters() {
    // Clear all input values
    searchInput.value = '';
    regionFilter.value = '';
    populationFilter.value = '';
    sortBySelect.value = '';

    // Show all countries
    currentCountries = allCountries.slice();
    renderCountries(currentCountries);
}

// ============================================
// LOAD ALL COUNTRIES ON PAGE START
// ============================================
function loadCountries() {
    fetchCountries().then(function(data) {
        allCountries = data;
        currentCountries = data.slice();
        renderCountries(currentCountries);
    });
}

// ============================================
// EVENT LISTENERS
// ============================================

// Search button click
searchButton.addEventListener('click', function() {
    handleSearch();
});

// Search input - Enter key
searchInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        handleSearch();
    }
});


regionFilter.addEventListener('change', function() {applyAllFilters()});
populationFilter.addEventListener('change', function() {applyAllFilters()});
sortBySelect.addEventListener('change', function() {applyAllFilters()});
resetButton.addEventListener('click', function() {resetAllFilters()});

// ============================================
// START THE APP
// ============================================
loadCountries();
