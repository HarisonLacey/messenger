import Layout from "../components/Layout";
import { Container, Row, Col } from "react-bootstrap";
import User from "../models/user";
import dbConnect from "../util/mongodb";
import Link from "next/link";
import { getSession } from "next-auth/client";
import styled, { keyframes } from "styled-components";

// landing

const buttonAnimation = keyframes`
0% { width: 100%}
50% { width: 90% }
100% { width: 100%}
`;

const UserBox = styled.div`
  text-align: left;
  margin-right: 10%;
  p {
    margin: 2% auto;
    width: 100%;
    border-bottom: solid 1px;
    background-color: ${({ theme }) => theme.colors.blue};
    border-radius: 2%;
    padding: 1%;
  }
  p:hover {
    animation: ${buttonAnimation} 1s infinite;
  }
`;

// landing page
export default function Home({ users }) {
  return (
    <Layout title="Home">
      <Container fluid>
        <Row noGutters>
          <Col xs={12}>
            <h4 style={{ borderBottom: "solid 2px" }}>Users</h4>
          </Col>
          <Col xs={12}>
            <div style={{ height: "400px", overflow: "auto" }}>
              {users.map((e, index) => (
                <UserBox>
                  <Link href={`/users/${e.id}`}>
                    <div value={index} style={{ cursor: "pointer" }}>
                      <p>
                        <strong>{e.name}</strong> | {e.city}
                      </p>
                    </div>
                  </Link>
                </UserBox>
              ))}
            </div>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);
  try {
    await dbConnect();
    const res = await User.find({});
    const array = [];
    JSON.parse(JSON.stringify(res)).forEach((e) => {
      array.push({ id: e._id, name: e.name, email: e.email, city: e.city });
    });
    if (session) {
      const filtered = array.filter((e) => e.email !== session.user.email);
      return {
        props: {
          users: filtered,
        },
      };
    } else {
      return {
        props: {
          users: array,
        },
      };
    }
  } catch (err) {
    console.log(err.message);
  }
}
