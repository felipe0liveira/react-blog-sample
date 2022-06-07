import { render, screen, waitForElementToBeRemoved } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { Home } from '.'

const handlers = [
  rest.get('https://jsonplaceholder.typicode.com/posts', async (req, res, ctx) => {
    return res(
      ctx.json([
        {
          userId: 1,
          id: 1,
          title: 'My title 1',
          body: 'My body 1',
        },
        {
          userId: 1,
          id: 2,
          title: 'My title 2',
          body: 'My body 2',
        },
        {
          userId: 1,
          id: 3,
          title: 'My Title 3',
          body: 'My body 3',
        },
      ])
    )
  }),
  rest.get('https://jsonplaceholder.typicode.com/photos', async (req, res, ctx) => {
    return res(ctx.json([{ url: 'img/img1.png' }, { url: 'img/img2.png' }, { url: 'img/img3.png' }]))
  }),
]

const server = setupServer(...handlers)

describe('<Home />', () => {
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  it('should render search, posts and load more', async () => {
    render(<Home />)

    expect.assertions(3)

    const noMorePosts = screen.getByText('None posts found!')
    await waitForElementToBeRemoved(noMorePosts)

    const searchInput = screen.getByPlaceholderText(/Search for posts here/i)
    expect(searchInput).toBeInTheDocument()

    const images = screen.getAllByRole('img', { name: /title/i })
    expect(images).toHaveLength(2)

    const button = screen.getByRole('button', { name: /load/i })
    expect(button).toBeInTheDocument()
  })

  it('should show two posts', async () => {
    render(<Home />)
    expect.assertions(4)

    await waitForElementToBeRemoved(screen.getByText('None posts found!'))

    const searchInput = screen.getByPlaceholderText(/Search for posts here/i)
    expect(searchInput).toBeInTheDocument()

    expect(screen.getByRole('heading', { name: /my title 1/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /my title 2/i })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /my title 3/i })).not.toBeInTheDocument()
  })

  it('should show a specifc post from a search', async () => {
    render(<Home />)
    expect.assertions(5)

    await waitForElementToBeRemoved(screen.getByText('None posts found!'))

    const searchInput = screen.getByPlaceholderText(/Search for posts here/i)
    expect(searchInput).toBeInTheDocument()

    userEvent.type(searchInput, 'title 1')
    expect(screen.getByRole('heading', { name: /my title 1/i })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /my title 2/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /my title 3/i })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: "Searching title: 'title 1'" })).toBeInTheDocument()
  })

  it('should show two posts after writing and clearing the input', async () => {
    render(<Home />)
    expect.assertions(3)

    await waitForElementToBeRemoved(screen.getByText('None posts found!'))

    const searchInput = screen.getByPlaceholderText(/Search for posts here/i)
    expect(searchInput).toBeInTheDocument()

    userEvent.type(searchInput, 'title 1')
    userEvent.clear(searchInput)
    expect(screen.getByRole('heading', { name: /my title 1/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /my title 2/i })).toBeInTheDocument()
  })

  it("should not show posts when search doesn't match any title", async () => {
    render(<Home />)
    expect.assertions(2)

    await waitForElementToBeRemoved(screen.getByText('None posts found!'))

    const searchInput = screen.getByPlaceholderText(/Search for posts here/i)
    expect(searchInput).toBeInTheDocument()

    userEvent.type(searchInput, 'wontfind')
    expect(screen.getByText('None posts found!')).toBeInTheDocument()
  })

  it('should load more posts', async () => {
    render(<Home />)
    // expect.assertions(2)

    await waitForElementToBeRemoved(screen.getByText('None posts found!'))

    const button = screen.getByRole('button', /load more posts/i)
    userEvent.click(button)

    expect(screen.getByRole('heading', { name: /my title 3/i })).toBeInTheDocument()
    expect(button).toBeDisabled()
  })
})
