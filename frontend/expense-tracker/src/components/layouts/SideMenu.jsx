
import React, { useContext } from 'react'
import { SIDE_MENU_DATA } from '../../utils/data'
import { UserContext } from '../../context/UserContext'
import { useNavigate } from "react-router-dom"
import CharAvatar from '../Cards/CharAvatar.jsx'

const SideMenu = ({ activeMenu }) => {
    const { user, clearUser } = useContext(UserContext)
    const navigate = useNavigate()

    const handleClick = (route) => {
        if (route === "logout") {
            handleLogout()
            return
        }
        navigate(route)
    }

    const handleLogout = () => {
        localStorage.clear()
        clearUser()
        navigate("/login")
    }

    return (
        <div className='w-64 h-[calc(100vh-77px)] bg-gradient-to-b from-white to-gray-50 border-r border-gray-200/50 p-6 sticky top-[77px] z-30 shadow-sm'>
            <div className='flex flex-col items-center justify-center gap-4 mt-2 mb-8'>
                {user?.profileImageUrl ? (
                    <img
                        src={user?.profileImageUrl || ""}
                        alt='Profile Image'
                        className='w-20 h-20 bg-gradient-to-br from-primary to-purple-600 rounded-2xl shadow-lg shadow-primary/20 object-cover'
                    />
                ) : (
                    <CharAvatar
                        fullName={user?.fullName}
                        width="w-20"
                        height="h-20"
                        style="text-xl"
                    />
                )}
                <div className="text-center">
                    <h5 className='text-lg font-bold text-gray-900'>{user?.fullName || "Guest"}</h5>
                    <p className='text-sm text-gray-600'>{user?.email || "Not logged in"}</p>
                </div>
            </div>

            <nav className="space-y-2">
                {SIDE_MENU_DATA.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = activeMenu === item.label;

                    return (
                        <button
                            key={`menu_${index}`}
                            className={`w-full flex items-center gap-4 text-sm font-medium transition-all duration-200 ${
                                isActive 
                                    ? "text-white bg-gradient-to-r from-primary to-purple-600 shadow-lg shadow-primary/20" 
                                    : "text-gray-700 hover:text-primary hover:bg-primary/10"
                            } py-3 px-4 rounded-xl`}
                            onClick={() => handleClick(item.path)}
                        >
                            <Icon className={`text-lg ${isActive ? "text-white" : "text-primary"}`} />
                            <span className="flex-1 text-left">{item.label}</span>
                        </button>
                    )
                })}
            </nav>

            <div className="mt-8 pt-6 border-t border-gray-200/50">
                <button
                    className="w-full flex items-center gap-4 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200 py-3 px-4 rounded-xl"
                    onClick={handleLogout}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="flex-1 text-left">Logout</span>
                </button>
            </div>
        </div>
    )
}

export default SideMenu
