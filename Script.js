const apiUrl = "YOUR_API_ENDPOINT"; // Replace with your API endpoint

// Weekly countdown (7 days)
let endOfWeek = localStorage.getItem("weekEnd");
if (!endOfWeek) {
    const now = new Date();
    endOfWeek = new Date(now.getTime() + 7*24*60*60*1000); // 7 days from now
    localStorage.setItem("weekEnd", endOfWeek);
} else {
    endOfWeek = new Date(endOfWeek);
}

// Update countdown every second
function updateTimer() {
    const now = new Date();
    let diff = endOfWeek - now;
    if(diff <= 0){
        // Reset for next week
        endOfWeek = new Date(now.getTime() + 7*24*60*60*1000);
        localStorage.setItem("weekEnd", endOfWeek);
    }
    const days = Math.floor(diff / (1000*60*60*24));
    const hours = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
    const minutes = Math.floor((diff % (1000*60*60)) / (1000*60));
    const seconds = Math.floor((diff % (1000*60)) / 1000);
    document.getElementById("timer").textContent = `Time left: ${days}d ${hours}h ${minutes}m ${seconds}s`;
}
setInterval(updateTimer, 1000);
updateTimer();

// Fetch leaderboard and show top 5 with rewards
async function fetchLeaderboard() {
    const apiKey = localStorage.getItem("leaderboardApiKey");
    if (!apiKey) {
        console.warn("No API Key found. Go to admin.html to set it.");
        return;
    }

    try {
        const response = await fetch(apiUrl, {
            headers: {
                "Authorization": `Bearer ${apiKey}`
            }
        });
        let data = await response.json();

        // Sort descending by wager and get top 5
        data.sort((a,b) => b.totalWager - a.totalWager);
        data = data.slice(0,5);

        const tbody = document.querySelector("#leaderboard tbody");
        tbody.innerHTML = "";

        data.forEach((item,index) => {
            let reward = 0;
            if(index === 0) reward = 60;      // 1st place $60
            else if(index === 1 || index === 2) reward = 15;  // 2nd & 3rd $15
            else if(index === 3 || index === 4) reward = 5;   // 4th & 5th $5

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${index+1}</td>
                <td>${item.username}</td>
                <td>${item.totalWager}</td>
                <td>$${reward}</td>
            `;
            tbody.appendChild(row);
        });
    } catch (err) {
        console.error("Error fetching leaderboard:", err);
    }
}

// Update every 5 seconds
fetchLeaderboard();
setInterval(fetchLeaderboard, 5000);
