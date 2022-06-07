import { useCallback, useEffect, useState } from 'react'
import { loadPosts } from '../../utils/load-posts'
import { Posts } from '../../components/Posts'
import { Button } from '../../components/Button'
import { TextInput } from '../../components/TextInput'

import './styles.css'

export const Home = () => {
  const [posts, setPosts] = useState([])
  const [allPosts, setAllPosts] = useState([])
  const [page, setPage] = useState(0)
  const [searchValue, setSearchValue] = useState('')

  const POSTS_PER_PAGE = 12

  const noMorePosts = page + POSTS_PER_PAGE >= allPosts.length

  const filteredPosts = !!searchValue
    ? allPosts.filter((p) => p.title.toLowerCase().includes(searchValue.toLowerCase()))
    : posts

  const handleLoadPosts = useCallback(async (page, postsPerPage) => {
    const postsAndPhotos = await loadPosts()

    setPosts(postsAndPhotos.slice(page, postsPerPage))
    setAllPosts(postsAndPhotos)
  }, [])

  const loadMorePosts = () => {
    const nextPage = page + POSTS_PER_PAGE
    const nextPosts = allPosts.slice(nextPage, nextPage + POSTS_PER_PAGE)

    posts.push(...nextPosts)

    setPosts(posts)
    setPage(nextPage)
  }

  const handleSearchChange = (e) => {
    const { value } = e.target

    setSearchValue(value)
  }

  useEffect(() => {
    handleLoadPosts(0, POSTS_PER_PAGE)
  }, [handleLoadPosts, POSTS_PER_PAGE])

  return (
    <section className='container'>
      <div className='search-container'>
        {!!searchValue && <h1>Searching title: '{searchValue}'</h1>}
        <TextInput searchValue={searchValue} handleChange={handleSearchChange} />
      </div>

      {filteredPosts.length > 0 && <Posts posts={filteredPosts} />}
      {filteredPosts.length === 0 && <p>None posts found!</p>}
      <div className='button-container'>
        {!searchValue && <Button text='Load more posts' onClick={loadMorePosts} disabled={noMorePosts} />}
      </div>
    </section>
  )
}
