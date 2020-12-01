import {
  forceManyBody,
  forceSimulation,
  hierarchy,
  select,
  pointer,
  forceX,
  forceCollide,
  forceRadial,
  forceY,
} from "d3";
import { useEffect, useRef } from "react";
import useResizeObserver from "./useResizeObserver";

function ForceTreeChart({ data }) {
  const wrapperRef = useRef();
  const svgRef = useRef();
  const [width, height] = useResizeObserver(wrapperRef);

  useEffect(() => {
    const svg = select(svgRef.current);

    svg.attr("viewBox", [-width / 2, -height / 2, width, height]);

    const root = hierarchy(data);
    const nodeData = root.descendants();
    const linkData = root.links();

    const simulation = forceSimulation(nodeData)
      .force("charge", forceManyBody().strength(-30))
      .force("collide", forceCollide(30))
      .on("tick", () => {
        svg
          .selectAll(".alpha")
          .data([data])
          .join("text")
          .attr("class", "alpha")
          .text(simulation.alpha().toFixed(2))
          .attr("x", -width / 2 + 10)
          .attr("y", -height / 2 + 25);

        svg
          .selectAll(".link")
          .data(linkData)
          .join("line")
          .attr("class", "link")
          .attr("stroke", "black")
          .attr("fill", "none")
          .attr("x1", (link) => link.source.x)
          .attr("y1", (link) => link.source.y)
          .attr("x2", (link) => link.target.x)
          .attr("y2", (link) => link.target.y);

        svg
          .selectAll(".node")
          .data(nodeData)
          .join("circle")
          .attr("class", "node")
          .attr("r", 4)
          .attr("cx", (node) => node.x)
          .attr("cy", (node) => node.y);

        svg
          .selectAll(".label")
          .data(nodeData)
          .join("text")
          .attr("class", "label")
          .attr("text-anchor", "middle")
          .attr("font-size", 20)
          .text((node) => node.data.name)
          .attr("x", (node) => node.x)
          .attr("y", (node) => node.y);
      });

    svg.on("mousemove", (e) => {
      const [x, y] = pointer(e);
      simulation
        .force(
          "x",
          forceX(x).strength((node) => 0.2 + node.depth * 0.15)
        )
        .force(
          "y",
          forceY(y).strength((node) => 0.2 + node.depth * 0.15)
        );
    });

    svg.on("click", (e) => {
      const [x, y] = pointer(e);
      simulation
        .alpha(0.5)
        .restart()
        .force("orbit", forceRadial(100, x, y).strength(0.8));

      svg
        .selectAll(".orbit")
        .data([data])
        .join("circle")
        .attr("class", "orbit")
        .attr("stroke", "green")
        .attr("fill", "none")
        .attr("r", 100)
        .attr("cx", x)
        .attr("cy", y);
    });
  }, [data, width, height]);

  return (
    <div
      ref={wrapperRef}
      style={{
        marginBottom: "2rem",
        maxWidth: 800,
        width: "100%",
      }}
    >
      <svg ref={svgRef} width={width} height={height} />
    </div>
  );
}

export default ForceTreeChart;
