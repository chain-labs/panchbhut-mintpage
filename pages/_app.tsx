import type {AppProps} from 'next/app';
import React, {useEffect} from 'react';
import Toaster from 'src/components/Toaster';
import Wagmi from 'src/components/Wagmi';
import Navbar from 'src/components/Navbar';
import {wrapper} from 'src/redux/store';
import 'src/styles/global.css';
import Head from 'next/head';

function MyApp({Component, pageProps}: AppProps) {
	return (
		<Wagmi>
			<Head>
				<title>Panchbut Game | Mint Here</title>
				<link
					rel="shortcut icon"
					href=" https://pranapsivadasan.github.io/panchbhut/assets/navLogo.png"
				/>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
				<link
					rel="preconnect"
					href="https://fonts.googleapis.com"
				/>
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					crossOrigin="true"
				/>
				<link
					href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800;900&display=swap"
					rel="stylesheet"
				/>
			</Head>
			{/* <Navbar /> */}
			<Component {...pageProps} />
		</Wagmi>
	);
}
export default wrapper.withRedux(MyApp);
