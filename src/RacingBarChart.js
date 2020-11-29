import { max, scaleBand, scaleLinear, select } from "d3";
import { useEffect, useRef } from "react";
import useResizeObserver from "./useResizeObserver";

function RacingBarChart({ data }) {
  const wrapperRef = useRef();
  const svgRef = useRef();
  const [width, height] = useResizeObserver(wrapperRef);

  useEffect(() => {
    const svg = select(svgRef.current);

    if (height === 0) return;

    data.sort((a, b) => b.value - a.value);

    const yScale = scaleBand()
      .domain(data.map((_, index) => index))
      .range([0, height])
      .paddingInner(0.1);

    const xScale = scaleLinear()
      .domain([
        0,
        max(data, (entry) => entry.value) !== 1
          ? max(data, (entry) => entry.value)
          : 500,
      ])
      .range([0, width]);

    svg
      .selectAll(".bar")
      .data(data, (entry) => entry.name)
      .join((enter) =>
        enter.append("rect").attr("y", (_, index) => yScale(index))
      )
      .attr("class", "bar")
      .attr("fill", (entry) => entry.color)
      .attr("x", 0)
      .attr("height", yScale.bandwidth())
      .transition()
      .attr("width", (entry) => xScale(entry.value))
      .attr("y", (_, index) => yScale(index));

    svg
      .selectAll(".label")
      .data(data, (entry) => entry.name)
      .join((enter) =>
        enter
          .append("text")
          .attr("y", (_, index) => yScale(index) + yScale.bandwidth() / 2 + 5)
      )
      .text((entry) => `🏎 ~ ${entry.name} (${entry.value} meters)`)
      .attr("class", "label")
      .attr("x", 10)
      .transition()
      .attr("y", (_, index) => yScale(index) + yScale.bandwidth() / 2 + 5);
  }, [data, height, width]);

  return (
    <div
      ref={wrapperRef}
      style={{ marginBottom: "2rem", width: "100%", maxWidth: 800 }}
    >
      <svg ref={svgRef} width={width} height={height} />
    </div>
  );
}

export default RacingBarChart;
