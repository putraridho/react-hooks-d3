import { useEffect, useState } from "react";
import ResizeObserver from "resize-observer-polyfill";

const calcHeight = (w) => (1 / 2) * w;

const useResizeObserver = (ref) => {
  const [dimensions, setDimensions] = useState([0, 0]);

  useEffect(() => {
    const observeTarget = ref.current;
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach(({ contentRect: { width } }) => {
        setDimensions([width, calcHeight(width)]);
      });
    });

    resizeObserver.observe(observeTarget);

    return () => {
      resizeObserver.unobserve(observeTarget);
    };
  }, [ref]);

  return dimensions;
};
export default useResizeObserver;
