import React from 'react'
import CustomPieChart from '../Cards/Charts/CustomPieChart'
import { useTheme } from '../../context/ThemeContext'

const COLORS=["#875CF5","#FA2C37","#FF6900"]

const FinanceOverview = ({totalBalance,totalIncome,totalExpense}) => {
  const { isDarkMode } = useTheme()
  const balanceData=[
    {name:"Total Balance",amount:totalBalance},
    {name:"Total Expenses",amount:totalExpense},
    {name:"Total Income",amount:totalIncome}
  ]
  
  // Format number with commas
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className={`card card-lg ${isDarkMode ? 'bg-gray-800 border-gray-700/50' : 'bg-white border-gray-100/50'}`}>
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Financial Overview</h3>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Your current financial status</p>
        </div>
        <div className="text-right">
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Net Balance</p>
          <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {formatCurrency(totalBalance)}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className={`border rounded-xl p-4 ${
          isDarkMode 
            ? 'bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-green-800/50' 
            : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-100'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${
                isDarkMode ? 'text-green-300' : 'text-green-600'
              }`}>Total Income</p>
              <p className={`text-lg font-bold ${
                isDarkMode ? 'text-green-200' : 'text-green-800'
              }`}>{formatCurrency(totalIncome)}</p>
            </div>
            <div className={`w-10 h-10 ${
              isDarkMode ? 'bg-green-800/30' : 'bg-green-100'
            } rounded-full flex items-center justify-center`}>
              <svg className={`w-6 h-6 ${
                isDarkMode ? 'text-green-300' : 'text-green-600'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className={`border rounded-xl p-4 ${
          isDarkMode 
            ? 'bg-gradient-to-br from-red-900/30 to-rose-900/30 border-red-800/50' 
            : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-100'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${
                isDarkMode ? 'text-red-300' : 'text-red-600'
              }`}>Total Expenses</p>
              <p className={`text-lg font-bold ${
                isDarkMode ? 'text-red-200' : 'text-red-800'
              }`}>{formatCurrency(totalExpense)}</p>
            </div>
            <div className={`w-10 h-10 ${
              isDarkMode ? 'bg-red-800/30' : 'bg-red-100'
            } rounded-full flex items-center justify-center`}>
              <svg className={`w-6 h-6 ${
                isDarkMode ? 'text-red-300' : 'text-red-600'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className={`border rounded-xl p-4 ${
          isDarkMode 
            ? 'bg-gradient-to-br from-blue-900/30 to-indigo-900/30 border-blue-800/50' 
            : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${
                isDarkMode ? 'text-blue-300' : 'text-blue-600'
              }`}>Net Balance</p>
              <p className={`text-lg font-bold ${
                isDarkMode ? 'text-blue-200' : 'text-blue-800'
              }`}>{formatCurrency(totalBalance)}</p>
            </div>
            <div className={`w-10 h-10 ${
              isDarkMode ? 'bg-blue-800/30' : 'bg-blue-100'
            } rounded-full flex items-center justify-center`}>
              <svg className={`w-6 h-6 ${
                isDarkMode ? 'text-blue-300' : 'text-blue-600'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <div className={`border-t pt-6 ${isDarkMode ? 'border-gray-700/50' : 'border-gray-100/50'}`}>
        <CustomPieChart
          data={balanceData}
          label="Financial Distribution"
          totalAmount={formatCurrency(totalBalance)}
          colors={COLORS}
          showTextAnchor
          isDarkMode={isDarkMode}
        />
      </div>
    </div>
  )
}

export default FinanceOverview
