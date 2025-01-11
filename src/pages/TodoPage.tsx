import React, { useState } from 'react'
import { Plus, Trash, Edit } from 'lucide-react'

interface Task {
    text: string
    description: string
    completed: boolean
}

const TodoPage: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([])
    const [task, setTask] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [showForm, setShowForm] = useState<boolean>(false)
    const [selectedTask, setSelectedTask] = useState<Task | null>(null)

    const addOrUpdateTask = () => {
        if (task.trim() && description.trim()) {
            if (selectedTask) {
                // Update existing task
                setTasks(tasks.map((t) =>
                    t === selectedTask ? { ...t, text: task, description } : t
                ))
                setSelectedTask(null)
            } else {
                setTasks([...tasks, { text: task, description, completed: false }])
            }
            setTask('')
            setDescription('')
            setShowForm(false)
        }
    }

    const removeTask = (index: number) => {
        setTasks(tasks.filter((_, i) => i !== index))
    }

    const toggleTaskCompletion = (index: number) => {
        setTasks(
            tasks.map((t, i) =>
                i === index ? { ...t, completed: !t.completed } : t
            )
        )
    }

    const handleEditTask = (task: Task) => {
        setSelectedTask(task)
        setTask(task.text)
        setDescription(task.description)
        setShowForm(true) 
    }

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Sidebar */}
            <div className="w-1/4 bg-gray-100 p-6 border-r border-gray-300">
                <h2 className="text-xl font-semibold mb-6 text-gray-800">Daftar Tugas</h2>
                <ul className="space-y-3">
                    {tasks.map((t, index) => (
                        <li
                            key={index}
                            className={`flex justify-between items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-200 ${
                                t.completed ? 'bg-green-50 line-through text-gray-500' : ''
                            }`}
                        >
                            <span
                                onClick={() => toggleTaskCompletion(index)}
                                className="cursor-pointer text-gray-700"
                            >
                                {t.text}
                            </span>
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => handleEditTask(t)}
                                    className="p-2 text-yellow-500 hover:text-yellow-600"
                                >
                                    <Edit size={18} />
                                </button>
                                <button
                                    onClick={() => removeTask(index)}
                                    className="p-2 text-red-500 hover:text-red-600"
                                >
                                    <Trash size={18} />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Main Content */}
            <div className="w-3/4 p-10 flex flex-col items-center justify-start bg-white">
                <h1 className="text-4xl font-semibold mb-6 text-gray-800">todo<span className="font-bold text-blue-600">list</span></h1>

                {!showForm && (
                    <div className="w-full mb-8 text-center text-gray-400">
                        <p className="text-3xl opacity-60">Tugas kamu belum dimulai, klik tombol di bawah untuk menambahkan tugas baru.</p>
                    </div>
                )}

                {showForm && (
                    <div className="w-full max-w-lg bg-white p-6 border border-gray-300 rounded-md shadow-lg mb-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">{selectedTask ? 'Edit Tugas' : 'Tambah Tugas Baru'}</h2>
                        <input
                            type="text"
                            value={task}
                            onChange={(e) => setTask(e.target.value)}
                            className="w-full mb-4 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            placeholder="Judul Tugas"
                        />
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full mb-4 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            placeholder="Deskripsi Tugas"
                            rows={4}
                        />
                        <div className="flex justify-end">
                            <button
                                onClick={addOrUpdateTask}
                                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
                            >
                                {selectedTask ? 'Update Tugas' : 'Tambah Tugas'}
                            </button>
                        </div>
                    </div>
                )}

                <button
                    onClick={() => setShowForm(!showForm)}
                    className="fixed bottom-8 right-8 bg-blue-500 text-white p-5 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
                >
                    <Plus size={28} />
                </button>
            </div>

            {selectedTask && (
                <div className="w-1/4 bg-gray-100 p-6 border-l border-gray-300">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Detail Tugas</h2>
                    <p className="text-lg font-semibold text-gray-700">Judul: {selectedTask.text}</p>
                    <p className="text-lg text-gray-600 mt-2">Deskripsi: {selectedTask.description}</p>
                </div>
            )}
        </div>
    )
}

export default TodoPage
