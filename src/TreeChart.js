import { hierarchy, linkHorizontal, select, tree } from "d3";
import { useEffect, useRef } from "react";
import useResizeObserver from "./useResizeObserver";

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

function TreeChart({ data }) {
  const wrapperRef = useRef();
  const svgRef = useRef();
  const [w, h] = useResizeObserver(wrapperRef);
  const previouslyRenderedData = usePrevious(data);

  useEffect(() => {
    const svg = select(svgRef.current);
    const { width, height } = !h
      ? wrapperRef.current.getBoundingClientRect()
      : { width: w, height: h };

    const root = hierarchy(data);
    const treeLayout = tree().size([height, width]);
    treeLayout(root);

    const linkGenerator = linkHorizontal()
      .x((node) => node.y)
      .y((node) => node.x);

    const enteringAndUpdatingNodes = svg
      .selectAll(".node")
      .data(root.descendants())
      .join("circle")
      .attr("class", "node")
      .attr("r", 4)
      .attr("fill", "black")
      .attr("cx", (node) => node.y)
      .attr("cy", (node) => node.x);

    const enteringAndUpdatingLinks = svg
      .selectAll(".link")
      .data(root.links())
      .join("path")
      .attr("class", "link")
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("d", linkGenerator)
      .attr("stroke-dasharray", function () {
        const length = this.getTotalLength();
        return `${length} ${length}`;
      });

    const enteringAndUpdatingLabels = svg
      .selectAll(".label")
      .data(root.descendants())
      .join("text")
      .attr("class", "label")
      .text((node) => node.data.name)
      .attr("text-anchor", "middle")
      .attr("font-size", 24)
      .attr("x", (node) => node.y)
      .attr("y", (node) => node.x - 10);

    if (data !== previouslyRenderedData) {
      enteringAndUpdatingNodes
        .attr("opacity", 0)
        .transition()
        .duration(500)
        .delay((node) => node.depth * 500)
        .attr("opacity", 1);

      enteringAndUpdatingLinks
        .attr("stroke-dashoffset", function () {
          return this.getTotalLength();
        })
        .transition()
        .duration(500)
        .delay((linkObj) => linkObj.source.depth * 500)
        .attr("stroke-dashoffset", 0);

      enteringAndUpdatingLabels
        .attr("opacity", 0)
        .transition()
        .duration(500)
        .delay((node) => node.depth * 500)
        .attr("opacity", 1);
    }
  }, [data, h, previouslyRenderedData, w]);

  return (
    <div
      ref={wrapperRef}
      style={{
        marginBottom: "2rem",
        maxWidth: 800,
        width: "100%",
      }}
    >
      <svg ref={svgRef} width={w} height={h} />
    </div>
  );
}

export default TreeChart;
