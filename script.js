const search = document.getElementById('searchButton');
const searchInput = document.getElementById('searchInput');

async function fetchCountries(){
    const res = await fetch("https://restcountries.com/v3.1/all?fields=name,flags,capital,population,region");
    const data = await res.json();
    return data;
}
// data --> {name: {common: "India"},
//           flags: {png: "https://flagcdn.com/w320/in.png"},
//           capital: ["New Delhi"], 
//           population: 1393409038, 
//           region: "Asia"}
async function renderCountries(){
    let data = await fetchCountries();

    data.forEach((country) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'country-card';
        itemDiv.style.border = "3px solid #0a0a0a";

        let countryName = document.createElement('h2');
        countryName.textContent = "Country: " + country.name.common;
        
        let countryFlag = document.createElement('img');
        countryFlag.src = country.flags.png;
        countryFlag.alt = "Flag of " + country.name.common; 
        countryFlag.className = 'flag-image';    

        let countryCapital = document.createElement('p');
        countryCapital.textContent = "Capital: " + country.capital[0];
        
        let countryPopulation = document.createElement('p');
        countryPopulation.textContent = "Population: " + country.population;

        let countryRegion = document.createElement('p');
        countryRegion.textContent = "Region: " + country.region;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'card-content';
        contentDiv.style.backgroundColor = "rgb(164, 132, 132)";

        contentDiv.append(countryName, countryCapital, countryPopulation, countryRegion);

        itemDiv.append(countryFlag, contentDiv);

        let wrapper = document.querySelector('.countries-container');
        if (!wrapper) {
            wrapper = document.createElement('div');
            wrapper.className = 'countries-container';
            document.querySelector('.container').appendChild(wrapper);
        }
        wrapper.appendChild(itemDiv);
    })
}
renderCountries()

async function searchCountries(query){
    if (query === "") {
        alert("Please enter a country name to search.");
        return;
    }

    let data = await fetchCountries();

    const filtered = data.filter((country) =>
        country.name.common.toLowerCase().includes(query.toLowerCase())
    );

    let wrapper = document.querySelector('.countries-container');
    if (wrapper) {
        wrapper.innerHTML = ""; 
    } else {
        wrapper = document.createElement('div');
        wrapper.className = 'countries-container';
        document.querySelector('.container').appendChild(wrapper);
    }

    if (filtered.length === 0) {
        alert("No country found with the name: " + query);
        return;
    }

    filtered.forEach((country) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'country-card';
        itemDiv.style.border = "3px solid #0a0a0a";

        let countryName = document.createElement('h2');
        countryName.textContent = "Country: " + country.name.common;
        
        let countryFlag = document.createElement('img');
        countryFlag.src = country.flags.png;
        countryFlag.alt = "Flag of " + country.name.common; 
        countryFlag.className = 'flag-image';    

        let countryCapital = document.createElement('p');
        countryCapital.textContent = "Capital: " + (country.capital ? country.capital[0] : "N/A");
        
        let countryPopulation = document.createElement('p');
        countryPopulation.textContent = "Population: " + country.population;

        let countryRegion = document.createElement('p');
        countryRegion.textContent = "Region: " + country.region;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'card-content';
        contentDiv.style.backgroundColor = "rgb(164, 132, 132)";

        contentDiv.append(countryName, countryCapital, countryPopulation, countryRegion);
        itemDiv.append(countryFlag, contentDiv);

        wrapper.appendChild(itemDiv);
    });
}


search.addEventListener("click", () => {searchCountries(searchInput.value)});
