export interface ICartItem {
  id: number;
  product_variant_id: number;
  quantity: number;
  // product_variant: ICartVariant;
  // price: number;
}
export interface ICartVariant {
  id: number;
  // quantity:number;
  variants:{
   id :number;
  images: IImage[];
  sku: string;
  }
}

interface IImage {
  url: string;
}
