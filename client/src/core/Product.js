import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import { read, listRelated } from "./apiCore";
import Card from "./Card";

const Product = props => {
    const [product, setProduct] = useState({});
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [error, setError] = useState(false);

    const loadSingleProduct = productId => {
        read(productId).then((data = []) => {
            if (data && data.error) {
                setError(data.error);
            } else {
                setProduct(data);
                // fetch related products
                listRelated(data._id)
                .then((data = []) => {
                    if(data.error) {
                        setError(data.error);
                    } else {
                        setRelatedProducts(data);
                    }
                })
            }
        });
    };

    useEffect(() => {
        // getting params from URL thorugh react-router-dom
        // update when props changes. Like when clicking in a related product
        const productId = props.match.params.productId;
        loadSingleProduct(productId);
    }, [props]);

    return (
        <Layout
            title={product && product.name}
            description={product && product.description && product.description.substring(0, 100)}
            className="container-fluid"
        >
            <h2 className="mb-4">Single Product</h2>
            <div className="row">
                <div className="col-8">
                    {
                        product &&
                        product.description &&
                        <Card product={product} showViewProductButton={false} divClassProduct="" />
                    }
                </div>
                <div className="col-4">
                    <h4>Related Products</h4>
                    {relatedProducts.map((p, ind) => (
                        <div key={ind} className="mb-3">
                            <Card product={p} />
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default Product;
