import { Link } from 'react-router-dom'
import { ArrowLeft, Home } from 'lucide-react'

const ErrorPage = () => {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center space-y-8">
            
            <div className="relative">
            <div className="text-[150px] font-bold text-gray-100">404</div>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-3xl text-gray-800 font-light">
                Oops! Halaman tidak ditemukan
                </div>
            </div>
            </div>
            
            <div className="space-y-4">
            <p className="text-gray-500">
                Sepertinya Anda tersesat. Halaman yang Anda cari tidak tersedia atau telah dipindahkan.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
                <Link 
                to={'/'}
                className="group flex items-center px-6 py-2 text-sm text-gray-600 hover:text-blue-500 transition-colors"
                >
                <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
                Kembali
                </Link >
                
                <Link
                to={"/todo"}
                className="flex items-center px-6 py-2 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-all shadow-lg hover:shadow-xl hover:shadow-blue-100"
                >
                <Home className="h-4 w-4 mr-2" />
                Ke Beranda
                </Link>
            </div>
            </div>

            <div className="flex justify-center gap-2">
            <div className="h-1 w-16 bg-blue-500 rounded-full opacity-20"></div>
            <div className="h-1 w-16 bg-blue-500 rounded-full opacity-40"></div>
            <div className="h-1 w-16 bg-blue-500 rounded-full opacity-60"></div>
            </div>
        </div>
        </div>
    )
}

export default ErrorPage