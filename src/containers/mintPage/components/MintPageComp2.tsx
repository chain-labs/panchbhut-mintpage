import React from 'react';
import LogoComp from './LogoComp';
import ConnectWallet from 'src/components/Navbar/ConnectWallet';
import If from 'src/components/If';

const MintPageComp2 = () => {
	return (
		<div className="flex justify-center items-center flex-col gap-10">
			<LogoComp />
			<div className=" w-[500px] flex justify-around items-center text-[#ffa800]">
				<div>Supply</div>
				<div>Supply</div>
				<div>Supply</div>
			</div>
			{/* <ConnectWallet /> */}
			<div>
				<input
					className="w-10 bg-input-lg"
					placeholder=" "
				/>
			</div>
		</div>
	);
};

export default MintPageComp2;
