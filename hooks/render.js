import { useEffect, useRef } from "react";

// render hook

export function firstRender() {
  const render = useRef(true);
  useEffect(() => {
    render.current = false;
  }, []);

  return render.current;
}
