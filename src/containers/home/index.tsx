import React, {useEffect, useState} from 'react';
import useCustomContract, {
	getContractDetails,
} from 'src/ethereum/useCustomContract';
import {useProvider, useSigner} from 'wagmi';
import {ethers} from 'ethers';
import {CONTRACT_ADDRESS} from 'src/utils/constants';
import If from 'components/If';
import {useAppSelector} from 'redux/hooks';
import {userSelector} from 'redux/user';
import MintPage from '../mintPage';
import ConnectWallet from 'src/components/Navbar/ConnectWallet';
import Test from './Test';

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
	}, [contractAddress, provider, signer, user]);

	return (
		<div className="md:flex md:justify-center min-h-screen bg-mint-page-lg bg-cover bg-center bg-no-repeat md:items-center">
			<If
				condition={user.exists}
				then={
					<If
						condition={!!contract}
						// then={<MintPage contract={contract} />}
						then={<Test />}
					/>
				}
				else={<ConnectWallet />}
			/>
		</div>
	);
};

export default HomeContainer;
