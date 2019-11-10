import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';

const RadioBox = ({ prices, handleFilters }) => {
    const [value, setValue] = useState(0);

    const handleChange = event => {
        handleFilters(event.target.value);
    };

    return prices.map((p, i) => (
        <div key={i}>
            <input
                onChange={handleChange}
                name={p} //name is  required to allow selection to only one out of many
                value={`${p._id}`}
                type="radio"
                className="mr-2 ml-4"
            />
            <label className="form-check-label">{p.name}</label>
        </div>
    ));
};

RadioBox.propTypes = {
    prices: PropTypes.arrayOf(PropTypes.object),
}

export default RadioBox;
