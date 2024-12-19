// Variables to store data
let totalAmount = 0;
let expenseLabels = []; // For chart labels
let expenseData = []; // For chart data
let expenseChart; // Chart instance

// Add expense when button is clicked
document.getElementById("addExpense").addEventListener("click", function () {
  const name = document.getElementById("expenseName").value;
  const amount = parseFloat(document.getElementById("expenseAmount").value);

  if (name && amount) {
    // Update the list
    const listItem = document.createElement("li");
    listItem.textContent = `${name}: $${amount.toFixed(2)}`;
    listItem.setAttribute("data-amount", amount); // Store amount in a data attribute
    document.getElementById("expenseList").appendChild(listItem);

    // Update the total
    totalAmount += amount;
    document.getElementById("totalAmount").textContent = totalAmount.toFixed(2);

    // Update chart data
    const labelIndex = expenseLabels.indexOf(name);
    if (labelIndex === -1) {
      expenseLabels.push(name); // New expense category
      expenseData.push(amount);
    } else {
      expenseData[labelIndex] += amount; // Update existing category
    }

    // Clear input fields
    document.getElementById("expenseName").value = "";
    document.getElementById("expenseAmount").value = "";
  } else {
    alert("Please enter a valid expense name and amount.");
  }
});

// Clear the last expense when "Clear Last" button is clicked
document
  .getElementById("clearLastExpense")
  .addEventListener("click", function () {
    const expenseList = document.getElementById("expenseList");
    const lastItem = expenseList.lastElementChild;

    if (lastItem) {
      const amount = parseFloat(lastItem.getAttribute("data-amount"));
      totalAmount -= amount;
      document.getElementById("totalAmount").textContent =
        totalAmount.toFixed(2);
      expenseList.removeChild(lastItem);

      // Update chart
      const label = lastItem.textContent.split(":")[0].trim();
      const labelIndex = expenseLabels.indexOf(label);
      if (labelIndex !== -1) {
        expenseData[labelIndex] -= amount;
        if (expenseData[labelIndex] <= 0) {
          expenseLabels.splice(labelIndex, 1);
          expenseData.splice(labelIndex, 1);
        }
      }
      updateChart();
    } else {
      alert("No expenses to remove.");
    }
  });

// Reset all expenses when "Reset" button is clicked
document.getElementById("resetExpenses").addEventListener("click", function () {
  document.getElementById("expenseList").innerHTML = "";
  totalAmount = 0;
  document.getElementById("totalAmount").textContent = totalAmount.toFixed(2);
  expenseLabels = [];
  expenseData = [];
  updateChart();
});

// Show graph when "Show Graph" button is clicked
document.getElementById("showGraph").addEventListener("click", function () {
  const chartCanvas = document.getElementById("expenseChart");
  // Toggle canvas visibility
  chartCanvas.style.display =
    chartCanvas.style.display === "none" ? "block" : "none";

  // Create or update the chart only if the canvas is visible
  if (chartCanvas.style.display === "block") {
    updateChart();
  }
});

// Function to update the chart
function updateChart() {
  const chartCanvas = document.getElementById("expenseChart");

  // Check if chart already exists, destroy if necessary
  if (expenseChart) {
    expenseChart.destroy();
  }

  // Initialize the chart if the canvas is visible
  if (chartCanvas.style.display === "block") {
    const ctx = chartCanvas.getContext("2d");
    expenseChart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: expenseLabels,
        datasets: [
          {
            data: expenseData,
            backgroundColor: [
              "#ff6384",
              "#36a2eb",
              "#ffcd56",
              "#4bc0c0",
              "#9966ff",
              "#ff9f40",
            ],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
        },
      },
    });
  }
}
