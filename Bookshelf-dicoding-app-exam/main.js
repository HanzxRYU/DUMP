document.addEventListener("DOMContentLoaded", function () {
  const bookForm = document.getElementById("bookForm");
  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");
  const searchBookForm = document.getElementById("searchBook");

  const STORAGE_KEY = "BOOKS_DATA";

  let books = [];

  function loadBooksFromStorage() {
    const storedBooks = localStorage.getItem(STORAGE_KEY);
    if (storedBooks) {
      books = JSON.parse(storedBooks);
      books.forEach((book) => addBookToDOM(book));
    }
  }

  function saveBooksToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  }

  function addBook(title, author, year, isComplete) {
    const bookId = Date.now().toString();
    const book = { id: bookId, title, author, year: Number(year), isComplete }; // Mengonversi year ke number
    books.push(book);
    saveBooksToStorage();
    addBookToDOM(book);
  }

  function addBookToDOM(book) {
    const bookItem = document.createElement("div");
    bookItem.classList.add("card");
    bookItem.setAttribute("data-testid", "bookItem");
    bookItem.setAttribute("data-bookid", book.id);

    bookItem.innerHTML = `
      <h3 data-testid="bookItemTitle">${book.title}</h3>
      <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
      <p data-testid="bookItemYear">Tahun: ${book.year}</p>
      <div>
        <button data-testid="bookItemIsCompleteButton">${
          book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca"
        }</button>
        <button data-testid="bookItemDeleteButton">Hapus Buku</button>
      </div>
    `;

    const toggleButton = bookItem.querySelector(
      "[data-testid='bookItemIsCompleteButton']"
    );
    toggleButton.addEventListener("click", function () {
      toggleBookCompletion(book.id);
    });

    const deleteButton = bookItem.querySelector(
      "[data-testid='bookItemDeleteButton']"
    );
    deleteButton.addEventListener("click", function () {
      removeBook(book.id);
    });

    if (book.isComplete) {
      completeBookList.appendChild(bookItem);
    } else {
      incompleteBookList.appendChild(bookItem);
    }
  }

  function toggleBookCompletion(bookId) {
    const book = books.find((book) => book.id === bookId);
    if (book) {
      book.isComplete = !book.isComplete;
      saveBooksToStorage();
      renderBooks();
    }
  }

  function removeBook(bookId) {
    books = books.filter((book) => book.id !== bookId);
    saveBooksToStorage();
    renderBooks();
  }

  function renderBooks() {
    incompleteBookList.innerHTML = "";
    completeBookList.innerHTML = "";
    books.forEach((book) => addBookToDOM(book));
  }

  bookForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const title = document.getElementById("bookFormTitle").value;
    const author = document.getElementById("bookFormAuthor").value;
    const year = document.getElementById("bookFormYear").value; // Masih dalam string
    const isComplete = document.getElementById("bookFormIsComplete").checked;

    addBook(title, author, year, isComplete);

    bookForm.reset();
  });

  searchBookForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const searchQuery = document
      .getElementById("searchBookTitle")
      .value.toLowerCase();

    filterBooks(searchQuery);
  });

  function filterBooks(query) {
    const booksDOM = document.querySelectorAll("[data-testid='bookItem']");

    booksDOM.forEach((book) => {
      const title = book
        .querySelector("[data-testid='bookItemTitle']")
        .textContent.toLowerCase();

      book.style.display = title.includes(query) ? "" : "none";
    });
  }

  loadBooksFromStorage();
});
