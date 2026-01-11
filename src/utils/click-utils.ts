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

export function generateClickSign(params: { merchant_trans_id: string; amount: number; service_id: number }, secretKey: string) {
  const { merchant_trans_id, amount, service_id } = params;

  // Для prepare подпись формируется так:
  // click_trans_id, action и sign_time пока не нужны — Click их присылает при callback
  const str = `${service_id}${secretKey}${merchant_trans_id}${amount}`;
  const md5 = crypto.createHash("md5").update(str).digest("hex");

  return md5;
}