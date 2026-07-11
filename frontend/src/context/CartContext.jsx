import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  // Load from LocalStorage
  useEffect(() => {
    const storedCart = localStorage.getItem('cartItems');
    const storedWishlist = localStorage.getItem('wishlist');
    if (storedCart) setCartItems(JSON.parse(storedCart));
    if (storedWishlist) setWishlist(JSON.parse(storedWishlist));
  }, []);

  const addToCart = (product, qty = 1) => {
    setCartItems((prevItems) => {
      const existItem = prevItems.find((x) => x.product === product._id);
      let newItems;

      if (existItem) {
        newItems = prevItems.map((x) =>
          x.product === product._id
            ? { ...x, qty: Math.min(x.qty + qty, product.stock) }
            : x
        );
      } else {
        newItems = [
          ...prevItems,
          {
            product: product._id,
            name: product.name,
            image: product.images[0],
            price: product.price,
            discountPrice: product.discountPrice,
            stock: product.stock,
            qty: Math.min(qty, product.stock),
          },
        ];
      }

      localStorage.setItem('cartItems', JSON.stringify(newItems));
      return newItems;
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => {
      const newItems = prevItems.filter((x) => x.product !== id);
      localStorage.setItem('cartItems', JSON.stringify(newItems));
      return newItems;
    });
  };

  const updateCartQty = (id, qty) => {
    setCartItems((prevItems) => {
      const newItems = prevItems.map((x) =>
        x.product === id ? { ...x, qty: Math.min(qty, x.stock) } : x
      );
      localStorage.setItem('cartItems', JSON.stringify(newItems));
      return newItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };

  const toggleWishlist = (product) => {
    setWishlist((prevWishlist) => {
      const exist = prevWishlist.find((x) => x._id === product._id);
      let newWishlist;
      if (exist) {
        newWishlist = prevWishlist.filter((x) => x._id !== product._id);
      } else {
        newWishlist = [...prevWishlist, product];
      }
      localStorage.setItem('wishlist', JSON.stringify(newWishlist));
      return newWishlist;
    });
  };

  const isInWishlist = (id) => {
    return wishlist.some((x) => x._id === id);
  };

  // Computed values
  const itemsPrice = cartItems.reduce(
    (acc, item) => acc + (item.discountPrice > 0 ? item.discountPrice : item.price) * item.qty,
    0
  );
  
  // Free shipping on orders over $500, else $15
  const shippingPrice = itemsPrice > 500 || itemsPrice === 0 ? 0 : 15;
  
  // 8% Sales Tax
  const taxPrice = Math.round(itemsPrice * 0.08 * 100) / 100;
  
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        wishlist,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        toggleWishlist,
        isInWishlist,
        itemsPrice: Math.round(itemsPrice * 100) / 100,
        shippingPrice,
        taxPrice,
        totalPrice: Math.round(totalPrice * 100) / 100,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
