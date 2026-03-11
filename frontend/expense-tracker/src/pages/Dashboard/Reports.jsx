  import React, { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { useUserAuth } from '../../hooks/useUserAuth'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import { addThousandSeparator } from '../../utils/helper'
import toast from 'react-hot-toast'
import { LuDownload, LuCalendar, LuTrendingUp, LuTrendingDown } from "react-icons/lu"
import { FiPieChart, FiBarChart2 } from "react-icons/fi"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'

const Reports = () => {
  useUserAuth()
  const navigate = useNavigate()
  
  const [incomeData, setIncomeData] = useState([])
  const [expenseData, setExpenseData] = useState([])
  const [loading, setLoading] = useState(false)
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  })

  const fetchReportsData = async () => {
    setLoading(true)
    try {
      const [incomeResponse, expenseResponse] = await Promise.all([
        axiosInstance.get(API_PATHS.INCOME.GET_ALL_INCOME),
        axiosInstance.get(API_PATHS.EXPENSE.GET_ALL_EXPENSE)
      ])
      
      setIncomeData(incomeResponse.data.data?.incomes || incomeResponse.data.incomes || [])
      setExpenseData(expenseResponse.data.data?.expenses || expenseResponse.data.expenses || [])
    } catch (error) {
      console.error('Error fetching reports data:', error)
      toast.error('Failed to load reports data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReportsData()
  }, [])

  // Calculate totals
  const totalIncome = incomeData.reduce((sum, income) => sum + income.amount, 0)
  const totalExpense = expenseData.reduce((sum, expense) => sum + expense.amount, 0)
  const netSavings = totalIncome - totalExpense

  // Group income by source
  const incomeBySource = incomeData.reduce((acc, income) => {
    const source = income.source || 'Unknown'
    acc[source] = (acc[source] || 0) + income.amount
    return acc
  }, {})

  const incomeChartData = Object.entries(incomeBySource).map(([name, value]) => ({
    name, value
  }))

  // Group expense by category
  const expenseByCategory = expenseData.reduce((acc, expense) => {
    const category = expense.category || 'Unknown'
    acc[category] = (acc[category] || 0) + expense.amount
    return acc
  }, {})

  const expenseChartData = Object.entries(expenseByCategory).map(([name, value]) => ({
    name, value
  }))

  // Monthly data for trend analysis
  const getMonthlyData = (data, isIncome = true) => {
    const monthlyData = {}
    
    data.forEach(item => {
      const date = new Date(item.date)
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`
      
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { income: 0, expense: 0 }
      }
      
      if (isIncome) {
        monthlyData[monthYear].income += item.amount
      } else {
        monthlyData[monthYear].expense += item.amount
      }
    })

    return Object.entries(monthlyData).map(([month, values]) => ({
      month,
      income: values.income,
      expense: values.expense,
      savings: values.income - values.expense
    })).sort((a, b) => new Date(a.month) - new Date(b.month))
  }

  const monthlyData = getMonthlyData([...incomeData, ...expenseData.map(e => ({...e, amount: -e.amount}))])

  // Download reports
  const downloadIncomeReport = async () => {
    try {
      await axiosInstance.get(API_PATHS.INCOME.DOWNLOAD_INCOME, { responseType: 'blob' })
      toast.success('Income report downloaded')
    } catch (error) {
      console.error('Error downloading income report:', error)
      toast.error('Failed to download income report')
    }
  }

  const downloadExpenseReport = async () => {
    try {
      await axiosInstance.get(API_PATHS.EXPENSE.DOWNLOAD_EXPENSE, { responseType: 'blob' })
      toast.success('Expense report downloaded')
    } catch (error) {
      console.error('Error downloading expense report:', error)
      toast.error('Failed to download expense report')
    }
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

  return (
    <DashboardLayout activeMenu="Reports">
      <div className='container-custom'>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Financial Reports</h1>
              <p className="text-gray-600">Detailed analytics and insights for your finances</p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">Total Income</h3>
                <p className="text-green-100">All income sources</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">₹{addThousandSeparator(totalIncome)}</p>
                <p className="text-green-100 text-sm">INR</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">Total Expenses</h3>
                <p className="text-red-100">All expense categories</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">₹{addThousandSeparator(totalExpense)}</p>
                <p className="text-red-100 text-sm">INR</p>
              </div>
            </div>
          </div>
          
          <div className={`bg-gradient-to-r from-blue-500 to-cyan-600 text-white p-6 rounded-2xl shadow-lg ${netSavings >= 0 ? 'from-green-500 to-emerald-600' : 'from-red-500 to-pink-600'}`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">Net Savings</h3>
                <p className="text-blue-100">Income - Expenses</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">₹{addThousandSeparator(netSavings)}</p>
                <p className="text-blue-100 text-sm">INR</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Income Distribution */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FiPieChart size={24} />
              Income Distribution by Source
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={incomeChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {incomeChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${addThousandSeparator(value)}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Expense Distribution */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FiBarChart2 size={24} />
              Expense Distribution by Category
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={expenseChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `${addThousandSeparator(value)}`} />
                  <Tooltip formatter={(value) => `₹${addThousandSeparator(value)}`} />
                  <Bar dataKey="value" fill="#FF8042" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Trend Analysis */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <LuTrendingUp size={24} />
            Monthly Trend Analysis
          </h2>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `${addThousandSeparator(value)}`} />
                <Tooltip formatter={(value) => `₹${addThousandSeparator(value)}`} />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="#00C49F" strokeWidth={2} dot={{ fill: '#00C49F' }} />
                <Line type="monotone" dataKey="expense" stroke="#FF8042" strokeWidth={2} dot={{ fill: '#FF8042' }} />
                <Line type="monotone" dataKey="savings" stroke="#8884D8" strokeWidth={2} dot={{ fill: '#8884D8' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Income Sources */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold">Top Income Sources</h2>
            </div>
            <div className="p-6">
              {incomeChartData.slice(0, 5).map((item, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">{((item.value / totalIncome) * 100).toFixed(1)}% of total</p>
                  </div>
                  <p className="font-semibold text-green-600">₹{addThousandSeparator(item.value)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Top Expense Categories */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold">Top Expense Categories</h2>
            </div>
            <div className="p-6">
              {expenseChartData.slice(0, 5).map((item, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">{((item.value / totalExpense) * 100).toFixed(1)}% of total</p>
                  </div>
                  <p className="font-semibold text-red-600">₹{addThousandSeparator(item.value)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Reports