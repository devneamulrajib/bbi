import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = "$";
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

    // --- STATES ---
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]); 
    const [token, setToken] = useState("");
    const [cartItems, setCartItems] = useState({});
    const [search, setSearch] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    
    // Config & User
    const [featurePoster, setFeaturePoster] = useState(null);
    const [config, setConfig] = useState(null);
    const [userData, setUserData] = useState(null);

    // Wishlist
    const [wishlist, setWishlist] = useState([]);

    // Promo
    const [discountAmount, setDiscountAmount] = useState(0);
    const [couponCode, setCouponCode] = useState("");

    // --- 1. CART LOGIC (UPDATED FOR QUANTITY) ---
    const addToCart = async (itemId, size, quantity = 1) => {
        if (!size) {
            toast.error("Select Product Size");
            return;
        }

        // Deep copy to avoid mutation
        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += quantity; // Add specific quantity
            } else {
                cartData[itemId][size] = quantity;
            }
        } else {
            cartData[itemId] = {};
            cartData[itemId][size] = quantity;
        }
        
        setCartItems(cartData);
        toast.success("Added to Cart");

        if (token) {
            try {
                // Send quantity to backend
                await axios.post(backendUrl + '/api/cart/add', { itemId, size, quantity }, { headers: { token } });
            } catch (error) { 
                console.log(error);
                toast.error(error.message);
            }
        }
    }

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                try { if (cartItems[items][item] > 0) totalCount += cartItems[items][item]; } 
                catch (error) {}
            }
        }
        return totalCount;
    }

    const updateQuantity = async (itemId, size, quantity) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId][size] = quantity;
        setCartItems(cartData);
        if (token) {
            try { await axios.post(backendUrl + '/api/cart/update', { itemId, size, quantity }, { headers: { token } }); } 
            catch (error) { console.log(error); }
        }
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            if (itemInfo) {
                for (const item in cartItems[items]) {
                    try { if (cartItems[items][item] > 0) totalAmount += itemInfo.price * cartItems[items][item]; } 
                    catch (error) {}
                }
            }
        }
        return totalAmount;
    }

    // --- 2. WISHLIST LOGIC ---
    const addToWishlist = async (itemId) => {
        if (!token) {
            toast.info("Login to use Wishlist");
            return;
        }
        // Optimistic Update
        if (wishlist.includes(itemId)) {
            setWishlist(prev => prev.filter(id => id !== itemId));
            toast.success("Removed from Wishlist");
        } else {
            setWishlist(prev => [...prev, itemId]);
            toast.success("Added to Wishlist");
        }
        // Backend Update
        try {
            await axios.post(backendUrl + '/api/user/wishlist', { productId: itemId }, { headers: { token } });
        } catch (error) { console.error(error); }
    }

    // --- 3. DELIVERY & PROMO ---
    const getDeliveryFee = () => {
        let fee = 10; 
        if (config && config.delivery) {
            fee = config.delivery.fee;
            const subTotal = getCartAmount();
            if (subTotal > 0 && subTotal >= config.delivery.freeDeliveryThreshold) return 0;
        }
        if (getCartAmount() === 0) return 0;
        return fee;
    }

    const verifyPromo = async (code) => {
        try {
            const response = await axios.post(backendUrl + '/api/config/promo/check', { code });
            if (response.data.success) {
                const promo = response.data.promo;
                setDiscountAmount(promo.value);
                setCouponCode(promo.code);
                toast.success("Coupon Applied!");
                return true;
            } else {
                toast.error(response.data.message);
                return false;
            }
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    // --- 4. DATA FETCHING ---
    const getProductsData = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/product/list');
            if (response.data.success) setProducts(response.data.products);
        } catch (error) {}
    }

    const getCategoriesData = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/category/list');
            if (response.data.success) setCategories(response.data.categories);
        } catch (error) {}
    }

    const getFeaturePoster = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/feature/get');
            if (response.data.success) setFeaturePoster(response.data.feature);
        } catch (error) {}
    }

    const getGlobalConfig = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/config/get');
            if (response.data.success) setConfig(response.data.config);
        } catch (error) {}
    }

    const getUserCart = async (token) => {
        try {
            const response = await axios.post(backendUrl + '/api/cart/get', {}, { headers: { token } });
            if (response.data.success) setCartItems(response.data.cartData);
        } catch (error) {}
    }

    const getUserData = async (authToken) => {
        try {
            const response = await axios.get(backendUrl + '/api/user/profile', { headers: { token: authToken } });
            if (response.data.success) {
                setUserData(response.data.userData);
                setWishlist(response.data.userData.wishlist || []);
            }
        } catch (error) {}
    }

    // --- LIFECYCLE ---
    useEffect(() => {
        getProductsData();
        getCategoriesData();
        getFeaturePoster();
        getGlobalConfig();
    }, []);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (!token && storedToken) {
            setToken(storedToken);
            getUserCart(storedToken);
            getUserData(storedToken); 
        }
    }, [token]);

    const value = {
        products, categories, currency, 
        delivery_fee: getDeliveryFee(),
        search, setSearch, showSearch, setShowSearch,
        cartItems, addToCart, setCartItems,
        getCartCount, updateQuantity, getCartAmount,
        navigate, backendUrl, token, setToken, 
        featurePoster, config,
        userData, setUserData, getUserData,
        wishlist, addToWishlist,
        verifyPromo, discountAmount, couponCode
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;