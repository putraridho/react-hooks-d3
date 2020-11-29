import { useEffect, useState } from "react";
import BBTimeline from "./BBTimeline";

function App3() {
  // const videoRef = useRef();

  const [bbEpisodes, setBbEpisodes] = useState([]);
  const [bbCharacters, setBbCharacters] = useState([]);
  const [highlight, setHighlight] = useState();

  useEffect(() => {
    fetch("https://www.breakingbadapi.com/api/characters?category=Breaking+Bad")
      .then((response) => response.ok && response.json())
      .then((characters) => {
        setBbCharacters(
          characters.sort((a, b) => a.name.localeCompare(b.name))
        );
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetch("https://www.breakingbadapi.com/api/episodes?series=Breaking+Bad")
      .then((response) => response.ok && response.json())
      .then((episodes) => {
        console.warn(episodes);
        setBbEpisodes(episodes);
      });
  }, []);

  // useEffect(() => {
  //   navigator.mediaDevices
  //     .getUserMedia({ video: true, audio: false })
  //     .then((stream) => {
  //       videoRef.current.srcObject = stream;
  //       videoRef.current.play();
  //     });
  // });

  return (
    <div className="bb-container">
      <h1>Breaking Bad Timeline</h1>
      <BBTimeline highlight={highlight} data={bbEpisodes} />
      <h2>Select your character</h2>
      <select value={highlight} onChange={(e) => setHighlight(e.target.value)}>
        <option>Select character</option>
        {bbCharacters.map((character) => (
          <option key={character.name}>{character.name}</option>
        ))}
      </select>
      {/* <video
        ref={videoRef}
        style={{ transform: "scale(-1, 1)" }}
        width={300}
        height={150}
      /> */}
    </div>
  );
}

export default App3;
