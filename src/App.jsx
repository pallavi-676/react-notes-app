import React, { useState, useEffect } from 'react'

const App = () => {

  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [search, setSearch] = useState('')
  const [task, setTask] = useState('')
  const [notes, setNotes] = useState(
    JSON.parse(localStorage.getItem('notes')) || []
  )
  const [tasks, setTasks] = useState(
    JSON.parse(localStorage.getItem('tasks')) || []
  )

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes))
  }, [notes])

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  const submitHandler = (e) => {
    e.preventDefault()

    if (!title || !desc) return

    const newNote = {
      id: Date.now(),
      title,
      desc,
      priority,
      pinned: false,
      date: new Date().toLocaleString()
    }

    setNotes([newNote, ...notes])
    setTitle('')
    setDesc('')
    setPriority('Medium')
  }

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id))
  }

  const pinNote = (id) => {
    setNotes(
      notes.map(note =>
        note.id === id ? { ...note, pinned: !note.pinned } : note
      )
    )
  }

  const addTask = () => {
    if (!task) return

    const newTask = {
      id: Date.now(),
      text: task,
      done: false
    }

    setTasks([newTask, ...tasks])
    setTask('')
  }

  const toggleTask = (id) => {
    setTasks(
      tasks.map(task =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    )
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(search.toLowerCase())
  )

  const sortedNotes = [...filteredNotes].sort((a, b) => b.pinned - a.pinned)

  return (
    <div className="min-h-screen bg-[#d2bf8b] p-8">

      <h1 className="text-5xl font-bold text-center mb-8 text-stone-800">
        Notes App
      </h1>

      <div className="grid md:grid-cols-2 gap-8">

        {/* Add Note */}
        <form
          onSubmit={submitHandler}
          className="bg-[#FAEBD7] p-6 rounded-2xl shadow-lg flex flex-col gap-4"
        >
          <h2 className="text-2xl font-semibold">Add Note</h2>

          <input
            className="px-4 py-3 rounded-lg border-2"
            type="text"
            placeholder="Enter heading"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="px-4 py-3 rounded-lg border-2 h-32"
            placeholder="Enter description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />

          <select
            className="px-4 py-3 rounded-lg border-2"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option>High priority</option>
            <option>Medium priority</option>
            <option>Low priority</option>
          </select>

          <button className="bg-stone-700 text-white py-3 rounded-lg hover:bg-stone-900">
            Add Note
          </button>
        </form>

        {/* Daily Tasks */}
        <div className="bg-[#FAEBD7] p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Daily Tasks</h2>

          <div className="flex gap-2 mb-4">
            <input
              className="px-4 py-2 rounded-lg border-2 w-full"
              type="text"
              placeholder="Add task..."
              value={task}
              onChange={(e) => setTask(e.target.value)}
            />

            <button
              onClick={addTask}
              className="bg-stone-700 text-white px-4 rounded-lg"
            >
              Add
            </button>
          </div>

          <div className="space-y-3">
            {tasks.map(item => (
              <div
                key={item.id}
                className="flex justify-between items-center bg-white p-3 rounded-lg"
              >
                <span
                  onClick={() => toggleTask(item.id)}
                  className={`cursor-pointer ${
                    item.done ? 'line-through text-gray-400' : ''
                  }`}
                >
                  {item.text}
                </span>

                <button
                  onClick={() => deleteTask(item.id)}
                  className="text-red-500"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search */}
      <input
        className="w-full mt-8 px-5 py-3 rounded-xl border-2"
        type="text"
        placeholder="Search Notes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Notes */}
      <div className="grid md:grid-cols-3 gap-5 mt-8">
        {sortedNotes.map(note => (
          <div
            key={note.id}
            className="bg-[#FAEBD7] rounded-2xl p-5 shadow-lg"
          >
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-bold">{note.title}</h2>

              <button onClick={() => pinNote(note.id)}>
                {note.pinned ? '📌' : '📍'}
              </button>
            </div>

            <p className="mt-3 text-stone-700">{note.desc}</p>

            <p className="mt-3 text-sm text-gray-500">{note.date}</p>

            <span className="inline-block mt-3 px-3 py-1 bg-stone-300 rounded-full text-sm">
              {note.priority}
            </span>

            <button
              onClick={() => deleteNote(note.id)}
              className="block mt-4 text-red-500"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

    </div>
  )
}

export default App