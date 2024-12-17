import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {Oval} from 'react-loader-spinner'
import './App.css'

function App() {
  const [books, setBooks] = useState([])
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    genre: '',
    pages: '',
    publishedDate: '',
  })
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState(false)
  const [currentBook, setCurrentBook] = useState(null)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async () => {
    try {
      const response = await axios.get(
        'https://book-mangement-w1ri.onrender.com/books',
      )
      setBooks(response.data)
    } catch (error) {
      console.error('Error fetching books', error)
    }
  }

  const handleChange = e => {
    const {name, value} = e.target
    setNewBook(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSearch = e => {
    setSearch(e.target.value)
  }

  const handleAddBook = async e => {
    e.preventDefault()
    try {
      await axios.post(
        'https://book-mangement-w1ri.onrender.com/books',
        newBook,
      )
      fetchBooks()
      setNewBook({
        title: '',
        author: '',
        genre: '',
        pages: '',
        publishedDate: '',
      })
    } catch (error) {
      console.error('Error adding book', error)
    }
  }

  const handleEditBook = async e => {
    e.preventDefault()
    try {
      await axios.put(
        `https://book-mangement-w1ri.onrender.com/books/${currentBook.bookId}`,
        newBook,
      )
      fetchBooks()
      setEditing(false)
      setNewBook({
        title: '',
        author: '',
        genre: '',
        pages: '',
        publishedDate: '',
      })
    } catch (error) {
      console.error('Error updating book', error)
    }
  }

  const handleDeleteBook = async bookId => {
    try {
      await axios.delete(
        `https://book-mangement-w1ri.onrender.com/books/${bookId}`,
      )
      fetchBooks()
    } catch (error) {
      console.error('Error deleting book', error)
    }
  }

  const handleEditForm = book => {
    setEditing(true)
    setCurrentBook(book)
    setNewBook({
      title: book.title,
      author: book.author,
      genre: book.genre,
      pages: book.pages,
      publishedDate: book.publishedDate,
    })
  }

  const filteredBooks = books.filter(book =>
    book.author.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="app-container">
      <h1>Book Management</h1>

      <div className="search-container">
        <input
          type="search"
          placeholder="Search by Author"
          value={search}
          onChange={handleSearch}
        />
      </div>

      <div className="form-container">
        <h2>{editing ? 'Edit Book' : 'Add New Book'}</h2>
        <form onSubmit={editing ? handleEditBook : handleAddBook}>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={newBook.title}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="author"
            placeholder="Author"
            value={newBook.author}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="genre"
            placeholder="Genre"
            value={newBook.genre}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="pages"
            placeholder="Pages"
            value={newBook.pages}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="publishedDate"
            value={newBook.publishedDate}
            placeholder="Published Date"
            onChange={handleChange}
            required
          />
          <button type="submit">{editing ? 'Update' : 'Add'}</button>
        </form>
      </div>

      <div className="books-list">
        {filteredBooks.length > 0 ? (
          filteredBooks.map(book => (
            <div className="book-item" key={book.bookId}>
              <h3>{book.title}</h3>
              <p>Author: {book.author}</p>
              <p>Genre: {book.genre}</p>
              <p>Pages: {book.pages}</p>
              <p>Published: {book.publishedDate}</p>
              <div className="actions">
                <button onClick={() => handleEditForm(book)}>Edit</button>
                <button onClick={() => handleDeleteBook(book.bookId)}>
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <h2 className="text-center">No books found</h2>
        )}
      </div>
    </div>
  )
}

export default App

