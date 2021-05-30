import Head from "next/head";
import Header from "../components/Header";

// layout component

export default function Layout({ children, ...rest }) {
  return (
    <>
      <Head>
        <title>{rest.title} | Messenger</title>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Condensed&display=swap"
          rel="stylesheet"
        ></link>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" href="/images/user.png" />
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css"
          integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk"
          crossorigin="anonymous"
        />
      </Head>
      <header>
        <Header name="header" description="menu header" />
      </header>
      <main style={{ paddingTop: "100px", minHeight: "500px" }}>
        {children}
      </main>
      <footer
        style={{ height: "100px", borderTop: "solid 1px", marginTop: "1%" }}
      ></footer>
    </>
  );
}
