import React from 'react'
import CustomPieChart from '../Cards/Charts/CustomPieChart'
const COLORS=["#875CF5","#FA2C37","#FF6900"]

const FinanceOverview = ({totalBalance,totalIncome,totalExpense}) => {
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
    <div className='card card-lg'>
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h3 className='text-2xl font-bold text-gray-900 mb-2'>Financial Overview</h3>
          <p className='text-sm text-gray-600'>Your current financial status</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 mb-1">Net Balance</p>
          <p className="text-3xl font-bold text-gray-900">
            {formatCurrency(totalBalance)}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Total Income</p>
              <p className="text-lg font-bold text-green-800">{formatCurrency(totalIncome)}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-red-50 to-rose-50 border border-red-100 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-medium">Total Expenses</p>
              <p className="text-lg font-bold text-red-800">{formatCurrency(totalExpense)}</p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Net Balance</p>
              <p className="text-lg font-bold text-blue-800">{formatCurrency(totalBalance)}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-100/50 pt-6">
        <CustomPieChart
          data={balanceData}
          label="Financial Distribution"
          totalAmount={formatCurrency(totalBalance)}
          colors={COLORS}
          showTextAnchor
        />
      </div>
    </div>
  )
}

export default FinanceOverview
