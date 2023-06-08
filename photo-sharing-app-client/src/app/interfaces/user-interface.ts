
export interface User {
  email: string;
  name: string;
  id: string;
}

interface userData {
  _id: string;
  name: string;
  email: string;
  token: string;
}

export interface LoggedInUserReq {
  email: string;
  password: string;
}

export interface LoggedInUserRes {
  code: number;
  status: string;
  message: string;
  data: userData;
}

export interface registeredUserReq {}

export interface registeredUserRes {}
