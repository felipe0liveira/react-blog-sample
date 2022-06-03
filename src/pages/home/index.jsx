import { Component } from 'react'
import { loadPosts } from '../../utils/load-posts'
import { Posts } from '../../components/Posts'
import { Button } from '../../components/Button'
import { TextInput } from '../../components/TextInput'

import './styles.css'

export class Home extends Component {
  state = {
    posts: [],
    allPosts: [],
    page: 0,
    postsPerPage: 12,
    searchValue: '',
  }

  loadPosts = async () => {
    const { page, postsPerPage } = this.state

    const postsAndPhotos = await loadPosts()

    this.setState({
      posts: postsAndPhotos.slice(page, postsPerPage),
      allPosts: postsAndPhotos,
    })
  }

  loadMorePosts = () => {
    const { page, postsPerPage, allPosts, posts } = this.state
    const nextPage = page + postsPerPage
    const nextPosts = allPosts.slice(nextPage, nextPage + postsPerPage)

    posts.push(...nextPosts)
    this.setState({ posts, page: nextPage })
  }

  handleSearchChange = (e) => {
    const { value } = e.target

    this.setState({ searchValue: value })
  }

  async componentDidMount() {
    await this.loadPosts()
  }

  render() {
    const { posts, page, postsPerPage, allPosts, searchValue } = this.state
    const noMorePosts = page + postsPerPage >= allPosts.length

    const filteredPosts = !!searchValue
      ? allPosts.filter((p) =>
          p.title.toLowerCase().includes(searchValue.toLowerCase())
        )
      : posts

    return (
      <section className='container'>
        <div className='search-container'>
          {!!searchValue && <h1>Searching title: '{searchValue}'</h1>}
          <TextInput
            searchValue={searchValue}
            handleChange={this.handleSearchChange}
          />
        </div>

        {filteredPosts.length > 0 && <Posts posts={filteredPosts} />}
        {filteredPosts.length === 0 && <p>None posts found!</p>}
        <div className='button-container'>
          {!searchValue && (
            <Button
              text='Load more posts'
              onClick={this.loadMorePosts}
              disabled={noMorePosts}
            />
          )}
        </div>
      </section>
    )
  }
}
