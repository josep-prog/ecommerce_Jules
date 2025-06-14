import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import ProfileInfo from './ProfileInfo';
import SecuritySettings from './SecuritySettings';

const UserProfile: React.FC = () => {
  const { user, updateProfile, uploadProfilePicture, loading } = useAuth();
  const [profilePicture, setProfilePicture] = useState<File | string | null>(user?.profilePicture || null);
  const [name, setName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const location = useLocation();

  // Update state when user data changes (e.g., after initial load or profile update)
  React.useEffect(() => {
    if (user) {
      setProfilePicture(user.profilePicture || null);
      setName(user.name || '');
    }
  }, [user]);

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePicture(file);
    }
  };

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user && name !== user.name) {
      const success = await updateProfile({ name });
      if (success) {
        toast.success('Name updated successfully!');
      }
    } else {
      toast.success('Name is already up to date.');
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      toast.error('All password fields are required.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error('New password and confirm password do not match.');
      return;
    }
    // In a real application, you'd send currentPassword, newPassword to backend for verification and update
    console.log('Updating password:', { currentPassword, newPassword });
    toast.success('Password update initiated (backend integration needed).');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  const handleUploadProfilePicture = async () => {
    if (typeof profilePicture === 'object' && profilePicture !== null) {
      const success = await uploadProfilePicture(profilePicture);
      if (success) {
        toast.success('Profile picture updated successfully!');
        // The setUser in AuthContext will trigger the useEffect to update profilePicture state
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-gray-700 dark:text-gray-300">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        <p>User data not available. Please log in.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Profile Settings</h2>

      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <Link
            to="/dashboard/profile"
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              location.pathname === '/dashboard/profile'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            Profile
          </Link>
          <Link
            to="/dashboard/profile/security"
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              location.pathname === '/dashboard/profile/security'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            Security
          </Link>
        </nav>
      </div>

      <Routes>
        <Route path="/" element={<ProfileInfo />} />
        <Route path="/security" element={<SecuritySettings />} />
      </Routes>
    </div>
  );
};

export default UserProfile; 