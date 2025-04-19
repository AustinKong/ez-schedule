import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
	FaUser,
	FaEnvelope,
	FaUserTag,
	FaEdit,
	FaCheck,
	FaTimes,
	FaCamera,
	FaArrowLeft,
} from 'react-icons/fa';
import './UserProfilePage.css';

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

				if (!token) {
					throw new Error('Authentication required');
				}

				const response = await fetch(`/api/users/${id}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				if (!response.ok) {
					throw new Error('Failed to fetch user data');
				}

				const data = await response.json();
				setUserData(data);
				setBio(data.bio || '');
				setContactNumber(data.contactNumber || '');
				setEditedUsername(data.username);
				if (data.profilePicture) {
					setPhotoPreview(data.profilePicture);
				}
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
			try {
				const token = localStorage.getItem('token');
				if (!token) {
					throw new Error('Authentication required');
				}

				// Create preview immediately
				const reader = new FileReader();
				reader.onloadend = () => {
					setPhotoPreview(reader.result);
				};
				reader.readAsDataURL(file);

				// Upload to server
				const formData = new FormData();
				formData.append('profilePicture', file);

				const response = await fetch(`/api/users/${id}/profile-picture`, {
					method: 'POST',
					headers: {
						Authorization: `Bearer ${token}`,
					},
					body: formData,
				});

				if (!response.ok) {
					throw new Error('Failed to update profile picture');
				}

				const data = await response.json();
				setUserData((prev) => ({
					...prev,
					profilePicture: data.profilePicture,
				}));
				setIsEditingPhoto(false);
			} catch (err) {
				setSaveError(err.message);
				// Revert preview on error
				setPhotoPreview(userData?.profilePicture || null);
			}
		}
	};

	const handlePhotoCancel = () => {
		setIsEditingPhoto(false);
		setPhotoPreview(userData?.profilePicture || null);
	};

	const handleSave = async () => {
		try {
			const token = localStorage.getItem('token');
			if (!token) {
				throw new Error('Authentication required');
			}

			const response = await fetch(`/api/users/${id}`, {
				method: 'PATCH',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ username: editedUsername }),
			});

			if (!response.ok) {
				throw new Error('Failed to update username');
			}

			setUserData((prevData) => ({
				...prevData,
				username: editedUsername,
			}));

			setIsEditing(false);
			setSaveError(null);
		} catch (err) {
			setSaveError(err.message);
		}
	};

	const handleCancel = () => {
		setEditedUsername(userData.username);
		setIsEditing(false);
		setSaveError(null);
	};

	const handleBioSave = async () => {
		try {
			const token = localStorage.getItem('token');
			if (!token) {
				throw new Error('Authentication required');
			}

			const response = await fetch(`/api/users/${id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ bio }),
			});
			if (!response.ok) throw new Error('Failed to update bio');
			setUserData((prev) => ({ ...prev, bio }));
			setIsEditingBio(false);
		} catch (error) {
			setError('Failed to update bio');
		}
	};

	const handleContactSave = async () => {
		try {
			const token = localStorage.getItem('token');
			if (!token) {
				throw new Error('Authentication required');
			}

			const response = await fetch(`/api/users/${id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ contactNumber }),
			});
			if (!response.ok) throw new Error('Failed to update contact number');
			setUserData((prev) => ({ ...prev, contactNumber }));
			setIsEditingContact(false);
		} catch (error) {
			setError('Failed to update contact number');
		}
	};

	if (loading) {
		return (
			<div className='loading-container'>
				<div className='spinner'></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='error-container'>
				<div className='error-content'>
					<h2>Error</h2>
					<p>{error}</p>
				</div>
			</div>
		);
	}

	if (!userData) {
		return (
			<div className='warning-container'>
				<div className='warning-content'>
					<h2>No Data</h2>
					<p>User profile not found</p>
				</div>
			</div>
		);
	}

	return (
		<div className='profile-container'>
			<div className='profile-card'>
				{/* Go Back Button */}
				<div className='back-button-container'>
					<button
						className='back-button'
						onClick={() => navigate('/user/groups')}>
						<FaArrowLeft /> Back to Groups
					</button>
				</div>

				{/* Profile Picture Section - Centered at the top */}
				<div className='profile-avatar-container'>
					{isEditingPhoto ? (
						<div className='photo-edit-container'>
							<div className='photo-preview'>
								{photoPreview ? (
									<img
										src={photoPreview}
										alt='Profile preview'
									/>
								) : (
									<div className='profile-avatar'>{userData.username?.[0]?.toUpperCase()}</div>
								)}
							</div>
							<div className='photo-edit-controls'>
								<label className='photo-upload-button'>
									<FaCamera /> Choose Photo
									<input
										type='file'
										accept='image/*'
										onChange={handlePhotoChange}
										style={{ display: 'none' }}
									/>
								</label>
								<button
									onClick={handlePhotoCancel}
									className='cancel-button'>
									<FaTimes /> Cancel
								</button>
							</div>
						</div>
					) : (
						<div className='profile-avatar-wrapper'>
							{userData.profilePicture ? (
								<img
									src={userData.profilePicture}
									alt={`${userData.username}'s profile`}
									className='profile-avatar-image'
								/>
							) : (
								<div className='profile-avatar'>{userData.username?.[0]?.toUpperCase()}</div>
							)}
							<button
								onClick={() => setIsEditingPhoto(true)}
								className='edit-photo-button'
								title='Edit profile picture'>
								<FaCamera />
							</button>
						</div>
					)}
				</div>

				{/* Username Section - Centered underneath profile picture */}
				<div className='username-section'>
					{isEditing ? (
						<div className='edit-form'>
							<input
								type='text'
								value={editedUsername}
								onChange={(e) => setEditedUsername(e.target.value)}
								className='username-input'
							/>
							<div className='button-group'>
								<button
									onClick={handleSave}
									className='save-button'>
									<FaCheck /> Save
								</button>
								<button
									onClick={handleCancel}
									className='cancel-button'>
									<FaTimes /> Cancel
								</button>
							</div>
							{saveError && <p className='error-message'>{saveError}</p>}
						</div>
					) : (
						<div className='username-display'>
							<h1>{userData.username}</h1>
							<button
								onClick={() => setIsEditing(true)}
								className='edit-button'>
								<FaEdit /> Edit
							</button>
						</div>
					)}
				</div>

				{/* User Information Card - All details in one card */}
				<div className='info-card'>
					<div className='detail-item'>
						<FaEnvelope className='detail-icon' />
						<span className='detail-label'>Email:</span>
						<span className='detail-value'>{userData.email}</span>
					</div>

					<div className='detail-item'>
						<FaUserTag className='detail-icon' />
						<span className='detail-label'>Role:</span>
						<span className={`role-badge ${userData.userRole}`}>{userData.userRole}</span>
					</div>

					{/* Bio Section */}
					<div className='profile-section'>
						<div className='section-header'>
							<h2>Bio</h2>
							{!isEditingBio ? (
								<button
									onClick={() => setIsEditingBio(true)}
									className='edit-button'>
									<FaEdit />
								</button>
							) : (
								<div className='button-group'>
									<button
										onClick={handleBioSave}
										className='save-button'>
										<FaCheck />
									</button>
									<button
										onClick={() => {
											setIsEditingBio(false);
											setBio(userData.bio || '');
										}}
										className='cancel-button'>
										<FaTimes />
									</button>
								</div>
							)}
						</div>
						{isEditingBio ? (
							<textarea
								value={bio}
								onChange={(e) => setBio(e.target.value)}
								placeholder='Write something about yourself...'
								className='bio-textarea'
							/>
						) : (
							<p className='bio-text'>{userData.bio || 'No bio added yet.'}</p>
						)}
					</div>

					{/* Contact Number Section */}
					<div className='profile-section'>
						<div className='section-header'>
							<h2>Contact Number</h2>
							{!isEditingContact ? (
								<button
									onClick={() => setIsEditingContact(true)}
									className='edit-button'>
									<FaEdit />
								</button>
							) : (
								<div className='button-group'>
									<button
										onClick={handleContactSave}
										className='save-button'>
										<FaCheck />
									</button>
									<button
										onClick={() => {
											setIsEditingContact(false);
											setContactNumber(userData.contactNumber || '');
										}}
										className='cancel-button'>
										<FaTimes />
									</button>
								</div>
							)}
						</div>
						{isEditingContact ? (
							<input
								type='tel'
								value={contactNumber}
								onChange={(e) => setContactNumber(e.target.value)}
								placeholder='Enter your contact number'
								className='contact-input'
							/>
						) : (
							<p className='contact-text'>
								{userData.contactNumber || 'No contact number added yet.'}
							</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default UserProfilePage;
