import {
  axisBottom,
  axisLeft,
  brushX,
  curveCardinal,
  line,
  max,
  scaleLinear,
  select,
} from "d3";
import { useEffect, useRef, useState } from "react";
import useResizeObserver from "./useResizeObserver";
import usePrevious from "./usePrevious";

function BrushChart({ data, children }) {
  const wrapperRef = useRef();
  const svgRef = useRef();
  const [w, h] = useResizeObserver(wrapperRef);
  const [selection, setSelection] = useState([0, 1.5]);
  const previousSelection = usePrevious(selection);

  useEffect(() => {
    const svg = select(svgRef.current);
    const { width, height } = h
      ? { width: w, height: h }
      : wrapperRef.current.getBoundingClientRect();

    const xScale = scaleLinear()
      .domain([0, data.length - 1])
      .range([0, width]);

    const yScale = scaleLinear()
      .domain([0, max(data)])
      .range([height, 0]);

    const lineGenerator = line()
      .x((d, index) => xScale(index))
      .y((d) => yScale(d))
      .curve(curveCardinal);

    svg
      .selectAll(".myLine")
      .data([data])
      .join("path")
      .attr("class", "myLine")
      .attr("stroke", "black")
      .attr("fill", "none")
      .attr("d", lineGenerator);

    svg
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
      .attr("transform", `translate(0,${height})`)
      .call(xAxis);

    const yAxis = axisLeft(yScale);
    svg.select(".y-axis").call(yAxis);

    const brush = brushX()
      .extent([
        [0, 0],
        [width, height],
      ])
      .on("start brush end", (event) => {
        if (event.selection) {
          const indexSelection = event.selection.map(xScale.invert);
          setSelection(indexSelection);
        }
      });

    if (previousSelection === selection) {
      svg.select(".brush").call(brush).call(brush.move, selection.map(xScale));
    }
  }, [data, h, previousSelection, selection, w]);

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
          style={{ overflow: "visible", background: "#f5f5f5" }}
        >
          <g className="x-axis" />
          <g className="y-axis" />
          <g className="brush" />
        </svg>
      </div>
      {children(selection)}
    </>
  );
}

export default BrushChart;
