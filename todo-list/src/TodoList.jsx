import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addTodo, toggleTodo, deleteTodo, clearCompleted } from './store/todosSlice'
import { CATEGORIES } from './store/todosSlice'
import {
  CheckCircle2,
  Circle,
  Trash2,
  Plus,
  ClipboardList,
} from 'lucide-react'

const CATEGORY_COLORS = {
  work:     'bg-blue-100 text-blue-700 ring-blue-200',
  personal: 'bg-purple-100 text-purple-700 ring-purple-200',
  health:   'bg-green-100 text-green-700 ring-green-200',
  shopping: 'bg-amber-100 text-amber-700 ring-amber-200',
  other:    'bg-gray-100 text-gray-600 ring-gray-200',
}

export default function TodoList() {
  const todos = useSelector(state => state.todos)
  const dispatch = useDispatch()
  const [input, setInput] = useState('')
  const [category, setCategory] = useState('other')

  const handleAdd = () => {
    const text = input.trim()
    if (!text) return
    dispatch(addTodo({ text, category }))
    setInput('')
    setCategory('other')
  }

  const handleKey = e => {
    if (e.key === 'Enter') handleAdd()
  }

  const done = todos.filter(t => t.done).length

  const grouped = CATEGORIES
    .map(cat => ({ ...cat, items: todos.filter(t => t.category === cat.key) }))
    .filter(group => group.items.length > 0)

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
        <div className="px-6 py-4 border-b border-gray-100 flex flex-col gap-2">
          <div className="flex gap-2">
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
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
          >
            {CATEGORIES.map(c => (
              <option key={c.key} value={c.key}>{c.label}</option>
            ))}
          </select>
        </div>

        {/* List */}
        <div className="max-h-80 overflow-y-auto">
          {todos.length === 0 && (
            <p className="py-8 text-center text-gray-400 text-sm">
              No tasks yet. Add one above!
            </p>
          )}
          {grouped.map(group => (
            <section key={group.key}>
              <div className="px-6 pt-4 pb-1 flex items-center gap-2">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ring-1 ring-inset ${CATEGORY_COLORS[group.key]}`}>
                  {group.label}
                </span>
                <span className="text-xs text-gray-400">{group.items.length}</span>
              </div>
              <ul className="divide-y divide-gray-50 px-6 py-2">
                {group.items.map(todo => (
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
            </section>
          ))}
        </div>

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
