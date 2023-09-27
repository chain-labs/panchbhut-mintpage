import React, {useEffect, useState} from 'react';
import useCustomContract, {
	getContractDetails,
} from 'src/ethereum/useCustomContract';
import {useProvider, useSigner} from 'wagmi';
import {ethers} from 'ethers';
import {CONTRACT_ADDRESS} from 'src/utils/constants';
import {useAppSelector} from 'redux/hooks';
import {userSelector} from 'redux/user';
import LogoComp from '../mintPage/components/LogoComp';
import {useRouter} from 'next/router';

const HomeContainer = () => {
	const provider = useProvider();
	const [contract, setContract] = useState<ethers.Contract>();
	const contractAddress = CONTRACT_ADDRESS;
	const {data: signer} = useSigner();
	const user = useAppSelector(userSelector);
	const {push} = useRouter();

	useEffect(() => {
		if (contractAddress && provider) {
			const abi = getContractDetails();
			console.log(signer);
			const contract = new ethers.Contract(contractAddress, abi, signer);
			console.log(contract);
			setContract(contract);
		}
	}, [contractAddress, provider, signer, user]);

	return (
		<div className=" min-h-screen bg-home-lg bg-cover bg-center bg-no-repeat ">
			<div className="flex justify-center items-center flex-col pt-32">
				<LogoComp />
				<div className="text-center text-[#ffa800]">
					{' '}
					Unique Multiverse storyline
					<div>20K+ possible mix of traits & layers</div>
					<div>Demi-Gods, Demons & Creatures 80+ Unique Characters</div>
					<div>8+ Clans</div>
					<div>Possibilities are endless!</div>
					<div>Panchbhut Gameverse Collect now to see</div>
					<div>what's in store for you! </div>
				</div>
				<div>
					<button
						className="bg-collect-button w-[368px] h-20 object-contain text-[#0e0e0e] flex justify-center items-center bg-no-repeat rounded"
						onClick={() => push('/mint-page')}
					>
						Collect & Discover
					</button>
				</div>
			</div>
		</div>
		// 	}
		// />
	);
};

export default HomeContainer;
