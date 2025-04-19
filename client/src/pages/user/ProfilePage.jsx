import React, { useEffect, useState } from 'react';
import {
	Box,
	Container,
	Heading,
	Text,
	VStack,
	HStack,
	Avatar,
	Badge,
	Card,
	CardBody,
	Spinner,
	Center,
} from '@chakra-ui/react';
import { FaUser, FaEnvelope, FaUserTag } from 'react-icons/fa';

const ProfilePage = () => {
	const [userData, setUserData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchUserProfile = async () => {
			try {
				const token = localStorage.getItem('token');
				const userId = localStorage.getItem('userId');

				if (!token || !userId) {
					throw new Error('Authentication required');
				}

				const response = await fetch(`/api/users/${userId}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				if (!response.ok) {
					throw new Error('Failed to fetch user profile');
				}

				const data = await response.json();
				setUserData(data);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchUserProfile();
	}, []);

	if (loading) {
		return (
			<Center h='100vh'>
				<Spinner size='xl' />
			</Center>
		);
	}

	if (error) {
		return (
			<Container
				maxW='container.md'
				py={8}>
				<Box
					p={4}
					bg='red.100'
					color='red.700'
					borderRadius='md'>
					<Text fontWeight='bold'>Error</Text>
					<Text>{error}</Text>
				</Box>
			</Container>
		);
	}

	return (
		<Container
			maxW='container.md'
			py={8}>
			<Card>
				<CardBody>
					<VStack
						spacing={6}
						align='stretch'>
						<HStack spacing={4}>
							<Avatar
								size='xl'
								name={userData?.username}
							/>
							<VStack
								align='start'
								spacing={1}>
								<Heading size='lg'>{userData?.username}</Heading>
								<Badge colorScheme={userData?.userRole === 'manager' ? 'purple' : 'blue'}>
									{userData?.userRole}
								</Badge>
							</VStack>
						</HStack>

						<Box
							borderBottom='1px'
							borderColor='gray.200'
						/>

						<VStack
							spacing={4}
							align='stretch'>
							<HStack>
								<FaEnvelope />
								<Text>Email: {userData?.email}</Text>
							</HStack>

							<HStack>
								<FaUser />
								<Text>Username: {userData?.username}</Text>
							</HStack>

							<HStack>
								<FaUserTag />
								<Text>Role: {userData?.userRole}</Text>
							</HStack>
						</VStack>
					</VStack>
				</CardBody>
			</Card>
		</Container>
	);
};

export default ProfilePage;
