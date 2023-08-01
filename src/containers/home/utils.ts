import { BigNumber } from "ethers";

export type DiscountCode = {
  discountIndex: number;
  discountedPrice: BigNumber;
  signature: string
}
export const getDiscountCode = () =>{
  const discountCode ={
    discountIndex: 0,
    discountedPrice:BigNumber.from('0x09184e72a000'),
    signature: '0xc6d336b0b783848226c3e9813efbc000e51caf232415de13fe4d7c7ea5310018262ef7b0a0a51cc33cf6af9c1e38e683a8e62c636cfdd454cd1561a60bce475b1b'
  }
    return discountCode
}