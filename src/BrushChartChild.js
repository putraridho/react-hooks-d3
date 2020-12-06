import {
  axisBottom,
  axisLeft,
  curveCardinal,
  line,
  max,
  scaleLinear,
  select,
} from "d3";
import { useEffect, useRef } from "react";
import useResizeObserver from "./useResizeObserver";

function BrushChartChild({ data, selection, id = "myClipPath" }) {
  const wrapperRef = useRef();
  const svgRef = useRef();
  const [w, h] = useResizeObserver(wrapperRef);

  useEffect(() => {
    const svg = select(svgRef.current);
    const content = svg.select(".content");
    const { width, height } = h
      ? { width: w, height: h }
      : wrapperRef.current.getBoundingClientRect();

    const xScale = scaleLinear()
      .domain(selection)
      .range([10, width - 10]);

    const yScale = scaleLinear()
      .domain([0, max(data)])
      .range([height - 10, 10]);

    const lineGenerator = line()
      .x((_, index) => xScale(index))
      .y((d) => yScale(d))
      .curve(curveCardinal);

    content
      .selectAll(".myLine")
      .data([data])
      .join("path")
      .attr("class", "myLine")
      .attr("stroke", "black")
      .attr("fill", "none")
      .attr("d", lineGenerator);

    content
      .selectAll(".myDot")
      .data(data)
      .join("circle")
      .attr("class", "myDot")
      .attr("stroke", "none")
      .attr("r", (_, index) =>
        index >= selection[0] && index <= selection[1] ? 4 : 2
      )
      .attr("fill", (_, index) =>
        index >= selection[0] && index <= selection[1] ? "orange" : "black"
      )
      .attr("cx", (_, index) => xScale(index))
      .attr("cy", yScale);

    const xAxis = axisBottom(xScale);
    svg
      .select(".x-axis")
      .attr("transform", `translate(0,${height - 10})`)
      .call(xAxis);

    const yAxis = axisLeft(yScale);
    svg.select(".y-axis").attr("transform", `translate(10, 0)`).call(yAxis);
  }, [data, h, selection, w]);

  return (
    <>
      <div
        ref={wrapperRef}
        style={{
          marginBottom: "1rem",
          maxWidth: 800,
          width: "100%",
        }}
      >
        <svg
          ref={svgRef}
          width={w}
          height={h}
          style={{ overflow: "visible", background: "transparent" }}
        >
          <g className="x-axis" />
          <g className="y-axis" />
          <defs>
            <clipPath id={id}>
              <rect x="0" y="0" width="100%" height="100%" />
            </clipPath>
          </defs>
          <g className="content" clipPath={`url(#${id})`} />
        </svg>
      </div>
    </>
  );
}

export default BrushChartChild;
