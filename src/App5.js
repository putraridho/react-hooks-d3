import { useState } from "react";
import ForceTreeChart from "./ForceTreeChart";
import TreeChart from "./TreeChart";

const initialData = {
  name: "😐",
  children: [
    {
      name: "🙂",
      children: [
        {
          name: "😀",
        },
        {
          name: "😁",
        },
        {
          name: "🤣",
        },
      ],
    },
    {
      name: "😔",
    },
  ],
};

function App5() {
  const [data, setData] = useState(initialData);
  return (
    <div className="column-container">
      <h1>D3 Force Layout</h1>
      <ForceTreeChart data={data} />
      <h1>Animated Tree Chart</h1>
      <TreeChart data={data} />
      <button onClick={() => setData(initialData.children[0])}>
        Update Data
      </button>
    </div>
  );
}

export default App5;
