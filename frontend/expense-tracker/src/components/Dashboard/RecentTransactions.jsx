import React from 'react'
import { LuArrowRight, LuHistory } from 'react-icons/lu'
import moment from 'moment'
import TransactionsInfoCard from '../Cards/TransactionsInfoCard'
import { useTheme } from '../../context/ThemeContext'

const RecentTransactions = ({ transactions, onSeeMore }) => {
    const { isDarkMode } = useTheme()
    console.log(transactions)
    
    if (!transactions || transactions.length === 0) {
        return (
            <div className={`card card-lg ${isDarkMode ? 'bg-gray-800 border-gray-700/50' : 'bg-white border-gray-100/50'}`}>
                <div className='flex items-center justify-between mb-6'>
                    <div>
                        <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Recent Transactions</h3>
                        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Your latest financial activities</p>
                    </div>
                    <button className={`flex items-center gap-2 ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`} onClick={onSeeMore}>
                        View All <LuArrowRight className='text-base'/>
                    </button>
                </div>

                <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className={`w-16 h-16 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-full flex items-center justify-center mb-4`}>
                        <LuHistory className={`w-8 h-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                    </div>
                    <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>No transactions yet</h4>
                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-6`}>Start tracking your income and expenses to see them here.</p>
                </div>
            </div>
        )
    }

  return (
    <div className={`card card-lg ${isDarkMode ? 'bg-gray-800 border-gray-700/50' : 'bg-white border-gray-100/50'}`}>
        <div className='flex items-center justify-between mb-6'>
            <div>
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Recent Transactions</h3>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Your latest financial activities</p>
            </div>
            <button className={`flex items-center gap-2 ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`} onClick={onSeeMore}>
                View All <LuArrowRight className='text-base'/>
            </button>
        </div>

        <div className='space-y-3'>
            {transactions?.slice(0,5)?.map((item) => (
                <TransactionsInfoCard
                  key={item._id}
                  title={item.type === 'expense' ? item.category : item.source}
                  icon={item.icon}
                  date={moment(item.date).format("Do MMM YYYY")}
                  amount={item.amount}
                  type={item.type}
                  hideDeleteBtn
                  isDarkMode={isDarkMode}
                />
            ))}
        </div>
    </div>
  )
}

export default RecentTransactions




