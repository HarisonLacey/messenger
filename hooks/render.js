import { useEffect, useRef } from "react";

export function firstRender() {
  const render = useRef(true);
  useEffect(() => {
    render.current = false;
  }, []);

  return render.current;
}
