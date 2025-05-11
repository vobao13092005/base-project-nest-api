import { HttpException, HttpStatus } from "@nestjs/common";

export class ApiResponse {
  error: boolean;
  message: string;
  data?: any;
}

export function apiResponse(message: string, data: any = {}): ApiResponse {
  const response: ApiResponse = {
    error: false,
    message: message,
    data: data,
  };
  return response;
}

export function apiError(message: string, data: any = {}): HttpException {
  const apiError: ApiResponse = {
    error: true,
    message: message,
    data: data,
  };
  return new HttpException(apiError, HttpStatus.BAD_REQUEST);
}

export type AuthError = {
  errorCode: number;
  message: string;
};
export const AUTH_ERRORS = {
  BLANK_TOKEN: {
    errorCode: 13,
    message: 'Không tìm thấy access token trong header'
  },
  TOKEN_MISMATCH: {
    errorCode: 9,
    message: 'Đây không phải là loại token được yêu cầu'
  },
  INVALID_TOKEN: {
    errorCode: 20,
    message: 'Token không hợp lệ hoặc đã hết hạn'
  },
  SESSION_EXPIRED: {
    errorCode: 5,
    message: 'Refresh token không hợp lệ, có thể phiên đăng nhập đã hết hạn'
  },
};
export function apiAuthError(authErrorResponse: AuthError): HttpException {
  return new HttpException(authErrorResponse, HttpStatus.UNAUTHORIZED);
}