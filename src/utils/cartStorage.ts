import { CartItem, Order } from '@/types/cart';

const CART_KEY = 'cart';
const ORDERS_KEY = 'orders';

export const getCartItems = (): CartItem[] => {
  try {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Error getting cart items:', error);
    return [];
  }
};

export const addToCart = (item: Omit<CartItem, 'id' | 'subtotal'>): void => {
  try {
    const cart = getCartItems();
    const existingItemIndex = cart.findIndex(cartItem => cartItem.productId === item.productId);
    
    if (existingItemIndex >= 0) {
      cart[existingItemIndex].quantity += item.quantity;
      cart[existingItemIndex].subtotal = cart[existingItemIndex].quantity * cart[existingItemIndex].price;
    } else {
      const newItem: CartItem = {
        ...item,
        id: Date.now().toString(),
        subtotal: item.quantity * item.price,
      };
      cart.push(newItem);
    }
    
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Error adding to cart:', error);
  }
};

export const updateCartItemQuantity = (itemId: string, quantity: number): void => {
  try {
    const cart = getCartItems();
    const itemIndex = cart.findIndex(item => item.id === itemId);
    
    if (itemIndex >= 0) {
      if (quantity <= 0) {
        cart.splice(itemIndex, 1);
      } else {
        cart[itemIndex].quantity = quantity;
        cart[itemIndex].subtotal = quantity * cart[itemIndex].price;
      }
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
  }
};

export const removeFromCart = (itemId: string): void => {
  try {
    const cart = getCartItems();
    const updatedCart = cart.filter(item => item.id !== itemId);
    localStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
  } catch (error) {
    console.error('Error removing from cart:', error);
  }
};

export const clearCart = (): void => {
  try {
    localStorage.removeItem(CART_KEY);
  } catch (error) {
    console.error('Error clearing cart:', error);
  }
};

export const getCartTotal = (): number => {
  const cart = getCartItems();
  return cart.reduce((total, item) => total + item.subtotal, 0);
};

export const getCartItemCount = (): number => {
  const cart = getCartItems();
  return cart.reduce((count, item) => count + item.quantity, 0);
};

export const saveOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Order => {
  try {
    const orders = getOrders();
    const newOrder: Order = {
      ...orderData,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    orders.push(newOrder);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    return newOrder;
  } catch (error) {
    console.error('Error saving order:', error);
    throw error;
  }
};

export const getOrders = (): Order[] => {
  try {
    const orders = localStorage.getItem(ORDERS_KEY);
    return orders ? JSON.parse(orders) : [];
  } catch (error) {
    console.error('Error getting orders:', error);
    return [];
  }
};

export const updateOrderStatus = (orderId: string, status: Order['status']): boolean => {
  try {
    const orders = getOrders();
    const orderIndex = orders.findIndex(order => order.id === orderId);
    
    if (orderIndex >= 0) {
      orders[orderIndex].status = status;
      orders[orderIndex].updatedAt = new Date();
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error updating order status:', error);
    return false;
  }
};
