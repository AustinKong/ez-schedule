import React from 'react';
import {
	Flex,
	Box,
	Heading,
	VStack,
	Input,
	Button,
	HStack,
	Text,
	Link as ChakraLink,
	RadioGroup,
} from '@chakra-ui/react';
import { useState } from 'react';
import { Toaster, toaster } from '@/components/ui/toaster';
import { PasswordInput } from '@/components/ui/password-input';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../../services/api';
import AuthLeftPanel from '../../components/auth/AuthLeftPanel';

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const RegisterPage = () => {
	const [email, setEmail] = useState('');
	const [username, setUsername] = useState('');
	const [userType, setUserType] = useState('participant');
	const [password, setPassword] = useState('');
	const [repeatPassword, setRepeatPassword] = useState('');
	const navigate = useNavigate();

	const handleRegister = async () => {
		if (!email || !isValidEmail(email) || !password || password !== repeatPassword || !username) {
			toaster.create({
				title: 'Invalid Input',
				description: 'Please check all fields',
				type: 'error',
			});
			return;
		}

		try {
			const response = await fetch(`${API_URL}/auth/register`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password, username, userType }),
			});

			if (response.ok) {
				navigate('/login');
			} else {
				toaster.create({
					title: 'Registration failed',
					description: 'Account already exists',
					type: 'error',
				});
			}
		} catch {
			toaster.create({
				title: 'Network error',
				description: 'Try again later',
				type: 'error',
			});
		}
	};

	const handleKeyDown = (event) => {
		if (event.key === 'Enter') {
			handleRegister();
		}
	};

	return (
		<Flex minH='100vh'>
			<AuthLeftPanel
				title='Create Account'
				subtitle='Join EzSchedule to start managing your schedule efficiently.'
			/>
			<Toaster />

			{/* Right side (Form) */}
			<VStack
				flex='1'
				align='center'
				justify='center'
				spacing={6}
				p={8}>
				<Heading>Register</Heading>
				<Text
					fontSize='sm'
					color='gray.500'>
					The first step to getting your questions answered!
				</Text>

				<VStack
					spacing={4}
					width='full'
					maxW='sm'>
					{/* Email */}
					<Box width='full'>
						<Text
							fontWeight='semibold'
							mb={1}>
							Email
						</Text>
						<Input
							type='email'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							onKeyDown={handleKeyDown}
						/>
						{email && !isValidEmail(email) && (
							<Text
								color='red.500'
								fontSize='sm'>
								Email is invalid
							</Text>
						)}
					</Box>

					<Box width='full'>
						<Text
							fontWeight='semibold'
							mb={1}>
							Username
						</Text>
						<Input
							type='text'
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							onKeyDown={handleKeyDown}
						/>
					</Box>

					{/* Password */}
					<Box width='full'>
						<Text
							fontWeight='semibold'
							mb={1}>
							Password
						</Text>
						<PasswordInput
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							onKeyDown={handleKeyDown}
						/>
					</Box>

					{/* Repeat Password */}
					<Box width='full'>
						<Text
							fontWeight='semibold'
							mb={1}>
							Repeat Password
						</Text>
						<PasswordInput
							value={repeatPassword}
							onChange={(e) => setRepeatPassword(e.target.value)}
							onKeyDown={handleKeyDown}
						/>
						{password && repeatPassword !== password && (
							<Text
								color='red.500'
								fontSize='sm'>
								Passwords do not match
							</Text>
						)}
					</Box>

					<Box width='full'>
						<Text
							fontWeight='semibold'
							mb={1}>
							Who are you?
						</Text>
						<RadioGroup.Root
							value={userType}
							onValueChange={(e) => setUserType(e.value)}>
							<HStack
								justifyContent='space-between'
								w='full'>
								<RadioGroup.Item
									value='participant'
									id='participant'>
									<RadioGroup.ItemHiddenInput />
									<RadioGroup.ItemIndicator />
									<RadioGroup.ItemText
										fontWeight='normal'
										color={userType === 'participant' ? 'fg.text' : 'fg.muted'}>
										I want to attend a consultation (student)
									</RadioGroup.ItemText>
								</RadioGroup.Item>
								<RadioGroup.Item
									value='host'
									id='host'>
									<RadioGroup.ItemHiddenInput />
									<RadioGroup.ItemIndicator />
									<RadioGroup.ItemText
										fontWeight='normal'
										color={userType === 'host' ? 'fg.text' : 'fg.muted'}>
										I want to host a consultation (lecturer)
									</RadioGroup.ItemText>
								</RadioGroup.Item>
							</HStack>
						</RadioGroup.Root>
					</Box>

					<Button
						colorScheme='blue'
						width='full'
						mt={2}
						disabled={!email || !isValidEmail(email) || !password || password !== repeatPassword}
						onClick={handleRegister}>
						Register
					</Button>
				</VStack>

				<Text fontSize='sm'>
					Already have an account?{' '}
					<ChakraLink
						as={Link}
						to='/login'
						color='blue.500'>
						Login
					</ChakraLink>
				</Text>
			</VStack>
		</Flex>
	);
};

export default RegisterPage;
