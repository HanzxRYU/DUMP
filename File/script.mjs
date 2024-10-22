$(document).ready(function () {
  loadTasks(); // Muat tugas saat halaman dimuat

  $(".tdl-new").keypress(function (e) {
    if (e.which === 13) {
      e.preventDefault();
      const inputValue = $(this).val().trim();
      if (inputValue !== "") {
        addTask(inputValue);
        $(this).val("");
        saveTasks(); // Simpan tugas ke localStorage
      }
    }
  });

  $(".tdl-content").on("click", "a", function (e) {
    e.preventDefault();
    const li = $(this).closest("li");
    li.addClass("remove")
      .stop()
      .delay(100)
      .slideUp("fast", function () {
        li.remove();
        saveTasks(); // Simpan tugas ke localStorage setelah menghapus tugas
      });
  });

  $(".tdl-content").on("change", "input[type='checkbox']", function () {
    saveTasks(); // Simpan tugas ke localStorage setelah perubahan checkbox
  });

  function addTask(taskText) {
    const timestamp = new Date().toLocaleString(); // Dapatkan tanggal dan waktu saat ini
    const listItem = `
          <li>
              <label>
                  <input type='checkbox'>
                  <i></i>
                  <span>${taskText}</span>
                  <span class="timestamp">${timestamp}</span>
                  <a href='#'>–</a>
              </label>
          </li>`;
    $(".tdl-content ul").append(listItem);
  }

  function saveTasks() {
    const tasks = [];
    $(".tdl-content ul li").each(function () {
      const task = {
        text: $(this).find("span").first().text(),
        checked: $(this).find("input[type='checkbox']").prop("checked"),
        timestamp: $(this).find(".timestamp").text(),
      };
      tasks.push(task);
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    console.log(tasks); // Debugging: Log tugas ke konsol
  }

  function loadTasks() {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      const tasks = JSON.parse(storedTasks);
      $.each(tasks, function (index, task) {
        const checkedAttribute = task.checked ? "checked='checked'" : "";
        const listItem = `
                  <li>
                      <label>
                          <input type='checkbox' ${checkedAttribute}>
                          <i></i>
                          <span>${task.text}</span>
                          <span class="timestamp">${task.timestamp}</span>
                          <a href='#'>–</a>
                      </label>
                  </li>`;
        $(".tdl-content ul").append(listItem);
      });
    }
  }
});
