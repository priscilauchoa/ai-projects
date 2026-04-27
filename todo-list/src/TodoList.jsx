import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addTodo, toggleTodo, deleteTodo, clearCompleted } from './store/todosSlice'
import {
  CheckCircle2,
  Circle,
  Trash2,
  Plus,
  ClipboardList,
} from 'lucide-react'

export default function TodoList() {
  const todos = useSelector(state => state.todos)
  const dispatch = useDispatch()
  const [input, setInput] = useState('')

  const handleAdd = () => {
    const text = input.trim()
    if (!text) return
    dispatch(addTodo(text))
    setInput('')
  }

  const handleKey = e => {
    if (e.key === 'Enter') handleAdd()
  }

  const done = todos.filter(t => t.done).length

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">

        {/* Header */}
        <div className="bg-indigo-600 px-6 py-5 flex items-center gap-3">
          <ClipboardList className="text-white" size={24} />
          <div>
            <h1 className="text-xl font-semibold text-white">My Tasks</h1>
            <p className="text-indigo-200 text-sm">
              {done} of {todos.length} completed
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-indigo-100">
          <div
            className="h-full bg-indigo-500 transition-all duration-300"
            style={{ width: todos.length ? `${(done / todos.length) * 100}%` : '0%' }}
          />
        </div>

        {/* Input */}
        <div className="px-6 py-4 border-b border-gray-100 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Add a new task…"
            className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
          />
          <button
            onClick={handleAdd}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={16} />
            Add
          </button>
        </div>

        {/* List */}
        <ul className="divide-y divide-gray-50 px-6 py-2 max-h-80 overflow-y-auto">
          {todos.length === 0 && (
            <li className="py-8 text-center text-gray-400 text-sm">
              No tasks yet. Add one above!
            </li>
          )}
          {todos.map(todo => (
            <li key={todo.id} className="flex items-center gap-3 py-3 group">
              <button
                onClick={() => dispatch(toggleTodo(todo.id))}
                className="shrink-0 text-gray-300 hover:text-indigo-500 transition-colors"
                aria-label={todo.done ? 'Mark incomplete' : 'Mark complete'}
              >
                {todo.done
                  ? <CheckCircle2 size={22} className="text-indigo-500" />
                  : <Circle size={22} />}
              </button>

              <span className={`flex-1 text-sm ${todo.done ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                {todo.text}
              </span>

              <button
                onClick={() => dispatch(deleteTodo(todo.id))}
                className="shrink-0 text-gray-200 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                aria-label="Delete task"
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>

        {/* Footer */}
        {todos.some(t => t.done) && (
          <div className="px-6 py-3 border-t border-gray-100 flex justify-end">
            <button
              onClick={() => dispatch(clearCompleted())}
              className="text-xs text-gray-400 hover:text-red-400 transition-colors"
            >
              Clear completed
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
