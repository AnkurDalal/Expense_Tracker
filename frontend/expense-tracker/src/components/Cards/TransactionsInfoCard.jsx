import React from 'react'
import { LuTrash2, LuTrendingDown, LuTrendingUp, LuUtensils } from 'react-icons/lu'

const TransactionsInfoCard = ({
    title,
    icon,
    date,
    amount,
    type,
    hideDeleteBtn,
    onDelete,
    isDarkMode
}) => {

    const getAmountStyles = () =>
        type === "income"
            ? isDarkMode ? "bg-green-900/30 text-green-300 border-green-800/50" : "bg-green-50 text-green-500 border-green-200"
            : isDarkMode ? "bg-red-900/30 text-red-300 border-red-800/50" : "bg-red-50 text-red-500 border-red-200"

    return (
        <div className={`group relative flex items-center gap-4 mt-2 p-4 rounded-xl transition-all duration-200 ${
            isDarkMode 
                ? 'hover:bg-gray-700/50 border-gray-700/50 hover:border-gray-600/50' 
                : 'hover:bg-gray-50/80 border-gray-100/50 hover:border-gray-200/50'
        }`}>
            <div className={`w-14 h-14 flex items-center justify-center text-xl ${
                isDarkMode ? 'text-gray-200 bg-gray-700' : 'text-gray-800 bg-gray-50'
            } rounded-xl shadow-sm`}>
                {icon ? (
                    <img src={icon} alt={title} className='w-6 h-6' />
                ) : (
                    <LuUtensils />
                )}
            </div>

            <div className='flex-1 flex items-center justify-between'>
                <div>
                    <p className={`text-sm font-semibold ${
                        isDarkMode ? 'text-white group-hover:text-gray-200' : 'text-gray-900 group-hover:text-gray-800'
                    } transition-colors`}>
                        {title}
                    </p>
                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-400'} mt-1`}>{date}</p>
                </div>

                <div className='flex items-center gap-2'>
                    {!hideDeleteBtn && (
                        <button
                            className={`${
                                isDarkMode 
                                    ? 'text-gray-400 hover:text-red-400 hover:bg-red-900/30' 
                                    : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                            } p-2 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100`}
                            onClick={onDelete}
                            title="Delete transaction"
                        >
                            <LuTrash2 size={18} />
                        </button>
                    )}

                    <div className={`flex items-center gap-3 px-4 py-2 rounded-lg ${getAmountStyles()}`}>
                        <span className='text-sm font-bold tracking-wide'>
                            {type === "income" ? "+" : "-"}₹{new Intl.NumberFormat('en-IN').format(amount)}
                        </span>
                        {type === "income" ? (
                            <div className={`w-8 h-8 ${
                                isDarkMode ? 'bg-green-800/30 text-green-300' : 'bg-green-100 text-green-600'
                            } rounded-full flex items-center justify-center`}>
                                <LuTrendingUp size={16} />
                            </div>
                        ) : (
                            <div className={`w-8 h-8 ${
                                isDarkMode ? 'bg-red-800/30 text-red-300' : 'bg-red-100 text-red-600'
                            } rounded-full flex items-center justify-center`}>
                                <LuTrendingDown size={16} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TransactionsInfoCard




