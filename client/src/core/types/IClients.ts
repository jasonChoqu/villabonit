export interface IClient {
  id: any;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface IClientCreateRequest {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface IClientUpdateRequest {
  name: string;
  email: string;
  phone: string;
  address: string;
}
