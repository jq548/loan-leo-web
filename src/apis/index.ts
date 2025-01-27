import apiClient from '@/utils/request';
import chainApiClient from '@/utils/request_chain';
import { access } from 'fs';

// Loan parameter configuration
export const loanParamsConfig = () => apiClient.get('/leo/config');

// get lp quantity by calculate
interface ICalculateUsdtParamsType {
  amount: number;
}
export const getLpQuantity = (params: ICalculateUsdtParamsType): Promise<any> =>
  apiClient.get('/leo/calculate_usdt', { params });

// save mortgage payment information
interface ISaveMortgageInfoParamsType {
  aleo_address: string;
  aleo_amount: number;
  bsc_address?: string; // when type === 0, this param is required
  email?: string; // when type === 0, this param is required
  stages?: number; // when type === 0, this param is required
  day_per_stage?: number; // when type === 0, this param is required
  loan_type?: 1 | 2; // when type === 0, this param is required
  type: 0 | 1;
  loan_id?: number; // when type === 1, this param is required
}
export const saveMortgageInfo = (data: ISaveMortgageInfoParamsType) =>
  apiClient.post('/leo/save_deposoit', data);

// get my loan info
export const getMyLoanInfo = (params: { address: string }) =>
  apiClient.get('/leo/loan_list', { params });

// get overview info
export const getOverview = () => apiClient.get('/leo/overview');

export const getAleoBalance = (account: string) =>
  chainApiClient.get(
    process.env.NEXT_PUBLIC_CHAIN_TYPE +
      '/program/credits.aleo/mapping/account/' +
      account
  );
