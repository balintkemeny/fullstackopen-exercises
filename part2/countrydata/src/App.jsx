import { useState, useEffect } from "react";

import countryService from "./services/countries";
import ResultList from "./components/ResultList";

const App = () => {
  const [allCountries, setAllCountries] = useState(null);
  const [countrySearchField, setCountrySearchField] = useState("");

  useEffect(() => {
    countryService.getAllCountries().then((fetchedCountries) => {
      console.log(fetchedCountries);
      setAllCountries(fetchedCountries);
    });
  }, []);

  const handleCountrySearchFieldChange = (event) => {
    setCountrySearchField(event.target.value);
  };

  if (!allCountries) {
    return null;
  }

  return (
    <div>
      <p>
        find countries{" "}
        <input
          value={countrySearchField}
          onChange={handleCountrySearchFieldChange}
        />
      </p>
      <ResultList
        allCountries={allCountries}
        countrySearchField={countrySearchField}
        setCountrySearchField={setCountrySearchField}
      />
    </div>
  );
};

export default App;
