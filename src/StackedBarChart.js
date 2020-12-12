import {
  axisBottom,
  axisLeft,
  max,
  scaleBand,
  scaleLinear,
  select,
  stack,
  stackOrderAscending,
} from "d3";
import React, { useEffect, useRef } from "react";
import useResizeObserver from "./useResizeObserver";

function StackedBarChart({ data, keys, colors }) {
  const wrapperRef = useRef();
  const svgRef = useRef();
  const [w, h] = useResizeObserver(wrapperRef);

  useEffect(() => {
    const svg = select(svgRef.current);
    const { width, height } =
      h === 0
        ? wrapperRef.current.getBoundingClientRect()
        : { width: w, height: h };

    const stackGenerator = stack().keys(keys).order(stackOrderAscending);
    const layers = stackGenerator(data);
    const extent = [
      0,
      max(layers, (layer) => max(layer, (sequence) => sequence[1])),
    ];

    const xScale = scaleBand()
      .domain(data.map((d) => d.year))
      .range([0, width])
      .padding(0.25);

    const yScale = scaleLinear().domain(extent).range([height, 0]);

    svg
      .selectAll(".layer")
      .data(layers)
      .join("g")
      .attr("class", "layer")
      .attr("fill", (layer) => colors[layer.key])
      .selectAll("rect")
      .data((layer) => layer)
      .join("rect")
      .attr("x", (sequence) => xScale(sequence.data.year))
      .attr("width", xScale.bandwidth())
      .attr("y", (sequence) => yScale(sequence[1]))
      .attr("height", (sequence) => yScale(sequence[0]) - yScale(sequence[1]));

    const xAxis = axisBottom(xScale);
    svg
      .select(".x-axis")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);

    const yAxis = axisLeft(yScale);
    svg.select(".y-axis").call(yAxis);
  }, [colors, data, h, keys, w]);

  return (
    <div
      ref={wrapperRef}
      style={{
        marginBottom: "2rem",
        maxWidth: 800,
        width: "100%",
      }}
    >
      <svg ref={svgRef} width={w} height={h}>
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </div>
  );
}

export default StackedBarChart;
