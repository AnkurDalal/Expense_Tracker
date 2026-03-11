// import React, { useState } from 'react'
// import { AuthLayout } from '../../components/layouts/AuthLayout'
// import { Link, useNavigate } from 'react-router-dom';
// import Input from '../../components/Inputs/Input';
// import { validateEmail } from '../../utils/helper';

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState(null)

//   const navigate = useNavigate();
//   //handle Login
//   const handleLogin = async (e) => {
//     e.preventDefault();
//     //email validity checking
//     if (!validateEmail(email)) {
//       setError("please enter a valid email address.")
//       return;
//     }
//     //password validity checking
//     if (!validatePassword(password)) {
//       setError("please enter the password.")
//       return;
//     }
//     setError("")


//     //login api call

//   }
//   return (
//     <AuthLayout>
//       <div className='lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center'>
//         <h3 className='text-xl font-semibold text-black'>Welcome Back</h3>
//         <p className='text-xs text-slate-700 mt-[5px] mb-6'>Please enter your details to log in</p>
//         <form onSubmit={handleLogin}>
//           <Input
//             value={email}
//             onChange={({ target }) => setEmail(target.value)}
//             label="Email Address"
//             placeholder="john@example.com"
//             type="text"
//           />

//           <Input
//             value={password}
//             onChange={({ target }) => setPassword(target.value)}
//             label="Password"
//             placeholder="Min 8 Characters"
//             type="password"
//           />
//           {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}
//           <button className='btn-primary'>LOGIN</button>
//           <p className='text-[13px] text-slate-800 mt-3'>
//             Don't have an account?
//             <Link className='font-medium text-primary underline' to='/signup'>SignUp</Link>
//           </p>
//         </form>
//       </div>
//     </AuthLayout>
//   )
// }

// export default Login

import React, { useContext, useState } from 'react'
import { AuthLayout } from '../../components/layouts/AuthLayout'
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/UserContext';
import { useTheme } from '../../context/ThemeContext';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")

  const { updateUser } = useContext(UserContext);
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setError("")
    setEmailError("")
    setPasswordError("")

    // Validation
    let hasError = false

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address")
      hasError = true
    }

    if (!password) {
      setPasswordError("Please enter your password")
      hasError = true
    }

    if (hasError) return

    setIsLoading(true)
    
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password
      })
      
      if (response.data && response.data.success && response.data.data) {
        const { token, fullName, email: userEmail, profileImageUrl } = response.data.data;
        if (token) {
          localStorage.setItem("token", token);
          updateUser({
            _id: response.data.data._id,
            fullName,
            email: userEmail,
            profileImageUrl
          });
          navigate("/dashboard")
        }
      } else {
        setError("Invalid login response")
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message)
      } else if (error.response && error.response.data && error.response.data.errors) {
        setError(error.response.data.errors.map(err => err.message).join(', '))
      } else {
        setError("Something went wrong. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className='w-full max-w-md mx-auto px-4 sm:px-6 h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center'>
        <div className="text-center mb-8">
          <h1 className='text-3xl font-bold text-text-primary mb-2'>Welcome Back</h1>
          <p className='text-sm text-text-secondary'>
            Sign in to your account to continue managing your finances
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <Input
            value={email}
            onChange={({ target }) => {
              setEmail(target.value)
              if (emailError) setEmailError("")
            }}
            label="Email Address"
            placeholder="Enter your email address"
            type="email"
            error={emailError}
            autoComplete="email"
            isDarkMode={isDarkMode}
          />

          <Input
            value={password}
            onChange={({ target }) => {
              setPassword(target.value)
              if (passwordError) setPasswordError("")
            }}
            label="Password"
            placeholder="Enter your password"
            type="password"
            error={passwordError}
            autoComplete="current-password"
            isDarkMode={isDarkMode}
          />

          {error && (
            <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-red-900/20 border-red-800/50' : 'bg-red-50 border-red-200'}`}>
              <p className={`text-sm ${isDarkMode ? 'text-red-300' : 'text-red-600'}`}>{error}</p>
            </div>
          )}

          <button 
            type="submit" 
            className={`group relative w-full overflow-hidden bg-gradient-to-r from-primary to-purple-600 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:scale-105'}`}
            disabled={isLoading}
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <span className="relative flex items-center justify-center gap-3">
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span>SIGN IN</span>
                </>
              )}
            </span>
          </button>

          <div className="text-center space-y-2">
            <p className='text-sm text-text-secondary'>
              Don't have an account?
              <Link className='font-medium text-primary hover:text-primary/80 transition-colors ml-1' to='/signup'>
                Create Account
              </Link>
            </p>
            {/* <Link 
              className='text-xs text-text-secondary hover:text-text-primary transition-colors' 
              to='/forgot-password'
            >
              Forgot your password?
            </Link> */}
          </div>
        </form>
      </div>
    </AuthLayout>
  )
}

export default Login
