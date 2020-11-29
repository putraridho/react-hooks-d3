import { axisBottom, axisRight, scaleBand, scaleLinear, select } from "d3";
import { useEffect, useMemo, useRef } from "react";
import useResizeObserver from "./useResizeObserver";

function BarChart({ data }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const [width, height] = useResizeObserver(wrapperRef);

  useEffect(() => {
    const svg = select(svgRef.current);

    const xScale = scaleBand()
      .domain(data.map((_, index) => index))
      .range([0, width])
      .padding(0.5);

    const yScale = scaleLinear().domain([0, 150]).range([height, 0]);

    const colorScale = scaleLinear()
      .domain([75, 100, 150])
      .range(["green", "orange", "red"])
      .clamp(true);

    const xAxis = axisBottom(xScale).ticks(data.length);
    svg
      .select(".x-axis")
      .style("transform", "translateY(" + height + "px)")
      .call(xAxis);

    const yAxis = axisRight(yScale);
    svg
      .select(".y-axis")
      .style("transform", "translateX(" + width + "px)")
      .call(yAxis);

    svg
      .selectAll(".bar")
      .data(data)
      .join("rect")
      .attr("class", "bar")
      .style("transform", "scale(1, -1")
      .attr("x", (_, index) => xScale(index))
      .attr("y", -height)
      .attr("width", xScale.bandwidth())
      .on("mouseenter", function (_, value) {
        const index = svg.selectAll(".bar").nodes().indexOf(this);
        svg
          .selectAll(".tooltip")
          .data([value])
          .join((enter) => enter.append("text").attr("y", yScale(value) - 4))
          .attr("class", "tooltip")
          .text(value)
          .attr("x", xScale(index) + xScale.bandwidth() / 2)
          .attr("text-anchor", "middle")
          .transition()
          .attr("y", yScale(value) - 8)
          .attr("opacity", 1);
      })
      .on("mouseleave", () => svg.select(".tooltip").remove())
      .transition()
      .attr("fill", colorScale)
      .attr("height", (value) => height - yScale(value));
  }, [data, height, width]);

  const bars = useMemo(
    () => data.map((_, i) => <rect className="bar" key={i} />),
    [data]
  );

  return (
    <div ref={wrapperRef}>
      <svg ref={svgRef} width={width} height={height}>
        {bars}
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </div>
  );
}

export default BarChart;
