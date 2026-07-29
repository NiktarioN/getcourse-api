function envNum(key: string | undefined): number {
  return key ? Number(key) : NaN;
}

export default envNum;
