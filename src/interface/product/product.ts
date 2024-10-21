export interface IProduct {
  id: number;
  name: string;
  price: number;
  images: { url: string }[]; // Sửa lại để đảm bảo kiểu dữ liệu đúng
}

export interface IDetailProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  images: { url: string }[]; // Sửa lại để đảm bảo kiểu dữ liệu đúng
  parent_id: number;
  attributes: IAttribute;

  category: {
    parent_id: number;
  };
  variants: IVariant[];
}

export interface IVariant {
  id: number;
  quantity: number;
  sku: string;
  attributes: IAttribute;
}

export interface IAttribute {
  [key: string]: string | undefined;
}
