import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = "$";
    const delivery_fee = 10;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]); 
    const [token, setToken] = useState("");
    const [cartItems, setCartItems] = useState({});
    const [search, setSearch] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    
    // Sidebar Banner State
    const [featurePoster, setFeaturePoster] = useState(null);
    
    // Global Config State (Footer, Hot Deals, Testimonials)
    const [config, setConfig] = useState(null);

    // User Profile Data (New)
    const [userData, setUserData] = useState(null);

    // 1. Add to Cart Function
    const addToCart = async (itemId, size) => {
        if (!size) {
            toast.error("Select Product Size");
            return;
        }

        // Deep copy cart data to avoid mutation issues
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
        toast.success("Added to Cart");

        // Sync with Backend
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

    // 3. Update Quantity
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
            if (itemInfo) {
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

    // 5. Fetch Products
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

    // 6. Fetch Categories
    const getCategoriesData = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/category/list');
            if (response.data.success) {
                setCategories(response.data.categories);
            }
        } catch (error) {
            console.log(error);
        }
    }

    // 7. Fetch Feature Poster
    const getFeaturePoster = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/feature/get');
            if (response.data.success) setFeaturePoster(response.data.feature);
        } catch (error) { console.log(error); }
    }

    // 8. Fetch Global Config
    const getGlobalConfig = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/config/get');
            if (response.data.success) {
                setConfig(response.data.config);
            }
        } catch (error) {
            console.log(error);
        }
    }

    // 9. Fetch User Cart
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

    // 10. Fetch User Profile Data (New)
    const getUserData = async (authToken) => {
        try {
            const response = await axios.get(backendUrl + '/api/user/profile', { headers: { token: authToken } });
            if (response.data.success) {
                setUserData(response.data.userData);
            }
        } catch (error) {
            console.log(error);
        }
    }

    // Initial Load
    useEffect(() => {
        getProductsData();
        getCategoriesData();
        getFeaturePoster();
        getGlobalConfig();
    }, []);

    // Handle Token on Reload
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (!token && storedToken) {
            setToken(storedToken);
            getUserCart(storedToken);
            getUserData(storedToken); // Load user data if logged in
        }
    }, [token]);

    const value = {
        products, categories, 
        currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems, addToCart, setCartItems,
        getCartCount, updateQuantity, getCartAmount,
        navigate, backendUrl,
        token, setToken, 
        featurePoster, config,
        userData, setUserData, getUserData // Export User Data logic
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;