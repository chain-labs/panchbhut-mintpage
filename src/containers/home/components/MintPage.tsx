import React, {useEffect, useState} from 'react';
import ConnectWallet from 'src/components/Navbar/ConnectWallet';
import {BigNumber, ethers} from 'ethers';
import {MINTS, SALE_ID} from '../constants';
import {useProvider, useSigner} from 'wagmi';
import {useAppSelector} from '../../../redux/hooks';
import {userSelector} from '../../../redux/user';
import {getDiscountCode} from '../utils';

interface Props {
	contract: ethers.Contract;
}

const MintPage = ({contract}: Props) => {
	const [noOfTokens, setNoOfTokens] = useState<string>('');
	const [saleCategory, setSaleCategory] = useState();
	const [discounted, setDiscounted] = useState<boolean>();
	const [allowListed, setAllowListed] = useState<boolean>();
	const [mintType, setMintType] = useState<number>();
	const {data: signer} = useSigner();
	const provider = useProvider();
	const user = useAppSelector(userSelector);
	const [price, setPrice] = useState<BigNumber>();
	const [discountedPrice, setDiscountedPrice] = useState<BigNumber>();
	const [discountCode, setDiscountedCode] = useState({});

	useEffect(() => {
		const getContractDetails = async () => {
			try {
				const saleCategory = await contract.callStatic.getSaleCategory(
					SALE_ID.DISCOUNTED
				);
				console.log(saleCategory);
				setSaleCategory(saleCategory);
			} catch (err) {
				console.log(err);
			}
		};

		if (contract) {
			console.log('I am inside contract going to contract details');
			getContractDetails();
		}
	}, [contract]);

	useEffect(() => {
		if (saleCategory) {
			console.log(contract);
			console.log(saleCategory);
			console.log(saleCategory['isDiscountEnabled']);
			const isDiscountEnabled = saleCategory['isDiscountEnabled'];
			const merkleRoot = saleCategory['merkleRoot'];
			const currentPrice = saleCategory['price'];
			console.log(saleCategory);
			console.log(parseInt(currentPrice));
			setPrice(currentPrice);
			// console.log(ethers.utils.formatUnits(price), 'ETH');
			getIsMintDiscounted(isDiscountEnabled);
			getIsMintAllowListed(merkleRoot);
			getMintType();
		}
	}, [saleCategory]);

	const getIsMintDiscounted = isDiscountEnabled => {
		if (isDiscountEnabled) {
			console.log('Inside discount');
			setDiscounted(true);
		} else {
			setDiscounted(false);
		}
	};

	const getIsMintAllowListed = merkleRoot => {
		if (parseInt(merkleRoot) === 0) {
			setAllowListed(false);
		} else {
			setAllowListed(true);
		}
	};

	const getMintType = async () => {
		if (allowListed && discounted) {
			setMintType(MINTS.DISCOUNTED_ALLOWLISTED);
		} else if (allowListed) {
			setMintType(MINTS.ALLOWLISTED);
		} else if (discounted) {
			const discountCode = getDiscountCode();
			// const dPrice = parseInt(discountCode.discountedPrice);
			console.log(price);
			// setDiscountedPrice(discountCode.discountedPrice);
			setMintType(MINTS.DISCOUNTED);
		} else {
			console.log('public');
			setMintType(MINTS.PUBLIC);
		}
	};
	const mintController = async () => {
		console.log('price:', price);
		console.log(mintType);
		if (mintType === MINTS.DISCOUNTED_ALLOWLISTED) {
			console.log('Mint is discounted allowlisted');
			try {
				const transaction = await contract
					.connect(signer)
					?.mintDiscountAllowlist(
						user.address,
						noOfTokens,
						parseInt(SALE_ID.DISCOUNT_ALLOWLIST),
						{
							value: BigNumber.from(noOfTokens).mul(price),
						}
					);
				console.log(transaction);
			} catch (error) {
				console.log({error});
			}
		} else if (mintType === MINTS.PUBLIC) {
			console.log('Mint is public');
			try {
				const transaction = await contract
					?.connect(signer)
					?.mintPublic(user.address, noOfTokens, parseInt(SALE_ID.PUBLIC), {
						value: BigNumber.from(noOfTokens).mul(price),
					});
				console.log('Transaction:', transaction);
			} catch (error) {
				console.log({error});
			}
		} else if (mintType === MINTS.DISCOUNTED) {
			console.log('Mint is discounted');
			console.log(signer);
			console.log(price);
			const discountCode = getDiscountCode();

			if (discountCode) {
				try {
					const transaction = await contract
						?.connect(signer)
						?.mintDiscounted(
							user.address,
							noOfTokens,
							parseInt(SALE_ID.DISCOUNTED),
							discountCode.discountIndex,
							discountCode.discountedPrice,
							discountCode.signature,
							{
								value: BigNumber.from(noOfTokens).mul(
									discountCode.discountedPrice
								),
							}
						);
					console.log('Transaction:', transaction);
				} catch (error) {
					console.log({error});
				}
			}
		} else if (mintType === MINTS.ALLOWLISTED) {
			console.log('Mint is allowlisted');
			try {
				const transaction = await contract
					?.connect(signer)
					?.mintAllowlisted(
						user.address,
						noOfTokens,
						parseInt(SALE_ID.ALLOWLIST),
						{
							value: BigNumber.from(noOfTokens).mul(price),
						}
					);
				console.log('Transaction:', transaction);
			} catch (error) {
				console.log({error});
			}
		}
	};

	return (
		<div className="mint-page-1">
			<input
				className="input"
				type="number"
				onWheel={e => {
					// @ts-ignore
					e.target?.blur();
				}}
				value={noOfTokens}
				onChange={e => setNoOfTokens(e.target.value)}
				// min={0}
				// max={10}
				// disabled={disabledMintInput}
			/>
			<button
				className="mint-btn"
				onClick={mintController}
				// disabled={disabledMintButton}
				style={{
					backgroundColor: 'white',
					paddingLeft: '24px',
					paddingRight: '24px',
					marginTop: '12px',
					marginBottom: '12px',
				}}
				// style={noSale ? {paddingLeft: '24px', paddingRight: '24px'} : null}
			>
				Mint
			</button>
			<ConnectWallet />
		</div>
	);
};

export default MintPage;
