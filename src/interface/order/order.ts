export interface IOrderItem{
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
    IOrderItem:IOrderItem;
}