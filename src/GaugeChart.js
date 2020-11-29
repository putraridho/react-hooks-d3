import { useEffect, useRef } from "react";
import { select, arc, pie, interpolate } from "d3";
import useResizeObserver from "./useResizeObserver";

function GaugeChart({ data }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const [width, height] = useResizeObserver(wrapperRef);

  useEffect(() => {
    const svg = select(svgRef.current);

    const arcGenerator = arc().innerRadius(75).outerRadius(150);

    const pieGenerator = pie()
      .startAngle(-0.5 * Math.PI)
      .endAngle(0.5 * Math.PI)
      .sort(null);

    const instructions = pieGenerator(data);

    svg
      .selectAll(".slice")
      .data(instructions)
      .join("path")
      .attr("class", "slice")
      .attr("fill", (_, index) => (index === 0 ? "#FC0" : "#EEE"))
      .style("transform", `translate(${width / 2}px, ${height}px)`)
      .transition()
      .attrTween("d", function (nextInstruction, index) {
        const initialInstruction = pieGenerator([0, 1])[index];
        const interpolator = interpolate(
          this.lastInstruction || initialInstruction,
          nextInstruction
        );
        this.lastInstruction = interpolator(1);
        return function (t) {
          return arcGenerator(interpolator(t));
        };
      });
  }, [data, height, width]);

  return (
    <div
      className="gauge-wrapper"
      ref={wrapperRef}
      style={{ marginBottom: "2rem" }}
    >
      <svg ref={svgRef} width={width} height={height} />
    </div>
  );
}

export default GaugeChart;
