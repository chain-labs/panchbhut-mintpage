import {CrossmintPayButton} from '@crossmint/client-sdk-react-ui';
import React, {useEffect, useState} from 'react';
import PlusImg from 'public/static/images/plus.png';
import MinusImg from 'public/static/images/minus.png';
import Image from 'next/image';
import {MINT_SALE_ID} from 'src/utils/constants';
import {BigNumber} from 'ethers';
import {getIsMintAllowListed, getMintType} from '../mintPage/utils';
import {MINTS} from '../mintPage/constants';
import If from 'src/components/If';

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
	const [price, setPrice] = useState<BigNumber>();

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

	return (
		<div>
			<div className="flex flex-col items-center">
				<label className="text-[#ffa800]">Reciever Address</label>
				<div className="flex justify-center items-center gap-2">
					<input
						className="input w-80 h-[35px] bg-slate-300 rounded text-center text-xs text-black [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
						type="text"
						onWheel={e => {
							// @ts-ignore
							e.target?.blur();
						}}
						min={1}
						// max={`${perTransactionLimit}`}
						value={receiverAddress}
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
						// max={`${perTransactionLimit}`}
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
			<div className="flex justify-center items-center mt-4">
				<If
					condition={mintType === MINTS.DISCOUNTED_ALLOWLISTED}
					then={<div></div>}
				/>
				<If
					condition={mintType === MINTS.PUBLIC}
					then={<div></div>}
				/>
				<If
					condition={mintType === MINTS.ALLOWLISTED}
					then={<div>Hi</div>}
				/>
				<If
					condition={mintType === MINTS.DISCOUNTED}
					then={
						<CrossmintPayButton
							projectId="1d2587be-f150-4661-8377-5445a43d5719"
							collectionId="47f94c27-06b4-4089-b685-087f095159c3"
							environment="staging"
							mintTo="0x5F5A30564388e7277818c15DB0d511AAbbD0eC80"
							mintConfig={{
								type: 'erc-721',
								quantity: [1],
								totalPrice: '0.000009',
								_receiver: '0x5F5A30564388e7277818c15DB0d511AAbbD0eC80',
								_numberOfTokens: '1',
								_saleId: '18',
								_discountIndex: '58',
								_discountedPrice: '9000000000000',
								_signature:
									'0x034b290b00a2e63da9e3af623112a08f458c21d36da89ad743672769cec79cba7853ae73f748ebd139d1b39b50e7a0c5dd70d9e3ae4944aa922d1ace3c9cecac1b',
								// your custom minting arguments...
							}}
						/>
					}
				/>
			</div>
		</div>
	);
};

export default CrossmintComponent;
