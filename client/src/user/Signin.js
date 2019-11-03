import React, { useState } from "react";
import Layout from "../core/Layout";
import { Redirect } from 'react-router-dom';
import { signin, authenticate, isAuthenticated } from '../auth';

const Signin = () => {
    const [values, setValues] = useState({
        email: "",
        password: "",
        error: "",
        loading: false,
        redirectToReferrer: false
    });
    const { email, password, loading, error, redirectToReferrer } = values;
    const { user } = isAuthenticated();
    const handleChange = e => {
        const { name, value } = e.target;
        setValues({ ...values, error: false, [name]: value });
    };

    const clickSubmit = e => {
        e.preventDefault();
        setValues({ ...values, error: false, loading: true });
        signin({ email, password })
        .then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error, loading: false });
            } else {
                authenticate(data, () => {
                    setValues({
                        ...values,
                        redirectToReferrer: true
                    });
                })
            }
        });
    };

    const signInForm = () => (
        <form onChange={handleChange}>
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input
                    name="email"
                    type="email"
                    className="form-control"
                />
            </div>

            <div className="form-group">
                <label className="text-muted">Password</label>
                <input
                    name="password"
                    type="password"
                    className="form-control"
                />
            </div>
            <button onClick={clickSubmit} className="btn btn-primary">Submit</button>
        </form>
    );

    const showError = () => (
        <div
            className="alert alert-danger"
            style={{ display: error ? "" : "none" }}
        >
            {error}
        </div>
    );

    const showLoading = () =>
       loading && (
        <div className="alert alert-info">
            <h2>Loading...</h2>
       </div>
       )
    ;

    const redirectUser = () => {
        if(redirectToReferrer) {
            if(user && user.role === 1) {
                return <Redirect to='/admin/dashboard' />
            } else {
                return <Redirect to='/user/dashboard' />
            }
        }
        if(isAuthenticated()) {
            return <Redirect to='/' />
        }
    }

    return (
        <Layout
            title="Signin"
            description="Signin to BookMania App"
            className="container col-md-8 offset-md-2"
        >
            {showLoading()}
            {showError()}
            {signInForm()}
            {redirectUser()}
            {/*This following JSON allows us to see the current object as string*/}
            {/*JSON.stringify(values)*/}
        </Layout>
    );
};

export default Signin;



