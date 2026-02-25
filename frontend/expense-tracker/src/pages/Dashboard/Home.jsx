import React, { useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { useUserAuth } from '../../hooks/useUserAuth'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import axiosInstance from '../../utils/axiosInstance';

const Home = () => {
  useUserAuth();

  const navigate=useNavigate();

  const [dashboardData,setDashboardData]=useState(null);
  const [loading,setLoading]=useState(false);

  const fetchDashboardData=async()=>{
          if(loading) return;
          setLoading(true);

          try {
            const response=await axiosInstance
          } catch (error) {
            
          }
  }
  return (
    <DashboardLayout activeMenu="Dashboard">
    <div className='my-5 mx-auto'>
    </div>
    </DashboardLayout>
  )
}

export default Home