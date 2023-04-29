import './css/styles.css';
import fetchCountries from './fetchCountries.js';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.6.min.css';

const DEBOUNCE_DELAY = 300;

const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchBox.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(evt) {
  const searchValue = evt.target.value.trim();

  if (!searchValue) {
    countryInfo.innerHTML = '';
    countryList.innerHTML = '';
    return;
  }

  fetchCountries(searchValue)
    .then(countries => {
      if (countries.length > 10) {
        countryInfo.innerHTML = '';
        countryList.innerHTML = '';
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (countries.length >= 2 && countries.length <= 10) {
        countryList.innerHTML = renderCountriesList(countries);
      } else if (countries.length === 1) {
        countryInfo.innerHTML = renderCountryCard(countries);
      }
    })
    .catch(error => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function renderCountriesList(arr) {
  countryInfo.innerHTML = '';

  return arr
    .map(
      ({ name, flags: { svg } }) =>
        `
        <li class="country-item">
        <img class="country-img" src=${svg} alt="${name}" />
         <h2 class="country-name">${name}</h2>
        </li>
`
    )
    .join('');
}

function renderCountryCard(arr) {
  countryList.innerHTML = '';

  return arr
    .map(
      ({ name, capital, population, flags: { svg }, languages }) =>
        `<div class="country-title">
           <img class="country-img" src=${svg} alt="${name}" />
      <h2 class="country-name">${name}</h2>
        </div>
      <ul class="country-discription">
        <li class="item-discription"><span class="title-discrip">Capital:</span>${capital}</li>
        <li class="item-discription"><span class="title-discrip">Population:</span>${population}</li>
        <li class="item-discription"><span class="title-discrip">Languages:</span>${languages
          .map(lang => lang.name)
          .join(', ')}</li>
      </ul>`
    )
    .join('');
}
