import React from 'react';
import ConnectWallet from 'src/components/Navbar/ConnectWallet';
import MintPageComp from './components/MintPageComp';

const MintPage = ({contract}) => {
	return (
		<div className="flex justify-center items-center flex-col">
			{/* <div>
				<input
					className="input"
					type="number"
					onWheel={e => {
						// @ts-ignore
						e.target?.blur();
					}}
				/>
			</div>
			<button className="text-white">Mint</button> */}
			<ConnectWallet />
			<MintPageComp />
		</div>
	);
};

export default MintPage;
