import * as crypto from "crypto";

// export function checkClickSign(dto: any, secretKey: string) {
//   const {
//     click_trans_id,
//     service_id,
//     merchant_trans_id,
//     amount,
//     action,
//     sign_time,
//     sign_string,
//   } = dto;

//   const str =
//     `${click_trans_id}` +
//     `${service_id}` +
//     `${secretKey}` +
//     `${merchant_trans_id}` +
//     `${amount}` +
//     `${action}` +
//     `${sign_time}`;

//   const md5 = crypto.createHash("md5").update(str).digest("hex");
//     console.log(md5)

//   return md5 === sign_string;

// }

export const clickCheckToken = (data: any): boolean => {
  const {
    click_trans_id,
    service_id,
    merchant_prepare_id,
    amount,
    action,
    sign_time,
    sign_string
  } = data;
  const merchant_trans_id = `merchant_${data.merchant_trans_id}`;
  const CLICK_SECRET_KEY = process.env.CLICK_SECRET_KEY;
  const signature = merchant_prepare_id
    ? `${click_trans_id}${service_id}${CLICK_SECRET_KEY}${merchant_trans_id}${merchant_prepare_id}${amount}${action}${sign_time}`
    : `${click_trans_id}${service_id}${CLICK_SECRET_KEY}${merchant_trans_id}${amount}${action}${sign_time}`;
  const signatureHash = crypto.createHash('md5').update(signature).digest('hex');
console.log(signatureHash)
console.log(signature)
  return signatureHash === sign_string;
};
