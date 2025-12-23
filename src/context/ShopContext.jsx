import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = "$"; // Change this to your currency symbol
    const delivery_fee = 10; // Change this to your fixed delivery fee
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]); // <--- NEW STATE FOR CATEGORIES
    const [token, setToken] = useState("");
    const [cartItems, setCartItems] = useState({});
    const [search, setSearch] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    const [featurePoster, setFeaturePoster] = useState(null);

    // 1. Add to Cart Function
    const addToCart = async (itemId, size) => {
        if (!size) {
            toast.error("Select Product Size");
            return;
        }

        // Clone cart data to update local state immediately (User Experience)
        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            } else {
                cartData[itemId][size] = 1;
            }
        } else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }
        setCartItems(cartData);

        // If logged in, sync with Backend
        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/add', { itemId, size }, { headers: { token } });
            } catch (error) {
                console.log(error);
                toast.error(error.message);
            }
        }
    }

    // 2. Get Total Count of Items in Cart
    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalCount += cartItems[items][item];
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }
        return totalCount;
    }

    // 3. Update Quantity (from Cart Page)
    const updateQuantity = async (itemId, size, quantity) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId][size] = quantity;
        setCartItems(cartData);

        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/update', { itemId, size, quantity }, { headers: { token } });
            } catch (error) {
                console.log(error);
                toast.error(error.message);
            }
        }
    }

    // 4. Calculate Total Cart Amount
    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            if (itemInfo) { // Safety check to ensure product exists
                for (const item in cartItems[items]) {
                    try {
                        if (cartItems[items][item] > 0) {
                            totalAmount += itemInfo.price * cartItems[items][item];
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
            }
        }
        return totalAmount;
    }

    // 5. Fetch Products from Backend
    const getProductsData = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/product/list');
            if (response.data.success) {
                setProducts(response.data.products);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    // 6. Fetch Categories from Backend (NEW FUNCTION)
    const getCategoriesData = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/category/list');
            if (response.data.success) {
                setCategories(response.data.categories);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    // 7. Fetch User Cart (When page reloads)
    const getUserCart = async (token) => {
        try {
            const response = await axios.post(backendUrl + '/api/cart/get', {}, { headers: { token } });
            if (response.data.success) {
                setCartItems(response.data.cartData);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    // Add function
    const getFeaturePoster = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/feature/get');
            if (response.data.success) setFeaturePoster(response.data.feature);
        } catch (error) { console.log(error); }
    }

    // Initial Load
    useEffect(() => {
        getProductsData();
        getCategoriesData();
        getFeaturePoster();
    }, []);

    // Handle Token on Reload
    useEffect(() => {
        if (!token && localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'));
            getUserCart(localStorage.getItem('token'));
        }
    }, [token]);

    const value = {
        products, categories, // <--- Export 'categories' here
        currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems, addToCart, setCartItems,
        getCartCount, updateQuantity, getCartAmount,
        navigate, backendUrl,
        token, setToken, featurePoster
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;