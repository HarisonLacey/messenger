import dbConnect from "../../util/mongodb";
import User from "../../models/user";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/client";
import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import styled, { keyframes, css } from "styled-components";

// message user page

const buttonAnimation = keyframes`
0% { width: 50%}
50% { width: 40% }
100% { width: 50%}
`;

const SendButton = styled.button.attrs(({ name, ...rest }) => ({
  hover:
    !rest.lock &&
    css`
      ${buttonAnimation} 1s infinite
    `,
}))`
  width: 50%;
  margin: 1%;
  border: none;
  background-color: ${({ theme }) => theme.colors.blue};
  padding: 1.5% 0;
  :hover{
  animation: ${({ hover }) => hover};
  }
}}
`;

export default function UserItem({ user }) {
  const [message, setMessage] = useState();
  const [response, setResponse] = useState("Send");
  const [lock, setLock] = useState(false);
  const [session] = useSession();
  const router = useRouter();
  useEffect(() => {
    session ? setLock(false) : setLock(true);
  }, [session]);
  const sendMessage = async (e) => {
    e.preventDefault();
    setResponse("Sending...");
    try {
      const res = await axios.post("/api/message", {
        message: message,
        id: user._id,
      });
      setResponse(res.data.message);
    } catch (err) {
      console.log(err.message);
    }
  };
  return (
    <Layout>
      {router.isFallback ? (
        <div>Loading...</div>
      ) : (
        <Container fluid>
          <Row style={{ textAlign: "center" }} noGutters>
            <Col style={{ textAlign: "left" }} xs={12}>
              <h4 style={{ borderBottom: "solid 2px" }}>
                <strong>{user.name}</strong> | {user.city}
              </h4>
            </Col>
            <Col xs={12}>
              <form
                style={{ width: "80%", margin: "0 auto" }}
                onSubmit={sendMessage}
              >
                <textarea
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="message"
                  type="text area"
                  disabled={lock}
                  style={{
                    display: "block",
                    margin: "2% auto",
                    width: "70%",
                    maxHeight: "100px",
                  }}
                  required
                />
                <SendButton
                  type="submit"
                  disabled={lock}
                  lock={lock}
                  name={true}
                >
                  <strong>{response}</strong>
                </SendButton>
                {!session && (
                  <p>
                    <strong>Sign in to send a message</strong>
                  </p>
                )}
              </form>
            </Col>
            <Col xs={12}>
              {response === "Message Sent!" && (
                <Link href="/dashboard">
                  <button
                    style={{
                      width: "50%",
                      margin: "1%",
                      border: "none",
                      backgroundColor: "#c6ffc1",
                      padding: "1.5% 0",
                    }}
                    type="submit"
                    disabled={lock}
                  >
                    <strong>
                      <a>Continue in Dashboard</a>
                    </strong>
                  </button>
                </Link>
              )}
            </Col>
          </Row>
        </Container>
      )}
    </Layout>
  );
}

export async function getStaticProps({ params }) {
  try {
    await dbConnect();
    const res = await User.findById(params.id);
    return {
      props: {
        user: JSON.parse(JSON.stringify(res)),
      },
      revalidate: 1,
    };
  } catch (err) {
    console.log(err.message);
  }
}

export async function getStaticPaths() {
  try {
    await dbConnect();
    const res = await User.find({});
    const paths = JSON.parse(JSON.stringify(res)).map((e) => ({
      params: { id: e._id },
    }));
    return {
      paths,
      fallback: true,
    };
  } catch (err) {
    console.log(err.message);
  }
}
