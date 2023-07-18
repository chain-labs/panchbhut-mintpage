import React, {useEffect, useState} from 'react';
import ConnectWallet from 'src/components/Navbar/ConnectWallet';
import {useAppSelector} from 'src/redux/hooks';
import {userSelector} from 'src/redux/user';
import {useProvider, useSigner} from 'wagmi';
import {getIsMintAllowListed, getMintType} from './utils';
import If from 'src/components/If';
import {BigNumber} from 'ethers';
import {MINTS, SALE_ID} from './constants';

const MintPage = ({contract}) => {
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
		const getSaleCategory = async () => {
			try {
				const saleCategory = await contract.callStatic.getSaleCategory(1);
				setSaleCategory(saleCategory);
				console.log('sale category', saleCategory);
			} catch (err) {
				console.log(err);
			}
		};

		if (contract) {
			getSaleCategory();
		}
	}, [contract]);

	useEffect(() => {
		if (saleCategory) {
			const isDiscountEnabled = saleCategory['isDiscountEnabled'];
			const merkleRoot = saleCategory['merkleRoot'];
			const price = saleCategory['price'];
			setPrice(price);
			setDiscounted(isDiscountEnabled);
			setAllowListed(getIsMintAllowListed(merkleRoot));
		}
	}, [saleCategory]);

	useEffect(() => {
		const getCurrentMintType = async () => {
			const mint_type = await getMintType(allowListed, discounted);
			setMintType(mint_type);
			console.log('Current Mint Type', mint_type);
		};
		getCurrentMintType();
	}, [discounted, allowListed]);

	const mintController = async () => {
		if (noOfTokens) {
			console.log(mintType);
			if (mintType === MINTS.DISCOUNTED_ALLOWLISTED) {
				console.log('Mint is discounted allowlisted');
			} else if (mintType === MINTS.PUBLIC) {
				console.log('Mint is public');
				console.log('INPUT OF PUBLIC MINT', {
					address: user.address,
					Tokens: noOfTokens,
					saleId: SALE_ID.PUBLIC,
					value: BigNumber.from(noOfTokens).mul(price),
				});
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
			} else if (mintType === MINTS.ALLOWLISTED) {
				console.log('Mint is allowlisted');
			}
		} else {
			console.log('No of tokens is not provided');
		}
	};

	return (
		<div className="flex justify-center items-center flex-col py-10">
			<div>
				<input
					className="input"
					type="number"
					onWheel={e => {
						// @ts-ignore
						e.target?.blur();
					}}
					value={noOfTokens}
					onChange={e => setNoOfTokens(e.target.value)}
				/>
			</div>
			<button
				type="button"
				className="focus:outline-none mt-4 text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:focus:ring-yellow-900"
				onClick={mintController}
			>
				Mint
			</button>
		</div>
	);
};

export default MintPage;
