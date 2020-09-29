import { encrypto } from 'pass-encrypto';

async function HashPassword(pwd): Promise<string> {
  return await encrypto(pwd);
}

async function ComparePassword(pwd: string, encrypt: string) {
  const str = await encrypto(pwd);
  return encrypt === str;
}

export { HashPassword, ComparePassword };