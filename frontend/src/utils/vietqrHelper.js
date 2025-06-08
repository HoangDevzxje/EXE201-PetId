export const generateVietQRLink = ({
  bankId,
  accountNo,
  template,
  amount,
  description,
  accountName,
}) => {
  return `https://img.vietqr.io/image/${bankId}-${accountNo}-${template}.jpg?amount=${amount}&addInfo=${encodeURIComponent(
    description
  )}&accountName=${encodeURIComponent(accountName)}`;
};
