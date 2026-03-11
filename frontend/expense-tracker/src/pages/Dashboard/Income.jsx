import React, { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { useUserAuth } from '../../hooks/useUserAuth'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import { addThousandSeparator } from '../../utils/helper'
import toast from 'react-hot-toast'
import { IoMdAdd } from "react-icons/io"
import { MdDelete } from "react-icons/md"
import { FaEdit } from "react-icons/fa"
import { useTheme } from '../../context/ThemeContext'

const Income = () => {
  useUserAuth()
  const navigate = useNavigate()
  const { isDarkMode } = useTheme()
  const [incomes, setIncomes] = useState([])
  const [loading, setLoading] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    source: '',
    amount: '',
    date: ''
  })
  const [formErrors, setFormErrors] = useState({})
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false
  })

  const fetchIncomes = async (page = 1) => {
    setLoading(true)
    try {
      const response = await axiosInstance.get(`${API_PATHS.INCOME.GET_ALL_INCOME}?page=${page}&limit=10`)
      
      if (response.data && response.data.success) {
        setIncomes(response.data.data.income || [])
        setPagination(response.data.data.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          hasNextPage: false,
          hasPrevPage: false
        })
      } else {
        toast.error('Failed to load income data')
      }
    } catch (error) {
      console.error('Error fetching incomes:', error)
      toast.error('Failed to load income data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIncomes()
  }, [])

  const validateForm = () => {
    const errors = {}
    if (!formData.source.trim()) errors.source = 'Source is required'
    if (!formData.amount || formData.amount <= 0) errors.amount = 'Valid amount is required'
    if (!formData.date) errors.date = 'Date is required'
    return errors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    try {
      const response = await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
        ...formData,
        amount: Number(formData.amount)
      })
      
      if (response.data && response.data.success) {
        toast.success('Income added successfully')
        setFormData({ source: '', amount: '', date: '' })
        setFormErrors({})
        setShowAddForm(false)
        fetchIncomes(pagination.currentPage)
      } else {
        toast.error('Failed to add income')
      }
    } catch (error) {
      console.error('Error adding income:', error)
      
      if (error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else if (error.response?.data?.errors) {
        const errorMsg = error.response.data.errors.map(err => err.message).join(', ')
        toast.error(errorMsg)
      } else {
        toast.error('Failed to add income')
      }
    }
  }

  const handleDelete = async (incomeId) => {
    if (!window.confirm('Are you sure you want to delete this income?')) return
    
    try {
      const response = await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(incomeId))
      
      if (response.data && response.data.success) {
        toast.success('Income deleted successfully')
        fetchIncomes(pagination.currentPage)
      } else {
        toast.error('Failed to delete income')
      }
    } catch (error) {
      console.error('Error deleting income:', error)
      toast.error('Failed to delete income')
    }
  }

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchIncomes(page)
    }
  }

  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0)

  return (
    <DashboardLayout activeMenu="Income">
      <div className='container-custom'>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Income Management</h1>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Track and manage your income sources</p>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className={`px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex items-center gap-2 ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-green-600 to-emerald-700 text-white' 
                  : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
              }`}
            >
              <IoMdAdd size={20} />
              Add Income
            </button>
          </div>
        </div>

        {/* Add Income Form */}
        {showAddForm && (
          <div className={`rounded-2xl shadow-lg p-6 mb-8 border ${
            isDarkMode ? 'bg-gray-800 border-gray-700/50' : 'bg-white border-gray-100'
          }`}>
            <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Add New Income</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Source</label>
                <input
                  type="text"
                  value={formData.source}
                  onChange={(e) => setFormData({...formData, source: e.target.value})}
                  className={`w-full border-2 rounded-lg px-4 py-2 focus:outline-none focus:border-primary transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-primary' 
                      : 'bg-white border-gray-200 text-gray-900 focus:border-primary'
                  }`}
                  placeholder="e.g., Salary, Freelance, Investment"
                />
                {formErrors.source && <p className="text-red-600 text-sm">{formErrors.source}</p>}
              </div>
              
              <div className="space-y-2">
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Amount</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  className={`w-full border-2 rounded-lg px-4 py-2 focus:outline-none focus:border-primary transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-primary' 
                      : 'bg-white border-gray-200 text-gray-900 focus:border-primary'
                  }`}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
                {formErrors.amount && <p className="text-red-600 text-sm">{formErrors.amount}</p>}
              </div>
              
              <div className="space-y-2">
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className={`w-full border-2 rounded-lg px-4 py-2 focus:outline-none focus:border-primary transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-primary' 
                      : 'bg-white border-gray-200 text-gray-900 focus:border-primary'
                  }`}
                />
                {formErrors.date && <p className="text-red-600 text-sm">{formErrors.date}</p>}
              </div>
              
              <div className="md:col-span-2 flex gap-4">
                <button
                  type="submit"
                  className={`px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-gradient-to-r from-green-600 to-emerald-700 text-white' 
                      : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                  }`}
                >
                  Add Income
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false)
                    setFormData({ source: '', amount: '', date: '' })
                    setFormErrors({})
                  }}
                  className={`px-6 py-2 rounded-lg transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Summary Card */}
        <div className={`p-6 rounded-2xl mb-8 shadow-lg ${
          isDarkMode 
            ? 'bg-gradient-to-r from-green-600 to-emerald-700 text-white' 
            : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">Total Income</h3>
              <p className={`${isDarkMode ? 'text-green-200' : 'text-green-100'}`}>All income sources combined</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">{addThousandSeparator(totalIncome)}</p>
              <p className={`${isDarkMode ? 'text-green-200' : 'text-green-100'} text-sm`}>INR</p>
            </div>
          </div>
        </div>

        {/* Income List */}
        <div className={`rounded-2xl shadow-lg border overflow-hidden ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700/50' 
            : 'bg-white border-gray-100'
        }`}>
          <div className={`p-6 border-b ${
            isDarkMode ? 'border-gray-700/50' : 'border-gray-100'
          }`}>
            <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Income History</h2>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-4`}>Loading incomes...</p>
            </div>
          ) : incomes.length === 0 ? (
            <div className="p-8 text-center">
              <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-400'} mb-2`}>No income records found</div>
              <p className={`${isDarkMode ? 'text-gray-500' : 'text-gray-500'} text-sm`}>Add your first income to get started</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`${isDarkMode ? 'bg-gray-800 divide-y divide-gray-700/50' : 'bg-white divide-y divide-gray-200'}`}>
                    {incomes.map((income) => (
                      <tr key={income._id} className={`${isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'} transition-colors`}>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {income.source}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                          isDarkMode ? 'text-green-400' : 'text-green-600'
                        }`}>
                          +{addThousandSeparator(income.amount)}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {new Date(income.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => navigate(`/income/edit/${income._id}`)}
                            className={`${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-900'} transition-colors`}
                          >
                            <FaEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(income._id)}
                            className={`${isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-900'} transition-colors`}
                          >
                            <MdDelete size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className={`p-6 border-t ${
                  isDarkMode ? 'border-gray-700/50' : 'border-gray-100'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className={`text-sm ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Showing {((pagination.currentPage - 1) * 10) + 1} to {Math.min(pagination.currentPage * 10, pagination.totalItems)} of {pagination.totalItems} results
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={!pagination.hasPrevPage}
                        className={`px-4 py-2 rounded-lg border transition-colors ${
                          pagination.hasPrevPage 
                            ? isDarkMode 
                              ? 'border-gray-600 hover:bg-gray-700 text-gray-300' 
                              : 'border-gray-300 hover:bg-gray-50 text-gray-700' 
                            : isDarkMode 
                              ? 'border-gray-700/50 text-gray-500 cursor-not-allowed' 
                              : 'border-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={!pagination.hasNextPage}
                        className={`px-4 py-2 rounded-lg border transition-colors ${
                          pagination.hasNextPage 
                            ? isDarkMode 
                              ? 'border-gray-600 hover:bg-gray-700 text-gray-300' 
                              : 'border-gray-300 hover:bg-gray-50 text-gray-700' 
                            : isDarkMode 
                              ? 'border-gray-700/50 text-gray-500 cursor-not-allowed' 
                              : 'border-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Income
