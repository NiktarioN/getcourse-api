/* eslint-disable import-x/prefer-default-export */

export function envNum(key: string | undefined): number {
  return key ? Number(key) : NaN;
}
