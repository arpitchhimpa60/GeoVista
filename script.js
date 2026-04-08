const regionFilter = document.getElementById('regionFilter')
const sortBy = document.getElementById('sortBy')
const resetBtn = document.getElementById('resetBtn')
const search = document.getElementById('searchButton')
const searchInput = document.getElementById('searchInput')


// Feching data
async function fetchCountries(){
    const res = await fetch("https://restcountries.com/v3.1/all?fields=name,flags,capital,population,region")
    const data = await res.json()
    return data
}
// data --> {name: {common: "India"},
//           flags: {png: "https://flagcdn.com/w320/in.png"},
//           capital: ["New Delhi"], 
//           population: 1393409038, 
//           region: "Asia"}

// Rendering all countries
async function renderCountries(){
    let data = await fetchCountries()

    let wrapper = document.querySelector('.countries-container')
    wrapper.innerHTML = ""

    data.forEach((country) => {

        const itemDiv = document.createElement('div')
        itemDiv.className = 'country-card'

        let countryName = document.createElement('h2')
        countryName.textContent = "Country: " + country.name.common

        let countryFlag = document.createElement('img')
        countryFlag.src = country.flags.png;
        countryFlag.className = 'flag-image'

        let countryCapital = document.createElement('p')
        countryCapital.textContent = "Capital: " + (country.capital ? country.capital[0] : "N/A")

        let countryPopulation = document.createElement('p')
        countryPopulation.textContent = "Population: " + country.population

        let countryRegion = document.createElement('p')
        countryRegion.textContent = "Region: " + country.region

        const contentDiv = document.createElement('div')
        contentDiv.className = 'card-content'

        contentDiv.append(countryName, countryCapital, countryPopulation, countryRegion)
        itemDiv.append(countryFlag, contentDiv)

        wrapper.appendChild(itemDiv)
    });
}


// Searching
async function searchCountries(query){
    if (query === "") {
        alert("Please enter a country name to search.")
        return
    }

    let data = await fetchCountries()

    const filtered = data.filter((country) =>
        country.name.common.toLowerCase().includes(query.toLowerCase())
    )

    let wrapper = document.querySelector('.countries-container')
    wrapper.innerHTML = ""

    if (filtered.length === 0) {
        alert("No country found with the name: " + query)
        return
    }

    filtered.forEach((country) => {

        const itemDiv = document.createElement('div')
        itemDiv.className = 'country-card'

        let countryName = document.createElement('h2')
        countryName.textContent = "Country: " + country.name.common

        let countryFlag = document.createElement('img')
        countryFlag.src = country.flags.png
        countryFlag.className = 'flag-image'

        let countryCapital = document.createElement('p')
        countryCapital.textContent = "Capital: " + (country.capital ? country.capital[0] : "N/A")

        let countryPopulation = document.createElement('p')
        countryPopulation.textContent = "Population: " + country.population

        let countryRegion = document.createElement('p')
        countryRegion.textContent = "Region: " + country.region

        const contentDiv = document.createElement('div')
        contentDiv.className = 'card-content'

        contentDiv.append(countryName, countryCapital, countryPopulation, countryRegion)
        itemDiv.append(countryFlag, contentDiv)

        wrapper.appendChild(itemDiv)
    });
}


// Sorting 
async function applyFilters(){
    let data = await fetchCountries()

    // Region filter
    if(regionFilter.value !== ""){
        data = data.filter((country) => country.region === regionFilter.value)
    }

    // Sorting by alphateically order
    if(sortBy.value === "name"){
        data.sort((a,b) => a.name.common.localeCompare(b.name.common))
    }

    let wrapper = document.querySelector('.countries-container')
    wrapper.innerHTML = ""

    if(data.length === 0){
        alert("No countries found")
        return
    }

    data.forEach((country) => {

        const itemDiv = document.createElement('div')
        itemDiv.className = 'country-card'

        let countryName = document.createElement('h2')
        countryName.textContent = "Country: " + country.name.common

        let countryFlag = document.createElement('img')
        countryFlag.src = country.flags.png
        countryFlag.className = 'flag-image'

        let countryCapital = document.createElement('p')
        countryCapital.textContent = "Capital: " + (country.capital ? country.capital[0] : "N/A")

        let countryPopulation = document.createElement('p')
        countryPopulation.textContent = "Population: " + country.population

        let countryRegion = document.createElement('p')
        countryRegion.textContent = "Region: " + country.region

        const contentDiv = document.createElement('div')
        contentDiv.className = 'card-content'

        contentDiv.append(countryName, countryCapital, countryPopulation, countryRegion)
        itemDiv.append(countryFlag, contentDiv)

        wrapper.appendChild(itemDiv)
    })
}


// Reset function
function resetFilters(){
    regionFilter.value = ""
    sortBy.value = ""
    searchInput.value = ""

    renderCountries()
}



search.addEventListener("click", () => {searchCountries(searchInput.value)})
regionFilter.addEventListener("change", applyFilters)
sortBy.addEventListener("change", applyFilters)
resetBtn.addEventListener("click", resetFilters)

renderCountries()