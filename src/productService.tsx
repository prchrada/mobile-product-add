import { ProductInsert } from "./types/product";
import { supabase } from "./integrations/supabase/client";

export const addProductService = async (product: ProductInsert) => {
  try {
    // ดึงข้อมูล id ของผู้เข้าใช้งาน
    const { data: { session } } =  await supabase.auth.getSession()
    const user = session.user.id

    // ตั้งชื่อไฟล์รูป
    const filename = `${product.name}_${Date.now()}.jpg`;
    const file = product.image;
    // อัพโหลดรูปขึ้น supabase
    const { data: uploadData, error: uploadError } = await supabase.storage.from("images").upload(filename, file) 
    // ดึง URL รูปจาก supabase สำหรับเก็บใน product
    const { data: imageUrl }  = supabase.storage.from("images").getPublicUrl(filename)
    // อัพโหลดข้อมูลสินค้าขึ้น product
    const { data, error } = await supabase.from("products").insert({
      seller_id: user,
      name: product.name,
      price: product.price,
      description: product.description,
      image_url: imageUrl.publicUrl,
    }).select()
  } catch (err) {
    console.error(err)
  } finally {}
};
