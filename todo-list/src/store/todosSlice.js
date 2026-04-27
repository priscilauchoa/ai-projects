import { createSlice } from '@reduxjs/toolkit'

const initialState = [
  { id: 1, text: 'Design the landing page layout', done: false },
  { id: 2, text: 'Set up the React project with Vite', done: true },
  { id: 3, text: 'Integrate Tailwind CSS', done: true },
  { id: 4, text: 'Build the Todo List component', done: false },
]

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action) => {
      state.push({ id: Date.now(), text: action.payload, done: false })
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
