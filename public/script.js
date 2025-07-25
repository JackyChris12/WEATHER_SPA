async function getWeather() {
  const city = document.getElementById("cityInput").value;
  const weatherDiv = document.getElementById("weatherResult");
  const chartCanvas = document.getElementById("tempChart");

  weatherDiv.innerHTML = "Loading...";

  try {
    const response = await fetch(`/weather?city=${city}`);
    const data = await response.json();

    if (!data || data.cod !== "200") {
      weatherDiv.innerHTML = "City not found or API error.";
      return;
    }

    const cityName = data.city.name;

    // Filter for one forecast per day at 12:00:00
    const dailyData = data.list.filter(item => item.dt_txt.includes("12:00:00")).slice(0, 5);

    const labels = dailyData.map(item =>
      new Date(item.dt_txt).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      })
    );

    const temps = dailyData.map(item => item.main.temp);
    const descriptions = dailyData.map(item => item.weather[0].description);

    // Show weather info before chart
    let output = `<h3>5-Day Forecast for ${cityName}</h3><ul style="list-style:none; padding:0;">`;

    dailyData.forEach((item, index) => {
      output += `<li><strong>${labels[index]}:</strong> ${temps[index]}°C – ${descriptions[index]}</li>`;
    });

    output += `</ul>`;
    weatherDiv.innerHTML = output;

    // Draw chart after showing data
    if (window.myChart) {
      window.myChart.destroy();
    }

    window.myChart = new Chart(chartCanvas, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Daily Temperature (°C)",
            data: temps,
            borderColor: "#fff",
            backgroundColor: "rgba(255,255,255,0.3)",
            tension: 0.3,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: false,
          },
        },
      },
    });
  } catch (error) {
    console.error(error);
    weatherDiv.innerHTML = "Error fetching data.";
  }
}
