import type {AppProps} from 'next/app';
import React, {useEffect} from 'react';
import Toaster from '../src/components/Toaster';
import Wagmi from '../src/components/Wagmi';
import Navbar from '../src/components/Navbar';
import {wrapper} from '../src/redux/store';
import '../src/styles/global.css';
import '../src/styles/home.scss';

function MyApp({Component, pageProps}: AppProps) {
	return (
		<Wagmi>
			{/* <Navbar /> */}
			<Component {...pageProps} />
		</Wagmi>
	);
}
export default wrapper.withRedux(MyApp);
