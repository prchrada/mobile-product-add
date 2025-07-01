
const CURRENT_USER_KEY = 'currentUser';

export interface UserInfo {
  id: string;
  name: string;
  phone: string;
  email: string;
  userType: 'buyer' | 'seller';
  // Seller specific fields
  promptPay?: string;
  lineId?: string;
}

export const setCurrentUser = (user: UserInfo) => {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
};

export const getCurrentUser = (): UserInfo | null => {
  try {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

export const clearCurrentUser = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

export const isCurrentUser = (userPhone: string): boolean => {
  const currentUser = getCurrentUser();
  return currentUser?.phone === userPhone;
};

export const isSeller = (): boolean => {
  const currentUser = getCurrentUser();
  return currentUser?.userType === 'seller';
};

export const isBuyer = (): boolean => {
  const currentUser = getCurrentUser();
  return currentUser?.userType === 'buyer';
};
