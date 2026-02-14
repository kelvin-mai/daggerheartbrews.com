import { formatAPIError } from '../utils';

/* eslint-disable @typescript-eslint/no-explicit-any */
export type ApiResponse<T = any, M = undefined> = {
  success: boolean;
  data: T;
  meta: M;
  errors?: ReturnType<typeof formatAPIError>;
};

export type PaginationMeta = {
  page: number;
  pageSize: number;
  total: number;
};
