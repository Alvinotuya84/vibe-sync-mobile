export type LoginSuccessResponse = {
  success?: true;
  data?: {
    shukran_id?: string;
    email?: string;
    phone?: string;
    first_name?: string;
    last_name?: string;
    user_type?: string;
    sacco_stage?: string;
    is_sacco?: boolean;
    token?: string;
    timestamp?: number;
    inactive?: boolean;
  };
  msg?: string;
};

export type LoginError = IncorrectDataSubmition | IncorrectCredentials;
export type IncorrectDataSubmition = {
  success: false;
  data: {
    non_field_errors: string[];
  };
  msg: "Incorrect data submitted";
};
export type IncorrectCredentials = {
  success: false;
  data: "wrongcredentials";
  msg: "Wrong username/password combination";
};

export type RegisterSuccessResponse = {
  success: true;
  data?: {
    shukran_id?: string;
    email?: string;
    phone?: string;
    first_name?: string;
    last_name?: string;
    user_type?: string;
    sacco_stage?: string;
    is_sacco?: boolean;
    token?: string;
    timestamp?: number;
    inactive?: boolean;
  };
  msg: "Signed up successfully";
};
export type RegisterState = {
  first_name: string;
  last_name: string;
  phone: string;
  password: string;
  confirm_password: string;
  user_type: string;
  is_sacco: string;
};

export type OTPRequestSuccessResponse = {
  success: true;
  msg: "SMS verification code has been sent. Please check your phone";
};
export type OTPSubmitSuccessResponse = {
  msg: string;
  success: boolean;
  token: string;
};
export type ChangePasswordSuccessReponse = {
  success: boolean;
  msg: "Your password has been changed successfully";
};
export type CheckTransactionResponse = {
  data: {
    email: string;
    first_name: string;
    id: number;
    is_accepted_terms: boolean;
    is_sacco: boolean;
    last_name: string;
    phone: string;
    sacco_stage: string;
    shukran_id: string;
    token: string;
    user_type: string;
  };
  msg: string;
  success: boolean;
};

type SubmitOtpData = {
  id: number;
  shukran_id: string;
  first_name: string;
  last_name: string;
  token: string;
};
export type SubmitOtpResponse = {
  success: boolean;
  data: SubmitOtpData;
  msg: string;
};
// types/auth.types.ts
export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: {
      id: number;
      username: string;
      email: string;
    };
  };
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: {
      id: number;
      username: string;
      email: string;
    };
  };
}
