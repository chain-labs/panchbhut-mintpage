import React from 'react';
import ConnectWallet from 'src/components/Navbar/ConnectWallet';

const MintPage = ({contract}) => {
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
				/>
			</div>
			<button className="text-white">Mint</button>
			<ConnectWallet />
		</div>
	);
};

export default MintPage;
