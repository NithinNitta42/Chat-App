import { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'

const LoginPage = () => {
  const[currState, setCurrState] = useState("Sign up")
  const[fullName, setFullName] = useState("")
  const[email, setEmail] = useState("")
  const[password, setPassword] = useState("")
  const[bio, setBio] = useState("")
  const[isDataSubmitted, setIsDataSubmitted] = useState(false)
  const[isLoading, setIsLoading] = useState(false)
  const[agreedToTerms, setAgreedToTerms] = useState(false)
  const[showTermsReminder, setShowTermsReminder] = useState(false)
  const[showPassword, setShowPassword] = useState(false)
  const[error, setError] = useState("")
  const[success, setSuccess] = useState("")

  // Fixed: Properly use useContext hook
  const {login} = useContext(AuthContext)

  // Password strength calculation
  const getPasswordStrength = (password) => {
    if (!password) return { strength: '', color: '', width: '0%' }
    
    let score = 0
    
    // Length check
    if (password.length >= 8) score += 2
    else if (password.length >= 6) score += 1
    
    // Character variety checks
    if (/[a-z]/.test(password)) score += 1 // lowercase
    if (/[A-Z]/.test(password)) score += 1 // uppercase
    if (/[0-9]/.test(password)) score += 1 // numbers
    if (/[^A-Za-z0-9]/.test(password)) score += 1 // special chars
    
    // Determine strength
    if (score <= 2) return { 
      strength: 'Weak', 
      color: 'bg-red-500', 
      width: '33%',
      textColor: 'text-red-500'
    }
    if (score <= 4) return { 
      strength: 'Medium', 
      color: 'bg-yellow-500', 
      width: '66%',
      textColor: 'text-yellow-600'
    }
    return { 
      strength: 'Strong', 
      color: 'bg-green-500', 
      width: '100%',
      textColor: 'text-green-600'
    }
  }

  const passwordStrength = getPasswordStrength(password)

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    
    // Clear previous messages
    setError("")
    setSuccess("")

    // Validate terms
    if (!agreedToTerms) {
      setShowTermsReminder(true)
      setTimeout(() => setShowTermsReminder(false), 3000)
      return
    }

    // Validate fields
    if (!email.trim() || !password.trim() || (currState === "Sign up" && !isDataSubmitted && !fullName.trim())) {
      setError("Please fill out all required fields.")
      return
    }

    if (currState === "Sign up" && isDataSubmitted && !bio.trim()) {
      setError("Please enter your bio.")
      return
    }

    setIsLoading(true)

    try {
      if (currState === 'Sign up' && !isDataSubmitted) {
        await new Promise(resolve => setTimeout(resolve, 800))
        setIsDataSubmitted(true)
        setIsLoading(false)
        return
      }

      // Call login function from AuthContext
      const result = await login(currState === "Sign up" ? 'signup' : 'login', { 
        fullName, 
        email, 
        password, 
        bio 
      })
      
      // Check if login function returns success/error info
      if (result && result.success) {
        setSuccess(currState === "Sign up" ? "Account created successfully!" : "Login successful!")
        // Optionally redirect or clear form here
      } else if (result && result.error) {
        setError(result.error)
      } else {
        setSuccess(currState === "Sign up" ? "Account created successfully!" : "Login successful!")
      }
      
    } catch (error) {
      console.error('Login error:', error)
      setError(error.message || "An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleStateChange = (newState) => {
    setIsLoading(true)
    setError("")
    setSuccess("")
    setTimeout(() => {
      setCurrState(newState)
      setIsDataSubmitted(false)
      setIsLoading(false)
    }, 300)
  }

  const handleBackClick = () => {
    setIsLoading(true)
    setError("")
    setTimeout(() => {
      setIsDataSubmitted(false)
      setIsLoading(false)
    }, 300)
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-black via-gray-800 to-gray-900 flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col relative overflow-hidden'>

      {/* Left Side - Logo */}
      <div className='relative z-10 transform transition-all duration-700 hover:scale-105'>
        <div className='text-center text-white'>
          <h1 className='text-6xl font-bold mb-4 tracking-wider drop-shadow-2xl'>
            VO
            <span className='bg-gradient-to-r from-purple-400 via-violet-500 to-purple-400 bg-clip-text text-transparent animate-pulse bg-[length:200%_200%]'>
              X
            </span>
            A
          </h1>
          <div className='w-24 h-1 bg-gradient-to-r from-white to-violet-500 mx-auto rounded-full animate-pulse'></div>
          <p className='mt-4 text-lg text-gray-300'>Connect • Share • Discover</p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className={`relative z-10 transform transition-all duration-500 ${isLoading ? 'scale-95 opacity-50' : 'scale-100 opacity-100'}`}>
        <div className='border border-gray-200 bg-white text-gray-900 p-8 flex flex-col gap-4 rounded-2xl shadow-2xl w-96 relative overflow-hidden'>

          {/* Loading overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 rounded-2xl">
              <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            </div>
          )}

          {/* Header */}
          <h2 className='font-semibold text-3xl flex justify-between items-center'>
            <span className='bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent'>
              {currState}
            </span>
            {isDataSubmitted && (
              <button 
                type="button"
                onClick={handleBackClick}
                className='w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-all duration-200 transform hover:scale-110'
              >
                <svg className="w-5 h-5 text-gray-700 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </h2>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-300 rounded-lg p-3 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-100 border border-green-300 rounded-lg p-3 text-green-700 text-sm">
              {success}
            </div>
          )}

          {/* Form Fields */}
          <div className={`transition-all duration-500 ${isDataSubmitted ? 'opacity-0 transform translate-x-full' : 'opacity-100 transform translate-x-0'} space-y-3`}>
            {currState === "Sign up" && !isDataSubmitted && (
              <input 
                onChange={(e)=>setFullName(e.target.value)} 
                value={fullName}
                type="text" 
                required
                className='w-full p-4 border border-gray-300 rounded-xl bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:bg-gray-200 transition-all duration-300' 
                placeholder='Full Name' 
              />
            )}

            {!isDataSubmitted && (
              <>
                <input 
                  onChange={(e)=>setEmail(e.target.value)} 
                  value={email}
                  type="email" 
                  placeholder='Email Address' 
                  required 
                  className='w-full p-4 border border-gray-300 rounded-xl bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:bg-gray-200 transition-all duration-300'
                />

                {/* Password Field with Toggle and Strength Indicator */}
                <div className="relative">
                  <input 
                    onChange={(e)=>setPassword(e.target.value)} 
                    value={password}
                    type={showPassword ? "text" : "password"} 
                    placeholder='Password' 
                    required 
                    className='w-full p-4 pr-12 border border-gray-300 rounded-xl bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:bg-gray-200 transition-all duration-300'
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M21.536 15.536L8.464 8.464" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Password Strength Indicator - Only show during Sign up */}
                {password && currState === "Sign up" && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Password strength:</span>
                      <span className={`text-sm font-medium ${passwordStrength.textColor}`}>
                        {passwordStrength.strength}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${passwordStrength.color}`}
                        style={{ width: passwordStrength.width }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 space-y-1">
                      <div className="flex flex-wrap gap-2">
                        <span className={password.length >= 8 ? 'text-green-600' : 'text-gray-400'}>
                          8+ chars
                        </span>
                        <span className={/[A-Z]/.test(password) ? 'text-green-600' : 'text-gray-400'}>
                          Uppercase
                        </span>
                        <span className={/[0-9]/.test(password) ? 'text-green-600' : 'text-gray-400'}>
                          Number
                        </span>
                        <span className={/[^A-Za-z0-9]/.test(password) ? 'text-green-600' : 'text-gray-400'}>
                          Special
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Bio Field */}
          <div className={`transition-all duration-500 ${currState==="Sign up" && isDataSubmitted ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform -translate-x-full absolute'}`}>
            {currState==="Sign up" && isDataSubmitted && (
              <textarea 
                onChange={(e)=>setBio(e.target.value)} 
                value={bio}
                rows={4} 
                required
                className='w-full p-4 border border-gray-300 rounded-xl bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:bg-gray-200 transition-all duration-300 resize-none'
                placeholder='Tell us a bit about yourself...' 
              />
            )}
          </div>

          {/* Submit Button */}
          <button 
            onClick={onSubmitHandler}
            disabled={isLoading}
            className='py-4 bg-gradient-to-r from-purple-600 to-violet-700 text-white rounded-xl cursor-pointer text-lg font-semibold shadow-lg hover:from-purple-700 hover:to-violet-800 transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden'
          >
            <span className="relative z-10">
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Processing...
                </div>
              ) : (
                currState === "Sign up" ? "Create Account" : "Login Now"
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-violet-600 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          </button>

          {/* Terms Checkbox */}
          <div className='flex items-center gap-3 text-sm text-gray-600'>
            <label className="flex items-center cursor-pointer group">
              <input 
                type="checkbox" 
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className='sr-only'
              />
              <div className={`w-5 h-5 rounded border-2 border-gray-400 flex items-center justify-center transition-all duration-200 ${agreedToTerms ? 'bg-gradient-to-r from-purple-500 to-violet-600 border-purple-500' : 'group-hover:border-gray-500'}`}>
                {agreedToTerms && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className='ml-2 group-hover:text-gray-800 transition-colors duration-200'>
                I agree to the terms of use & privacy policy
              </span>
            </label>
          </div>

          {/* Terms Reminder */}
          {showTermsReminder && (
            <div className="bg-red-100 border border-red-300 rounded-lg p-3 text-red-700 text-sm animate-pulse">
              Please agree to the terms of use & privacy policy to continue.
            </div>
          )}

          {/* State Toggle */}
          <div className='flex flex-col gap-2 text-sm text-gray-600'>
            {currState === "Sign up" ? (
              <p>
                Already have an account? 
                <button
                  type="button"
                  onClick={() => handleStateChange("Login")}
                  className='ml-1 font-medium text-purple-600 hover:text-purple-500 transition-colors duration-200 hover:underline'
                >
                  Login here
                </button>
              </p>
            ) : (
              <p>
                Create an account 
                <button
                  type="button"
                  onClick={() => handleStateChange("Sign up")}
                  className='ml-1 font-medium text-purple-600 hover:text-purple-500 transition-colors duration-200 hover:underline'
                >
                  Click here
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage