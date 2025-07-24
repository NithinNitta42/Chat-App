import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets';
import { AuthContext } from '../../context/AuthContext.jsx';
import { Camera, Edit3, Save, ArrowLeft, User } from 'lucide-react';

const ProfilePage = () => {
  const { authUser, updateProfile } = useContext(AuthContext);
  const [selectedImg, setSelectedImg] = useState(null);
  const [name, setName] = useState(authUser.fullName);
  const [bio, setBio] = useState(authUser.bio);
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImg(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!selectedImg) {
        await updateProfile({ fullName: name, bio });
        navigate('/');
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(selectedImg);
      reader.onload = async () => {
        const base64Image = reader.result;
        await updateProfile({ profilePic: base64Image, fullName: name, bio });
        navigate('/');
      };
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const currentProfileImage = previewImage || authUser?.profilePic || assets.logo_icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-200 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="text-sm font-medium">Back to Home</span>
          </button>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gray-900/80 p-6 border-b border-gray-700">
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <User className="w-6 h-6" />
              Profile Settings
            </h1>
            <p className="text-gray-300 mt-2">Update your profile information and photo</p>
          </div>

          <div className="p-8">
            <div className="max-w-md mx-auto">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-200">
                    Profile Picture
                  </label>
                  <label htmlFor="avatar" className="relative group cursor-pointer inline-block">
                    <input
                      onChange={handleImageChange}
                      type="file"
                      id="avatar"
                      accept=".png, .jpg, .jpeg"
                      className="hidden"
                    />
                    <div className="relative">
                      <img
                        src={previewImage || authUser?.profilePic || assets.avatar_icon}
                        alt="Profile"
                        className="w-20 h-20 rounded-full object-cover border-2 border-gray-600 group-hover:border-gray-400 transition-all duration-300"
                      />
                      <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Camera className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-300 group-hover:text-gray-100 transition-colors duration-200 flex items-center gap-2">
                      <Camera className="w-4 h-4" />
                      {selectedImg ? 'Change photo' : 'Upload photo'}
                    </div>
                  </label>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-200">Full Name</label>
                  <div className="relative">
                    <input
                      onChange={(e) => setName(e.target.value)}
                      value={name}
                      type="text"
                      required
                      placeholder="Enter your full name"
                      className="w-full p-4 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                    />
                    <User className="absolute right-4 top-4 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-200">Bio</label>
                  <div className="relative">
                    <textarea
                      onChange={(e) => setBio(e.target.value)}
                      value={bio}
                      placeholder="Tell us about yourself..."
                      required
                      rows={4}
                      className="w-full p-4 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 resize-none"
                    />
                    <Edit3 className="absolute right-4 top-4 w-5 h-5 text-gray-400" />
                  </div>
                  <div className="text-right text-sm text-gray-400">
                    {bio.length}/500 characters
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-violet-700 hover:from-purple-500 hover:to-violet-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 shadow-lg hover:shadow-violet-500/25"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Profile
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
