
const CURRENT_SELLER_KEY = 'currentSeller';

export interface SellerInfo {
  name: string;
  phone: string;
  promptPay: string;
  lineId: string;
}

export const setCurrentSeller = (seller: SellerInfo) => {
  localStorage.setItem(CURRENT_SELLER_KEY, JSON.stringify(seller));
};

export const getCurrentSeller = (): SellerInfo | null => {
  try {
    const seller = localStorage.getItem(CURRENT_SELLER_KEY);
    return seller ? JSON.parse(seller) : null;
  } catch {
    return null;
  }
};

export const clearCurrentSeller = () => {
  localStorage.removeItem(CURRENT_SELLER_KEY);
};

export const isCurrentSeller = (sellerPhone: string): boolean => {
  const currentSeller = getCurrentSeller();
  return currentSeller?.phone === sellerPhone;
};
