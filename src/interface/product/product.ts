  import type { ICategoryProductByAdmin } from "../category/categoryProduct";

  export interface IProduct {
    id: number;
    name: string;
    price: number;
    images: { url: string }[]; // Sửa lại để đảm bảo kiểu dữ liệu đúng
  }
  export interface IProductPage {
    data: IProduct[]; // Mảng sản phẩm
    current_page: number;
    total: number;
    last_page: number;
  }

  export interface ISearchProduct {
    id: number;
    name: string;
    images: { url: string }[];
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



  export interface IProductShowByAdmin  {
    id:number;
    name: string;
    description:string;
    price: number;
    images: { url: string }[]; // Sửa lại để đảm bảo kiểu dữ liệu đúng
    category:ICategoryProductByAdmin;
  }

  export interface IAttribute {
    [key: string]: string | undefined;
  }

  export interface IProductCreate {
    id:number;
    name: string;
    description:string;
    price: string;
    public: number; // Thêm trường này
    category_id:number;
    // images: { url: string }[]; // Sửa lại để đảm bảo kiểu dữ liệu đúng
    variant: IVariantCreateProduct[]
  }

  export interface IVariantCreateProduct {
    quantity: number;
    sku: string;
    attributes: IAttribute[];
  }

 