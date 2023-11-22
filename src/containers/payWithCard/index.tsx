import {CrossmintPayButton} from '@crossmint/client-sdk-react-ui';
import React, {useEffect, useState} from 'react';
import PlusImg from 'public/static/images/plus.png';
import MinusImg from 'public/static/images/minus.png';
import Image from 'next/image';
import {MINT_SALE_ID} from 'src/utils/constants';
import {BigNumber, ethers} from 'ethers';
import {
	getIsMintAllowListed,
	getMerkleHashes,
	getMintType,
} from '../mintPage/utils';
import {
	ALLOWLIST_ERROR,
	ERROR_MESSAGE,
	MINTS,
	MINT_NAME,
} from '../mintPage/constants';
import If from 'src/components/If';
import MerkleTree from 'merkletreejs';
import {useAppSelector} from 'src/redux/hooks';
import {userSelector} from 'src/redux/user';
import toast, {Toaster} from 'react-hot-toast';
import DiscountCodeComp from '../mintPage/components/DiscountCodeComp';
import LogoComp from '../mintPage/components/LogoComp';
import {formatUnits} from 'ethers/lib/utils';

const CrossmintComponent = ({contract}) => {
	const [noOfTokens, setNoOfTokens] = useState<number>(1);
	const [receiverAddress, setReceiverAddress] = useState();
	const [saleCategory, setSaleCategory] = useState();
	const [supply, setSupply] = useState<number>();
	const [tokensMinted, setTokensMinted] = useState<number>();
	const [loading, setLoading] = useState(false);
	const [perTransactionLimit, setPerTransactionLimit] = useState<number>();
	const [perWalletLimit, setPerWalletLimit] = useState<number>();
	const [discounted, setDiscounted] = useState<boolean>();
	const [allowListed, setAllowListed] = useState<boolean>();
	const [mintType, setMintType] = useState<number>();
	const [price, setPrice] = useState();
	const user = useAppSelector(userSelector);
	const [showDiscountComp, setShowDiscountComp] = useState<boolean>(false);
	const [discountCode, setDiscountCode] = useState();
	const [isDiscountCodeValid, setIsDiscountCodeValid] = useState(false);
	const [discountIndex, setDiscountIndex] = useState<string>('');
	const [discountedPrice, setDiscountedPrice] = useState();
	const [discountedSignature, setDiscountedSignature] = useState();
	const [ethPrice, setEthPrice] = useState('');
	const [proofs, setProofs] = useState([]);

	useEffect(() => {
		const getSaleCategory = async () => {
			console.log(contract);
			try {
				console.log(MINT_SALE_ID);
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

		if (contract) {
			console.log('Contract present');
			// console.log(contract?.callStatic?.getSaleCategory(18));
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

			// console.log(ethers.utils.formatUnits(balance));
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
		if (noOfTokens && receiverAddress) {
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
						if (hashes.includes(receiverAddress) && discountCode) {
							const leaf = leafs[hashes.indexOf(receiverAddress)];
							const proofs = tree.getHexProof(leaf);
							setProofs(proofs);
							//@ts-ignore
							setDiscountIndex((discountCode?.discountIndex).toString());
							//@ts-ignore
							setDiscountedPrice(discountCode?.discountedPrice);
							//@ts-ignore
							setDiscountedSignature(discountCode?.discountSignature);
							//@ts-ignore

							const discountedPrice = BigNumber.from(noOfTokens)
								.mul(
									//@ts-ignore
									discountCode.discountedPrice
								)
								.toString();

							setEthPrice(formatUnits(discountedPrice, 18));
						} else {
							console.log('Address is not allowlisted');
							toast(
								`❌ Your address is not allowlisted please try to use other address`
							);
							setLoading(false);
						}
					} else {
						toast(`❌ Please Apply discount code`);
						setLoading(false);
					}
				});
			} else if (mintType === MINTS.PUBLIC) {
				if (noOfTokens && receiverAddress) {
					const publicPrice = BigNumber.from(noOfTokens)
						.mul(
							//@ts-ignore
							price
						)
						.toString();
					setEthPrice(formatUnits(publicPrice, 18));
				}
			} else if (mintType === MINTS.DISCOUNTED) {
				if (discountCode) {
					//@ts-ignore
					setDiscountIndex((discountCode?.discountIndex).toString());
					//@ts-ignore
					setDiscountedPrice(discountCode?.discountedPrice);
					//@ts-ignore
					setDiscountedSignature(discountCode?.discountSignature);
					const discountedPrice = BigNumber.from(noOfTokens)
						.mul(
							//@ts-ignore
							discountCode.discountedPrice
						)
						.toString();

					setEthPrice(formatUnits(discountedPrice, 18));
				}
			} else if (mintType === MINTS.ALLOWLISTED) {
				if (noOfTokens && receiverAddress) {
					getMerkleHashes()
						.then(async hashes => {
							console.log({hashes});
							//@ts-expect-error
							const leafs = hashes.map(entry => ethers.utils.keccak256(entry));
							const tree = new MerkleTree(leafs, ethers.utils.keccak256, {
								sortPairs: true,
							});
							if (hashes && hashes.includes(receiverAddress)) {
								const leaf = leafs[hashes.indexOf(receiverAddress)];
								const proofs = tree.getHexProof(leaf);
								setProofs(proofs);
								const allowlistedPrice = BigNumber.from(noOfTokens)
									.mul(
										//@ts-ignore
										price
									)
									.toString();
								setEthPrice(formatUnits(allowlistedPrice, 18));
							} else {
								console.log('Address is not allowlisted');
								toast(ALLOWLIST_ERROR);
								setLoading(false);
							}
						})
						.catch(err => {
							toast(ERROR_MESSAGE);
							setLoading(false);
						});
				}
			}
		} else {
			console.log(noOfTokens);
			console.log('No of tokens is not provided');
		}
	}, [mintType, discountCode, receiverAddress, noOfTokens]);

	useEffect(() => {
		console.log('PROOFS INSIDE USEEFFECT:', proofs);
	}, [proofs]);

	return (
		<If
			condition={!showDiscountComp}
			then={
				<div className="flex flex-col items-center">
					<LogoComp />
					<Toaster position="top-center" />

					<div className="flex flex-col items-center">
						<a className="text-[#ffa800] cursor-pointer pb-3 mt-[-14px]">
							{mintType ? `Mint is ${MINT_NAME[mintType].substr(4)}` : ''}
						</a>

						<label className="text-[#ffa800]">WALLET ADDRESS</label>
						<div className="flex justify-center items-center gap-2">
							<input
								className="input w-80 h-[35px] bg-slate-300 rounded text-center text-xs text-black [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
								type="text"
								onWheel={e => {
									// @ts-ignore
									e.target?.blur();
								}}
								value={receiverAddress}
								//@ts-expect-error
								onChange={e => setReceiverAddress(e.target?.value)}
							/>
						</div>
					</div>
					<div className="flex flex-col items-center mt-4">
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
					</div>
					<div className="flex justify-center items-center gap-2">
						<If
							condition={mintType === 2 || mintType === 1}
							then={
								<a
									className="text-[#5fca00] cursor-pointer"
									onClick={e => setShowDiscountComp(true)}
								>
									{isDiscountCodeValid ? 'APPLIED' : 'APPLY COUPON CODE'}
								</a>
							}
						/>
					</div>
					<div className="flex justify-center items-center mt-4">
						<If
							condition={mintType === MINTS.DISCOUNTED_ALLOWLISTED}
							then={
								<div>
									<CrossmintPayButton
										projectId="1d2587be-f150-4661-8377-5445a43d5719"
										collectionId="47f94c27-06b4-4089-b685-087f095159c6"
										environment="staging"
										mintTo={receiverAddress}
										mintConfig={{
											type: 'erc-721',
											quantity: noOfTokens,
											totalPrice: ethPrice,
											_receiver: receiverAddress,
											_numberOfTokens: noOfTokens,
											_saleId: MINT_SALE_ID,
											_proofs: proofs,
											_discountIndex: discountIndex,
											_discountedPrice: discountedPrice,
											_signature: discountedSignature,
											// your custom minting arguments...
										}}
									/>
								</div>
							}
						/>
						<If
							condition={mintType === MINTS.PUBLIC}
							then={
								<div>
									<CrossmintPayButton
										projectId="1d2587be-f150-4661-8377-5445a43d5719"
										collectionId="47f94c27-06b4-4089-b685-087f095159c4"
										environment="staging"
										mintTo={receiverAddress}
										mintConfig={{
											type: 'erc-721',
											quantity: noOfTokens,
											totalPrice: ethPrice,
											_receiver: receiverAddress,
											_numberOfTokens: noOfTokens,
											_saleId: MINT_SALE_ID,
											// your custom minting arguments...
										}}
									/>
								</div>
							}
						/>
						<If
							condition={mintType === MINTS.ALLOWLISTED}
							then={
								<div>
									<CrossmintPayButton
										projectId="1d2587be-f150-4661-8377-5445a43d5719"
										collectionId="47f94c27-06b4-4089-b685-087f095159c5"
										environment="staging"
										mintTo={receiverAddress}
										mintConfig={{
											type: 'erc-721',
											quantity: noOfTokens,
											totalPrice: ethPrice,
											_receiver: receiverAddress,
											_numberOfTokens: noOfTokens,
											_proofs: proofs,
											_saleId: MINT_SALE_ID,

											// your custom minting arguments...
										}}
									/>
								</div>
							}
						/>
						<If
							condition={mintType === MINTS.DISCOUNTED && discountCode}
							then={
								<CrossmintPayButton
									projectId="1d2587be-f150-4661-8377-5445a43d5719"
									collectionId="47f94c27-06b4-4089-b685-087f095159c3"
									environment="staging"
									mintTo={receiverAddress}
									mintConfig={{
										type: 'erc-721',
										quantity: noOfTokens,
										totalPrice: ethPrice,
										_receiver: receiverAddress,
										_numberOfTokens: noOfTokens,
										_saleId: MINT_SALE_ID,
										_discountIndex: discountIndex,
										_discountedPrice: discountedPrice,
										_signature: discountedSignature,
										// your custom minting arguments...
									}}
								/>
							}
						/>
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
	);
};

export default CrossmintComponent;
