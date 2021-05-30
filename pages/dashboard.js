import { getSession } from "next-auth/client";
import User from "../models/user";
import dbConnect from "../util/mongodb";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { useRouter } from "next/router";
import { Container, Row, Col } from "react-bootstrap";
import { firstRender } from "../hooks/render";
import Link from "next/link";
import styled, { keyframes, css } from "styled-components";

// user dashboard

const UserBox = styled.div`
  text-align: center;
  margin-right: 10%;
  margin-bottom: 4%;
  p {
    margin: 0;
  }
  p:first-child {
    border-bottom: solid 1px;
  }
`;

const buttonAnimation = keyframes`
0% { width: 100%}
50% { width: 90% }
100% { width: 100%}
`;

const SendButton = styled.button.attrs(({ message }) => ({
  hover:
    message &&
    css`
      ${buttonAnimation} 1s infinite
    `,
}))`
  cursor: pointer;
  width: 100%;
  border: none;
  height: 50px;
  background-color: ${({ theme }) => theme.colors.blue};
  :hover {
    animation: ${({ hover }) => hover};
  }
`;

const MessageContainer = styled.div.attrs(({ message }) => ({
  display: message && "flex",
  reverse: message && "column-reverse",
}))`
  display: ${({ display }) => display};
  flex-direction: ${({ reverse }) => reverse};
  height: 500px;
  overflow: auto;
  background-color: whitesmoke;
  padding: 2%;
  border-radius: 2%;
`;

const Find = styled.h4`
  cursor: pointer;
  :hover {
    text-decoration: underline;
  }
`;

export default function Dashboard({ profile, users }) {
  const [userMessages, setUserMessages] = useState([]);
  const [response, setResponse] = useState("Send");
  const [message, setMessage] = useState();
  const [id, setId] = useState();
  const [able, setAble] = useState(false);
  const firstRend = firstRender();
  const router = useRouter();
  const refreshData = () => {
    router.replace(router.asPath);
  };
  useEffect(() => {
    users[0] ? setAble(false) : setAble(true);
  }, [users]);
  useEffect(async () => {
    if (firstRend && users[0]) {
      router.replace("/dashboard");
      setUserMessages([]);
      setId(users[0].user_id);
      try {
        await profile.messages.forEach((el) => {
          if (el.user_id === users[0].user_id) {
            setUserMessages((userMessages) => [...userMessages, el]);
          }
        });
      } catch (err) {
        console.log(err.message);
      }
    }
  }, []);
  useEffect(async () => {
    if (!firstRend && users[0]) {
      setUserMessages([]);
      try {
        await profile.messages.forEach((el) => {
          if (el.user_id === id) {
            setUserMessages((userMessages) => [...userMessages, el]);
          }
        });
      } catch (err) {
        console.log(err.message);
      }
    }
  }, [profile]);
  const Messages = async (e) => {
    setId(e.target.id);
    setUserMessages([]);
    try {
      await profile.messages.forEach((el) => {
        if (el.user_id === e.target.id) {
          setUserMessages((userMessages) => [...userMessages, el]);
        }
      });
    } catch (err) {
      console.log(err.message);
    }
  };
  const toFrom = useCallback((el, value) => {
    if (el) {
      value === "to"
        ? (el.style.backgroundColor = "#c6ffc1")
        : (el.style.backgroundColor = "#f5f7b2");
      value === "to"
        ? (el.style.marginLeft = "50%")
        : (el.style.marginLeft = "0");
    }
  }, []);
  const Delete = async (e) => {
    try {
      await axios.post("api/delete", {
        id: e.target.id,
      });
      userMessages.splice(e.target.className, 1);
      setUserMessages(userMessages);
      refreshData();
    } catch (err) {
      console.log(err.message);
    }
  };
  const sendMessage = async (e) => {
    e.preventDefault();
    setResponse("Sending...");
    try {
      const res = await axios.post("api/message", {
        message: message,
        id: id,
      });
      setResponse(res.data.message);
      refreshData();
      setTimeout(() => {
        setResponse("Send");
      }, 5000);
    } catch (err) {
      console.log(err.message);
    }
  };
  const DeleteChat = async (e) => {
    try {
      await axios.post("api/deleteChat", {
        id: e.target.id,
      });
      setUserMessages([]);
      refreshData();
    } catch (err) {
      console.log(err.message);
    }
  };
  const resetText = useCallback(
    (el) => {
      if (el) el.value = "";
    },
    [profile]
  );
  return (
    <Layout title="Dashboard">
      <Container fluid>
        <Row style={{ minHeight: "720px" }} noGutters>
          <Col xs={3} md={2}>
            <div style={{ height: "500px", overflow: "auto" }}>
              {users[0] ? (
                <>
                  {users.map((e) => (
                    <UserBox>
                      <div
                        style={{
                          backgroundColor: "#caf7e3",
                          padding: "2%",
                          borderRadius: "2%",
                        }}
                      >
                        <p
                          id={e.user_id}
                          onClick={Messages}
                          style={{ fontWeight: "bold", cursor: "pointer" }}
                        >
                          {e.user_profile.name}
                        </p>
                        <p>{e.user_profile.city}</p>
                      </div>
                      <button
                        style={{
                          border: "none",
                          fontSize: "0.7em",
                          marginLeft: "2%",
                        }}
                        id={e.user_id}
                        onClick={DeleteChat}
                      >
                        Delete
                      </button>
                    </UserBox>
                  ))}
                </>
              ) : (
                <Link href="/">
                  <Find>
                    <a>Find users</a>
                  </Find>
                </Link>
              )}
            </div>
          </Col>
          <Col xs={9} md={10}>
            <MessageContainer message={userMessages[0]}>
              {userMessages[0] ? (
                <>
                  {userMessages.map((e, index) => (
                    <p
                      style={{
                        minHeight: "50px",
                        borderRadius: "2%",
                        width: "50%",
                        padding: "0.5%",
                        cursor: "pointer",
                      }}
                      id={e.code}
                      className={index}
                      onClick={Delete}
                      ref={(el) => toFrom(el, e.type)}
                    >
                      {e.message}
                    </p>
                  ))}
                </>
              ) : (
                <h4 style={{ textAlign: "center" }}>No messages</h4>
              )}
            </MessageContainer>
            <form
              style={{
                position: "absolute",
                bottom: "4%",
                width: "100%",
                textAlign: "center",
              }}
              onSubmit={sendMessage}
            >
              <textarea
                ref={resetText}
                disabled={able}
                style={{ width: "100%", maxHeight: "100px" }}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="message"
                required
              />
              <SendButton
                disabled={able}
                message={userMessages[0]}
                type="submit"
              >
                <strong>{response}</strong>
              </SendButton>
              {userMessages[0] && (
                <p style={{ paddingTop: "2%" }}>Click on messages to delete</p>
              )}
            </form>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);
  if (!session) {
    ctx.res.writeHead(302, { Location: "/" });
    ctx.res.end();
    return {
      props: {
        user: {},
      },
    };
  }
  if (session) {
    try {
      await dbConnect();
      var user = await User.findById(session.user.id);
      if (user === null) {
        ctx.res.writeHead(302, { Location: "/" });
        ctx.res.end();
        return {
          props: {
            user: {},
          },
        };
      }
    } catch (err) {
      console.log(err.message);
    }
    if (user.newUser) {
      ctx.res.writeHead(302, { Location: "/profile" });
      ctx.res.end();
      return {
        props: {
          user: {},
        },
      };
    } else {
      try {
        await dbConnect();
        const userFind = await User.findById(session.user.id);
        const array = [{ user_id: "1" }];
        await JSON.parse(JSON.stringify(userFind.messages)).forEach((e) => {
          array.findIndex((el) => el.user_id == e.user_id) === -1
            ? array.push(e)
            : null;
        });
        array.splice(0, 1);
        return {
          props: {
            profile: JSON.parse(JSON.stringify(userFind)),
            users: array,
          },
        };
      } catch (err) {
        console.log(err.message);
      }
    }
  }
}
