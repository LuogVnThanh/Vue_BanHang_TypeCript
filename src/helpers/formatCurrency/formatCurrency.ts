// export const formatCurrency = (value:string) => {
//     return `${parseInt(value).toLocaleString('vi-VN')} VND`;
//   };
// formatCurrency.ts

export function formatCurrency(value: number): string {
  return value.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });
}