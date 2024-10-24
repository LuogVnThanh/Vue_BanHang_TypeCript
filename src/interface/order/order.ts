export interface IOrderItem{
    id:number;
    phone:string;
    address:string;
    note: string
}

export interface IOrder{
    id:number;
    user_id:number;
    total_amount:number;
    payment_method:string;
    payment_status:string;
    order:IOrderItem[];
     items: items[];
}

export interface  items{

    id:number;
    order_id:number;
    price:number;
    product_variant_id:number;
    quantity:number;
}

 