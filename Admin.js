const ADMIN_USERNAME = "visco";
const ADMIN_PASSWORD = "lilpeep";

function login() {
  const usernameInput = document.getElementById("adminUsername").value;
  const passwordInput = document.getElementById("adminPassword").value;
  const msg = document.getElementById("loginMsg");

  if (usernameInput === ADMIN_USERNAME && passwordInput === ADMIN_PASSWORD) {
    document.getElementById("loginDiv").style.display = "none";
    document.getElementById("apiDiv").style.display = "block";
  } else {
    msg.textContent = "Incorrect username or password!";
  }
}

function saveApiKey() {
  const key = document.getElementById("apiInput").value;
  if (key) {
    localStorage.setItem("leaderboardApiKey", key);
    document.getElementById("saveMsg").textContent = "API Key saved!";
  }
}
