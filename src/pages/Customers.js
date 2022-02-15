import React from 'react';



const Customers = () => {

    useEffect(() => {
        const productService = new ProductService();
        productService.getProducts().then(data => setProducts(data));
    }, []);
    
  return <div></div>;
};
export default Customers;