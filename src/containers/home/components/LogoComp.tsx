import React from 'react';
import menuLogoImg from './../../../../public/menu_logo.png';

import Image from 'next/image';

export default function LogoComp() {
	return (
		<div className="mt-10 mb-10">
			<Image
				src={menuLogoImg}
				alt="react logo"
			/>
		</div>
	);
}
