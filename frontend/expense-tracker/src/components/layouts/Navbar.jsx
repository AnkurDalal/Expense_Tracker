import React, { useState } from 'react'
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi"
import SideMenu from './SideMenu.jsx'

const Navbar = ({ activeMenu }) => {
    const [openSideMenu, setOpenSideMenu] = useState(false)

    return (
        <div className="flex gap-5 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 py-4 px-7 sticky top-0 z-50 shadow-sm">
            <button
                className="block lg:hidden text-gray-700 hover:text-primary transition-colors"
                onClick={() => {
                    setOpenSideMenu(!openSideMenu)
                }}
            >
                {openSideMenu ? (
                    <HiOutlineX className="text-2xl" />
                ) : (
                    <HiOutlineMenu className="text-2xl" />
                )}
            </button>

            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                    <span className="text-white font-bold text-sm">ET</span>
                </div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Expense Tracker
                </h2>
            </div>

            {openSideMenu && (
                <div className="fixed top-[77px] left-0 w-64 bg-white/95 backdrop-blur-xl border-r border-gray-200/50 shadow-xl z-40 animate-slide-up">
                    <SideMenu activeMenu={activeMenu} />
                </div>
            )}
        </div>
    )
}

export default Navbar
