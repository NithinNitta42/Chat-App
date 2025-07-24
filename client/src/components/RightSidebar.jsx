import React, { useContext, useEffect, useState } from 'react'
import assets, { imagesDummyData } from '../assets/assets'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'

const RightSidebar = () => {
  const { selectedUser, messages } = useContext(ChatContext)
  const { logout, onlineUsers } = useContext(AuthContext)
  const [msgImages, setMsgImages] = useState([])
  const [imageModalOpen, setImageModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)

  // Get all the images from the messages and set them to state
  useEffect(() => {
    setMsgImages(
      messages.filter(msg => msg.image).map(msg => msg.image)
    )
  }, [messages])

  const handleImageClick = (url) => {
    setSelectedImage(url)
    setImageModalOpen(true)
  }

  const closeModal = () => {
    setImageModalOpen(false)
    setSelectedImage(null)
  }

  return selectedUser && (
    <>
      <div className={`bg-gradient-to-b from-[#8185B2]/5 to-[#8185B2]/15 backdrop-blur-sm text-white w-full relative overflow-hidden ${selectedUser ? "max-md:hidden" : ""}`}>
        {/* Custom scrollbar container */}
        <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30">
          
          {/* User Profile Section */}
          <div className='pt-8 pb-6 flex flex-col items-center gap-4 text-xs font-light mx-auto px-6'>
            <div className="relative group">
              <img 
                src={selectedUser?.profilePic || assets.avatar_icon} 
                alt="Profile"
                className='w-24 h-24 rounded-full object-cover border-4 border-white/20 shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:border-white/30'
              />
              {/* Online indicator with pulse animation */}
              {onlineUsers.includes(selectedUser._id) && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white/20 flex items-center justify-center">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
            
            <div className="text-center space-y-2">
              <h1 className='text-xl font-semibold text-white/90 flex items-center justify-center gap-2'>
                {selectedUser.fullName}
              </h1>
              <p className='text-white/70 text-sm leading-relaxed max-w-xs'>
                {selectedUser.bio || "No bio available"}
              </p>
              <div className="flex items-center justify-center gap-2 text-xs">
                <div className={`w-2 h-2 rounded-full ${onlineUsers.includes(selectedUser._id) ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                <span className="text-white/60">
                  {onlineUsers.includes(selectedUser._id) ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="px-6">
            <hr className='border-white/20 border-t-2'/>
          </div>

          {/* Media Section */}
          <div className='px-6 py-6'>
            <div className="flex items-center justify-between mb-4">
              <h3 className='text-sm font-medium text-white/90'>Shared Media</h3>
              <span className='text-xs text-white/60 bg-white/10 px-2 py-1 rounded-full'>
                {msgImages.length} items
              </span>
            </div>
            
            {msgImages.length > 0 ? (
              <div className='max-h-[250px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent'>
                <div className='grid grid-cols-2 gap-3'>
                  {msgImages.map((url, index) => (
                    <div 
                      key={index} 
                      onClick={() => handleImageClick(url)}
                      className='group cursor-pointer rounded-lg overflow-hidden bg-white/5 hover:bg-white/10 transition-all duration-300 transform hover:scale-105 hover:shadow-lg'
                    >
                      <img 
                        src={url} 
                        alt={`Shared media ${index + 1}`}
                        className='w-full h-20 object-cover group-hover:brightness-110 transition-all duration-300'
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-white/50">
                <div className="text-2xl mb-2">🖼️</div>
                <p className="text-sm">No shared media yet</p>
              </div>
            )}
          </div>

          {/* Spacer to ensure logout button doesn't overlap content */}
          <div className="h-20"></div>
        </div>

        {/* Logout Button - Fixed at bottom */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#8185B2]/20 to-transparent p-6">
          <button 
            onClick={() => logout()} 
            className='w-full bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white border-none text-sm font-medium py-3 px-8 rounded-full cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95'
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </span>
          </button>
        </div>
      </div>

      {/* Image Modal */}
      {imageModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div 
            className="relative max-w-4xl max-h-[90vh] p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute -top-2 -right-2 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all duration-200 z-10"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img 
              src={selectedImage} 
              alt="Enlarged view"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  )
}

export default RightSidebar