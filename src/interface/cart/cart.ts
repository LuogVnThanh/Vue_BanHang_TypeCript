export interface ICartItem{
    id:number;
    // cart_id:number;
    product_variant_id:number;
    quantity:number;
    
    // price: number
}
export interface ICartVariant{
    id:number;
    quantity:number;
    variants:{
        id :number;
        sku:string
      
    }
}
