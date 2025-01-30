export interface ICreateUserDto {
  username: string;
  password: string;
  avatar: Uint8Array;
}

export interface IAuthorizeDto {
  username: string;
  password: string;
}
