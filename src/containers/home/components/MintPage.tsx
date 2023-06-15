import React, {useEffect, useState} from 'react';
import ConnectWallet from '../../../components/Navbar/ConnectWallet';
import {ethers} from 'ethers';
import {MINTS} from '../constants';
import {useProvider, useSigner} from 'wagmi';
import {useAppSelector} from '../../../redux/hooks';
import {userSelector} from '../../../redux/user';

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
	const [price, setPrice] = useState();

	useEffect(() => {
		const getContractDetails = async () => {
			try {
				const saleCategory = await contract.callStatic.getSaleCategory(1);
				// const price = await contract.callStatic.
				console.log(contract.callStatic.price);
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
			try {
				const transaction = await contract
					.connect(signer)
					?.mintDiscountAllowlist(user.address, 1, 1);
				console.log(transaction);
			} catch (error) {
				console.log({error});
			}
		} else if (mintType === MINTS.PUBLIC) {
			try {
				console.log('Receiver address:', user.address);
				console.log('Signer:', signer);
				console.log('No of tokens:', 1);
				console.log('Sale id:', 1);
				const transaction = await contract.mintPublic(user.address, 1, 1);
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
