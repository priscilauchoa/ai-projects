import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import todosReducer from '../store/todosSlice'

export function renderWithStore(ui, { preloadedState } = {}) {
  const store = configureStore({
    reducer: { todos: todosReducer },
    preloadedState,
  })

  return {
    ...render(<Provider store={store}>{ui}</Provider>),
    store,
  }
}
