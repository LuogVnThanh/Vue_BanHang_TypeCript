export interface IAuthResponse {
  token: string | null;
  // refreshToken: string | null
  expires: number | null
}

export interface ILogin {
  email: string;
  password: string;
}
export interface IRegister {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}
  export interface IProfile {
    id: number;
    name: string;
    email: string;
    phone: string;
    status: string;
    role: string[];
  }
