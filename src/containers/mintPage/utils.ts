import { MINTS } from "./constants";

//function definition:
//if merkle root is empty then the mint is not allowlisted
//merkle root can be said empty if it contains all 0s or its empty or its '0x'
export const getIsMintAllowListed = merkleRoot => {
    if (parseInt(merkleRoot) === 0) {
        return false
    } else {
        return true
    }
};

//funct definition:
//if allowlisted and discounted both are true then the mint type is mintDiscountAllowListed
//if allowlisted is true and discounted is false then the mint type is mintAllowListed
//if allowlisted is false and discounted is true then the mint type is mintDiscounted
//if allowlisted and discounted both are false then the mint type is mintPublic

export const getMintType = async (allowListed,discounted) => {
    if (allowListed && discounted) {
        return MINTS.DISCOUNTED_ALLOWLISTED;
    } else if (allowListed && !discounted) {
        return MINTS.ALLOWLISTED;
    } else if (discounted && !allowListed) {
        return MINTS.DISCOUNTED;
    } else {
        return MINTS.PUBLIC;
    }
};