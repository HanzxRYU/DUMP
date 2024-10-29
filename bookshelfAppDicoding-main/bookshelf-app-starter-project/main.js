const STORAGE_KEY = "BOOKSHELF_APP";

const SAVED_EVENT = "saved-buku";
let incompleteBooks = [];
let completeBooks = [];
let editingBookId = null;

document.addEventListener("DOMContentLoaded", () => {
  loadDataFromStorage();
  const bookForm = document.getElementById("bookForm");
  bookForm.addEventListener("submit", (event) => {
    event.preventDefault();
    editingBookId ? updateBook() : addBook();
  });

  const searchForm = document.getElementById("searchBook");
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    searchBooks();
  });

  renderBooks();
});

function addBook() {
  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const year = parseInt(document.getElementById("bookFormYear").value);
  const isComplete = document.getElementById("bookFormIsComplete").checked;

  const book = { id: generateId(), title, author, year, isComplete };
  isComplete ? completeBooks.push(book) : incompleteBooks.push(book);

  saveDataToStorage();
  renderBooks();
  clearForm();
}

function updateBook() {
  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const year = parseInt(document.getElementById("bookFormYear").value);
  const isComplete = document.getElementById("bookFormIsComplete").checked;

  const bookIndex = findBookIndex(editingBookId, incompleteBooks);
  if (bookIndex === -1) {
    const completeBookIndex = findBookIndex(editingBookId, completeBooks);
    if (completeBookIndex !== -1) {
      completeBooks[completeBookIndex] = {
        ...completeBooks[completeBookIndex],
        title,
        author,
        year,
        isComplete,
      };
    }
  } else {
    incompleteBooks[bookIndex] = {
      ...incompleteBooks[bookIndex],
      title,
      author,
      year,
      isComplete,
    };
  }

  saveDataToStorage();
  renderBooks();
  clearForm();
  editingBookId = null;
}

function generateId() {
  return +new Date();
}

function renderBooks() {
  renderIncompleteBooks();
  renderCompleteBooks();
}

function renderIncompleteBooks() {
  const incompleteBookList = document.getElementById("incompleteBookList");
  incompleteBookList.innerHTML = "";
  for (const book of incompleteBooks) {
    const bookElement = createBookElement(book);
    incompleteBookList.appendChild(bookElement);
  }
}

function renderCompleteBooks() {
  const completeBookList = document.getElementById("completeBookList");
  completeBookList.innerHTML = "";
  for (const book of completeBooks) {
    const bookElement = createBookElement(book);
    completeBookList.appendChild(bookElement);
  }
}

function createBookElement(book) {
  const bookItem = document.createElement("div");
  bookItem.setAttribute("data-bookid", book.id);
  bookItem.setAttribute("data-testid", "bookItem");

  const titleElement = document.createElement("h3");
  titleElement.setAttribute("data-testid", "bookItemTitle");
  titleElement.innerText = book.title;

  const authorElement = document.createElement("p");
  authorElement.setAttribute("data-testid", "bookItemAuthor");
  authorElement.innerText = `Penulis: ${book.author}`;

  const yearElement = document.createElement("p");
  yearElement.setAttribute("data-testid", "bookItemYear");
  yearElement.innerText = `Tahun: ${book.year}`;

  const buttonContainer = document.createElement("div");

  const completeButton = document.createElement("button");
  completeButton.setAttribute("data-testid", "bookItemIsCompleteButton");
  completeButton.innerText = book.isComplete
    ? "Belum selesai dibaca"
    : "Selesai dibaca";
  completeButton.addEventListener("click", () => toggleComplete(book.id));

  const deleteButton = document.createElement("button");
  deleteButton.setAttribute("data-testid", "bookItemDeleteButton");
  deleteButton.innerText = "Hapus Buku";
  deleteButton.addEventListener("click", () => deleteBook(book.id));

  const editButton = document.createElement("button");
  editButton.setAttribute("data-testid", "bookItemEditButton");
  editButton.innerText = "Edit Buku";
  editButton.addEventListener("click", () => editBook(book.id));

  buttonContainer.append(completeButton, deleteButton, editButton);
  bookItem.append(titleElement, authorElement, yearElement, buttonContainer);

  return bookItem;
}

function editBook(bookId) {
  editingBookId = bookId;
  const book =
    incompleteBooks.find((b) => b.id === bookId) ||
    completeBooks.find((b) => b.id === bookId);
  if (book) {
    document.getElementById("bookFormTitle").value = book.title;
    document.getElementById("bookFormAuthor").value = book.author;
    document.getElementById("bookFormYear").value = book.year;
    document.getElementById("bookFormIsComplete").checked = book.isComplete;
  }
}

function toggleComplete(bookId) {
  const bookIndex = findBookIndex(bookId, incompleteBooks);
  if (bookIndex !== -1) {
    const [completedBook] = incompleteBooks.splice(bookIndex, 1);
    completedBook.isComplete = true;
    completeBooks.push(completedBook);
  } else {
    const completeBookIndex = findBookIndex(bookId, completeBooks);
    if (completeBookIndex !== -1) {
      const [incompleteBook] = completeBooks.splice(completeBookIndex, 1);
      incompleteBooks.push(incompleteBook);
      incompleteBooks[incompleteBooks.length - 1].isComplete = false;
    }
  }

  saveDataToStorage();
  renderBooks();
}

function deleteBook(bookId) {
  let bookIndex = findBookIndex(bookId, incompleteBooks);
  if (bookIndex !== -1) {
    incompleteBooks.splice(bookIndex, 1);
  } else {
    bookIndex = findBookIndex(bookId, completeBooks);
    if (bookIndex !== -1) {
      completeBooks.splice(bookIndex, 1);
    }
  }

  saveDataToStorage();
  renderBooks();
}

function findBookIndex(bookId, bookList) {
  return bookList.findIndex((book) => book.id === bookId);
}

function clearForm() {
  document.getElementById("bookFormTitle").value = "";
  document.getElementById("bookFormAuthor").value = "";
  document.getElementById("bookFormYear").value = "";
  document.getElementById("bookFormIsComplete").checked = false;
  editingBookId = null;
}

function saveDataToStorage() {
  const data = { incompleteBooks, completeBooks };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  document.dispatchEvent(new Event(SAVED_EVENT));
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  if (serializedData) {
    const data = JSON.parse(serializedData);
    incompleteBooks = data.incompleteBooks || [];
    completeBooks = data.completeBooks || [];
  }
  incompleteBooks.forEach((book) => {
    book.year = parseInt(book.year);
  });
  completeBooks.forEach((book) => {
    book.year = parseInt(book.year);
  });
}

function searchBooks() {
  const searchQuery = document
    .getElementById("searchBookTitle")
    .value.toLowerCase();
  const filteredIncompleteBooks = incompleteBooks.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery) ||
      book.author.toLowerCase().includes(searchQuery)
  );

  const filteredCompleteBooks = completeBooks.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery) ||
      book.author.toLowerCase().includes(searchQuery)
  );

  renderFilteredBooks(filteredIncompleteBooks, filteredCompleteBooks);
}

function renderFilteredBooks(filteredIncompleteBooks, filteredCompleteBooks) {
  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");

  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  for (const book of filteredIncompleteBooks) {
    const bookElement = createBookElement(book);
    incompleteBookList.appendChild(bookElement);
  }

  for (const book of filteredCompleteBooks) {
    const bookElement = createBookElement(book);
    completeBookList.appendChild(bookElement);
  }
}
document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});
