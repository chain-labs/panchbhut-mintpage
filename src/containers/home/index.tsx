import React, {useEffect, useState} from 'react';
import useCustomContract, {
	getContractDetails,
} from '../../ethereum/useCustomContract';
import {useProvider, useSigner} from 'wagmi';
import {ethers} from 'ethers';
import {CONTRACT_ADDRESS} from '../../utils/constants';
import If from '../../components/If';
import {useAppSelector} from '../../redux/hooks';
import {userSelector} from '../../redux/user';
import MintPage from './components/MintPage';

const HomeContainer = () => {
	const provider = useProvider();
	const [contract, setContract] = useState<ethers.Contract>();
	const contractAddress = CONTRACT_ADDRESS;
	const {data: signer} = useSigner();
	const user = useAppSelector(userSelector);

	useEffect(() => {
		if (contractAddress && provider) {
			const abi = getContractDetails();
			const contract = new ethers.Contract(contractAddress, abi, signer);
			console.log(contract);
			setContract(contract);
		}
	}, [contractAddress, provider, signer]);

	return (
		<div className="container">
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
				// style={noSale ? {paddingLeft: '24px', paddingRight: '24px'} : null}
			>
				Mint
			</button> */}
			<If
				condition={!!contract}
				then={<MintPage contract={contract} />}
			/>
		</div>
	);
};

export default HomeContainer;
