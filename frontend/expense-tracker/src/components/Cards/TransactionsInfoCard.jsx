import React from 'react'
import { LuTrash2, LuTrendingDown, LuTrendingUp, LuUtensils } from 'react-icons/lu'

const TransactionsInfoCard = ({
    title,
    icon,
    date,
    amount,
    type,
    hideDeleteBtn,
    onDelete
}) => {

    const getAmountStyles = () =>
        type === "income"
            ? "bg-green-50 text-green-500"
            : "bg-red-50 text-red-500"

    return (
<div className='group relative flex items-center gap-4 mt-2 p-4 rounded-xl hover:bg-gray-50/80 transition-all duration-200 border border-gray-100/50 hover:border-gray-200/50'>

<div className='w-14 h-14 flex items-center justify-center text-xl text-gray-800 bg-gray-50 rounded-xl shadow-sm'>
                {icon ? (
                    <img src={icon} alt={title} className='w-6 h-6' />
                ) : (
                    <LuUtensils />
                )}
            </div>

            <div className='flex-1 flex items-center justify-between'>
                <div>
<p className='text-sm font-semibold text-gray-900 group-hover:text-gray-800 transition-colors'>
                        {title}
                    </p>
                    <p className='text-xs text-gray-400 mt-1'>{date}</p>
                </div>

                <div className='flex items-center gap-2'>

                    {!hideDeleteBtn && (
<button
                            className='text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100'
                            onClick={onDelete}
                            title="Delete transaction"
                        >
                            <LuTrash2 size={18} />
                        </button>
                    )}

                    <div className={`flex items-center gap-3 px-4 py-2 rounded-lg ${getAmountStyles()} border`}>
                        <span className='text-sm font-bold tracking-wide'>
                            {type === "income" ? "+" : "-"}₹{new Intl.NumberFormat('en-IN').format(amount)}
                        </span>
                        {type === "income" ? (
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                <LuTrendingUp size={16} />
                            </div>
                        ) : (
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600">
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




