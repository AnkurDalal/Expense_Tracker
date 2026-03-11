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

const Expense = () => {
  useUserAuth()
  const navigate = useNavigate()
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    category: '',
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

  const fetchExpenses = async (page = 1) => {
    setLoading(true)
    try {
      const response = await axiosInstance.get(`${API_PATHS.EXPENSE.GET_ALL_EXPENSE}?page=${page}&limit=10`)
      
      if (response.data && response.data.success) {
        setExpenses(response.data.data.expenses || [])
        setPagination(response.data.data.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          hasNextPage: false,
          hasPrevPage: false
        })
      } else {
        toast.error('Failed to load expense data')
      }
    } catch (error) {
      console.error('Error fetching expenses:', error)
      toast.error('Failed to load expense data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExpenses()
  }, [])

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
      const response = await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
        ...formData,
        amount: Number(formData.amount)
      })
      
      if (response.data && response.data.success) {
        toast.success('Expense added successfully')
        setFormData({ category: '', amount: '', date: '' })
        setFormErrors({})
        setShowAddForm(false)
        fetchExpenses(pagination.currentPage)
      } else {
        toast.error('Failed to add expense')
      }
    } catch (error) {
      console.error('Error adding expense:', error)
      
      if (error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else if (error.response?.data?.errors) {
        const errorMsg = error.response.data.errors.map(err => err.message).join(', ')
        toast.error(errorMsg)
      } else {
        toast.error('Failed to add expense')
      }
    }
  }

  const handleDelete = async (expenseId) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return
    
    try {
      const response = await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(expenseId))
      
      if (response.data && response.data.success) {
        toast.success('Expense deleted successfully')
        fetchExpenses(pagination.currentPage)
      } else {
        toast.error('Failed to delete expense')
      }
    } catch (error) {
      console.error('Error deleting expense:', error)
      toast.error('Failed to delete expense')
    }
  }

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchExpenses(page)
    }
  }

  const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  return (
    <DashboardLayout activeMenu="Expense">
      <div className='container-custom'>
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Expense Management</h1>
              <p className="text-gray-600">Track and manage your expenses</p>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <IoMdAdd size={20} />
              Add Expense
            </button>
          </div>
        </div>

        {/* Add Expense Form */}
        {showAddForm && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Add New Expense</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-white border-2 border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-primary transition-colors"
                  placeholder="e.g., Food, Transport, Bills"
                />
                {formErrors.category && <p className="text-red-600 text-sm">{formErrors.category}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Amount</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  className="w-full bg-white border-2 border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-primary transition-colors"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
                {formErrors.amount && <p className="text-red-600 text-sm">{formErrors.amount}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full bg-white border-2 border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-primary transition-colors"
                />
                {formErrors.date && <p className="text-red-600 text-sm">{formErrors.date}</p>}
              </div>
              
              
              <div className="md:col-span-2 flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300 flex-1"
                >
                  Add Expense
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false)
                    setFormData({ category: '', amount: '', date: '' })
                    setFormErrors({})
                  }}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Summary Card */}
        <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-6 rounded-2xl mb-8 shadow-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-1">Total Expenses</h3>
              <p className="text-red-100">All expense categories combined</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">{addThousandSeparator(totalExpense)}</p>
              <p className="text-red-100 text-sm">INR</p>
            </div>
          </div>
        </div>

        {/* Expense List */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold">Expense History</h2>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading expenses...</p>
            </div>
          ) : expenses.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 mb-2">No expense records found</div>
              <p className="text-gray-500 text-sm">Add your first expense to get started</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">Category</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {expenses.map((expense) => (
                      <tr key={expense._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4 text-sm font-medium text-gray-900 sm:px-6">
                          {expense.category}
                        </td>
                        <td className="px-4 py-4 text-sm text-red-600 font-semibold sm:px-6">
                          -{addThousandSeparator(expense.amount)}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 sm:px-6">
                          {new Date(expense.date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-4 text-sm font-medium space-x-2 sm:px-6">
                          <button
                            onClick={() => navigate(`/expense/edit/${expense._id}`)}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                          >
                            <FaEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(expense._id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
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
                <div className="p-6 border-t border-gray-100">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-gray-700 text-center sm:text-left">
                      Showing {((pagination.currentPage - 1) * 10) + 1} to {Math.min(pagination.currentPage * 10, pagination.totalItems)} of {pagination.totalItems} results
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={!pagination.hasPrevPage}
                        className={`px-4 py-2 rounded-lg border ${
                          pagination.hasPrevPage 
                            ? 'border-gray-300 hover:bg-gray-50 text-gray-700' 
                            : 'border-gray-200 text-gray-400 cursor-not-allowed'
                        } transition-colors`}
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={!pagination.hasNextPage}
                        className={`px-4 py-2 rounded-lg border ${
                          pagination.hasNextPage 
                            ? 'border-gray-300 hover:bg-gray-50 text-gray-700' 
                            : 'border-gray-200 text-gray-400 cursor-not-allowed'
                        } transition-colors`}
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

export default Expense
