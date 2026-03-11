import React from 'react'

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className='bg-white shadow-xl rounded-xl p-4 border border-gray-100/50 backdrop-blur-sm'>
        <div className="flex items-center gap-3 mb-2">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: payload[0].color }}
          />
          <p className='text-sm font-semibold text-gray-900 tracking-wide'>
            {payload[0].name}
          </p>
        </div>
        <div className="border-t border-gray-100/50 pt-2">
          <p className='text-xs text-gray-600 font-medium'>
            Amount
          </p>
          <p className='text-lg font-bold text-gray-900 tracking-tight'>
            ₹{payload[0].value.toLocaleString()}
          </p>
        </div>
      </div>
    );
  }

  return null; // always return null if nothing to show
};

export default CustomTooltip;
