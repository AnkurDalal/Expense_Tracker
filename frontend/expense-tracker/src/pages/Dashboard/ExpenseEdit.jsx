import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { useUserAuth } from '../../hooks/useUserAuth'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import toast from 'react-hot-toast'
import { useTheme } from '../../context/ThemeContext'

const ExpenseEdit = () => {
  useUserAuth()
  const navigate = useNavigate()
  const { id } = useParams()
  const { isDarkMode } = useTheme()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    date: '',
    description: ''
  })
  const [formErrors, setFormErrors] = useState({})

  // Fetch expense data
  const fetchExpense = async () => {
    setLoading(true)
    try {
      const response = await axiosInstance.get(API_PATHS.EXPENSE.GET_EXPENSE_BY_ID(id))
      
      if (response.data && response.data.success) {
        const expense = response.data.data
        setFormData({
          category: expense.category || '',
          amount: expense.amount || '',
          date: expense.date ? expense.date.split('T')[0] : '',
          description: expense.description || ''
        })
      } else {
        toast.error('Failed to load expense data')
        navigate('/expense')
      }
    } catch (error) {
      console.error('Error fetching expense:', error)
      toast.error('Failed to load expense data')
      navigate('/expense')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExpense()
  }, [id])

  const validateForm = () => {
    const errors = {}
    if (!formData.category.trim()) errors.category = 'Category is required'
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
      const response = await axiosInstance.put(API_PATHS.EXPENSE.UPDATE_EXPENSE(id), {
        ...formData,
        amount: Number(formData.amount)
      })
      
      if (response.data && response.data.success) {
        toast.success('Expense updated successfully')
        navigate('/expense')
      } else {
        toast.error('Failed to update expense')
      }
    } catch (error) {
      console.error('Error updating expense:', error)
      
      if (error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else if (error.response?.data?.errors) {
        const errorMsg = error.response.data.errors.map(err => err.message).join(', ')
        toast.error(errorMsg)
      } else {
        toast.error('Failed to update expense')
      }
    }
  }

  const handleCancel = () => {
    navigate('/expense')
  }

  return (
    <DashboardLayout activeMenu="Expense">
      <div className='container-custom'>
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Edit Expense</h1>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Update your expense details</p>
            </div>
          </div>
        </div>

        {/* Edit Expense Form */}
        {loading ? (
          <div className={`rounded-2xl shadow-lg p-8 border ${
            isDarkMode ? 'bg-gray-800 border-gray-700/50' : 'bg-white border-gray-100'
          }`}>
            <div className="flex justify-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-4`}>Loading expense data...</p>
          </div>
        ) : (
          <div className={`rounded-2xl shadow-lg p-6 border ${
            isDarkMode ? 'bg-gray-800 border-gray-700/50' : 'bg-white border-gray-100'
          }`}>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className={`w-full border-2 rounded-lg px-4 py-2 focus:outline-none focus:border-primary transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-primary' 
                      : 'bg-white border-gray-200 text-gray-900 focus:border-primary'
                  }`}
                  placeholder="e.g., Food, Transport, Bills"
                />
                {formErrors.category && <p className="text-red-600 text-sm">{formErrors.category}</p>}
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
              
              <div className="space-y-2">
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Description (Optional)</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className={`w-full border-2 rounded-lg px-4 py-2 focus:outline-none focus:border-primary transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-primary' 
                      : 'bg-white border-gray-200 text-gray-900 focus:border-primary'
                  }`}
                  placeholder="Additional details"
                />
              </div>
              
              <div className="md:col-span-2 flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  className={`px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300 flex-1 ${
                    isDarkMode 
                      ? 'bg-gradient-to-r from-red-600 to-pink-700 text-white' 
                      : 'bg-gradient-to-r from-red-500 to-pink-600 text-white'
                  }`}
                >
                  Update Expense
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className={`px-6 py-2 rounded-lg transition-colors flex-1 ${
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
      </div>
    </DashboardLayout>
  )
}

export default ExpenseEdit