// import React from 'react'
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
// import Login from './pages/Auth/login'
// import SignUp from './pages/Auth/SignUp'
// import Home from './pages/Dashboard/Home'
// import Expense from './pages/Dashboard/Expense'
// import Income from './pages/Dashboard/Income'
// import UserProvider from './context/UserContext'
// const App = () => {
//   return (
    
//       <>
//       <UserProvider>
//         <Router>
//           <Routes>
//             <Route path='/' element={<Root />} />
//             <Route path='/login' exact element={<Login />} />
//             <Route path='/signUp' exact element={<SignUp />} />
//             <Route path='/dashboard' exact element={<Home />} />
//             <Route path='/income' exact element={<Income />} />
//             <Route path='/expense' exact element={<Expense />} />
//           </Routes>
//         </Router>
//     </UserProvider>
//       </>
//   )
// }

// export default App

// const Root = () => {
//   //check if token exists in local storage
//   const isAuthenticated = !!localStorage.getItem("token");
//   //redirect to dashboard if authenticated, otherwise to login
//   return isAuthenticated ? (<Navigate to="/dashboard" />) : (<Navigate to="/login" />)
// }


import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Auth/Login'
import SignUp from './pages/Auth/SignUp'
import Home from './pages/Dashboard/Home'
import Expense from './pages/Dashboard/Expense'
import ExpenseEdit from './pages/Dashboard/ExpenseEdit'
import Income from './pages/Dashboard/Income'
import IncomeEdit from './pages/Dashboard/IncomeEdit'
import Reports from './pages/Dashboard/Reports'
import UserProvider from './context/UserContext'

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Root />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signUp" element={<SignUp />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/income" element={<PrivateRoute><Income /></PrivateRoute>} />
          <Route path="/income/edit/:id" element={<PrivateRoute><IncomeEdit /></PrivateRoute>} />
          <Route path="/expense" element={<PrivateRoute><Expense /></PrivateRoute>} />
          <Route path="/expense/edit/:id" element={<PrivateRoute><ExpenseEdit /></PrivateRoute>} />
          <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
        </Routes>
      </Router>
    </UserProvider>
  )
}

export default App


// Root Component
const Root = () => {
  const isAuthenticated = !!localStorage.getItem("token")
  return isAuthenticated 
    ? <Navigate to="/dashboard" replace />
    : <Navigate to="/login" replace />
}


// Private Route Component
const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("token")

  return isAuthenticated 
    ? children 
    : <Navigate to="/login" replace />
}