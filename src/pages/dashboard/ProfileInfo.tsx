import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const ProfileInfo: React.FC = () => {
  const { user, updateProfile, uploadProfilePicture, loading } = useAuth();
  const [profilePicture, setProfilePicture] = useState<File | string | null>(user?.profilePicture || null);
  const [name, setName] = useState(user?.name || '');

  useEffect(() => {
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

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    let success = true;

    // Update Name
    if (user && name !== user.name) {
      const nameUpdateSuccess = await updateProfile({ name });
      if (nameUpdateSuccess) {
        toast.success('Name updated successfully!');
      } else {
        success = false;
      }
    }

    // Upload Profile Picture
    if (typeof profilePicture === 'object' && profilePicture !== null) {
      const pictureUploadSuccess = await uploadProfilePicture(profilePicture);
      if (pictureUploadSuccess) {
        toast.success('Profile picture updated successfully!');
      } else {
        success = false;
      }
    }

    if (success && name === user?.name && (typeof profilePicture === 'string' || profilePicture === null)) {
      toast.success('No changes to save.');
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
    <form onSubmit={handleUpdate} className="space-y-8">
      {/* Profile Picture Upload Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Profile Picture</h3>
        <div className="flex items-center space-x-4">
          <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm overflow-hidden">
            {profilePicture ? (
              <img
                src={typeof profilePicture === 'string' ? profilePicture : URL.createObjectURL(profilePicture)}
                alt="Profile Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <span>No Image</span>
            )}
          </div>
          <label htmlFor="profile-picture-upload" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
            Upload New Picture
            <input
              type="file"
              id="profile-picture-upload"
              accept="image/*"
              onChange={handleProfilePictureChange}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Update Name Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Update Name</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your full name"
            />
          </div>
        </div>
      </div>

      <button type="submit" className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-md">
        Update & Save Profile
      </button>
    </form>
  );
};

export default ProfileInfo; 