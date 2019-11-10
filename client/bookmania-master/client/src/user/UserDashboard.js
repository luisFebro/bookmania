import React from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const {
        user: { name, email, role }
    } = isAuthenticated();

    const userLinks = () => {
        return (
            <div className="card">
                <h4 className="card-header">User Links</h4>
                <ul className="list-group">
                    <li className="list-group-item">
                        <Link to="/cart" className="nav-link">My Cart</Link>
                    </li>
                    <li className="list-group-item">
                        <Link to="/profile/update" className="nav-link">Update Profile</Link>
                    </li>
                </ul>
            </div>
        );
    }

    const userInfo = () => {
        return (
            <div className="card mb-5">
                <h3 className="card-header">User Information</h3>
                <ul className="list-group">
                    <li className="list-group-item">{name}</li>
                    <li className="list-group-item">{email}</li>
                    <li className="list-group-item">
                        {role === 1 ? "Admin" : "Registered User"}
                    </li>
                </ul>
            </div>
        );
    };

    const purchaseHistory = () => {
        return (
            <div className="card mb-5">
                <h3 className="card-header">Purchase history</h3>
                <ul className="list-group">
                    <li className="list-group-item">history</li>
                </ul>
            </div>
        );
    };


    return (
        <Layout
            title="Dashboard"
            description="User Dashboard"
            className="container"
        >
            <div className="row">
                <div className="mb-4 col-md-3">{userLinks()}</div>
                <div className="col-md-9">
                    {userInfo()}
                    {purchaseHistory()}
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
