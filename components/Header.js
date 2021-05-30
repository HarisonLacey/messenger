import { signIn, signOut, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { useEffect, useState, memo } from "react";
import Link from "next/link";
import styled from "styled-components";

// header and menu component

const Menu = styled.div.attrs(({ width, scroll }) => ({
  width: width ? "50%" : "0",
  opacity: width ? "1" : "0",
  display: width ? "block" : "none",
  top: scroll ? "50px" : "80px",
}))`
  height: 100%;
  width: ${({ width }) => width};
  position: fixed;
  top: ${({ top }) => top};
  left: 0;
  transition: 0.3s;
  z-index: 3;
  text-align: center;
  background-color: rgb(245, 222, 179, ${({ opacity }) => opacity});
  p {
    display: ${({ display }) => display};
    width: 50%;
    margin: 2% auto;
    cursor: pointer;
    padding-bottom: 1%;
  }
  p:hover {
    text-decoration: underline;
  }
  p:first-child {
    margin: 3% auto;
    border-bottom: solid 1px;
    padding-bottom: 2%;
    cursor: context-menu;
  }
  p:first-child:hover {
    text-decoration: none;
  }
`;

const Bar = styled.div.attrs(({ scroll }) => ({
  height: scroll ? "50px" : "80px",
}))`
  height: ${({ height }) => height};
  border-bottom: solid 1px;
  transition: 0.3s;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 4;
  background-color: white;
`;

function Header({ age, ...rest }) {
  const [session, loading] = useSession();
  const [width, setWidth] = useState(false);
  const [scroll, setScroll] = useState(false);
  const [icon, setIcon] = useState("/images/menu.png");
  const router = useRouter();
  useEffect(() => {
    window.addEventListener("scroll", () => {
      document.documentElement.scrollTop > 20
        ? setScroll(true)
        : setScroll(false);
    });
    console.log(rest.name);
  }, []);
  function Icon() {
    width ? setWidth(false) : setWidth(true);
    width ? setIcon("/images/menu.png") : setIcon("/images/close.png");
  }
  return (
    <>
      <Bar scroll={scroll}>
        <img
          style={{ cursor: "pointer", margin: "1%" }}
          src={icon}
          onClick={Icon}
        />
      </Bar>
      <Menu width={width} scroll={scroll}>
        {loading && (
          <p>
            <strong>Loading...</strong>
          </p>
        )}
        {!session && !loading && (
          <>
            <p>
              <strong>Welcome</strong>
            </p>
            <p onClick={signIn}>Sign In</p>
          </>
        )}
        {session && !loading && (
          <>
            <p>
              <strong>Hey, {session.user.name}</strong>
            </p>
            {router.pathname !== "/dashboard" && (
              <Link href="/dashboard">
                <p>
                  <a>Dashboard</a>
                </p>
              </Link>
            )}
            {router.pathname === "/dashboard" && (
              <Link href="/profile">
                <p>
                  <a>Update Profile</a>
                </p>
              </Link>
            )}
            <p onClick={signOut}>Sign Out</p>
            {router.pathname !== "/" && (
              <Link href="/">
                <p>
                  <a>Home</a>
                </p>
              </Link>
            )}
          </>
        )}
      </Menu>
    </>
  );
}

export default memo(Header);
