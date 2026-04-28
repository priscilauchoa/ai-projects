import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addTodo, toggleTodo, deleteTodo, clearCompleted, CATEGORIES } from './store/todosSlice'
import {
  CheckCircle2,
  Circle,
  Trash2,
  Plus,
  ClipboardList,
  X,
  ArrowDown,
  ArrowUp,
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
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [category, setCategory] = useState('other')
  const [activeFilter, setActiveFilter] = useState('all')
  const [sortOrder, setSortOrder] = useState('desc')

  const openModal = () => setIsOpen(true)

  const closeModal = () => {
    setIsOpen(false)
    setInput('')
    setCategory('other')
  }

  const handleSave = () => {
    const text = input.trim()
    if (!text) return
    dispatch(addTodo({ text, category }))
    closeModal()
  }

  const handleKey = e => {
    if (e.key === 'Enter') handleSave()
    if (e.key === 'Escape') closeModal()
  }

  const done = todos.filter(t => t.done).length

  const presentCategories = CATEGORIES.filter(cat => todos.some(t => t.category === cat.key))

  const grouped = CATEGORIES
    .map(cat => ({
      ...cat,
      items: todos
        .filter(t => t.category === cat.key)
        .slice()
        .sort((a, b) => sortOrder === 'desc' ? b.id - a.id : a.id - b.id),
    }))
    .filter(group => group.items.length > 0)
    .filter(group => activeFilter === 'all' || group.key === activeFilter)

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">

        {/* Header */}
        <div className="bg-violet-600 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ClipboardList className="text-white" size={24} />
            <div>
              <h1 className="text-xl font-semibold text-white">My Tasks</h1>
              <p className="text-violet-200 text-sm">
                {done} of {todos.length} completed
              </p>
            </div>
          </div>
          <button
            onClick={openModal}
            aria-label="Add task"
            className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-sm font-medium px-3 py-2 rounded-lg transition-colors"
          >
            <Plus size={16} />
            Add task
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-violet-100">
          <div
            className="h-full bg-violet-500 transition-all duration-300"
            style={{ width: todos.length ? `${(done / todos.length) * 100}%` : '0%' }}
          />
        </div>

        {/* Filter & sort toolbar */}
        {todos.length > 0 && (
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => setActiveFilter('all')}
                aria-label="Filter: All"
                className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                  activeFilter === 'all'
                    ? 'bg-violet-600 text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              {presentCategories.map(cat => (
                <button
                  key={cat.key}
                  onClick={() => setActiveFilter(cat.key)}
                  aria-label={`Filter: ${cat.label}`}
                  className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                    activeFilter === cat.key
                      ? 'bg-violet-600 text-white'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setSortOrder(s => s === 'desc' ? 'asc' : 'desc')}
              aria-label={sortOrder === 'desc' ? 'Sort oldest first' : 'Sort newest first'}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-violet-600 transition-colors shrink-0"
            >
              {sortOrder === 'desc' ? <ArrowDown size={13} /> : <ArrowUp size={13} />}
              {sortOrder === 'desc' ? 'Newest' : 'Oldest'}
            </button>
          </div>
        )}

        {/* List */}
        <div className="max-h-80 overflow-y-auto">
          {todos.length === 0 && (
            <p className="py-8 text-center text-gray-400 text-sm">
              No tasks yet. Click &ldquo;Add task&rdquo; to get started!
            </p>
          )}
          {todos.length > 0 && grouped.length === 0 && (
            <p className="py-8 text-center text-gray-400 text-sm">
              No tasks in this category.
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
                      className="shrink-0 text-gray-300 hover:text-violet-500 transition-colors"
                      aria-label={todo.done ? 'Mark incomplete' : 'Mark complete'}
                    >
                      {todo.done
                        ? <CheckCircle2 size={22} className="text-violet-500" />
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

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          onClick={e => { if (e.target === e.currentTarget) closeModal() }}
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-gray-800">New Task</h2>
              <button
                onClick={closeModal}
                aria-label="Close modal"
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Add a new task…"
                autoFocus
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
              />
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
              >
                {CATEGORIES.map(c => (
                  <option key={c.key} value={c.key}>{c.label}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm font-medium bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
