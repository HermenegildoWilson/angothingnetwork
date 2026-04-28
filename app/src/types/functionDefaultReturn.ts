export type functionDefaultReturn<T = unknown> = {
  success: boolean;
  data?: T;
  error?: unknown;
  message?: string;
};
