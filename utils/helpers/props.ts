import { ethers } from "ethers";

const extractBignumber = (value: any) => {
  if (!value) {
    return "";
  }

  if (typeof value !== "object" || !value.type || value.type !== "BigNumber") {
    return value.toString();
  }

  return ethers.BigNumber.from(value).toString();
};

export const stringifyProps = (any: any) => {
  for (const prop in any) {
    if (Object.prototype.hasOwnProperty.call(any, prop)) {
      try {
        any[prop] = extractBignumber(any[prop]);
      } catch (error) {
        // swallow this error
      }
    }
  }

  return any;
};
