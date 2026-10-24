export interface IApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
  } | unknown;
  message?: string;
  timestamp: string;
}
