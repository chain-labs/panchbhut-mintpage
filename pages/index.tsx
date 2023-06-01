import type {NextPage} from 'next';
import Head from 'next/head';
import React from 'react';
import HomeContainer from '../src/containers/home';

const Home: NextPage = () => {
	return (
		<React.Fragment>
			<Head>
				<title>Panchbut Game | Mint Here</title>
				<link
					rel="shortcut icon"
					href=" https://pranapsivadasan.github.io/panchbhut/assets/navLogo.png"
				/>
			</Head>
			<HomeContainer />
		</React.Fragment>
	);
};

export default Home;
