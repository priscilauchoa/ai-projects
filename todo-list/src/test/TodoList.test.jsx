import { screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import TodoList from '../TodoList'
import { renderWithStore } from './renderWithStore'

const preloadedState = {
  todos: [
    { id: 1, text: 'Buy groceries', done: false },
    { id: 2, text: 'Write tests', done: true },
  ],
}

describe('TodoList', () => {
  it('renders existing tasks', () => {
    renderWithStore(<TodoList />, { preloadedState })

    expect(screen.getByText('Buy groceries')).toBeInTheDocument()
    expect(screen.getByText('Write tests')).toBeInTheDocument()
  })

  it('shows correct completed count in header', () => {
    renderWithStore(<TodoList />, { preloadedState })

    expect(screen.getByText('1 of 2 completed')).toBeInTheDocument()
  })

  it('adds a new task', () => {
    renderWithStore(<TodoList />, { preloadedState })

    const input = screen.getByPlaceholderText('Add a new task…')
    fireEvent.change(input, { target: { value: 'New task' } })
    fireEvent.click(screen.getByRole('button', { name: /add/i }))

    expect(screen.getByText('New task')).toBeInTheDocument()
    expect(input.value).toBe('')
  })

  it('adds a task by pressing Enter', () => {
    renderWithStore(<TodoList />, { preloadedState })

    const input = screen.getByPlaceholderText('Add a new task…')
    fireEvent.change(input, { target: { value: 'Enter task' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(screen.getByText('Enter task')).toBeInTheDocument()
  })

  it('does not add an empty task', () => {
    renderWithStore(<TodoList />, { preloadedState })

    const before = screen.getAllByRole('listitem').length
    fireEvent.click(screen.getByRole('button', { name: /add/i }))

    expect(screen.getAllByRole('listitem').length).toBe(before)
  })

  it('toggles a task as done', () => {
    renderWithStore(<TodoList />, { preloadedState })

    const toggle = screen.getByRole('button', { name: 'Mark complete' })
    fireEvent.click(toggle)

    expect(screen.getByText('2 of 2 completed')).toBeInTheDocument()
  })

  it('toggles a done task back to pending', () => {
    renderWithStore(<TodoList />, { preloadedState })

    const toggle = screen.getByRole('button', { name: 'Mark incomplete' })
    fireEvent.click(toggle)

    expect(screen.getByText('0 of 2 completed')).toBeInTheDocument()
  })

  it('deletes a task', () => {
    renderWithStore(<TodoList />, { preloadedState })

    const deleteButtons = screen.getAllByRole('button', { name: 'Delete task' })
    fireEvent.click(deleteButtons[0])

    expect(screen.queryByText('Buy groceries')).not.toBeInTheDocument()
  })

  it('clears completed tasks', () => {
    renderWithStore(<TodoList />, { preloadedState })

    fireEvent.click(screen.getByText('Clear completed'))

    expect(screen.queryByText('Write tests')).not.toBeInTheDocument()
    expect(screen.getByText('Buy groceries')).toBeInTheDocument()
  })

  it('shows empty state when no tasks', () => {
    renderWithStore(<TodoList />, { preloadedState: { todos: [] } })

    expect(screen.getByText('No tasks yet. Add one above!')).toBeInTheDocument()
  })

  it('does not show clear completed button when nothing is done', () => {
    const allPending = { todos: [{ id: 1, text: 'Task', done: false }] }
    renderWithStore(<TodoList />, { preloadedState: allPending })

    expect(screen.queryByText('Clear completed')).not.toBeInTheDocument()
  })
})
