export class UserDto {
  id: string;
  name: string;
  email: string;
  phone: string;
  username: string;
  role?: "ADMIN" | "CLIENT" | "VISITOR";
  photoUrl?: string | null;
  createdAt?: string;
}

export default class CreateUserDto {
  token: string;
}

export class GenerateRegisterTokenDto {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export class UpdateUserDto {
  name: string;
  email: string;
  phone: string;
  username: string;
}

export class UpdateUserPasswordDto {
  oldPassword: string;
  newPassword: string;
}
