import React, {useEffect, useState} from 'react';
import {CrossmintPayButton} from '@crossmint/client-sdk-react-ui';
import CrossmintComponent from 'src/containers/payWithCard';
import {CONTRACT_ADDRESS, getChain} from 'src/utils/constants';
import {getContractDetails} from 'src/ethereum/useCustomContract';
import {useProvider, useSigner} from 'wagmi';
import {ethers} from 'ethers';
import If from 'src/components/If';

const index = () => {
	const contractAddress = CONTRACT_ADDRESS;
	const [contract, setContract] = useState<ethers.Contract>();
	const [contractExists, setContractExists] = useState<boolean>(false);
	const chain = getChain();
	const provider = useProvider({chainId: parseInt(chain)});

	useEffect(() => {
		if (contractAddress) {
			const abi = getContractDetails();
			const contract = new ethers.Contract(contractAddress, abi, provider);
			console.log(contract);
			setContract(contract);
			console.log('contract added');
			setContractExists(true);
			console.log('contract present added');
		}
	}, []);

	return (
		<If
			condition={contractExists}
			then={
				<div className="min-h-screen bg-white bg-cover bg-center bg-no-repeat flex justify-center items-center">
					<CrossmintComponent contract={contract} />
				</div>
			}
		/>
	);
};

export default index;
