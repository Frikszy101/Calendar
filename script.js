// script.js

const monthYear = document.getElementById("month-year");
const calendarDays = document.getElementById("calendar-days");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

// separate month/year spans
const monthPart = document.getElementById("month-part");
const yearPart = document.getElementById("year-part");

let date = new Date();
let events = JSON.parse(localStorage.getItem("calendarEvents")) || {};

const monthNames = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

// helper: enable/disable arrows
function updateNavButtons(state) {
  if (state === "calendar") {
    prevBtn.disabled = false;
    nextBtn.disabled = false;
  } else {
    prevBtn.disabled = true;
    nextBtn.disabled = true;
  }
}

// Render normal calendar view
function renderCalendar() {
  const year = date.getFullYear();
  const month = date.getMonth();

  // fill separate spans
  monthPart.textContent = monthNames[month];
  yearPart.textContent = year;

  calendarDays.innerHTML = "";
  calendarDays.className = ""; // reset grid class back to normal

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    calendarDays.appendChild(document.createElement("div"));
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const day = document.createElement("div");
    day.classList.add("day");
    day.textContent = d;

    const today = new Date();
    if (d === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
      day.style.background = "#90caf9";
    }

    const key = `${year}-${month}-${d}`;
    if (events[key]) {
      day.innerHTML = d;
      events[key].forEach((note, index) => {
        day.innerHTML += `<br><small>${index + 1}. ${note}</small>`;
      });
      day.style.background = "#ffe082";
    }

    day.addEventListener("click", () => {
      let choice = prompt("Options:\n1. Add note\n2. Remove note\n\nEnter 1 or 2:");
      if (choice === "1") {
        const note = prompt("Enter note for " + d + " " + monthPart.textContent + " " + yearPart.textContent);
        if (note) {
          if (!events[key]) events[key] = [];
          events[key].push(note);
          localStorage.setItem("calendarEvents", JSON.stringify(events));
          renderCalendar();
        }
      } else if (choice === "2" && events[key] && events[key].length > 0) {
        const removeIndex = prompt(
          "Enter note number to remove:\n" +
          events[key].map((n, i) => `${i + 1}. ${n}`).join("\n")
        );
        const idx = parseInt(removeIndex) - 1;
        if (!isNaN(idx) && idx >= 0 && idx < events[key].length) {
          events[key].splice(idx, 1);
          if (events[key].length === 0) delete events[key];
          localStorage.setItem("calendarEvents", JSON.stringify(events));
          renderCalendar();
        }
      }
    });

    calendarDays.appendChild(day);
  }

  // Backgrounds per month
  const backgrounds = {
    0: "url('images/Jan.jpg')",
    1: "url('images/Feb.jpg')",
    2: "url('images/March.jpg')",
    3: "url('images/April.jpg')",
    4: "url('images/May.jpg')",
    5: "url('images/June.jpg')",
    6: "url('images/July.jpg')",
    7: "url('images/August.jpg')",
    8: "url('images/September.jpg')",
    9: "url('images/October.jpg')",
    10: "url('images/November.jpg')",
    11: "url('images/December.jpg')"
  };

  document.body.style.backgroundImage = backgrounds[month];
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";

  // Seasonal color themes
  const seasonColors = {
    winter: "#90caf9",
    spring: "#a5d6a7",
    summer: "#ffcc80",
    autumn: "#ffab91"
  };
  let season;
  if ([11, 0, 1].includes(month)) season = "winter";
  else if ([2, 3, 4].includes(month)) season = "spring";
  else if ([5, 6, 7].includes(month)) season = "summer";
  else season = "autumn";

  document.getElementById("calendar").style.borderColor = seasonColors[season];
  monthYear.style.color = seasonColors[season];

  // enable arrows in calendar view
  updateNavButtons("calendar");
}

// Render month picker (12 months)
function renderMonthPicker(year) {
  calendarDays.innerHTML = "";
  monthPart.textContent = "Select Month";
  yearPart.textContent = ""; // clear year part
  calendarDays.className = "month-picker";

  monthNames.forEach((m, i) => {
    const monthDiv = document.createElement("div");
    monthDiv.classList.add("picker");
    monthDiv.textContent = m;
    monthDiv.addEventListener("click", () => {
      date.setMonth(i);
      date.setFullYear(year);
      renderCalendar();
    });
    calendarDays.appendChild(monthDiv);
  });

  // disable arrows in picker view
  updateNavButtons("picker");
}

// Render year picker (2000–2026)
function renderYearPicker() {
  calendarDays.innerHTML = "";
  monthPart.textContent = "Select Year";
  yearPart.textContent = ""; // clear year part
  calendarDays.className = "year-picker";

  for (let y = 2000; y <= 2026; y++) {
    const yearDiv = document.createElement("div");
    yearDiv.classList.add("picker");
    yearDiv.textContent = y;
    yearDiv.addEventListener("click", () => {
      date.setFullYear(y);
      renderCalendar();
    });
    calendarDays.appendChild(yearDiv);
  }

  // disable arrows in picker view
  updateNavButtons("picker");
}

// Navigation
prevBtn.addEventListener("click", () => {
  date.setMonth(date.getMonth() - 1);
  renderCalendar();
});
nextBtn.addEventListener("click", () => {
  date.setMonth(date.getMonth() + 1);
  renderCalendar();
});

// separate click handlers
monthPart.addEventListener("click", () => {
  renderMonthPicker(date.getFullYear());
});

yearPart.addEventListener("click", () => {
  renderYearPicker();
});

// Initial load
renderCalendar();
