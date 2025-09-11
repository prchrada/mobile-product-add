interface Product {
  name: string;
  price: number;
  description: string;
  image: string;
}

export const addProduct = async (product: Product) => {
  const response = await fetch('/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product)
  });

  if (!response.ok) {
    throw new Error('ไม่สามารถเพิ่มสินค้าได้');
  }

  return response.json();
};
