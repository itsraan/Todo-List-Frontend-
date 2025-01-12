import React, { useState, useEffect } from 'react'
import { Plus, Trash, Edit, CheckCircle, LogOut, X, Menu } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

interface Note {
    id: string
    title: string
    description: string  
    isCompleted: boolean
}

const TodoPage: React.FC = () => {
    const navigate = useNavigate()
    const [notes, setNotes] = useState<Note[]>([])
    const [selectedNote, setSelectedNote] = useState<Note | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const username = localStorage.getItem('name') || 'User'
    const token = localStorage.getItem('token')

    const axiosInstance = axios.create({
        baseURL: 'http://localhost:5000/api',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })

    useEffect(() => {
        fetchTodos()
    }, [])

    const fetchTodos = async () => {
        try {
            const response = await axiosInstance.get('/todos')
            if (Array.isArray(response.data.data)) {
                setNotes(response.data.data)
            } else {
                console.error('Unexpected response format:', response.data)
            }
        } catch (error) {
            console.error('Error fetching todos:', error)
        }
    }

    const handleLogout = async () => {
        try {
            await axiosInstance.delete('/logout')
            localStorage.removeItem('token')
            localStorage.removeItem('name')
            navigate('/')
        } catch (error) {
            console.error('Error during logout:', error)
        }
    }

    const handleAddNote = async () => {
        const newNote = {
            title: "Catatan Baru",
            description: "Tulis catatan disini", 
            isCompleted: false
        }
        
        try {
            const response = await axiosInstance.post('/todos', newNote)
            
            if (response.data?.data) {
                const createdNote = response.data.data
                setNotes(prevNotes => [createdNote, ...prevNotes])
                setSelectedNote(createdNote)
                setIsSidebarOpen(false)
            }
        } catch (error: any) {
            alert(`Gagal membuat catatan baru: ${error.response?.data?.message || error.message}`)
        }
    }

    const handleDeleteNote = async (noteId: string) => {
        try {
            await axiosInstance.delete(`/todos/${noteId}`)
            setNotes(notes.filter(note => note.id !== noteId))
            if (selectedNote?.id === noteId) {
                setSelectedNote(null)
            }
        } catch (error) {
            console.error('Error deleting todo:', error)
        }
    }

    const toggleCompleteNote = async (noteId: string) => {
        const noteToToggle = notes.find(note => note.id === noteId)
        if (noteToToggle) {
            const updatedNote = { 
                title: noteToToggle.title,
                description: noteToToggle.description,
                isCompleted: !noteToToggle.isCompleted 
            }
            try {
                const response = await axiosInstance.patch(`/todos/${noteId}`, updatedNote)
                if (response.data?.data) {
                    setNotes(notes.map(note => note.id === noteId ? response.data.data : note))
                }
            } catch (error) {
                console.error('Error updating todo:', error)
                alert('Gagal mengupdate status todo. Silakan coba lagi.')
            }
        }
    }

    const handleEditNote = (noteId: string) => {
        const noteToEdit = notes.find(note => note.id === noteId)
        if (noteToEdit) {
            setSelectedNote(noteToEdit)
            setIsSidebarOpen(false) 
        }
    }

    const handleNoteChange = async (updatedNote: Note) => {
        setNotes(notes.map(note => note.id === updatedNote.id ? updatedNote : note))
        setSelectedNote(updatedNote)

        try {
            const updateData = {
                title: updatedNote.title,
                description: updatedNote.description,
                isCompleted: updatedNote.isCompleted
            }
            await axiosInstance.patch(`/todos/${updatedNote.id}`, updateData)
        } catch (error) {
            console.error('Error saving note:', error)
        }
    }

    useEffect(() => {
        if (selectedNote) {
            const timeoutId = setTimeout(() => {
                handleNoteChange(selectedNote)
            }, 1000)
            return () => clearTimeout(timeoutId)
        }
    }, [selectedNote?.title, selectedNote?.description])

    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.description.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-white text-gray-900">
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between p-4 border-b">
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                >
                    <Menu size={24} />
                </button>
                <span className="font-medium">Notes</span>
                <button
                    onClick={handleLogout}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                >
                    <LogOut size={24} />
                </button>
            </div>

            <div className="flex relative">
                {/* Sidebar */}
                <div className={`
                    fixed md:static inset-0 z-20 bg-[#f8f9fa] w-full md:w-1/3 lg:w-1/4 
                    transform transition-transform duration-300 ease-in-out
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    md:translate-x-0 border-r border-gray-300
                `}>
                    {/* Mobile sidebar header */}
                    <div className="md:hidden flex justify-between items-center p-4 border-b">
                        <span className="font-medium">Notes List</span>
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className="p-4">
                        <input
                            type="text"
                            placeholder="Cari catatan"
                            className="bg-[#e9ecef] rounded-full p-2 text-gray-800 w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2 px-4 pb-20 overflow-y-auto max-h-[calc(100vh-8rem)]">
                        {[...filteredNotes.filter(note => !note.isCompleted), ...filteredNotes.filter(note => note.isCompleted)].map((note) => (
                            <div
                                key={note.id}
                                className={`p-4 rounded-lg bg-[#ffffff] cursor-pointer ${note.isCompleted ? 'line-through text-gray-500' : ''}`}
                                onClick={() => handleEditNote(note.id)}
                            >
                                <div className="flex justify-between items-center">
                                    <h3 className="text-gray-800 font-medium mb-1">{note.title}</h3>
                                    <div className="flex space-x-2">
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                toggleCompleteNote(note.id)
                                            }} 
                                            className="text-green-500 hover:text-green-700"
                                        >
                                            <CheckCircle size={16} />
                                        </button>
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleEditNote(note.id)
                                            }} 
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleDeleteNote(note.id)
                                            }} 
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 min-h-screen bg-white p-4">
                    {selectedNote ? (
                        <div className="max-w-3xl mx-auto">
                            <input
                                type="text"
                                value={selectedNote.title}
                                onChange={(e) => setSelectedNote({ ...selectedNote, title: e.target.value })}
                                placeholder="Judul"
                                className="w-full bg-transparent text-xl font-semibold mb-2 focus:outline-none text-gray-900"
                            />
                            <p className="text-sm text-gray-500 mb-4">
                                Jumlah karakter : ( {selectedNote.description?.length || 0} karakter )
                            </p>
                            <textarea
                                value={selectedNote.description}
                                onChange={(e) => setSelectedNote({ ...selectedNote, description: e.target.value })}
                                placeholder="Mulai mengetik"
                                className="w-full bg-transparent focus:outline-none text-gray-900 resize-none"
                                rows={20}
                            />
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-center text-gray-500">
                            <div>
                                <p className="text-xl font-semibold text-gray-700">Selamat datang, {username}!</p>
                                <p className="text-sm text-gray-400">Mulai dengan menambahkan catatan baru untuk mengelola tugas harian Anda.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Floating Action Button */}
            <button
                onClick={handleAddNote}
                className="fixed bottom-8 right-8 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-colors z-30"
            >
                <Plus size={24} />
            </button>

            {/* Desktop Logout Button */}
            <div className="hidden md:block fixed top-0 right-0 p-4">
                <button
                    onClick={handleLogout}
                    className="flex items-center bg-[#f8f9fa] text-gray-900 px-6 py-3 rounded-full hover:bg-gray-200 transition-colors shadow-lg hover:shadow-xl focus:outline-none"
                >
                    <LogOut size={18} className="mr-2" />
                    <span className="text-sm font-medium">Logout</span>
                </button>
            </div>
        </div>
    )
}

export default TodoPage