
const searchButton = document.getElementById('searchButton');
const searchInput = document.getElementById('searchInput');
const regionFilter = document.getElementById('regionFilter');
const populationFilter = document.getElementById('populationFilter');
const sortBySelect = document.getElementById('sortBy');
const resetButton = document.getElementById('resetBtn');


let allCountries = [];
let currentCountries = [];


function fetchCountries() {
    const url = "https://restcountries.com/v3.1/all?fields=name,flags,capital,population,region";
    return fetch(url).then(function(response) {
        return response.json();
    });
}


function createCountryCard(country) {
    // main card container
    const card = document.createElement('div');
    card.className = 'country-card';

    // flag image
    const flag = document.createElement('img');
    flag.src = country.flags.png;
    flag.alt = "Flag of " + country.name.common;
    flag.className = 'flag-image';

    //  content section
    const content = document.createElement('div');
    content.className = 'card-content';

    // country name heading
    const name = document.createElement('h2');
    name.textContent = country.name.common;

    //  capital text
    const capitalText = "Capital: " + (country.capital ? country.capital[0] : "N/A");
    const capital = document.createElement('p');
    capital.textContent = capitalText;

    // population text
    const populationText = "Population: " + country.population;
    const population = document.createElement('p');
    population.textContent = populationText;

    // region text
    const regionText = "Region: " + country.region;
    const region = document.createElement('p');
    region.textContent = regionText;

    // appending to conetent
    content.appendChild(name);
    content.appendChild(capital);
    content.appendChild(population);
    content.appendChild(region);

    // Add flag and content to card
    card.appendChild(flag);
    card.appendChild(content);

    return card;
}


function renderCountries(countries) {
    const container = document.querySelector('.countries-container');

    
    container.innerHTML = '';

   
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

    
    for (let i = 0; i < countries.length; i++) {
        const card = createCountryCard(countries[i]);
        container.appendChild(card);
    }
}


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


function applyAllFilters() {
   
    let results = allCountries.slice();
    results = filterByRegion(results);
    results = filterByPopulation(results);
    results = sortCountries(results);

    currentCountries = results;
    renderCountries(currentCountries);
}

function handleSearch() {
    const query = searchInput.value;
    let results = searchByName(query);
    results = filterByRegion(results);
    results = filterByPopulation(results);
    results = sortCountries(results);

    currentCountries = results;
    renderCountries(currentCountries);
}


function resetAllFilters() {

    searchInput.value = '';
    regionFilter.value = '';
    populationFilter.value = '';
    sortBySelect.value = '';

 
    currentCountries = allCountries.slice();
    renderCountries(currentCountries);
}


function loadCountries() {
    fetchCountries().then(function(data) {
        allCountries = data;
        currentCountries = data.slice();
        renderCountries(currentCountries);
    });
}


searchButton.addEventListener('click', function() {
    handleSearch();
});


searchInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        handleSearch();
    }
});


regionFilter.addEventListener('change', function() {applyAllFilters()});
populationFilter.addEventListener('change', function() {applyAllFilters()});
sortBySelect.addEventListener('change', function() {applyAllFilters()});
resetButton.addEventListener('click', function() {resetAllFilters()});


loadCountries();
