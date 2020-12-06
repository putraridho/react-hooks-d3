import { useState } from "react";
import GeoChart from "./GeoChart";
import data from "./GeoChart.world.geo.json";

function App6() {
  const [property, setProperty] = useState("pop_est");
  return (
    <div className="column-container">
      <h1>D3 Force Layout</h1>
      <GeoChart data={data} property={property} />
      <h2>Select property to highlight</h2>
      <select
        value={property}
        onChange={(event) => setProperty(event.target.value)}
      >
        <option value="pop_est">Population</option>
        <option value="name_len">Name length</option>
        <option value="gdp_md_est">GDP</option>
      </select>
    </div>
  );
}

export default App6;
