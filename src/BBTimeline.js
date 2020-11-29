import { select, min, max, scaleTime, axisBottom, scaleLinear } from "d3";
import { useEffect, useRef } from "react";
import useResizeObserver from "./useResizeObserver";

const getDate = (dateString) => {
  const date = dateString.split("-");
  return new Date(date[2], date[0] - 1, date[1]);
};

function BBTimeline({ highlight, data }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const [width, height] = useResizeObserver(wrapperRef);

  useEffect(() => {
    const svg = select(svgRef.current);

    console.log(data);

    const minDate = min(data, (episode) => getDate(episode.air_date));
    const maxDate = max(data, (episode) => getDate(episode.air_date));

    const xScale = scaleTime().domain([minDate, maxDate]).range([0, width]);

    const yScale = scaleLinear()
      .domain([max(data, (episode) => episode.characters.length), 0])
      .range([0, height]);

    svg
      .selectAll(".episode")
      .data(data)
      .join("line")
      .attr("class", "episode")
      .attr("stroke", (episode) =>
        episode.characters.includes(highlight) ? "blue" : "black"
      )
      .attr("x1", (episode) => xScale(getDate(episode.air_date)))
      .attr("y1", height)
      .attr("x2", (episode) => xScale(getDate(episode.air_date)))
      .attr("y2", (episode) => yScale(episode.characters.length));

    const xAxis = axisBottom(xScale);
    svg
      .select(".x-axis")
      .style("transform", "translateY(" + height + "px)")
      .call(xAxis);
  }, [data, height, highlight, width]);

  return (
    <div ref={wrapperRef} style={{ marginBottom: "2rem", width: "100%" }}>
      <svg ref={svgRef} width={width} height={height}>
        <g className="x-axis" />
      </svg>
    </div>
  );
}

export default BBTimeline;
