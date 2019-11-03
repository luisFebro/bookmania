import { API } from "../config";

export const signup = userObj => {
    return fetch(`${API}/auth/signup`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userObj)
    })
        .then(response => {
            return response.json();
        })
        .catch(err => {
            console.log(err);
        });
};

export const signin = userObj => {
    return fetch(`${API}/auth/signin`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userObj)
    })
        .then(response => {
            return response.json();
        })
        .catch(err => {
            console.log(err);
        });
};

export const authenticate = (data, next) => {
    if (typeof window !== "undefined") {
        localStorage.setItem("jwt", JSON.stringify(data));
        next();
    }
};

export const signout = next => {
    if (typeof window !== "undefined") {
        localStorage.removeItem("jwt");
        next();
        return fetch(`${API}/auth/signout`, {
            method: "GET"
        })
            .then(response => {
                console.log("signout", response);
            })
            .catch(err => console.log(err));
    }
};

export const isAuthenticated = () => {
    if (typeof window == "undefined") {
        return false;
    }
    if (localStorage.getItem("jwt")) {
        return JSON.parse(localStorage.getItem("jwt")); // prior: true || this JSON is here because we need to fetch the data to populate userDashboard
    } else {
        return false;
    }
};
