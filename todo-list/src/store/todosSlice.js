import { createSlice } from '@reduxjs/toolkit'

export const CATEGORIES = [
  { key: 'work',     label: 'Work' },
  { key: 'personal', label: 'Personal' },
  { key: 'health',   label: 'Health' },
  { key: 'shopping', label: 'Shopping' },
  { key: 'other',    label: 'Other' },
]

const initialState = [
  { id: 1, text: 'Design the landing page layout', done: false, category: 'work' },
  { id: 2, text: 'Set up the React project with Vite', done: true,  category: 'work' },
  { id: 3, text: 'Integrate Tailwind CSS', done: true,  category: 'work' },
  { id: 4, text: 'Build the Todo List component', done: false, category: 'work' },
]

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action) => {
      state.push({ id: Date.now(), text: action.payload.text, category: action.payload.category || 'other', done: false })
    },
    toggleTodo: (state, action) => {
      const todo = state.find(t => t.id === action.payload)
      if (todo) todo.done = !todo.done
    },
    deleteTodo: (state, action) => {
      return state.filter(t => t.id !== action.payload)
    },
    clearCompleted: state => {
      return state.filter(t => !t.done)
    },
  },
})

export const { addTodo, toggleTodo, deleteTodo, clearCompleted } = todosSlice.actions
export default todosSlice.reducer
