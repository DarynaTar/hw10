import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries.js';

const searchInput = document.getElementById('search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const DEBOUNCE_DELAY = 300;

searchInput.addEventListener('input', debounce(onInputSearch, DEBOUNCE_DELAY));

function onInputSearch(event) {
  const nameCountry = event.target.value.toLowerCase().trim();

  if (!nameCountry) {
    Notify.failure('Oops, there is no country with that name');
    return;
  }

  fetchCountries(nameCountry)
    .then(country => {
      if (country.length === 1) {
        clearCountryList();
        countryInfo.innerHTML = renderCountry(country);
      } else if (country.length > 10) {
        Notify.info('Too many matches found. Please enter a more specific name.');
      } else if (country.length > 1 && country.length <= 10) {
        clearCountryInfo();
        countryList.innerHTML = renderCountriesList(country);
      } else if (!country.length) {
        Notify.failure('Oops, the field is not filled');
      }
    })
    .catch(error => {
      console.log(error);
      Notify.failure('Oops, something went wrong.');
    });
}

function renderCountry(countries) {
  return countries
    .map(({ flags, name, capital, languages, population }) => {
      const languagesCountry = Object.values(languages).join(',');
      return `<div class="country-title"><img src="${flags.svg}" width="80" alt="${name.common} flag">
      <h1>${name.official}</h1></div>
          <li>
            <p><b>Capital</b>: ${capital}</p>
            <p><b>Population</b>: ${population}</p>
            <p><b>Languages</b>: ${languagesCountry}</p>
          </li>`;
    })
    .join('');
}

function renderCountriesList(countries) {
  return countries
    .map(({ flags, name }) => {
      return `<li class="country-list-info"><img src="${flags.svg}" width="50" alt="${name.common} flag">
      <p>${name.official}</p></li>`;
    })
    .join('');
}

function clearCountryList() {
  countryList.innerHTML = '';
}

function clearCountryInfo() {
  countryInfo.innerHTML = '';
}