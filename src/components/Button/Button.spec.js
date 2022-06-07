import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '.'

describe('<Button />', () => {
  it('should render the button with a text "Load more" as it\'s content', () => {
    render(<Button text='Load more' />)

    const button = screen.getByRole('button', { name: /load more/i })
    expect(button).toBeInTheDocument()
  })

  it('should call function on button click', () => {
    const fn = jest.fn()

    render(<Button text='Load more' onClick={fn} />)

    const button = screen.getByRole('button', { name: /load more/i })

    // Could be fireEvent/userEvent
    userEvent.click(button)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Button text='Load more' disabled={true} />)

    const button = screen.getByRole('button', { name: /load more/i })
    expect(button).toBeDisabled()
  })

  it('should be enabled when disabled prop is false', () => {
    render(<Button text='Load more' disabled={false} />)

    const button = screen.getByRole('button', { name: /load more/i })
    expect(button).toBeEnabled()
  })

  it('should be enabled when disabled prop is not set', () => {
    render(<Button text='Load more' />)

    const button = screen.getByRole('button', { name: /load more/i })
    expect(button).toBeEnabled()
  })
})
