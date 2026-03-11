import React from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import CustomTooltip from './CustomTooltip';
import { useTheme } from '../../../context/ThemeContext';

const CustomPieChart = ({ data, label, totalAmount, colors, showTextAnchor, isDarkMode }) => {
    const { isDarkMode: themeIsDarkMode } = useTheme();
    const currentIsDarkMode = isDarkMode ?? themeIsDarkMode;

    return (
        <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="amount"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        innerRadius={80}
                        labelLine={false}
                        cornerRadius={8}
                        stroke={currentIsDarkMode ? "#374151" : "white"}
                        strokeWidth={2}
                    >
                        {data.map((entry, index) => (
                            <Cell 
                                key={`cell-${index}`} 
                                fill={colors[index % colors.length]}
                                className="transition-all duration-300 hover:opacity-80"
                            />
                        ))}
                    </Pie>
                    <Tooltip content={CustomTooltip} />
                    <Legend 
                        verticalAlign="bottom" 
                        height={36}
                        wrapperStyle={{
                            fontSize: '12px',
                            fontFamily: 'Poppins, sans-serif',
                            color: currentIsDarkMode ? '#9ca3af' : '#6b7280'
                        }}
                    />
                    {showTextAnchor && (
                        <text 
                            x="50%" 
                            y="45%" 
                            dy={-10} 
                            textAnchor="middle" 
                            fill={currentIsDarkMode ? "#9ca3af" : "#6b7280"}
                            fontSize="14px"
                            fontWeight="500"
                        >
                            {label}
                        </text>
                    )}
                    <text
                        x="50%"
                        y="50%"
                        dy={8}
                        textAnchor="middle"
                        fill={currentIsDarkMode ? "#f9fafb" : "#1f2937"}
                        fontSize="28px"
                        fontWeight="700"
                        fontFamily="Poppins, sans-serif"
                    >
                        {totalAmount}
                    </text>
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}

export default CustomPieChart
