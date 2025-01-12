import React, { useState } from 'react'
import { User, Lock, Eye, EyeOff } from 'lucide-react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/api'

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate() 

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const response = await api.post('/login', formData)

            if (response.data.data?.token) {
                localStorage.setItem('token', response.data.data?.token)
                localStorage.setItem('name', response.data.data?.name)
                navigate('/todo') 
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || 'Terjadi kesalahan saat login')
            } else {
                setError('Terjadi kesalahan yang tidak diketahui')
            }
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <div className="w-full max-w-sm">
                <h1 className="text-3xl font-light text-center mb-8 text-gray-800">
                    todo<span className="font-bold">list</span>
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                            {error}
                        </div>
                    )}

                    <div className="relative">
                        <User className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full pl-8 pr-3 py-2 border-b border-gray-300 focus:border-blue-500 outline-none transition-colors"
                            placeholder="Email"
                            autoComplete="off"
                            required
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full pl-8 pr-8 py-2 border-b border-gray-300 focus:border-blue-500 outline-none transition-colors"
                            placeholder="Password"
                            autoComplete="off"
                            required
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-0 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 focus:outline-none"
                        >
                            {showPassword ? <EyeOff /> : <Eye />}
                        </button>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center text-gray-600">
                            <input
                                type="checkbox"
                                className="w-4 h-4 mr-2 border border-gray-300 rounded focus:ring-0 focus:ring-offset-0"
                            />
                            Ingat saya
                        </label>
                        <Link to="/forgot-password" className="text-blue-500 hover:text-blue-600">
                            Lupa password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors ${
                            loading ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                    >
                        {loading ? 'Memproses...' : 'Masuk'}
                    </button>

                    <p className="text-center text-gray-600 text-sm">
                        Belum punya akun?{' '}
                        <Link to="/register" className="text-blue-500 hover:text-blue-600">
                            Daftar sekarang
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default LoginPage
