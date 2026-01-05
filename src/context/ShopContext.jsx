import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = "$";
    // delivery_fee is now calculated dynamically below, not hardcoded here
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
    
    // Global Config State (Footer, Hot Deals, Delivery Settings)
    const [config, setConfig] = useState(null);

    // User Profile Data
    const [userData, setUserData] = useState(null);

    // --- NEW: PROMO STATE ---
    const [discountAmount, setDiscountAmount] = useState(0);
    const [couponCode, setCouponCode] = useState("");

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

    // --- NEW: DYNAMIC DELIVERY FEE LOGIC ---
    const getDeliveryFee = () => {
        // Default to 10 if config hasn't loaded yet
        let fee = 10; 
        
        if (config && config.delivery) {
            fee = config.delivery.fee;
            const subTotal = getCartAmount();
            
            // If cart is not empty and exceeds threshold, make delivery free
            if (subTotal > 0 && subTotal >= config.delivery.freeDeliveryThreshold) {
                return 0;
            }
        }
        
        // If cart is empty, fee is technically irrelevant but usually shown as 0 or standard
        if (getCartAmount() === 0) return 0;

        return fee;
    }

    // --- NEW: VERIFY PROMO CODE ---
    const verifyPromo = async (code) => {
        try {
            const response = await axios.post(backendUrl + '/api/config/promo/check', { code });
            if (response.data.success) {
                const promo = response.data.promo;
                setDiscountAmount(promo.value); // Currently supporting flat amount
                setCouponCode(promo.code);
                toast.success("Coupon Applied!");
                return true;
            } else {
                toast.error(response.data.message);
                return false;
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
            return false;
        }
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

    // 10. Fetch User Profile Data
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
            getUserData(storedToken); 
        }
    }, [token]);

    const value = {
        products, categories, 
        currency, 
        delivery_fee: getDeliveryFee(), // Calculated dynamically
        search, setSearch, showSearch, setShowSearch,
        cartItems, addToCart, setCartItems,
        getCartCount, updateQuantity, getCartAmount,
        navigate, backendUrl,
        token, setToken, 
        featurePoster, config,
        userData, setUserData, getUserData,
        // Promo Values
        verifyPromo, discountAmount, couponCode
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;