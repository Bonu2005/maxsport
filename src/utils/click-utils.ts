import * as crypto from "crypto";

export function checkClickSign(dto: any, secretKey: string) {
  const {
    click_trans_id,
    service_id,
    merchant_trans_id,
    amount,
    action,
    sign_time,
    sign_string,
  } = dto;

  const str =
    `${click_trans_id}` +
    `${service_id}` +
    `${secretKey}` +
    `${merchant_trans_id}` +
    `${amount}` +
    `${action}` +
    `${sign_time}`;

  const md5 = crypto.createHash("md5").update(str).digest("hex");
  return md5 === sign_string;
}