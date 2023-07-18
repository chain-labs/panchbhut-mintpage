import { MINTS } from "./constants";

export const getIsMintAllowListed = merkleRoot => {
    if (parseInt(merkleRoot) === 0) {
        return false
    } else {
        return true
    }
};

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