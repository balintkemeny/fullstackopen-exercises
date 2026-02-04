import CountryDetails from "./CountryDetails";

const ResultList = ({ matchingCountries }) => {
  if (matchingCountries.length == 0) {
    return <div>No matches. Try another search phrase!</div>;
  }

  if (matchingCountries.length === 1) {
    return <CountryDetails country={matchingCountries[0]} />;
  }

  if (matchingCountries.length > 10) {
    return <div>Too many matches, specify another filter!</div>;
  }

  return matchingCountries.map((country) => (
    <div key={country.name.common}>{country.name.common}</div>
  ));
};

export default ResultList;
