import React from "react";
import { API } from "../config";

const ShowImage = ({ item, url }) => (
    <div className="product-img">
        <img
            src={`${API}/${url}/photo/${item._id}`}
            alt={item.name}
            style={{ maxHeight: "300px", width: "auto" }}
            className="mb-3 img-fluid"
        />
    </div>
);

export default ShowImage;
