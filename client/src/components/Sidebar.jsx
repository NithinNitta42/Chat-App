import React, { useContext, useEffect, useState } from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { ChatContext } from '../../context/ChatContext'

const Sidebar = () => {
    const { getUsers, users, selectedUser, setSelectedUser, unseenMessages, setUnseenMessages } = useContext(ChatContext)
    const { logout, onlineUsers } = useContext(AuthContext)

    const [input, setInput] = useState("")
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const navigate = useNavigate()

    const filteredUsers = input
        ? users.filter((user) => user.fullName.toLowerCase().includes(input.toLowerCase()))
        : users

    useEffect(() => {
        getUsers()
    }, [onlineUsers])

    const handleUserSelect = (user) => {
        setSelectedUser(user)
        setUnseenMessages(prev => ({ ...prev, [user._id]: 0 }))
    }

    const handleNavigation = (path) => {
        navigate(path)
    }

    const handleLogout = () => {
        logout()
    }

    return (
        <div className={`bg-gradient-to-br from-[#8185B2]/15 to-[#8185B2]/5 h-full p-5 rounded-r-xl overflow-hidden text-white ${selectedUser ? "max-md:hidden" : ''} transition-all duration-300 ease-in-out backdrop-blur-sm border-r border-white/10`}>

            {/* Top Section */}
            <div className='pb-5'>
                <div className='flex justify-between items-center'>

                    {/* Logo */}
                    <div className="group cursor-pointer">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent hover:from-violet-300 hover:via-purple-300 hover:to-indigo-300 transition-all duration-300 tracking-wide transform hover:scale-105">
                            VOXA
                        </h1>
                        <div className="h-0.5 w-0 bg-gradient-to-r from-violet-400 to-purple-400 group-hover:w-full transition-all duration-300"></div>
                    </div>

                    {/* Dropdown Menu */}
                    <div className='relative'>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className='p-2 rounded-full hover:bg-white/10 transition-all duration-200 group'
                        >
                            <img
                                src={assets.menu_icon}
                                alt="Menu"
                                className='max-h-5 cursor-pointer group-hover:scale-110 transition-transform duration-200'
                            />
                        </button>

                        {/* Menu Items */}
                        <div className={`absolute top-full right-0 z-20 w-40 mt-2 rounded-xl bg-[#282142]/95 backdrop-blur-md border border-white/20 shadow-2xl overflow-hidden transition-all duration-300 ${isMenuOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'}`}>
                            <div className="p-2">
                                <button
                                    onClick={() => {
                                        handleNavigation('/profile')
                                        setIsMenuOpen(false)
                                    }}
                                    className='w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-white/10 transition-colors duration-200 flex items-center gap-2'
                                >
                                    <span className="w-2 h-2 bg-violet-400 rounded-full"></span>
                                    Edit Profile
                                </button>
                                <hr className='my-2 border-white/20' />
                                <button
                                    onClick={() => {
                                        handleLogout()
                                        setIsMenuOpen(false)
                                    }}
                                    className='w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-red-500/20 hover:text-red-400 transition-colors duration-200 flex items-center gap-2'
                                >
                                    <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search Input */}
                <div className='bg-[#282142]/80 backdrop-blur-sm rounded-full flex items-center gap-3 py-2 px-4 mt-5 border border-white/10 hover:border-white/20 transition-all duration-300 group'>
                    <img
                        src={assets.search_icon}
                        alt="Search"
                        className='w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity duration-200'
                    />
                    <input
                        onChange={(e) => setInput(e.target.value)}
                        type="text"
                        className='bg-transparent border-none outline-none text-white text-sm placeholder-[#c8c8c8] flex-1 placeholder:transition-colors placeholder:duration-200 focus:placeholder-white/50'
                        placeholder='Search users...'
                        value={input}
                    />
                    {input && (
                        <button
                            onClick={() => setInput("")}
                            className="text-white/50 hover:text-white/80 transition-colors duration-200"
                        >
                            ×
                        </button>
                    )}
                </div>
            </div>

            {/* Users List */}
            <div className='flex flex-col space-y-[6px] overflow-y-auto scrollbar-hide max-h-[calc(100vh-200px)]'>
                {filteredUsers.length === 0 ? (
                    <div className="text-center py-8 text-white/50">
                        <p>No users found</p>
                    </div>
                ) : (
                    filteredUsers.map((user, index) => (
                        <div
                            key={user._id}
                            onClick={() => handleUserSelect(user)}
                            className={`relative flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all duration-300 group hover:bg-white/10 hover:backdrop-blur-sm hover:scale-[1.015] hover:shadow-md ${
                                selectedUser?._id === user._id
                                    ? 'bg-gradient-to-r from-violet-500/20 to-purple-500/20 border border-violet-500/30 shadow-lg'
                                    : 'hover:border hover:border-white/20'
                            }`}
                            style={{
                                animationDelay: `${index * 0.08}s`,
                                animation: 'slideInRight 0.5s ease-out forwards'
                            }}
                        >
                            {/* Avatar */}
                            <div className="relative">
                                <img
                                    src={user?.profilePic || assets.avatar_icon}
                                    alt={user.fullName}
                                    className='w-9 h-9 rounded-full border-2 border-white/20 group-hover:border-white/40 transition-all duration-300 object-cover'
                                />
                                {onlineUsers.includes(user._id) && (
                                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#282142] animate-pulse"></div>
                                )}
                            </div>

                            {/* Info */}
                            <div className='flex-1 min-w-0'>
                                <p className='text-sm truncate group-hover:text-white transition-colors duration-200'>{user.fullName}</p>
                                <span className={`text-xs ${
                                    onlineUsers.includes(user._id)
                                        ? 'text-green-400 group-hover:text-green-300'
                                        : 'text-neutral-400 group-hover:text-neutral-300'
                                }`}>
                                    {onlineUsers.includes(user._id) ? 'Online' : 'Offline'}
                                </span>
                            </div>

                            {/* Unread badge */}
                            {unseenMessages[user._id] > 0 && (
                                <div className='flex items-center justify-center min-w-[18px] h-5 px-1.5 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 text-[11px] font-semibold animate-pulse shadow-md'>
                                    {unseenMessages[user._id] > 99 ? '99+' : unseenMessages[user._id]}
                                </div>
                            )}

                            {/* Hover Arrow */}
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <svg className="w-3.5 h-3.5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Custom Scrollbar & Animation */}
            <style jsx>{`
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                @keyframes slideInRight {
                    from {
                        opacity: 0;
                        transform: translateX(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
            `}</style>
        </div>
    )
}

export default Sidebar
