import React, { useState } from 'react'
import { AuthLayout } from '../../components/layouts/AuthLayout'
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import uploadImage from '../../utils/uploadImage';
import { UserContext } from '../../context/UserContext';
import { useContext } from 'react';

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate()

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Validation checks
    if (!fullName.trim()) {
      setError("Please enter your full name");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password) {
      setError("Please enter a password");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      let profileImageUrl = "";

      // Upload image if selected
      if (profilePic) {
        const imageUploadRes = await uploadImage(profilePic);
        profileImageUrl = imageUploadRes.imageUrl || "";
      }

      const response = await axiosInstance.post(
        API_PATHS.AUTH.REGISTER,
        {
          fullName: fullName.trim(),
          email: email.toLowerCase().trim(),
          password,
          profileImageUrl
        }
      );

      if (response.data && response.data.success && response.data.data) {
        const { token, fullName: userFullName, email: userEmail, profileImageUrl: userImage } = response.data.data;
        if (token) {
          localStorage.setItem("token", token);
          updateUser({
            _id: response.data.data._id,
            fullName: userFullName,
            email: userEmail,
            profileImageUrl: userImage
          });
          navigate("/dashboard");
        }
      } else {
        setError("Invalid registration response");
      }

    } catch (error) {
      console.log("Signup Error:", error.response?.data || error.message);

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.data?.errors) {
        setError(error.response.data.errors.map(err => err.message).join(', '));
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className='w-full max-w-lg mx-auto px-4 sm:px-6 h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center'>
        <div className="text-center mb-8">
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>Join Expense Tracker</h1>
          <p className='text-sm text-gray-600'>
            Create your account to start managing your finances today
          </p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-6">
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Input
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              label="Full Name"
              placeholder="John Doe"
              type="text"
              autoComplete="name"
            />

            <Input
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              label="Email Address"
              placeholder="john@example.com"
              type="email"
              autoComplete="email"
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className="relative">
              <Input
                value={password}
                onChange={({ target }) => setPassword(target.value)}
                label="Password"
                placeholder="Create a strong password (min 6 characters)"
                type="password"
                autoComplete="new-password"
              />
            </div>
            <div className="relative">
              <Input
                value={confirmPassword}
                onChange={({ target }) => setConfirmPassword(target.value)}
                label="Confirm Password"
                placeholder="Re-enter your password to confirm"
                type="password"
                autoComplete="new-password"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className='text-red-600 text-sm'>{error}</p>
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
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Create Account</span>
                </>
              )}
            </span>
          </button>

          <div className="text-center space-y-2">
            <p className='text-sm text-gray-600'>
              Already have an account?
              <Link className='font-medium text-primary hover:text-primary/80 transition-colors ml-1' to='/login'>
                Sign In
              </Link>
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
              <span>By signing up, you agree to our</span>
              <Link className='hover:text-gray-700 transition-colors' to='/terms'>
                Terms
              </Link>
              <span>and</span>
              <Link className='hover:text-gray-700 transition-colors' to='/privacy'>
                Privacy Policy
              </Link>
            </div>
          </div>
        </form>
      </div>
    </AuthLayout>
  )
}

export default SignUp
