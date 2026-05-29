export class LoginDto {
  username!: string;
  password!: string;
}

export class SignupDto {
  username!: string;
  email!: string;
  password!: string;
}

export class ForgotPasswordDto {
  email!: string
}

export class ResetPasswordDto {
  token!: string;
  newPassword!: string;
}
