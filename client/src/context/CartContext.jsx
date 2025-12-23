import { createContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(
        localStorage.getItem('cartItems')
            ? JSON.parse(localStorage.getItem('cartItems'))
            : []
    );

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, qty) => {
        const itemExists = cartItems.find((x) => x.product === product._id);

        if (itemExists) {
            setCartItems(
                cartItems.map((x) =>
                    x.product === product._id ? { ...x, qty: Number(qty) } : x
                )
            );
        } else {
            setCartItems([...cartItems, {
                product: product._id,
                name: product.name,
                image: product.image,
                price: product.price,
                countInStock: product.countInStock,
                qty: Number(qty),
            }]);
        }
    };

    const removeFromCart = (id) => {
        setCartItems(cartItems.filter((x) => x.product !== id));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;
