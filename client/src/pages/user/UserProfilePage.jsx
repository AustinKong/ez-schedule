import React, { useEffect, useState } from 'react';
import {
	Box,
	Flex,
	Avatar,
	Button,
	Heading,
	Text,
	Input,
	Textarea,
	IconButton,
	Badge,
	Spinner,
	Alert,
	Image,
} from '@chakra-ui/react';
import {
	FaEnvelope,
	FaUserTag,
	FaEdit,
	FaCheck,
	FaTimes,
	FaCamera,
	FaArrowLeft,
} from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import { Toaster, toaster } from '@/components/ui/toaster';
import { FiUser } from 'react-icons/fi';

const UserProfilePage = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	const [userData, setUserData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [isEditing, setIsEditing] = useState(false);
	const [editedUsername, setEditedUsername] = useState('');
	const [saveError, setSaveError] = useState(null);
	const [isEditingPhoto, setIsEditingPhoto] = useState(false);
	const [photoPreview, setPhotoPreview] = useState(null);
	const [isEditingBio, setIsEditingBio] = useState(false);
	const [isEditingContact, setIsEditingContact] = useState(false);
	const [bio, setBio] = useState('');
	const [contactNumber, setContactNumber] = useState('');

	useEffect(() => {
		const fetchUserProfile = async () => {
			try {
				const token = localStorage.getItem('token');
				if (!token) throw new Error('Authentication required');

				const response = await fetch(`/api/users/${id}`, {
					headers: { Authorization: `Bearer ${token}` },
				});

				if (!response.ok) throw new Error('Failed to fetch user data');
				const data = await response.json();

				setUserData(data);
				setBio(data.bio || '');
				setContactNumber(data.contactNumber || '');
				setEditedUsername(data.username);
				if (data.profilePicture) setPhotoPreview(data.profilePicture);
			} catch (error) {
				setError('Failed to load user data');
			} finally {
				setLoading(false);
			}
		};

		fetchUserProfile();
	}, [id]);

	const handlePhotoChange = async (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => setPhotoPreview(reader.result);
			reader.readAsDataURL(file);

			try {
				const token = localStorage.getItem('token');
				if (!token) throw new Error('Authentication required');

				const formData = new FormData();
				formData.append('profilePicture', file);

				const response = await fetch(`/api/users/${id}/profile-picture`, {
					method: 'POST',
					headers: { Authorization: `Bearer ${token}` },
					body: formData,
				});

				if (!response.ok) throw new Error('Failed to update profile picture');

				const data = await response.json();
				setUserData((prev) => ({ ...prev, profilePicture: data.profilePicture }));
				setIsEditingPhoto(false);

				toaster.create({
					title: 'Profile Picture Updated',
					description: 'Your profile picture has been changed.',
					type: 'success',
				});
			} catch (err) {
				setSaveError(err.message);
				setPhotoPreview(userData?.profilePicture || null);

				toaster.create({
					title: 'Upload Failed',
					description: err.message,
					type: 'error',
				});
			}
		}
	};

	const handleSave = async () => {
		try {
			const token = localStorage.getItem('token');
			if (!token) throw new Error('Authentication required');

			const response = await fetch(`/api/users/${id}`, {
				method: 'PATCH',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ username: editedUsername }),
			});

			if (!response.ok) throw new Error('Failed to update username');

			setUserData((prev) => ({ ...prev, username: editedUsername }));
			setIsEditing(false);
			setSaveError(null);

			toaster.create({
				title: 'Username Updated',
				description: 'Your new username has been saved.',
				type: 'success',
			});
		} catch (err) {
			setSaveError(err.message);
			toaster.create({
				title: 'Update Failed',
				description: err.message,
				type: 'error',
			});
		}
	};

	const handleBioSave = async () => {
		try {
			const token = localStorage.getItem('token');
			if (!token) throw new Error('Authentication required');

			const res = await fetch(`/api/users/${id}`, {
				method: 'PATCH',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ bio }),
			});

			if (!res.ok) throw new Error();
			setUserData((prev) => ({ ...prev, bio }));
			setIsEditingBio(false);

			toaster.create({
				title: 'Bio Updated',
				description: 'Your bio has been saved.',
				type: 'success',
			});
		} catch {
			toaster.create({
				title: 'Failed to update bio',
				description: 'Please try again later.',
				type: 'error',
			});
		}
	};

	const handleContactSave = async () => {
		try {
			const token = localStorage.getItem('token');
			if (!token) throw new Error('Authentication required');

			const res = await fetch(`/api/users/${id}`, {
				method: 'PATCH',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ contactNumber }),
			});

			if (!res.ok) throw new Error();
			setUserData((prev) => ({ ...prev, contactNumber }));
			setIsEditingContact(false);

			toaster.create({
				title: 'Contact Updated',
				description: 'Your contact number has been saved.',
				type: 'success',
			});
		} catch {
			toaster.create({
				title: 'Failed to update contact',
				description: 'Please try again later.',
				type: 'error',
			});
		}
	};

	if (loading) {
		return (
			<Flex justify="center" align="center" minH="100vh">
				<Spinner size="xl" />
			</Flex>
		);
	}

	if (error) {
		return (
			<Alert.Root>
				<Alert.Indicator />
				<Alert.Content>
					<Alert.Title>
						Something went wrong
					</Alert.Title>
					<Alert.Description>
						{error}
					</Alert.Description>
				</Alert.Content>
			</Alert.Root>
		);
	}

	if (!userData) {
		return (
			<Alert.Root>
				<Alert.Indicator />
				<Alert.Content>
					<Alert.Title>
						User profile not found
					</Alert.Title>
				</Alert.Content>
			</Alert.Root>
		);
	}

	return (
		<>
			<Toaster />
			<Flex direction="column" align="center" p={6} minH="100vh">
				<Box w="100%" maxW="800px" p={6}>
					{/* Profile Picture */}
					<Flex justify="center" mb={6}>
						{isEditingPhoto ? (
							<Flex direction="column" align="center">
								{photoPreview ? (
									<Image src={photoPreview} boxSize="150px" borderRadius="full" objectFit="cover" />
								) : (
									<Avatar.Root size="2xl">
										{userData?.profilePicture && (<Avatar.Image src={userData.profilePicture} alt={userData.username} />)}
										<Avatar.Fallback>
											<FiUser />
										</Avatar.Fallback>
									</Avatar.Root>
								)}
								<Flex gap={2} mt={2}>
									<label>
										<Button leftIcon={<FaCamera />} as="span">
											Choose Photo
											<input type="file" hidden accept="image/*" onChange={handlePhotoChange} />
										</Button>
									</label>
									<Button leftIcon={<FaTimes />} colorScheme="red" onClick={() => setIsEditingPhoto(false)}>
										Cancel
									</Button>
								</Flex>
							</Flex>
						) : (
							<Flex direction="column" align="center" position="relative">
								{userData.profilePicture ? (
									<Image src={userData.profilePicture} boxSize="150px" borderRadius="full" objectFit="cover" />
								) : (
									<Avatar.Root size="2xl">
										{userData?.profilePicture && (<Avatar.Image src={userData.profilePicture} alt={userData.username} />)}
										<Avatar.Fallback>
											<FiUser />
										</Avatar.Fallback>
									</Avatar.Root>
								)}
								<IconButton
									aria-label="Edit Photo"
									position="absolute"
									bottom={0}
									right={0}
									onClick={() => setIsEditingPhoto(true)}
									isRound
									size="sm"
								>
									<FaCamera />
								</IconButton>
							</Flex>
						)}
					</Flex>

					{/* Username */}
					<Flex direction="column" align="center" mb={6}>
						{isEditing ? (
							<>
								<Input
									value={editedUsername}
									onChange={(e) => setEditedUsername(e.target.value)}
									textAlign="center"
									maxW="300px"
									fontSize="2xl"
									mb={2}
								/>
								<Flex gap={2}>
									<Button onClick={handleSave}>
									<FaCheck />
										Save
									</Button>
									<Button
										onClick={() => {
											setIsEditing(false);
											setEditedUsername(userData.username);
										}}>
											<FaTimes />
										Cancel
									</Button>
								</Flex>
								{saveError && <Text color="red.500">{saveError}</Text>}
							</>
						) : (
							<>
								<Heading size="lg">{userData.username}</Heading>
								<Button variant="ghost" onClick={() => setIsEditing(true)}>
									<FaEdit />
									Edit
								</Button>
							</>
						)}
					</Flex>

					{/* Info Card */}
					<Box p={4} borderRadius="md">
						<Flex align="center" mb={4}>
							<FaEnvelope />
							<Text ml={2} fontWeight="semibold">
								Email:
							</Text>
							<Text ml={2}>{userData.email}</Text>
						</Flex>

						<Flex align="center" mb={4}>
							<FaUserTag />
							<Text ml={2} fontWeight="semibold">
								Role:
							</Text>
							<Badge ml={2} colorScheme={userData.userRole === 'admin' ? 'red' : userData.userRole === 'manager' ? 'green' : 'blue'}>
								{userData.userRole}
							</Badge>
						</Flex>

						{/* Bio */}
						<Box mt={4}>
							<Flex justify="space-between" align="center">
								<Heading size="sm">Bio</Heading>
								{isEditingBio ? (
									<Flex gap={2}>
										<IconButton size="sm" onClick={handleBioSave}>
											<FaCheck />
										</IconButton>
										<IconButton
											size="sm"
											onClick={() => {
												setIsEditingBio(false);
												setBio(userData.bio || '');
											}}>
											<FaTimes />
										</IconButton>
									</Flex>
								) : (
									<IconButton size="sm" onClick={() => setIsEditingBio(true)}>
										<FaEdit />
									</IconButton>
								)}
							</Flex>
							{isEditingBio ? (
								<Textarea value={bio} onChange={(e) => setBio(e.target.value)} mt={2} />
							) : (
								<Text mt={2}>{userData.bio || 'No bio added yet.'}</Text>
							)}
						</Box>

						{/* Contact Number */}
						<Box mt={6}>
							<Flex justify="space-between" align="center">
								<Heading size="sm">Contact Number</Heading>
								{isEditingContact ? (
									<Flex gap={2}>
										<IconButton size="sm" onClick={handleContactSave}>
											<FaCheck />
										</IconButton>
										<IconButton
											size="sm"
											onClick={() => {
												setIsEditingContact(false);
												setContactNumber(userData.contactNumber || '');
											}}>
											<FaTimes />
										</IconButton>
									</Flex>
								) : (
									<IconButton size="sm" onClick={() => setIsEditingContact(true)}>
										<FaEdit />
									</IconButton>
								)}
							</Flex>
							{isEditingContact ? (
								<Input mt={2} type="tel" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} />
							) : (
								<Text mt={2}>{userData.contactNumber || 'No contact number added yet.'}</Text>
							)}
						</Box>
					</Box>
				</Box>
			</Flex>
		</>
	);
};

export default UserProfilePage;
