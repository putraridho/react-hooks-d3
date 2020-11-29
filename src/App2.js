import { useEffect, useRef, useState } from "react";
import ml5 from "ml5";
import GaugeChart from "./GaugeChart";
import useInterval from "./useInterval";

let classifier;

function App2() {
  const [gaugeData, setGaugeData] = useState([0.5, 0.5]);
  const [shouldClassify, setShouldClassify] = useState(false);
  const videoRef = useRef();
  useEffect(() => {
    classifier = ml5.imageClassifier("./my-model/model.json", () => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((stream) => {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        });
    });
  }, []);

  useInterval(() => {
    if (classifier && shouldClassify) {
      classifier.classify(videoRef.current, (error, results) => {
        if (error) {
          console.error(error);
          return;
        }
        results.sort((a, b) => b.label.localeCompare(a.label));
        setGaugeData(results.map((entry) => 1 - entry.confidence));
      });
    }
  }, 500);

  return (
    <div className="video-container">
      <h1 style={{ textAlign: "center" }}>
        Is someone there?
        <br />
        <small>
          [{gaugeData[0].toFixed(2)}, {gaugeData[1].toFixed(2)}]
        </small>
      </h1>
      <GaugeChart data={gaugeData} />
      <button onClick={() => setShouldClassify((curr) => !curr)}>
        {shouldClassify ? "Stop Classifying" : "Start classifying"}
      </button>
      <video
        ref={videoRef}
        style={{ transform: "scale(-1, 1)" }}
        width={300}
        height={150}
      />
    </div>
  );
}

export default App2;
