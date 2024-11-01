document.addEventListener("DOMContentLoaded", function () {
  const bookForm = document.getElementById("bookForm");
  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");
  const searchBookForm = document.getElementById("searchBook");

  // Submit Book Form
  bookForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const title = document.getElementById("bookFormTitle").value;
    const author = document.getElementById("bookFormAuthor").value;
    const year = document.getElementById("bookFormYear").value;
    const isComplete = document.getElementById("bookFormIsComplete").checked;

    addBook(title, author, year, isComplete);
    bookForm.reset();
  });

  // Add Book to List
  function addBook(title, author, year, isComplete) {
    const bookItem = document.createElement("div");
    bookItem.classList.add("card");
    bookItem.setAttribute("data-testid", "bookItem");

    bookItem.innerHTML = `
      <h3 data-testid="bookItemTitle">${title}</h3>
      <p data-testid="bookItemAuthor">Penulis: ${author}</p>
      <p data-testid="bookItemYear">Tahun: ${year}</p>
      <div>
        <button data-testid="bookItemIsCompleteButton">${
          isComplete ? "Belum selesai dibaca" : "Selesai dibaca"
        }</button>
        <button data-testid="bookItemDeleteButton">Hapus Buku</button>
      </div>
    `;

    const toggleButton = bookItem.querySelector(
      "[data-testid='bookItemIsCompleteButton']"
    );
    toggleButton.addEventListener("click", function () {
      toggleBookCompletion(bookItem);
    });

    const deleteButton = bookItem.querySelector(
      "[data-testid='bookItemDeleteButton']"
    );
    deleteButton.addEventListener("click", function () {
      bookItem.remove();
    });

    if (isComplete) {
      completeBookList.appendChild(bookItem);
    } else {
      incompleteBookList.appendChild(bookItem);
    }
  }

  // Toggle Book Completion
  function toggleBookCompletion(bookItem) {
    const isComplete = bookItem.parentElement === completeBookList;
    const targetList = isComplete ? incompleteBookList : completeBookList;
    const toggleButton = bookItem.querySelector(
      "[data-testid='bookItemIsCompleteButton']"
    );
    toggleButton.textContent = isComplete
      ? "Selesai dibaca"
      : "Belum selesai dibaca";
    targetList.appendChild(bookItem);
  }

  // Search for Books by Title
  searchBookForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const searchQuery = document
      .getElementById("searchBookTitle")
      .value.toLowerCase();
    filterBooks(searchQuery);
  });

  function filterBooks(query) {
    const books = document.querySelectorAll("[data-testid='bookItem']");
    books.forEach((book) => {
      const title = book
        .querySelector("[data-testid='bookItemTitle']")
        .textContent.toLowerCase();
      book.style.display = title.includes(query) ? "" : "none";
    });
  }
});
