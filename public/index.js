function calculateTotal() {
  const inputs = document.getElementsByClassName("score-input");
  let total = 0;

  // Sum up all criteria scores
  for (let input of inputs) {
    let value = parseFloat(input.value) || 0;

    // Check if the value exceeds 100
    if (value > 100) {
      value = 100;
      input.value = 100; // Set the input value back to 100
      showMessage("Score cannot exceed 100. Value adjusted to 100.", true);
    }

    total += value;
  }

  // Update total score text content
  document.getElementById("total-score").textContent = total.toFixed(2);
}

function showMessage(message, isError = false) {
  const messageElement = document.getElementById("message");
  messageElement.textContent = message;
  messageElement.className = `message ${isError ? "error" : "success"}`;
  messageElement.style.display = "block";

  // Hide message after 5 seconds
  setTimeout(() => {
    messageElement.style.display = "none";
  }, 5000);
}

async function handleSubmit(event) {
  event.preventDefault();

  const form = event.target;

  // Get values from form inputs and calculate the total score
  const criteria1 = parseFloat(form.criteria1.value) || 0;
  const criteria2 = parseFloat(form.criteria2.value) || 0;
  const totalScore = parseFloat(
    document.getElementById("total-score").textContent
  );

  try {
    const response = await fetch("/api/scores", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        criteria1,
        criteria2,
        totalScore,
      }),
    });

    const data = await response.json();

    if (data.success) {
      showMessage(data.message);

      // Reset the form fields manually (for numeric inputs)
      form
        .querySelectorAll("input[type='number']")
        .forEach((input) => (input.value = ""));

      // Reset the total score
      document.getElementById("total-score").textContent = "0.00";

      // Optional: clear any messages that may have been shown
      clearMessage();
    } else {
      showMessage(data.message, true);
    }
  } catch (error) {
    showMessage("Error submitting scores. Please try again.", true);
  }
}

// Function to clear any displayed messages (success/error)
function clearMessage() {
  const messageElement = document.getElementById("message");
  messageElement.style.display = "none";
}

// Recalculate total when inputs change
document.querySelectorAll(".score-input").forEach((input) => {
  input.addEventListener("input", calculateTotal);
});
