import React from 'react';
import ConnectWallet from './ConnectWallet';

const Navbar = () => {
	return (
		<div>
			<nav>
				<div className="flex items-center">
					<a
						href="https://simplrhq.com"
						target="_blank"
						rel="noreferrer"
					></a>
				</div>
				<div className="flex md:order-2">
					<ConnectWallet />
				</div>
			</nav>
		</div>
	);
};

export default Navbar;
