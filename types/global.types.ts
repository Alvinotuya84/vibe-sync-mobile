export interface AuthErrorResponse {
  data: {
    status: boolean;
    msg: string | Record<string, string[]>;
  };
  error?: boolean;

  msg: string;
}

export interface MissingPostDataResponse {
  data: { non_field_errors: [string] };
  msg: string;
  error?: boolean;
  success: false;
}

export interface InternalErrorResponse {
  success: false;
  msg: string;
  error?: boolean;

  data: { non_field_errors: [string] };
}
export interface OtherErrorResponse {
  detail: string;
  error?: boolean;
}
