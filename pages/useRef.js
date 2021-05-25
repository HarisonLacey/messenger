// useRef Practice

import { UseContext } from "../context/context";
import { useEffect, useState, useCallback, useRef } from "react";
import styled from "styled-components";

const Div = styled.div.attrs(({ color }) => ({
  color: color ? "red" : "blue",
}))`
  .classAdd {
    background-color: ${({ color }) => color};
    padding-left: 20em;
  }
`;

export default function UseRef() {
  const [color, setColor] = useState(false);
  const { message } = UseContext();
  const newRef = useRef();

  useEffect(() => {
    console.log("use effect");
    color
      ? (newRef.current.style.color = "red")
      : (newRef.current.style.color = "blue");
  }, [color]);

  const Refs = useCallback((el, Class) => {
    console.log(el);
    if (el) {
      el.classList.toggle(Class);
    }
  }, []);

  return (
    <Div>
      <button
        onClick={() => {
          color ? setColor(false) : setColor(true);
        }}
      >
        {message}
      </button>
      {[1, 2, 3].map((i) => (
        // access each ref on callback
        <p key={i} ref={(el) => Refs(el, "classAdd")}>
          {i}
        </p>
      ))}
      <button
        onClick={() => {
          color ? setColor(false) : setColor(true);
        }}
      >
        {message}
      </button>
      {[1, 2, 3].map((i) => (
        // only access last ref
        <p key={i} ref={newRef}>
          {i}
        </p>
      ))}
    </Div>
  );
}
