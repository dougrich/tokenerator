import * as crypto from "crypto";

const algorithm = "aes-256-ctr";
const password = "LsAe1m7paCl4zryJaLNxGNN3iZmcAG";

export function encrypt(text: string): string {
  const cipher = crypto.createCipher(algorithm, password);
  let crypted = cipher.update(text, "utf8", "hex");
  crypted += cipher.final("hex");
  return crypted;
}

export function decrypt(text: string): string {
  const decipher = crypto.createDecipher(algorithm, password);
  let decrypted = decipher.update(text, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
