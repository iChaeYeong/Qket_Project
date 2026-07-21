export type AccountDTO = {
  accountNo: string;
  userId: string;
  accountNm: string;
  balance: number;
  accountStat: string;
};

export type TransactionDTO = {
  tranId: number;
  frmAccountNo: string;
  toAccountNo: string;
  tranAmt: number;
  tranDt: string;
};

export type UserDTO = {
  userId: string;
  userNm: string;
};

export type ApiResult = {
  success: boolean;
  message?: string;
};

export type LoginResult = ApiResult & {
  user?: UserDTO;
};
