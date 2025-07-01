import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useBooks } from "../context/BookContext";

export default function HomePage() {
  const { logout, user } = useAuth();
  const {
    books,
    loading,
    pagination,
    fetchBooks,
    addBook,
    updateBook,
    deleteBook,
    sortOption,
    setSortOption,
  } = useBooks();

  const [formData, setFormData] = useState({ title: "", description: "" });
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetchBooks(1, sortOption);
  }, [sortOption]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description) {
      setFormError("Title and description are required");
      return;
    }

    setFormError("");

    if (editId) await updateBook(editId, formData);
    else await addBook(formData);

    setFormData({ title: "", description: "" });
    setEditId(null);
    setShowForm(false);
  };

  const handleEdit = (book) => {
    setFormData({ title: book.title, description: book.description });
    setEditId(book.id);
    setShowForm(true);
    setFormError("");
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-center md:text-left">
          📘 BooksTitle
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-2">
          <span className="text-gray-700 text-sm">{user?.name}</span>
          <button
            onClick={logout}
            className="bg-red-500 px-4 py-2 text-white rounded hover:bg-red-600 text-sm"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Sort + Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-auto"
        >
          <option value="created_at-desc">Newest First</option>
          <option value="created_at-asc">Oldest First</option>
          <option value="title-asc">Title A-Z</option>
          <option value="title-desc">Title Z-A</option>
        </select>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setFormData({ title: "", description: "" });
            setEditId(null);
            setFormError("");
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
        >
          {showForm ? "Close" : "Add New"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 rounded shadow space-y-3 mb-6"
        >
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            placeholder="Book title"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
          />
          <textarea
            className="w-full border px-3 py-2 rounded"
            placeholder="Book description"
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
          />
          {formError && <p className="text-sm text-red-600">{formError}</p>}
          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
            >
              {editId ? "Update" : "Create"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={() => {
                  setEditId(null);
                  setFormData({ title: "", description: "" });
                  setShowForm(false);
                  setFormError("");
                }}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 text-sm"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      {/* Book List */}
      {loading ? (
        <p className="text-center text-gray-500">Loading books...</p>
      ) : books.length === 0 ? (
        <p className="text-center text-gray-500">No books found.</p>
      ) : (
        <ul className="space-y-4">
          {books.map((book) => (
            <li key={book.id} className="bg-white p-4 rounded shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{book.title}</h3>
                  <p className="text-sm text-gray-700">{book.description}</p>
                </div>
                <div className="flex gap-2 text-sm">
                  <button
                    onClick={() => handleEdit(book)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteBook(book.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Created: {new Date(book.created_at).toLocaleString()} | Updated:{" "}
                {new Date(book.updated_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      <div className="mt-6 flex justify-center gap-4">
        <button
          disabled={pagination.currentPage <= 1}
          onClick={() => fetchBooks(pagination.currentPage - 1, sortOption)}
          className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-sm px-3">Page {pagination.currentPage}</span>
        <button
          disabled={!pagination.nextPage}
          onClick={() => fetchBooks(pagination.currentPage + 1, sortOption)}
          className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
