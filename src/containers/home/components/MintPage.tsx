import React, {useEffect, useState} from 'react';
import ConnectWallet from '../../../components/Navbar/ConnectWallet';
import {BigNumber, ethers} from 'ethers';
import {MINTS, SALE_ID} from '../constants';
import {useProvider, useSigner} from 'wagmi';
import {useAppSelector} from '../../../redux/hooks';
import {userSelector} from '../../../redux/user';
import MintPageComp from './MintPageComp';

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

	useEffect(() => {
		const getContractDetails = async () => {
			try {
				const saleCategory = await contract.callStatic.getSaleCategory(
					SALE_ID.DISCOUNTED
				);

				setSaleCategory(saleCategory);
			} catch (err) {
				console.log(err);
			}
		};

		if (contract) {
			getContractDetails();
		}
	}, [contract]);

	useEffect(() => {
		if (saleCategory) {
			const isDiscountEnabled = saleCategory['isDiscountEnabled'];
			const merkleRoot = saleCategory['merkleRoot'];
			const price = saleCategory['price'];
			console.log(saleCategory);
			setPrice(price);
			console.log(ethers.utils.formatUnits(price), 'ETH');
			getIsMintDiscounted(isDiscountEnabled);
			getIsMintAllowListed(merkleRoot);
			getMintType();
		}
	}, [saleCategory]);

	const getIsMintDiscounted = isDiscountEnabled => {
		if (isDiscountEnabled) {
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
		} else if (allowListed && !discounted) {
			setMintType(MINTS.ALLOWLISTED);
		} else if (discounted && !allowListed) {
			setMintType(MINTS.DISCOUNTED);
		} else {
			setMintType(MINTS.PUBLIC);
		}
	};

	const mintController = async () => {
		console.log(mintType);
		if (mintType === MINTS.DISCOUNTED_ALLOWLISTED) {
			console.log('Mint is discounted allowlisted');
			try {
				const transaction = await contract
					.connect(signer)
					?.mintDiscountAllowlist(
						user.address,
						noOfTokens,
						parseInt(SALE_ID.DISCOUT_ALLOWLIST),
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
			try {
				const transaction = await contract
					?.connect(signer)
					?.mintDiscounted(
						user.address,
						noOfTokens,
						parseInt(SALE_ID.DISCOUNTED),
						parseInt('1'),
						signer,
						{
							value: BigNumber.from(noOfTokens).mul(price),
						}
					);
				console.log('Transaction:', transaction);
			} catch (error) {
				console.log({error});
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
		<div
		// className="mint-page"
		>
			{/* <input
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
			</button> */}
			<MintPageComp />
			{/* <ConnectWallet /> */}
		</div>
	);
};

export default MintPage;
