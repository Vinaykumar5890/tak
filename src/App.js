import React, {useState, useEffect} from 'react'
import './App.css'

const App = () => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks')
    return savedTasks ? JSON.parse(savedTasks) : []
  })
  const [filter, setFilter] = useState('All')
  const [editTask, setEditTask] = useState(null)
  const [formValues, setFormValues] = useState({
    title: '',
    description: '',
    dueDate: '',
    status: 'Pending',
  })

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  const handleInputChange = e => {
    const {name, value} = e.target
    setFormValues({...formValues, [name]: value})
  }

  const addTask = e => {
    e.preventDefault()
    if (editTask) {
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === editTask.id ? {...task, ...formValues} : task,
        ),
      )
      setEditTask(null)
    } else {
      const newTask = {
        id: Date.now(),
        ...formValues,
      }
      setTasks(prevTasks => [...prevTasks, newTask])
    }
    setFormValues({title: '', description: '', dueDate: '', status: 'Pending'})
  }

  const deleteTask = id => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id))
    }
  }

  const editExistingTask = task => {
    setEditTask(task)
    setFormValues(task)
  }

  const filteredTasks =
    filter === 'All' ? tasks : tasks.filter(task => task.status === filter)

  return (
    <div className="container">
      <h1 className="title">Task Manager</h1>
      <form className="task-form" onSubmit={addTask}>
        <input
          type="text"
          name="title"
          placeholder="Task Title"
          value={formValues.title}
          onChange={handleInputChange}
          required
        />
        <textarea
          name="description"
          placeholder="Task Description"
          value={formValues.description}
          onChange={handleInputChange}
          required
        />
        <input
          type="date"
          name="dueDate"
          value={formValues.dueDate}
          onChange={handleInputChange}
          required
        />
        <select
          name="status"
          value={formValues.status}
          onChange={handleInputChange}
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <button type="submit">{editTask ? 'Update Task' : 'Add Task'}</button>
      </form>
      <div className="filters">
        <label htmlFor="filter">Filter by Status:</label>
        <select
          id="filter"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
      <div className="task-list">
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <div className="task-card" key={task.id}>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p>
                <strong>Due:</strong> {task.dueDate}
              </p>
              <p>
                <strong>Status:</strong> {task.status}
              </p>
              <button onClick={() => editExistingTask(task)}>Edit</button>
              <button onClick={() => deleteTask(task.id)}>Delete</button>
            </div>
          ))
        ) : (
          <p className="no-tasks">No tasks to display</p>
        )}
      </div>
    </div>
  )
}

export default App


