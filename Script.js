const apiBaseUrl = "https://api.roulobets.com/v1/external/affiliates";

// Weekly countdown (7 days)
let endOfWeek = localStorage.getItem("weekEnd");
if (!endOfWeek) {
    const now = new Date();
    endOfWeek = new Date(now.getTime() + 7*24*60*60*1000);
    localStorage.setItem("weekEnd", endOfWeek);
} else {
    endOfWeek = new Date(endOfWeek);
}

function updateTimer() {
    const now = new Date();
    let diff = endOfWeek - now;
    if(diff <= 0){
        endOfWeek = new Date(now.getTime() + 7*24*60*60*1000);
        localStorage.setItem("weekEnd", endOfWeek);
        diff = endOfWeek - now;
    }
    const days = Math.floor(diff / (1000*60*60*24));
    const hours = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
    const minutes = Math.floor((diff % (1000*60*60)) / (1000*60));
    const seconds = Math.floor((diff % (1000*60)) / 1000);
    document.getElementById("timer").textContent = `Time left: ${days}d ${hours}h ${minutes}m ${seconds}s`;
}
setInterval(updateTimer, 1000);
updateTimer();

async function fetchLeaderboard() {
    const apiKey = localStorage.getItem("leaderboardApiKey");
    if (!apiKey) {
        console.warn("No API Key found. Go to admin.html to set it.");
        return;
    }

    const now = new Date();
    const start_at = new Date(now.getTime() - now.getDay()*24*60*60*1000);
    const end_at = endOfWeek;

    const startStr = start_at.toISOString().split('T')[0];
    const endStr = end_at.toISOString().split('T')[0];

    const url = `${apiBaseUrl}?start_at=${startStr}&end_at=${endStr}&key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        data.sort((a,b) => b.totalWager - a.totalWager);
        const top5 = data.slice(0,5);

        const tbody = document.querySelector("#leaderboard tbody");
        tbody.innerHTML = "";

        top5.forEach((item,index) => {
            let reward = 0;
            if(index === 0) reward = 60;
            else if(index === 1 || index === 2) reward = 15;
            else if(index === 3 || index === 4) reward = 5;

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${index+1}</td>
                <td>${item.username}</td>
                <td>${item.totalWager}</td>
                <td>$${reward}</td>
            `;
            tbody.appendChild(row);
        });

    } catch(err) {
        console.error("Error fetching leaderboard:", err);
    }
}

fetchLeaderboard();
setInterval(fetchLeaderboard, 900000); // 15 minutes
