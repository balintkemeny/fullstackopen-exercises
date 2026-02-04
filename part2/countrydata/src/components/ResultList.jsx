import CountryDetails from "./CountryDetails";

const ResultList = ({
  allCountries,
  countrySearchField,
  setCountrySearchField,
}) => {
  const matchingCountries = allCountries.filter((country) =>
    country.name.common
      .toLowerCase()
      .includes(countrySearchField.toLowerCase()),
  );

  const perfectMatch = matchingCountries.filter(
    (country) =>
      country.name.common.toLowerCase() === countrySearchField.toLowerCase(),
  );

  if (perfectMatch.length === 1) {
    return <CountryDetails country={perfectMatch[0]} />;
  }

  if (matchingCountries.length === 1) {
    return <CountryDetails country={matchingCountries[0]} />;
  }

  if (matchingCountries.length == 0) {
    return <div>No matches. Try another search phrase!</div>;
  }

  if (matchingCountries.length > 10) {
    return <div>Too many matches, specify another filter!</div>;
  }

  return matchingCountries.map((country) => (
    <div key={country.name.common}>
      {country.name.common}{" "}
      <button onClick={() => setCountrySearchField(country.name.common)}>
        Show
      </button>
    </div>
  ));
};

export default ResultList;
