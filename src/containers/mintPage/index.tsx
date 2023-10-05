import React, {useEffect, useState} from 'react';
import ConnectWallet from 'src/components/Navbar/ConnectWallet';
import {useAppSelector} from 'src/redux/hooks';
import {userSelector} from 'src/redux/user';
import {useProvider, useSigner} from 'wagmi';
import {
	getIsMintAllowListed,
	getMerkleHashes,
	getMintType,
	hashQueryData,
} from './utils';
import {BigNumber, ethers} from 'ethers';
import {
	ALLOWLIST_ERROR,
	DISCOUNTED_ERROR,
	ERROR_MESSAGE,
	MINTS,
	MINT_NAME,
	SALE_ID,
	SUCCESS_MESSAGE,
} from './constants';
import toast, {Toaster} from 'react-hot-toast';
import If from 'src/components/If';
import DiscountCodeComp from './components/DiscountCodeComp';
import LogoComp from './components/LogoComp';
import Image from 'next/image';
import PlusImg from 'public/static/images/plus.png';
import MinusImg from 'public/static/images/minus.png';
import {networkSelector} from 'src/redux/network';
import MerkleTree from 'merkletreejs';
import {MINT_SALE_ID} from 'src/utils/constants';

const MintPageComp = ({contract, signer}) => {
	const [saleCategory, setSaleCategory] = useState();
	const [discounted, setDiscounted] = useState<boolean>();
	const [allowListed, setAllowListed] = useState<boolean>();
	const [mintType, setMintType] = useState<number>();
	const [price, setPrice] = useState<BigNumber>();
	const [noOfTokens, setNoOfTokens] = useState<number>(1);
	const [showDiscountComp, setShowDiscountComp] = useState<boolean>(false);
	const [discountCode, setDiscountCode] = useState();
	const user = useAppSelector(userSelector);
	const [supply, setSupply] = useState<number>();
	const [tokensMinted, setTokensMinted] = useState<number>();
	const [loading, setLoading] = useState(false);
	const [perTransactionLimit, setPerTransactionLimit] = useState<number>();
	const [perWalletLimit, setPerWalletLimit] = useState<number>();
	const [minted, setMinted] = useState<boolean>(false);
	const [mintSuccessful, setMintSuccessful] = useState<boolean>();
	const provider = useProvider();
	const network = useAppSelector(networkSelector);
	const [isDiscountCodeValid, setIsDiscountCodeValid] = useState(false);
	const [hash, setHash] = useState([]);

	useEffect(() => {
		const getSaleCategory = async () => {
			console.log(contract);
			try {
				console.log(contract);
				const saleCategory = await contract?.callStatic?.getSaleCategory(
					MINT_SALE_ID
				);
				setSaleCategory(saleCategory);
				console.log('sale category', saleCategory);
			} catch (err) {
				console.log(err);
			}
		};

		if (contract && network.isValid) {
			console.log(contract?.callStatic?.getSaleCategory(MINT_SALE_ID));
			getSaleCategory();
		}
	}, [contract]);

	useEffect(() => {
		//If saleCategory is present then it get the required details like isDiscountEnabled,price,merkleroot
		//for understanding the mint type
		if (saleCategory) {
			console.log(saleCategory);
			console.log(saleCategory !== undefined);
			const isDiscountEnabled = saleCategory['isDiscountEnabled'];
			const merkleRoot = saleCategory['merkleRoot'];
			const price = saleCategory['price'];
			const nftSupply = saleCategory['supply'];
			const tokens_minted = saleCategory['tokensMinted'];
			const transactionsLimit = saleCategory['perTransactionLimit'];
			const walletLimit = saleCategory['perWalletLimit'];
			const balance = provider.getBalance(contract.address).then(balance => {
				// convert a currency unit from wei to ether
				const balanceInEth = ethers.utils.formatEther(balance);
				console.log(`balance: ${balanceInEth} ETH`);
			});
			setPerTransactionLimit(parseInt(transactionsLimit));
			setPerWalletLimit(parseInt(walletLimit));
			setSupply(parseInt(nftSupply));
			setTokensMinted(parseInt(tokens_minted));
			setPrice(price);
			setDiscounted(isDiscountEnabled);
			setAllowListed(getIsMintAllowListed(merkleRoot));
		}
	}, [saleCategory, contract]);

	useEffect(() => {
		//It checks allowlisted and discounted conditions and the setMintType accordingly
		const getCurrentMintType = async () => {
			const mint_type = await getMintType(allowListed, discounted);
			setMintType(mint_type);
			console.log('Current Mint Type', mint_type);
		};
		getCurrentMintType();
	}, [discounted, allowListed]);

	useEffect(() => {
		if (discountCode) {
			//@ts-ignore
			if (discountCode?.receiverAddress !== user.address) {
				toast('❌ This code is not applicable to your address');
			} else {
				setIsDiscountCodeValid(true);
			}
		}
	}, [discountCode]);

	//Below function checks the mint type and according to the minttype it calls the required function
	const mintController = async () => {
		setLoading(true);
		if (noOfTokens) {
			console.log(mintType);
			if (mintType === MINTS.DISCOUNTED_ALLOWLISTED) {
				console.log('Mint is discounted allowlisted');
				getMerkleHashes().then(async hashes => {
					console.log({hashes});
					//@ts-expect-error
					const leafs = hashes.map(entry => ethers.utils.keccak256(entry));
					const tree = new MerkleTree(leafs, ethers.utils.keccak256, {
						sortPairs: true,
					});
					if (discountCode) {
						if (hashes.includes(user.address)) {
							const leaf = leafs[hashes.indexOf(user.address)];
							const proofs = tree.getHexProof(leaf);
							try {
								const estimateGas =
									await contract.estimateGas.mintDiscountedAllowlist(
										user.address,
										noOfTokens,
										proofs,
										MINT_SALE_ID,
										//@ts-ignore
										discountCode.discountIndex,
										//@ts-ignore
										discountCode.discountedPrice,
										//@ts-ignore
										discountCode.discountSignature,
										{
											value: BigNumber.from(noOfTokens).mul(
												//@ts-ignore
												discountCode.discountedPrice
											),
										}
									);

								if (estimateGas) {
									console.log('Gas Estimation successfull');
									const transaction = await contract
										?.connect(signer)
										?.mintDiscountedAllowlist(
											user.address,
											noOfTokens,
											proofs,
											MINT_SALE_ID,
											//@ts-ignore
											discountCode.discountIndex,
											//@ts-ignore
											discountCode.discountedPrice,
											//@ts-ignore
											discountCode.discountSignature,
											{
												value: BigNumber.from(noOfTokens).mul(
													//@ts-ignore
													discountCode.discountedPrice
												),
											}
										);
									console.log(transaction);
									setLoading(false);
									const event = (await transaction.wait()).events?.filter(
										event => {
											return event.event === 'Transfer';
										}
									);
									console.log(transaction);
									console.log(event);
									if (event) {
										console.log('Mint Sucessfull');
										toast(SUCCESS_MESSAGE);
									} else {
										console.log('Mint Unsuccessful');
									}
								} else {
									console.log('Gas Estimation Unsuccessfull');
									toast(ERROR_MESSAGE);
								}
							} catch (error) {
								console.log({error});
								toast(ERROR_MESSAGE);
								setLoading(false);
							}
						} else {
							console.log('Address is not allowlisted');
							toast(ALLOWLIST_ERROR);
							setLoading(false);
						}
					} else {
						toast(DISCOUNTED_ERROR);
						setLoading(false);
					}
				});
			} else if (mintType === MINTS.PUBLIC) {
				try {
					const estimateGas = await contract.estimateGas.mintPublic(
						user.address,
						noOfTokens,
						MINT_SALE_ID,
						{
							value: BigNumber.from(noOfTokens).mul(price),
						}
					);
					if (estimateGas) {
						const transaction = await contract
							?.connect(signer)
							?.mintPublic(user.address, noOfTokens, MINT_SALE_ID, {
								value: BigNumber.from(noOfTokens).mul(price),
							});
						const event = (await transaction.wait()).events?.filter(event => {
							return event.event === 'Transfer';
						});
						if (event) {
							toast(SUCCESS_MESSAGE);
							setLoading(false);
						} else {
							toast(ERROR_MESSAGE);
							setLoading(false);
						}
					} else {
						toast(ERROR_MESSAGE);
						setLoading(false);
					}
				} catch (error) {
					console.log({error});
					toast(ERROR_MESSAGE);
					setLoading(false);
				}
			} else if (mintType === MINTS.DISCOUNTED) {
				if (discountCode) {
					console.log('Mint is discounted');
					try {
						console.log(discountCode);
						if (discountCode) {
							const estimateGas = await contract.estimateGas.mintDiscounted(
								user.address,
								noOfTokens,
								MINT_SALE_ID,
								//@ts-ignore
								discountCode.discountIndex,
								//@ts-ignore
								discountCode.discountedPrice,
								//@ts-ignore
								discountCode.discountSignature,
								{
									value: BigNumber.from(noOfTokens).mul(
										//@ts-ignore
										discountCode.discountedPrice
									),
								}
							);
							if (estimateGas) {
								const transaction = await contract
									?.connect(signer)
									?.mintDiscounted(
										user.address,
										noOfTokens,
										MINT_SALE_ID,
										//@ts-ignore
										discountCode.discountIndex,
										//@ts-ignore
										discountCode.discountedPrice,
										//@ts-ignore
										discountCode.discountSignature,
										{
											value: BigNumber.from(noOfTokens).mul(
												//@ts-ignore
												discountCode.discountedPrice
											),
										}
									);
								console.log('Transaction:', transaction);
								const event = (await transaction.wait()).events?.filter(
									event => {
										return event.event === 'Transfer';
									}
								);
								if (event) {
									toast(SUCCESS_MESSAGE);
									setLoading(false);
								} else {
									toast(ERROR_MESSAGE);
								}
							} else {
								toast(ERROR_MESSAGE);
								setLoading(false);
							}
						}
					} catch (error) {
						console.log({error});
						toast(ERROR_MESSAGE);
						setLoading(false);
					}
				} else {
					toast(DISCOUNTED_ERROR);
					setLoading(false);
				}
			} else if (mintType === MINTS.ALLOWLISTED) {
				console.log('Mint is allowlisted');
				getMerkleHashes().then(async hashes => {
					console.log({hashes});
					//@ts-expect-error
					const leafs = hashes.map(entry => ethers.utils.keccak256(entry));
					const tree = new MerkleTree(leafs, ethers.utils.keccak256, {
						sortPairs: true,
					});
					console.log(tree.toString());
					if (hashes.includes(user.address)) {
						const leaf = leafs[hashes.indexOf(user.address)];
						const proofs = tree.getHexProof(leaf);
						try {
							const estimateGas = await contract.estimateGas.mintAllowlisted(
								user.address,
								noOfTokens,
								proofs,
								MINT_SALE_ID,
								{
									value: BigNumber.from(noOfTokens).mul(price),
								}
							);
							if (estimateGas) {
								const transaction = await contract
									?.connect(signer)
									?.mintAllowlisted(
										user.address,
										noOfTokens,
										proofs,
										MINT_SALE_ID,
										{
											value: BigNumber.from(noOfTokens).mul(price),
										}
									);
								console.log(transaction);
								const event = (await transaction.wait()).events?.filter(
									event => {
										return event.event === 'Transfer';
									}
								);
								if (event) {
									setLoading(false);
									toast(SUCCESS_MESSAGE);
								} else {
									toast(ERROR_MESSAGE);
								}
							} else {
								toast(ERROR_MESSAGE);
							}
						} catch (error) {
							console.log({error});
							toast(ERROR_MESSAGE);
							setLoading(false);
						}
					} else {
						toast(ALLOWLIST_ERROR);
						setLoading(false);
					}
				});
			}
		} else {
			console.log('No of tokens is not provided');
			toast('❌ Please give a valid input');
		}
	};

	useEffect(() => {
		if (noOfTokens <= 0) {
			setNoOfTokens(1);
		}
		if (noOfTokens > perTransactionLimit) {
			setNoOfTokens(perTransactionLimit);
		}
	}, [noOfTokens]);

	return (
		<div className="flex justify-center items-center flex-col">
			<Toaster position="top-center" />
			<If
				condition={user.exists}
				then={
					<div className="flex justify-center items-center flex-col">
						<LogoComp />
						<a className="text-[#ffa800] cursor-pointer pb-3">
							{mintType ? `Mint is ${MINT_NAME[mintType].substr(4)}` : ''}
						</a>
						<If
							condition={!showDiscountComp}
							then={
								<div className="flex flex-col gap-8">
									<If
										condition={saleCategory !== undefined && network.isValid}
										then={
											<div className=" w-[500px] flex justify-around items-center text-[#ffa800]">
												<div className="flex flex-col  items-center">
													<text>Supply</text>
													<text>{supply ? supply : ''}</text>
												</div>
												<div className="flex flex-col  items-center">
													<text>Price</text>
													<text>
														{price ? ethers.utils.formatUnits(price) : ''} ETH
													</text>
												</div>
												<div className="flex flex-col  items-center">
													<text>Minted</text>
													<text>
														{tokensMinted ? tokensMinted : 0}/{supply}
													</text>
												</div>
											</div>
										}
									/>

									<div className="flex flex-col items-center">
										<label className="text-[#ffa800]">MINT QTY</label>
										<div className="flex justify-center items-center gap-2">
											<button
												className="mt-2"
												onClick={e => setNoOfTokens(noOfTokens - 1)}
											>
												<Image
													src={MinusImg}
													alt=""
												/>
											</button>
											<input
												className="input w-20 h-[35px] bg-slate-300 rounded text-center text-black [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
												type="number"
												onWheel={e => {
													// @ts-ignore
													e.target?.blur();
												}}
												min={1}
												max={`${perTransactionLimit}`}
												value={noOfTokens}
												onChange={e => setNoOfTokens(parseInt(e.target?.value))}
											/>
											<button
												className="mt-2"
												onClick={e => setNoOfTokens(noOfTokens + 1)}
											>
												<Image
													src={PlusImg}
													alt=""
												/>
											</button>
										</div>
										<If
											condition={mintType === 2 || mintType === 1}
											then={
												<a
													className="text-[#5fca00] cursor-pointer"
													onClick={e => setShowDiscountComp(true)}
												>
													{isDiscountCodeValid
														? 'APPLIED'
														: 'APPLY COUPON CODE'}
												</a>
											}
										/>

										<button
											className={`bg-button-sm w-[183px] h-20 border border-transparent rounded-lg object-fill text-[#0e0e0e] flex justify-center items-start bg-no-repeat mt-4 ${
												loading ? 'cursor-not-allowed' : 'cursor-pointer'
											}`}
											onClick={loading ? e => {} : mintController}
										>
											<div className="mt-3">
												{loading ? 'MINTING...' : 'MINT'}
											</div>
										</button>
									</div>
								</div>
							}
							else={
								<div className="flex justify-center items-center absolute top-[25%]">
									<DiscountCodeComp
										setDiscountCode={setDiscountCode}
										setShowDiscountComp={setShowDiscountComp}
										discountCode={discountCode}
									/>
								</div>
							}
						/>
					</div>
				}
				else={
					<div className="flex justify-center items-center flex-col gap-14">
						<div className="w-[500px] flex justify-center items-center">
							<ConnectWallet />
						</div>
					</div>
				}
			/>
		</div>
	);
};

export default MintPageComp;
