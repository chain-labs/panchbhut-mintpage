import type {NextPage} from 'next';
import Head from 'next/head';
import React from 'react';
import HomeContainer from '../src/containers/home';
import Test from 'src/containers/home/Test';

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
			<Test/>
			<HomeContainer />
		</React.Fragment>
	);
};

export default Home;
