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
import MintPageComp2 from '../mintPage/components/MintPageComp2';
import DiscountCodeComp from '../mintPage/components/DiscountCodeComp';

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
		<If
			condition={user.exists}
			then={
				<div className=" min-h-screen bg-mint-page-lg bg-cover bg-center bg-no-repeat">
					<If
						condition={!!contract}
						then={<MintPageComp2 />}
					/>
				</div>
			}
			else={
				<div className="md:flex md:justify-center min-h-screen bg-home-lg bg-cover bg-center bg-no-repeat md:items-center">
					<If
						condition={!!contract}
						then={<MintPage contract={contract} />}
					/>
				</div>
			}
		/>
	);
};

export default HomeContainer;
