// src/data/flags.js

// Mapeo nombre del país -> código ISO2 (lo que usa flagcdn)
export const countryToISO = {
  "Mexico": "mx",
  "South Africa": "za",
  "South Korea": "kr",
  "Czech Republic": "cz",
  "USA": "us",
  "United States": "us",
  "Germany": "de",
  "Brazil": "br",
  "Portugal": "pt",
  "United Kingdom": "gb",
  "Australia": "au",
  "Turkey": "tr",
  "Paraguay": "py",
  "Argentina": "ar",
  "Spain": "es",
  "France": "fr",
  "Colombia": "co",
  "Japan": "jp",
  "Canada": "ca",
  "Netherlands": "nl",
  "Belgium": "be",
  "Italy": "it",
  "Uruguay": "uy",
  "Chile": "cl",
  "Peru": "pe",
  "Ecuador": "ec"
};

// Función que arma la URL de la bandera
export const getFlagUrl = (team) => {
  const iso = countryToISO[team];
  return iso
    ? `https://flagcdn.com/w40/${iso}.png`
    : "https://flagcdn.com/w40/un.png"; // genérica si no existe
};