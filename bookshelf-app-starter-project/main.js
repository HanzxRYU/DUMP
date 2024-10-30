const APP_STORAGE_KEY = "MY_BOOKSHELF_APP";
const BOOK_SAVED_EVENT = "book-saved-event";
let booksPending = [];
let booksCompleted = [];
let currentEditId = null;

document.addEventListener("DOMContentLoaded", () => {
  loadBooksFromStorage();
  const formElement = document.getElementById("bookForm");
  formElement.addEventListener("submit", (event) => {
    event.preventDefault();
    currentEditId ? modifyBook() : addNewBook();
  });

  const searchElement = document.getElementById("searchBook");
  searchElement.addEventListener("submit", (event) => {
    event.preventDefault();
    filterBooks();
  });

  displayBooks();
});

function addNewBook() {
  const bookTitle = document.getElementById("bookFormTitle").value;
  const bookAuthor = document.getElementById("bookFormAuthor").value;
  const publicationYear = parseInt(
    document.getElementById("bookFormYear").value
  );
  const isFinished = document.getElementById("bookFormIsComplete").checked;

  const newBook = {
    id: createUniqueId(),
    title: bookTitle,
    author: bookAuthor,
    year: publicationYear,
    isComplete: isFinished,
  };
  isFinished ? booksCompleted.push(newBook) : booksPending.push(newBook);

  saveBooksToStorage();
  displayBooks();
  resetForm();
}

function modifyBook() {
  const bookTitle = document.getElementById("bookFormTitle").value;
  const bookAuthor = document.getElementById("bookFormAuthor").value;
  const publicationYear = parseInt(
    document.getElementById("bookFormYear").value
  );
  const isFinished = document.getElementById("bookFormIsComplete").checked;

  const pendingIndex = findBookIndex(currentEditId, booksPending);
  if (pendingIndex === -1) {
    const completedIndex = findBookIndex(currentEditId, booksCompleted);
    if (completedIndex !== -1) {
      booksCompleted[completedIndex] = {
        ...booksCompleted[completedIndex],
        title: bookTitle,
        author: bookAuthor,
        year: publicationYear,
        isComplete: isFinished,
      };
    }
  } else {
    booksPending[pendingIndex] = {
      ...booksPending[pendingIndex],
      title: bookTitle,
      author: bookAuthor,
      year: publicationYear,
      isComplete: isFinished,
    };
  }

  saveBooksToStorage();
  displayBooks();
  resetForm();
  currentEditId = null;
}

function createUniqueId() {
  return Date.now();
}

function displayBooks() {
  renderPendingBooks();
  renderCompletedBooks();
}

function renderPendingBooks() {
  const pendingList = document.getElementById("incompleteBookList");
  pendingList.innerHTML = "";
  booksPending.forEach((book) => {
    const bookElement = createBookItem(book);
    pendingList.appendChild(bookElement);
  });
}

function renderCompletedBooks() {
  const completedList = document.getElementById("completeBookList");
  completedList.innerHTML = "";
  booksCompleted.forEach((book) => {
    const bookElement = createBookItem(book);
    completedList.appendChild(bookElement);
  });
}

function createBookItem(book) {
  const bookContainer = document.createElement("div");
  bookContainer.setAttribute("data-bookid", book.id);

  const titleHeader = document.createElement("h3");
  titleHeader.innerText = book.title;

  const authorParagraph = document.createElement("p");
  authorParagraph.innerText = `Penulis: ${book.author}`;

  const yearParagraph = document.createElement("p");
  yearParagraph.innerText = `Tahun: ${book.year}`;

  const buttonContainer = document.createElement("div");

  const toggleButton = document.createElement("button");
  toggleButton.innerText = book.isComplete
    ? "Belum selesai dibaca"
    : "Selesai dibaca";
  toggleButton.addEventListener("click", () => toggleBookStatus(book.id));

  const removeButton = document.createElement("button");
  removeButton.innerText = "Hapus Buku";
  removeButton.addEventListener("click", () => removeBook(book.id));

  const editButton = document.createElement("button");
  editButton.innerText = "Edit Buku";
  editButton.addEventListener("click", () => initiateEdit(book.id));

  buttonContainer.append(toggleButton, removeButton, editButton);
  bookContainer.append(
    titleHeader,
    authorParagraph,
    yearParagraph,
    buttonContainer
  );

  return bookContainer;
}

function initiateEdit(bookId) {
  currentEditId = bookId;
  const bookToEdit =
    booksPending.find((b) => b.id === bookId) ||
    booksCompleted.find((b) => b.id === bookId);
  if (bookToEdit) {
    document.getElementById("bookFormTitle").value = bookToEdit.title;
    document.getElementById("bookFormAuthor").value = bookToEdit.author;
    document.getElementById("bookFormYear").value = bookToEdit.year;
    document.getElementById("bookFormIsComplete").checked =
      bookToEdit.isComplete;
  }
}

function toggleBookStatus(bookId) {
  const pendingIndex = findBookIndex(bookId, booksPending);
  if (pendingIndex !== -1) {
    const [completedBook] = booksPending.splice(pendingIndex, 1);
    completedBook.isComplete = true;
    booksCompleted.push(completedBook);
  } else {
    const completedIndex = findBookIndex(bookId, booksCompleted);
    if (completedIndex !== -1) {
      const [incompleteBook] = booksCompleted.splice(completedIndex, 1);
      incompleteBook.isComplete = false;
      booksPending.push(incompleteBook);
    }
  }

  saveBooksToStorage();
  displayBooks();
}

function removeBook(bookId) {
  let pendingIndex = findBookIndex(bookId, booksPending);
  if (pendingIndex !== -1) {
    booksPending.splice(pendingIndex, 1);
  } else {
    let completedIndex = findBookIndex(bookId, booksCompleted);
    if (completedIndex !== -1) {
      booksCompleted.splice(completedIndex, 1);
    }
  }

  saveBooksToStorage();
  displayBooks();
}

function findBookIndex(bookId, bookArray) {
  return bookArray.findIndex((book) => book.id === bookId);
}

function resetForm() {
  document.getElementById("bookFormTitle").value = "";
  document.getElementById("bookFormAuthor").value = "";
  document.getElementById("bookFormYear").value = "";
  document.getElementById("bookFormIsComplete").checked = false;
  currentEditId = null;
}

function saveBooksToStorage() {
  const dataToSave = {
    incompleteBooks: booksPending,
    completeBooks: booksCompleted,
  };
  localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(dataToSave));
  document.dispatchEvent(new Event(BOOK_SAVED_EVENT));
}

function loadBooksFromStorage() {
  const storedData = localStorage.getItem(APP_STORAGE_KEY);
  if (storedData) {
    const parsedData = JSON.parse(storedData);
    booksPending = parsedData.incompleteBooks || [];
    booksCompleted = parsedData.completeBooks || [];
  }
  booksPending.forEach((book) => {
    book.year = parseInt(book.year);
  });
  booksCompleted.forEach((book) => {
    book.year = parseInt(book.year);
  });
}

function filterBooks() {
  const searchInput = document
    .getElementById("searchBookTitle")
    .value.toLowerCase();
  const filteredPending = booksPending.filter(
    (book) =>
      book.title.toLowerCase().includes(searchInput) ||
      book.author.toLowerCase().includes(searchInput)
  );

  const filteredCompleted = booksCompleted.filter(
    (book) =>
      book.title.toLowerCase().includes(searchInput) ||
      book.author.toLowerCase().includes(searchInput)
  );

  displayFilteredBooks(filteredPending, filteredCompleted);
}

function displayFilteredBooks(filteredPending, filteredCompleted) {
  const pendingList = document.getElementById("incompleteBookList");
  const completedList = document.getElementById("completeBookList");

  pendingList.innerHTML = "";
  completedList.innerHTML = "";

  filteredPending.forEach((book) => {
    const bookElement = createBookItem(book);
    pendingList.appendChild(bookElement);
  });

  filteredCompleted.forEach((book) => {
    const bookElement = createBookItem(book);
    completedList.appendChild(bookElement);
  });
}

document.addEventListener(BOOK_SAVED_EVENT, function () {
  console.log(localStorage.getItem(APP_STORAGE_KEY));
});
