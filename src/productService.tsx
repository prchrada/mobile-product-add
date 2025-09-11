import axios from 'axios';

interface Product {
  name: string;
  price: number;
  description: string;
  image: string;
}

export const addProduct = async (product: Product) => {
  try {
    const response = await axios.post('/api/products', product);
    return response.data;
  } catch (error) {
    throw new Error('Failed to add product');
  }
};
