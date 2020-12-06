import { useState } from "react";
import BrushChart from "./BrushChart";
import BrushChartChild from "./BrushChartChild";

function App7() {
  const [data, setData] = useState([10, 25, 30, 40, 25, 60]);
  return (
    <div className="column-container">
      <h1>Sub-selections with d3-brush</h1>

      <BrushChart data={data}>
        {(selection) => <BrushChartChild data={data} selection={selection} />}
      </BrushChart>
      <button
        onClick={() => setData([...data, Math.round(Math.random() * 100)])}
      >
        Add data
      </button>
    </div>
  );
}

export default App7;
