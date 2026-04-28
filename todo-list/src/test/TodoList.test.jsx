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

const openModal = () => fireEvent.click(screen.getByRole('button', { name: 'Add task' }))

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

  it('opens modal when Add task button is clicked', () => {
    renderWithStore(<TodoList />, { preloadedState })

    openModal()

    expect(screen.getByText('New Task')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Add a new task…')).toBeInTheDocument()
  })

  it('closes modal when Cancel is clicked', () => {
    renderWithStore(<TodoList />, { preloadedState })

    openModal()
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }))

    expect(screen.queryByText('New Task')).not.toBeInTheDocument()
  })

  it('closes modal when X button is clicked', () => {
    renderWithStore(<TodoList />, { preloadedState })

    openModal()
    fireEvent.click(screen.getByRole('button', { name: /close modal/i }))

    expect(screen.queryByText('New Task')).not.toBeInTheDocument()
  })

  it('adds a new task', () => {
    renderWithStore(<TodoList />, { preloadedState })

    openModal()
    fireEvent.change(screen.getByPlaceholderText('Add a new task…'), { target: { value: 'New task' } })
    fireEvent.click(screen.getByRole('button', { name: /save/i }))

    expect(screen.getByText('New task')).toBeInTheDocument()
    expect(screen.queryByText('New Task')).not.toBeInTheDocument()
  })

  it('adds a task by pressing Enter', () => {
    renderWithStore(<TodoList />, { preloadedState })

    openModal()
    const input = screen.getByPlaceholderText('Add a new task…')
    fireEvent.change(input, { target: { value: 'Enter task' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(screen.getByText('Enter task')).toBeInTheDocument()
  })

  it('does not add an empty task', () => {
    renderWithStore(<TodoList />, { preloadedState })

    const before = screen.getAllByRole('listitem').length
    openModal()
    fireEvent.click(screen.getByRole('button', { name: /save/i }))

    expect(screen.getAllByRole('listitem').length).toBe(before)
  })

  it('clears input and closes modal after saving', () => {
    renderWithStore(<TodoList />, { preloadedState })

    openModal()
    fireEvent.change(screen.getByPlaceholderText('Add a new task…'), { target: { value: 'Temp task' } })
    fireEvent.click(screen.getByRole('button', { name: /save/i }))

    openModal()
    expect(screen.getByPlaceholderText('Add a new task…').value).toBe('')
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

    expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument()
  })

  it('does not show clear completed button when nothing is done', () => {
    const allPending = { todos: [{ id: 1, text: 'Task', done: false, category: 'other' }] }
    renderWithStore(<TodoList />, { preloadedState: allPending })

    expect(screen.queryByText('Clear completed')).not.toBeInTheDocument()
  })

  describe('categories', () => {
    it('renders category badges for groups present in state', () => {
      renderWithStore(<TodoList />, { preloadedState })

      expect(screen.getByText('Shopping')).toBeInTheDocument()
      expect(screen.getByText('Work')).toBeInTheDocument()
    })

    it('todos appear under their category group', () => {
      renderWithStore(<TodoList />, { preloadedState })

      const shoppingBadge = screen.getByText('Shopping')
      expect(shoppingBadge.closest('section')).toHaveTextContent('Buy groceries')

      const workBadge = screen.getByText('Work')
      expect(workBadge.closest('section')).toHaveTextContent('Write tests')
    })

    it('adding a todo with a selected category places it in the right group', () => {
      renderWithStore(<TodoList />, { preloadedState })

      openModal()
      fireEvent.change(screen.getByRole('combobox'), { target: { value: 'health' } })
      fireEvent.change(screen.getByPlaceholderText('Add a new task…'), { target: { value: 'Go running' } })
      fireEvent.click(screen.getByRole('button', { name: /save/i }))

      const healthBadge = screen.getByText('Health')
      expect(healthBadge.closest('section')).toHaveTextContent('Go running')
    })

    it('todos in different categories render under separate group headings', () => {
      renderWithStore(<TodoList />, { preloadedState })

      const sections = document.querySelectorAll('section')
      expect(sections.length).toBe(2)
    })

    it('shows empty state when todos list is empty', () => {
      renderWithStore(<TodoList />, { preloadedState: { todos: [] } })

      expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument()
      expect(document.querySelectorAll('section').length).toBe(0)
    })
  })
})
