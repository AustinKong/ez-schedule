import React from 'react';
import { Box, Heading, Text, VStack, Image } from '@chakra-ui/react';

const AuthLeftPanel = ({ title, subtitle }) => {
	return (
		<Box
			flex='1'
			bgColor='blue.50'
			display='flex'
			flexDirection='column'
			justifyContent='center'
			alignItems='center'
			p={8}>
			<VStack
				spacing={6}
				maxW='md'
				textAlign='center'>
				<Heading
					fontSize='3xl'
					color='blue.700'>
					{title || 'Welcome to EzSchedule'}
				</Heading>
				<Text
					fontSize='lg'
					color='blue.600'>
					{subtitle || 'Simplify your appointments, meetings, and events with EzSchedule.'}
				</Text>
				<Image
					src='/Icon.png'
					alt='EzSchedule icon'
					maxH='300px'
					fallbackSrc='https://via.placeholder.com/300x300?text=EzSchedule+Icon'
				/>
			</VStack>
		</Box>
	);
};

export default AuthLeftPanel;
