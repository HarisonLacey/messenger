import { useEffect } from "react";
import { getSession } from "next-auth/client";
import User from "../models/user";
import dbConnect from "../util/mongodb";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { firstRender } from "../hooks/render";
import Layout from "../components/Layout";
import { Container, Row, Col } from "react-bootstrap";

// update profile

export default function Profile({ profile }) {
  const [name, setName] = useState();
  const [city, setCity] = useState();
  const [response, setResponse] = useState();
  const router = useRouter();
  const firstRend = firstRender();
  useEffect(() => {
    if (firstRend) router.replace("/profile");
  }, []);
  const profileUpdate = async (e) => {
    e.preventDefault();
    setResponse("Saving...")
    try {
      const res = await axios.post("api/profile", {
        name: name,
        city: city,
      });
      setResponse(res.data.message);
      router.push("/dashboard");
    } catch (err) {
      console.log(err.message);
    }
  };
  return (
    <Layout title="Profile">
      <Container fluid>
        <Row style={{ textAlign: "center" }} noGutters>
          <Col xs={12}>
            {profile.name ? (
              <p>
                Hello, <strong>{profile.name}</strong>. Please update your
                details.
              </p>
            ) : (
              <p>
                Hello, <strong>{profile.email}</strong>. Please update your
                details.
              </p>
            )}
          </Col>
          <Col xs={12}>
            <form
              style={{ width: "70%", margin: "0 auto" }}
              onSubmit={profileUpdate}
            >
              <input
                style={{
                  display: "block",
                  margin: "2% auto",
                  width: "70%",
                  textAlign: "center",
                  height: "50px"
                }}
                required
                onChange={(e) => setName(e.target.value)}
                placeholder="update name"
                type="text"
              />
              <input
                style={{
                  display: "block",
                  margin: "2% auto",
                  width: "70%",
                  textAlign: "center",
                  height: "50px"
                }}
                required
                onChange={(e) => setCity(e.target.value)}
                placeholder="update city"
                type="text"
              />
              <button
                style={{
                  width: "50%",
                  margin: "2%",
                  border: "none",
                  backgroundColor: "#caf7e3",
                  padding: "1.5% 0",
                }}
                type="submit"
              >
                <strong>Submit</strong>
              </button>
              <p>{response}</p>
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
      props: {},
    };
  }
  try {
    await dbConnect();
    const userFind = await User.findById(session.user.id);
    if (userFind === null) {
      ctx.res.writeHead(302, { Location: "/" });
      ctx.res.end();
      return {
        props: {
          user: {},
        },
      };
    }
    return {
      props: {
        profile: JSON.parse(JSON.stringify(userFind)),
      },
    };
  } catch (err) {
    console.log(err.message);
  }
}
