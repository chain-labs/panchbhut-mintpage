import MintPageComp from 'src/containers/mintPage';
import React, {useEffect, useState} from 'react';
import useCustomContract, {
	getContractDetails,
} from 'src/ethereum/useCustomContract';
import {useProvider, useSigner} from 'wagmi';
import {ethers} from 'ethers';
import {CONTRACT_ADDRESS} from 'src/utils/constants';
import {useAppSelector} from 'redux/hooks';
import {userSelector} from 'redux/user';
import {useRouter} from 'next/router';
import {networkSelector} from 'src/redux/network';
import If from 'src/components/If';
import ConnectWallet from 'src/components/Navbar/ConnectWallet';
import {useDispatch} from 'react-redux';

const MintPage = () => {
	const provider = useProvider();
	const [contract, setContract] = useState<ethers.Contract>();
	const contractAddress = CONTRACT_ADDRESS;
	const {data: signer} = useSigner();
	const user = useAppSelector(userSelector);
	const network = useAppSelector(networkSelector);
	const [contractExists, setContractExists] = useState<boolean>(false);
	const dispatch = useDispatch();
	const router = useRouter();

	useEffect(() => {
		if (contractAddress && provider && network.isValid) {
			const abi = getContractDetails();
			const contract = new ethers.Contract(contractAddress, abi, signer);
			console.log(contract);
			console.log(signer);
			setContract(contract);
			console.log('contract added');
			setContractExists(true);
			console.log('contract present added');
		}
	}, [network.isValid]);

	return (
		<div className=" min-h-screen bg-mint-page-lg bg-cover bg-center bg-no-repeat flex justify-center items-center">
			<If
				condition={network.isValid && contractExists}
				then={
					<div>
						<MintPageComp
							contract={contract}
							signer={signer}
						/>
					</div>
				}
				else={
					<div className="flex justify-center items-center flex-col gap-3">
						<ConnectWallet />
						<div className="flex justify-around items-center text-[#ffa800]">
							OR
						</div>
						<div>
							<button
								className="bg-yellow-600 w-[368px] h-10 flex justify-center items-center bg-no-repeat rounded "
								onClick={() => router.replace('/pay-with-card')}
							>
								<div className=" text-white text-[16px] font-bold">
									PAY WITH CARD
								</div>
							</button>
						</div>
					</div>
				}
			/>
		</div>
	);
};

export default MintPage;
