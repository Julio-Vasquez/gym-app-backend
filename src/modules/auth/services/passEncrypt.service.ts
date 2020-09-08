import { encrypto } from 'pass-encrypto';

async function HashPassword(pwd): Promise<string> {
  return await encrypto(pwd);
}

function ComparePassword(pwd: string, encrypt: string) {
  return encrypt === encrypto(pwd);
}

export { HashPassword, ComparePassword };