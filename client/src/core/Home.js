import React from "react";
import Layout from "./Layout";
import { API } from "../config";

const Home = () => (
    <Layout title="Home Page" description="Node React E-commerce App">
        {API}
    </Layout>
);

export default Home;