// const search = document.getElementById('searchInput');

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
        let card = document.createElement('div');
        card.className = 'country-card';

        let countryFlag = document.createElement('img');
        countryFlag.src = country.flags.png;
        countryFlag.alt = "Flag of " + country.name.common;

        
        let countryName = document.createElement('h2');
        countryName.textContent = "Country: " + country.name.common;
        
        
        let countryCapital = document.createElement('p');
        countryCapital.textContent = "Capital: " + country.capital[0];
        
        let countryPopulation = document.createElement('p');
        countryPopulation.textContent = "Population: " + country.population;
        
        let countryRegion = document.createElement('p');
        countryRegion.textContent = "Region: " + country.region;
        
        const content = document.createElement('div');
        content.className = 'card-content';
        content.innerHTML = `
        <h2>${country.name.common}</h2>
        <div class="card-info"><span>${country.capital[0]}</span></div>
        <div class="card-info"><span>${country.population}</span></div>
        <div class="card-info"><span>${country.region}</span></div>
        `;

        card.append( countryFlag,countryName, countryCapital, countryPopulation, countryRegion, content);
        document.querySelector('.container').appendChild(card);
    })
}
renderCountries();