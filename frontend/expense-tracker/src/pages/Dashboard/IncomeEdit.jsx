import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { useUserAuth } from '../../hooks/useUserAuth'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import toast from 'react-hot-toast'

const IncomeEdit = () => {
  useUserAuth()
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    source: '',
    amount: '',
    date: '',
    description: ''
  })
  const [formErrors, setFormErrors] = useState({})

  // Fetch income data
  const fetchIncome = async () => {
    setLoading(true)
    try {
      const response = await axiosInstance.get(API_PATHS.INCOME.GET_INCOME_BY_ID(id))
      
      if (response.data && response.data.success) {
        const income = response.data.data
        setFormData({
          source: income.source || '',
          amount: income.amount || '',
          date: income.date ? income.date.split('T')[0] : '',
          description: income.description || ''
        })
      } else {
        toast.error('Failed to load income data')
        navigate('/income')
      }
    } catch (error) {
      console.error('Error fetching income:', error)
      toast.error('Failed to load income data')
      navigate('/income')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIncome()
  }, [id])

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
      const response = await axiosInstance.put(API_PATHS.INCOME.UPDATE_INCOME(id), {
        ...formData,
        amount: Number(formData.amount)
      })
      
      if (response.data && response.data.success) {
        toast.success('Income updated successfully')
        navigate('/income')
      } else {
        toast.error('Failed to update income')
      }
    } catch (error) {
      console.error('Error updating income:', error)
      
      if (error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else if (error.response?.data?.errors) {
        const errorMsg = error.response.data.errors.map(err => err.message).join(', ')
        toast.error(errorMsg)
      } else {
        toast.error('Failed to update income')
      }
    }
  }

  const handleCancel = () => {
    navigate('/income')
  }

  return (
    <DashboardLayout activeMenu="Income">
      <div className='container-custom'>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Income</h1>
              <p className="text-gray-600">Update your income details</p>
            </div>
          </div>
        </div>

        {/* Edit Income Form */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex justify-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-center text-gray-600 mt-4">Loading income data...</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Source</label>
                <input
                  type="text"
                  value={formData.source}
                  onChange={(e) => setFormData({...formData, source: e.target.value})}
                  className="w-full bg-white border-2 border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-primary transition-colors"
                  placeholder="e.g., Salary, Freelance, Investment"
                />
                {formErrors.source && <p className="text-red-600 text-sm">{formErrors.source}</p>}
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
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-white border-2 border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-primary transition-colors"
                  placeholder="Additional details"
                />
              </div>
              
              <div className="md:col-span-2 flex gap-4">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  Update Income
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
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

export default IncomeEdit