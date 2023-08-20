import type {AppProps} from 'next/app';
import React, {useEffect} from 'react';
import Toaster from 'src/components/Toaster';
import Wagmi from 'src/components/Wagmi';
import Navbar from 'src/components/Navbar';
import {wrapper} from 'src/redux/store';
import 'src/styles/global.css';
import Head from 'next/head';
import {debounce} from 'lodash';

function MyApp({Component, pageProps}: AppProps) {
	useEffect(() => {
		// Set a custom CSS Property for Height
		// See https://css-tricks.com/the-trick-to-viewport-units-on-mobile/

		// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
		if (process.browser) {
			const vh = window.innerHeight * 0.01;
			// Then we set the value in the --vh custom property to the root of the document
			document.documentElement.style.setProperty('--vh', `${vh}px`);

			const handleResize = debounce(() => {
				// We execute the same script as before
				const vh = window.innerHeight * 0.01;
				document.documentElement.style.setProperty('--vh', `${vh}px`);
			}, 150);

			window.addEventListener('resize', handleResize);
			return () => {
				if (process.browser) {
					window.removeEventListener('resize', handleResize);
				}
			};
		}
	});
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
