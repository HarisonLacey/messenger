import { ContextWrapper } from "../context/context";
import { themes, GlobalStyle } from "../styledComponents/globalStyles";
import { ThemeProvider } from "styled-components";
import { Provider } from "next-auth/client";

function MyApp({ Component, pageProps }) {
  const { session } = pageProps;
  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={themes}>
        <ContextWrapper data={{ message: "Click Me!" }}>
          <Provider session={session}>
            <Component {...pageProps} />
          </Provider>
        </ContextWrapper>
      </ThemeProvider>
    </>
  );
}

export default MyApp;
