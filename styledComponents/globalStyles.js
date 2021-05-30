import { createGlobalStyle } from "styled-components";

// global styles and themes

export const GlobalStyle = createGlobalStyle`
body {
    margin: 0;
    background-color: rgb(255, 251, 223, 0.3);
    font-family: 'Roboto Condensed', sans-serif;
}
`;

export const themes = {
  colors: {
    blue: "#caf7e3",
    green: "#c6ffc1",
    wheat: "#f5f7b2",
  },
};
