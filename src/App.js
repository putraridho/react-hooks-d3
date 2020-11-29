import { useCallback, useState } from "react";
import BarChart from "./BarChart";

function App() {
  const generateData = useCallback(() => {
    const randomLength = Math.ceil(Math.random() * 25);

    const newData = [];

    for (let i = 0; i < randomLength; i++) {
      newData.push(Math.round(Math.random() * 150));
    }

    return newData;
  }, []);
  const [data, setData] = useState(generateData());

  const changeData = useCallback(() => {
    setData(generateData());
  }, [generateData]);

  const updateData = useCallback(() => {
    setData(data.map((value) => value + 5));
  }, [data]);

  const filterData = useCallback(() => {
    setData(data.filter((value) => value < 50));
  }, [data]);

  return (
    <div className="container">
      <BarChart data={data} />
      <button onClick={changeData}>Change Data</button>
      <br />
      <button onClick={updateData}>Update data</button>
      <br />
      <button onClick={filterData}>Filter data</button>
    </div>
  );
}

export default App;
