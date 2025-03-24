export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: number;
    message: string;
  };
}
