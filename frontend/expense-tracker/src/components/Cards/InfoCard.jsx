import React from 'react'

const InfoCard = ({ icon, label, value, color, trend }) => {
  return (
    <div className='bg-white p-6 rounded-2xl shadow-card border border-gray-100/50 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 group'>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 flex items-center justify-center text-[28px] text-white ${color} rounded-2xl drop-shadow-lg shadow-lg shadow-black/20 group-hover:scale-105 transition-transform duration-300`}>
            {icon}
          </div>

          <div>
            <h6 className='text-sm text-gray-600 mb-1 font-medium'>{label}</h6>
            <span className='text-2xl font-bold text-gray-900 tracking-tight'>
              ₹{value}
            </span>
          </div>
        </div>
        
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-medium ${
            trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
          }`}>
            <span>{trend}</span>
            {trend.startsWith('+') ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default InfoCard
