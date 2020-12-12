import { useState } from "react";
import StackedBarChart from "./StackedBarChart";

const allKeys = ["🥑", "🍌", "🍆"];

const colors = {
  "🥑": "green",
  "🍌": "orange",
  "🍆": "purple",
};

function App8() {
  const [keys, setKeys] = useState(allKeys);
  const [data, setData] = useState([
    {
      year: 1980,
      "🥑": 10,
      "🍌": 20,
      "🍆": 30,
    },
    {
      year: 1990,
      "🥑": 20,
      "🍌": 40,
      "🍆": 60,
    },
    {
      year: 2000,
      "🥑": 30,
      "🍌": 45,
      "🍆": 80,
    },
    {
      year: 2010,
      "🥑": 40,
      "🍌": 60,
      "🍆": 100,
    },
    {
      year: 2020,
      "🥑": 50,
      "🍌": 80,
      "🍆": 120,
    },
  ]);

  return (
    <div className="column-container">
      <h1>Stacked Area Chart with D3</h1>

      <StackedBarChart data={data} keys={keys} colors={colors} />

      <div className="fields">
        {allKeys.map((key) => (
          <div key={key} className="field">
            <input
              type="checkbox"
              id={key}
              checked={keys.includes(key)}
              onChange={(e) => {
                if (e.target.checked) {
                  setKeys(Array.from(new Set([...keys, key])));
                } else {
                  setKeys(keys.filter((_key) => _key !== key));
                }
              }}
            />
            <label htmlFor={key} style={{ color: colors[key] }}>
              {key}
            </label>
          </div>
        ))}
      </div>

      <button
        onClick={() =>
          setData([
            ...data,
            {
              year: Math.max(...data.map((d) => d.year)) + 10,
              "🥑": Math.round(Math.random() * 100),
              "🍌": Math.round(Math.random() * 125),
              "🍆": Math.round(Math.random() * 150),
            },
          ])
        }
      >
        Add data
      </button>
    </div>
  );
}

export default App8;
