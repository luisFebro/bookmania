import { API } from "../config";

export const getProducts = sortBy => {
    return fetch(`${API}/product/list/all?sortBy=${sortBy}&order=desc&limit=6`, {
        method: "GET"
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const getCategories = () => {
    return fetch(`${API}/category/list/all`, {
        method: "GET"
    })
    .then(response => {
        console.log("response from apiCore", response)
        return response.json();
    })
    .catch(error => console.log(error));
};

export const getFilteredProducts = (skip, limit, filters = {}) => {
    const data = {
        limit,
        skip,
        filters
    };
    return fetch(`${API}/product/list/by-search`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            return response.json();
        })
        .catch(err => {
            console.log(err);
        });
};
