export interface IApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
  };
  message?: string;
  timestamp: string;
}
