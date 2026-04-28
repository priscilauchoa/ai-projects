import { screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import TodoList from '../TodoList'
import { renderWithStore } from './renderWithStore'

const preloadedState = {
  todos: [
    { id: 1, text: 'Buy groceries', done: false, category: 'shopping' },
    { id: 2, text: 'Write tests', done: true, category: 'work' },
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

    // Work group renders first, so deleteButtons[0] removes 'Write tests'
    expect(screen.queryByText('Write tests')).not.toBeInTheDocument()
    expect(screen.getByText('Buy groceries')).toBeInTheDocument()
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
    const allPending = { todos: [{ id: 1, text: 'Task', done: false, category: 'other' }] }
    renderWithStore(<TodoList />, { preloadedState: allPending })

    expect(screen.queryByText('Clear completed')).not.toBeInTheDocument()
  })

  describe('categories', () => {
    it('renders category badges for groups present in state', () => {
      renderWithStore(<TodoList />, { preloadedState })

      // getAllByText because the label also appears in the <select> options
      expect(screen.getAllByText('Shopping').length).toBeGreaterThan(0)
      expect(screen.getAllByText('Work').length).toBeGreaterThan(0)
    })

    it('todos appear under their category group', () => {
      renderWithStore(<TodoList />, { preloadedState })

      // Use the badge <span>, not the <option> in the select
      const shoppingBadge = screen.getAllByText('Shopping').find(el => el.tagName === 'SPAN')
      expect(shoppingBadge.closest('section')).toHaveTextContent('Buy groceries')

      const workBadge = screen.getAllByText('Work').find(el => el.tagName === 'SPAN')
      expect(workBadge.closest('section')).toHaveTextContent('Write tests')
    })

    it('adding a todo with a selected category places it in the right group', () => {
      renderWithStore(<TodoList />, { preloadedState })

      fireEvent.change(screen.getByRole('combobox'), { target: { value: 'health' } })
      fireEvent.change(screen.getByPlaceholderText('Add a new task…'), { target: { value: 'Go running' } })
      fireEvent.click(screen.getByRole('button', { name: /add/i }))

      const healthBadge = screen.getAllByText('Health').find(el => el.tagName === 'SPAN')
      expect(healthBadge.closest('section')).toHaveTextContent('Go running')
    })

    it('todos in different categories render under separate group headings', () => {
      renderWithStore(<TodoList />, { preloadedState })

      const sections = document.querySelectorAll('section')
      expect(sections.length).toBe(2)
    })

    it('shows empty state when todos list is empty', () => {
      renderWithStore(<TodoList />, { preloadedState: { todos: [] } })

      expect(screen.getByText('No tasks yet. Add one above!')).toBeInTheDocument()
      expect(document.querySelectorAll('section').length).toBe(0)
    })
  })
})
