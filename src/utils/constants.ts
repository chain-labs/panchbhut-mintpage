
export const CONTRACT_ADDRESS = `${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}`

const toBoolean = (condition: string) => {
  if (condition?.toLowerCase() === 'true') {
    return true
  } else if (condition?.toLowerCase() === 'false') {
    return false
  } else {
    return false
  }
}

export const TEST_ENV = toBoolean(process.env.NEXT_PUBLIC_TEST_NETWORK)
export const getNetwork = () => {
  return TEST_ENV ? 'goerli' : 'ethereum'
}

export const NETWORK: string = getNetwork()

export const getChain = () => {
  switch (NETWORK) {
    case 'goerli':
      return '5'
    case 'ethereum':
      return '1'
  }
}

export const CHAIN_ID: string = getChain()

export const getEtherscanUrl = () => {
  switch (getChain()) {
    case '5':
      return `https://goerli.etherscan.io/address/${CONTRACT_ADDRESS}`
    case '137':
      return `https://polygonscan.com/address/${CONTRACT_ADDRESS}`
  }
}

export const SIMPLR_LOGO_URL =
  'https://ik.imagekit.io/chainlabs/Simplr_Collection_Dapp/simplr_logo_RASw5d0WR.svg?ik-sdk-version=javascript-1.4.3&updatedAt=1676550226736'
