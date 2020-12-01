import { geoMercator, geoPath, max, min, scaleLinear, select } from "d3";
import { useEffect, useRef, useState } from "react";
import useResizeObserver from "./useResizeObserver";

function GeoChart({ data, property }) {
  const wrapperRef = useRef();
  const svgRef = useRef();
  const [w, h] = useResizeObserver(wrapperRef);
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    if (!h) return;
    const svg = select(svgRef.current);

    const minProp = min(
      data.features,
      (feature) => feature.properties[property]
    );

    const maxProp = max(
      data.features,
      (feature) => feature.properties[property]
    );

    const colorScale = scaleLinear()
      .domain([minProp, maxProp])
      .range(["#ccc", "red"]);

    const { width, height } = h
      ? { width: w, height: h }
      : wrapperRef.current.getBoundingClientRect();

    const projection = geoMercator()
      .fitSize([width, height], selectedCountry || data)
      .precision(100);

    const pathGenerator = geoPath().projection(projection);

    svg
      .selectAll(".country")
      .data(data.features)
      .join("path")
      .on("click", (_, feature) => {
        setSelectedCountry(selectedCountry === feature ? null : feature);
      })
      .attr("class", "country")
      .transition()
      .attr("fill", (feature) => colorScale(feature.properties[property]))
      .attr("d", (feature) => pathGenerator(feature));

    svg
      .selectAll(".label")
      .data([selectedCountry])
      .join("text")
      .attr("class", "label")
      .text(
        (feature) =>
          feature &&
          feature.properties.name +
            ": " +
            feature.properties[property].toLocaleString()
      )
      .attr("x", 18)
      .attr("y", 25);
  }, [data, h, property, selectedCountry, w]);

  return (
    <div
      ref={wrapperRef}
      style={{
        marginBottom: "2rem",
        maxWidth: 800,
        width: "100%",
      }}
    >
      <svg ref={svgRef} width={w} height={h} style={{ overflow: "hidden" }} />
    </div>
  );
}

export default GeoChart;
