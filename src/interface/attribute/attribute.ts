export interface IAttributes1 {
  id: number;
  name: string;
  values:IValues[]
}
export interface IAttributes2 {
  [key: string]: string | undefined;
}

export interface IValues{
    id:number;
    value:string;
}


export interface IAttributesCreate {
 
  name: string;
  // values:{value:string}[]
  values: IValues[]
}

export interface IAttributesEdit {
  id:number;
  name: string;
}


 
export interface IAttributeValueEdit{
  id:number;
  value:string;
}

