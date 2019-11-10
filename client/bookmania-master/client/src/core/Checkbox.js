import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';

const Checkbox = ({ categories, handleFilters }) => {
    const [checked, setCheked] = useState([]);

    const handleToggle = c => () => {
        // return the first index or -1
        const currentCategoryId = checked.indexOf(c);
        const newCheckedCategoryId = [...checked];
        // if currently checked was not already in checked state > push
        // else pull/take off
        if (currentCategoryId === -1) {
            newCheckedCategoryId.push(c);
        } else {
            newCheckedCategoryId.splice(currentCategoryId, 1);
        }
        //console.log(newCheckedCategoryId);
        setCheked(newCheckedCategoryId);
        handleFilters(newCheckedCategoryId);
    };

    return categories.map((c, i) => (
        <li key={i} className="list-unstyled">
            <input
                onChange={handleToggle(c._id)}
                //Why this value? this gives the index.
                value={checked.indexOf(c._id === -1)}
                type="checkbox"
                className="form-check-input"
            />
            <label className="form-check-label">{c.name}</label>
        </li>
    ));
};

Checkbox.propTypes = {
    categories: PropTypes.arrayOf(PropTypes.any),
    handleFilters: PropTypes.func
}

export default Checkbox;
