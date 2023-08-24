import React from 'react';

const Navbar = () => {
	return (
		<div>
			<nav className="fixed top-0 left-0 z-20 w-full border-gray-200 bg-white px-8 py-4 shadow-md  sm:px-4">
				<div className="container mx-auto flex flex-wrap items-center justify-between">
					<div className="flex items-center">
						<a
							href="https://simplrhq.com"
							target="_blank"
							rel="noreferrer"
						></a>
					</div>
				</div>
			</nav>
		</div>
	);
};

export default Navbar;
