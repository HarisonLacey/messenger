import { getSession } from "next-auth/client";
import User from "../models/user";
import dbConnect from "../util/mongodb";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { useRouter } from "next/router";
import { Container, Row, Col } from "react-bootstrap";
import { firstRender } from "../hooks/render";

// user dashboard
export default function Dashboard({ profile, users }) {
  const [userMessages, setUserMessages] = useState([]);
  const [response, setResponse] = useState("Send");
  const [message, setMessage] = useState();
  const [id, setId] = useState();
  const firstRend = firstRender();
  const router = useRouter();
  const refreshData = () => {
    router.replace(router.asPath);
  };
  useEffect(() => {
    if (firstRend) {
      setUserMessages([]);
      setId(users[0].user_id);
      profile.messages.forEach((el) => {
        if (el.user_id === users[0].user_id) {
          setUserMessages((userMessages) => [...userMessages, el]);
        }
      });
    }
  }, []);
  useEffect(() => {
    if (!firstRend) {
      console.log("render");
      setUserMessages([]);
      profile.messages.forEach((el) => {
        if (el.user_id === id) {
          setUserMessages((userMessages) => [...userMessages, el]);
        }
      });
    }
  }, [profile]);
  const Messages = (e) => {
    setId(e.target.id);
    setUserMessages([]);
    profile.messages.forEach((el) => {
      if (el.user_id === e.target.id) {
        setUserMessages((userMessages) => [...userMessages, el]);
      }
    });
  };
  const toFrom = useCallback((el, value) => {
    if (el) {
      value === "to"
        ? (el.style.backgroundColor = "#9fe6a0")
        : (el.style.backgroundColor = "#f5f7b2");
      value === "to"
        ? (el.style.marginLeft = "50%")
        : (el.style.marginLeft = "0");
    }
  }, []);
  const Delete = async (e) => {
    try {
      let res = await axios.post("api/delete", {
        id: e.target.id,
      });
      userMessages.splice(e.target.className, 1);
      setUserMessages(userMessages);
      setResponse(res.data.message);
      refreshData();
    } catch (err) {
      console.log(err);
    }
  };
  const sendMessage = async (e) => {
    e.preventDefault();
    try {
      let res = await axios.post("api/message", {
        message: message,
        id: id,
      });
      setResponse(res.data.message);
      refreshData();
      setTimeout(() => {
        setResponse("Send");
      }, 5000);
    } catch (err) {
      console.log(err);
    }
  };
  const DeleteChat = async (e) => {
    try {
      let res = await axios.post("api/deleteChat", {
        id: e.target.id,
      });
      setResponse(res.data.message);
      setUserMessages([]);
      refreshData();
    } catch (err) {
      console.log(err.message);
    }
  };
  return (
    <Layout>
      <Container fluid>
        <Row style={{ minHeight: "500px" }} noGutters>
          <Col xs={3} md={2}>
            {users.map((e) => (
              <>
                <p id={e.user_id} onClick={Messages}>
                  {e.user_profile.name}
                </p>
                <button id={e.user_id} onClick={DeleteChat}>
                  Delete Chat
                </button>
              </>
            ))}
          </Col>
          <Col style={{ position: "relative" }} xs={9} md={10}>
            <div
              style={{
                height: "400px",
                overflow: "auto",
                display: "flex",
                flexDirection: "column-reverse",
              }}
            >
              {userMessages.map((e, index) => (
                <p
                  style={{
                    minHeight: "50px",
                    borderRadius: "2%",
                    width: "50%",
                    padding: "0.5%",
                  }}
                  id={e.code}
                  className={index}
                  onClick={Delete}
                  ref={(el) => toFrom(el, e.type)}
                >
                  {e.message}
                </p>
              ))}
            </div>
            <form
              style={{ position: "absolute", bottom: "0", width: "100%" }}
              onSubmit={sendMessage}
            >
              <textarea
                style={{ width: "100%", maxHeight: "100px" }}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="message"
              />
              <button style={{ width: "100%" }} type="submit">
                {response}
              </button>
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
            : console.log("user exists");
        });
        array.splice(0, 1);
        console.log(array);
        return {
          props: {
            profile: JSON.parse(JSON.stringify(userFind)),
            users: array,
          },
        };
      } catch (err) {
        console.log(err);
      }
    }
  }
}
