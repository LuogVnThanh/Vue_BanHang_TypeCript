export interface ICategoryProduct{
    id: number,
    name: string,
    children: ICategoryProduct[]
}
export interface IChildrenCategory{
    id:number;
    name: string;
  }
  export interface ICategoryProductByAdmin{
    id: number,
    name: string,
}
  