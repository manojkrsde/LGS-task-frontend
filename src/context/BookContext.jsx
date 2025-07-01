// context/BookContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../helpers/axiosInstance";
import { toast } from "react-toastify";

const BookContext = createContext();

export const BookProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState("created_at-desc");

  const fetchBooks = async (page = 1, sort = sortOption) => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(
        `/api/books?pageNumber=${page}&sort=${sort}`
      );
      if (res?.data?.success) {
        setBooks(res.data.data.data);
        setPagination(res.data.data);
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (err) {
      setBooks([]);
      setPagination({});
    } finally {
      setLoading(false);
    }
  };

  const addBook = async (book) => {
    try {
      const response = await axiosInstance.post(`/api/books`, book);
      if (response?.status === 201) {
        toast.success("Book added");
        fetchBooks(pagination.currentPage || 1);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const updateBook = async (id, book) => {
    try {
      await axiosInstance.put(`/api/books/${id}`, book);
      toast.success("Book updated");
      fetchBooks(pagination.currentPage || 1);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const deleteBook = async (id) => {
    try {
      await axiosInstance.delete(`/api/books/${id}`);
      toast.success("Book deleted");
      fetchBooks(pagination.currentPage || 1);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <BookContext.Provider
      value={{
        books,
        loading,
        pagination,
        fetchBooks,
        addBook,
        updateBook,
        deleteBook,
        sortOption,
        setSortOption,
      }}
    >
      {children}
    </BookContext.Provider>
  );
};

export const useBooks = () => useContext(BookContext);
