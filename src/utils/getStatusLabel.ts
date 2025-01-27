export const getStatusLabel = (status: number) => {
  switch (status) {
    case 0:
      return 'Saved';
    case 1:
      return 'Confirmed';
    case 2:
      return 'Released USDT';
    case 3:
      return 'Loan in progress';
    case 4:
      return 'Redeemed';
    case 5:
      return 'Liquidated';
    default:
  }
};
