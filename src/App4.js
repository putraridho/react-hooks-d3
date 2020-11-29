import { useState } from "react";
import RacingBarChart from "./RacingBarChart";
import useInterval from "./useInterval";

const getRandomIndex = (array) => Math.floor(array.length * Math.random());

function App4() {
  const [iteration, setIteration] = useState(0);
  const [start, setStart] = useState(false);
  const [data, setData] = useState([
    {
      name: "alpha",
      value: 1,
      color: "#F4EFD3",
    },
    {
      name: "beta",
      value: 1,
      color: "#CCCCCC",
    },
    {
      name: "charlie",
      value: 1,
      color: "#C2B0C9",
    },
    {
      name: "delta",
      value: 1,
      color: "#9656A1",
    },
    {
      name: "echo",
      value: 1,
      color: "#fA697C",
    },
    {
      name: "foxtrot",
      value: 1,
      color: "#FCC169",
    },
  ]);

  useInterval(() => {
    if (start) {
      setData(
        data.map((entry) => ({
          ...entry,
          value: entry.value + Math.round(Math.random() * 500),
        }))
      );
      setIteration(iteration + 1);
    }
  }, 200);

  return (
    <div className="racing-bar-container">
      <h1>Racing Bar Chart</h1>
      <RacingBarChart data={data} />
      <button onClick={() => setStart(!start)}>
        {start ? "Stop the race" : "Start the race"}
      </button>
      <p>Iteration: {iteration}</p>
    </div>
  );
}

export default App4;
