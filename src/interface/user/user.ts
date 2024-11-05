export interface IUser {
  id: number;
  name: string | undefined;
  email: string | undefined;
  status: string | undefined;
  phone: string | undefined;
  roles: IRole[];
}

export interface IRole {
  id: number;
  name: string;
}

export interface IUserCreate {
  name: string;
  email: string;
  password: string;
  status: string;
  phone: string;
  role: string;
}
