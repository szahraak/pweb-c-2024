const timers = {};
const start = {};
const timeelapsed = {};

// TODO: Add event listeners for start buttons
document.querySelectorAll('.start').forEach(button => {
  button.addEventListener("click", (e) => {
    const activityid = e.target.getAttribute("data-activity");
    startTimer(activityid);
  })
})

// TODO: Add event listeners for stop buttons
document.querySelectorAll('.stop').forEach(button => {
  button.addEventListener("click", (e) => {
    const activityid = e.target.getAttribute("data-activity");
    stopTimer(activityid);
  })
})

// TODO: Start the timer for a specific activity
function startTimer(activityid) {
  if (!timers[activityid]) {
    start[activityid] = Date.now();

    timers[activityid] = setInterval (() => {
      const elapsed = Date.now() - start[activityid];
      timeelapsed[activityid] = elapsed;
      document.getElementById(`currentTime-${activityid}`).textContent = formatTime(elapsed);
    }, 100);
  }
}

// TODO: Stop the timer for a specific activity
/*
 * 1. Clear the interval for the activity
 * 2. Calculate the time elapsed
 * 3. Get the target time from the DOM
 * 4. Calculate performance based on actual and target times
 * 5. Save activity to the table
 * 6. Persist activity data in localStorage
 * 7. Reset the time elapsed for the next activity
 */
function stopTimer(activityid) {
  if(timers[activityid]) {
    clearInterval(timers[activityid]);
    delete timers[activityid];

    const elapsed = timeelapsed[activityid];

    const targetTimeStr = document.querySelector(`.activity-info[data-activity="${activityid}"] .target-time`).textContent.replace('Target time: ', '');
    const targetTimeMs = parseTargetTime(targetTimeStr);

    const performance = calculatePerformance(elapsed, targetTimeMs);
    const calcPerf = ((targetTimeMs - elapsed) / targetTimeMs * 100);
    const displayPerformance = Math.max(0, calcPerf.toFixed(2)) + "%";

    saveActivity(activityid, targetTimeStr, formatTime(elapsed), displayPerformance);
    storeActivity(activityid, targetTimeStr, formatTime(elapsed), displayPerformance);

    delete timeelapsed[activityid];
  }
}

// TODO: Format time as mm:ss.SS
function formatTime(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000)/1000);
  const milliseconds = Math.floor((ms % 1000)/10);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(2, '0')}`;
}

// TODO: Calculate performance based on time taken
/*
 * 1. Calculate the time taken in milliseconds
 * 2. Calculate the target time in milliseconds
 * 3. Calculate the performance as a percentage
 * 4. Return the performance
 * Performance = (target - time) / target * 100
 */
function calculatePerformance(ms, target) {
  const performance = (target / ms) * 100;
  return Math.max(0,performance.toFixed(2)) + "%";
}

// TODO: Parse target time from string to milliseconds
function parseTargetTime(targetTimeStr) {
  const [minutes, seconds, milliseconds] = targetTimeStr.split(/[:.]/).map(Number);
  return (minutes * 60000) + (seconds * 1000) + milliseconds;
}

// TODO: Save activity to the table
function saveActivity(activityid, target, time, performance) {
  const table = document.getElementById('activityTable').getElementsByTagName('tbody')[0];
  const newRow = table.insertRow();

  const activityCell = newRow.insertCell(0);
  const targetCell = newRow.insertCell(1);
  const timeCell = newRow.insertCell(2);
  const performanceCell = newRow.insertCell(3);

  activityCell.textContent = "Activity " + activityid;
  targetCell.textContent = target;
  timeCell.textContent = time;
  performanceCell.textContent = performance;
}

// TODO: Persist activity data in localStorage
function storeActivity(activityid, target, time, performance) {
  const activityData = {
    activityid,
    activity: "Activity " + activityid,
    target: target,
    time: time,
    performance: performance
  };

  let activities = JSON.parse(localStorage.getItem("activities") || "[]");
  activities.push(activityData);
  localStorage.setItem("activities", JSON.stringify(activities));
}

// TODO: Load activities from localStorage on page load
function activities() {
  const savedActivities = JSON.parse(localStorage.getItem("activities") || "[]");
  const tableBody = document.getElementById('activityTable').getElementsByTagName('tbody')[0];
  tableBody.innerHTML = "";

  savedActivities.forEach((activity) => {
    saveActivity(
      activity.activityid,
      activity.target,
      activity.time,
      activity.performance
    );
  });
}

// Load saved activities when the page loads
window.onload = function () {
  activities();
}

// Sorting functionality
const tableHeaders = document.querySelectorAll("#activityTable th");
tableHeaders.forEach((header) => {
  header.addEventListener("click", () => {
    const sort = header.getAttribute("data-sort");
    sortTable(sort);
  });
});

function sortTable(key) {
  const rows = Array.from(
    document.querySelector("#activityTable tbody").querySelectorAll("tr")
  );
  const sort = rows.sort((a, b) => {
    const cellA = a.querySelector(
      `td:nth-child(${columnindex(key)})`
    ).textContent;
    const cellB = b.querySelector(
      `td:nth-child(${columnindex(key)})`
    ).textContent;

    if (key === "time") {
      return time(cellA) - time(cellB);
    } else if (key === "performance") {
      return parseInt(cellB) - parseInt(cellA);
    } else {
      return cellA.localeCompare(cellB);
    }
  });

  document.querySelector("#activityTable tbody").innerHTML = "";
  sort.forEach((row) =>
    document.querySelector("#activityTable tbody").appendChild(row)
  );
}

function time(timeStr) {
  const [minutes, seconds] = timeStr.split(":");
  const [secs, millisecs] = seconds.split(".");
  return (
    parseInt(minutes) * 60000 + parseInt(secs) * 1000 + parseInt(millisecs) * 10
  );
}

function columnindex(key) {
  switch (key) {
    case "activity":
      return 1;
    case "time":
      return 2;
    case "performance":
      return 3;
    default:
      return 1;
  }
}

// Load activities when the page is loaded
document.addEventListener("DOMContentLoaded", activities);

module.exports = {
  startTimer,
  stopTimer,
  formatTime,
  calculatePerformance,
  parseTargetTime,
  saveActivity,
  storeActivity,
  activities,
  sortTable,
  time,
  columnindex,
};
