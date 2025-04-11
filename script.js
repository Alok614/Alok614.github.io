// Movies data with posters
const movies = [
  { name: "Inception", duration: 148, satisfaction: 95, poster: "https://th.bing.com/th/id/OIP.aBtnNKt5_4K6TQyjgT4XfgHaKy?rs=1&pid=ImgDetMain" },
  { name: "Interstellar", duration: 169, satisfaction: 100, poster: "https://i.pinimg.com/736x/26/ee/c3/26eec32582fabc16d00cb64f37f2a393.jpg" },
  { name: "The Dark Knight", duration: 152, satisfaction: 97, poster: "https://i.etsystatic.com/17257718/r/il/f4d506/3198058192/il_1140xN.3198058192_nm71.jpg" },
  { name: "Avengers: Endgame", duration: 181, satisfaction: 90, poster: "https://th.bing.com/th/id/OIP.r7kzrxGxBgvo8XejPcR_nwHaNK?rs=1&pid=ImgDetMain" },
  { name: "Titanic", duration: 195, satisfaction: 92, poster: "https://th.bing.com/th/id/OIP.meZV-p861BP2tAyxw_3n3wHaKS?rs=1&pid=ImgDetMain" },
  { name: "Joker", duration: 122, satisfaction: 85, poster: "https://i.pinimg.com/originals/0e/39/d5/0e39d5956e5370dcd7fca84dcb641a58.jpg" },
  { name: "Frozen II", duration: 103, satisfaction: 75, poster: "https://www.themoviedb.org/t/p/original/yBBPpyqh21Zil1qTvXTUpNURjiG.jpg" },
  { name: "Toy Story 4", duration: 100, satisfaction: 80, poster: "https://www.themoviedb.org/t/p/original/c527bh3QM4ItVT3ek5EI7GQOoDR.jpg" },
  { name: "Parasite", duration: 132, satisfaction: 88, poster: "https://i.pinimg.com/736x/b3/f1/78/b3f178b7528482c658f0a2e81b3bfbb4.jpg" },
  { name: "The Lion King", duration: 118, satisfaction: 84, poster: "https://www.themoviedb.org/t/p/original/zRIram9fBEL3yCMh4gSPwfYpzY.jpg" },
  { name: "Spider-Man: No Way Home", duration: 148, satisfaction: 93, poster: "https://picfiles.alphacoders.com/147/thumb-1920-147468.jpg" },
  { name: "Black Panther", duration: 134, satisfaction: 89, poster: "https://i.pinimg.com/originals/a4/d0/d0/a4d0d0bf928147f21185b8d5a87aae4c.jpg" },
  { name: "Coco", duration: 105, satisfaction: 86, poster: "https://www.wallpaperflare.com/static/317/902/340/coco-guitar-dog-4k-wallpaper.jpg" },
  { name: "Doctor Strange", duration: 115, satisfaction: 83, poster: "https://th.bing.com/th/id/OIP.aQbj8ircHN9kEsM_9GkPlQHaLH?rs=1&pid=ImgDetMain" },
  { name: "Finding Nemo", duration: 100, satisfaction: 78, poster: "https://i.etsystatic.com/10683147/r/il/326ba3/1716757566/il_1588xN.1716757566_avdl.jpg" },

  { name: "The Road Not Taken", duration: 10,satisfaction: 97,poster:"https://i.etsystatic.com/10857225/r/il/0903ff/2646563830/il_1140xN.2646563830_pc6c.jpg" },
  { name: "Twinkle Twinkle Little Star", duration: 10,satisfaction: 97,poster:"https://i.pinimg.com/736x/df/54/66/df54669f7cd090e12f5a5751910dc9f4.jpg" },
  { name: "Humpty Dumpty", duration: 10,satisfaction: 97,poster: "https://ecdn.teacherspayteachers.com/thumbitem/Humpty-Dumpty-Together-Again-7686653-1656584512/original-7686653-1.jpg" },
  { name: "Baa Baa Black Sheep", duration: 10,satisfaction: 97,poster:"https://i.pinimg.com/736x/14/13/31/14133156167d78c0d09dfa147a9638eb--sheep-nursery-nursery-rhymes.jpg" },
];


// Event listeners
document.getElementById('recommendButton').addEventListener('click', recommendMovies);
document.getElementById('clearButton').addEventListener('click', clearResults);

// Recommend movies
function recommendMovies() {
  const timeInput = document.getElementById('timeInput').value;
  const timeLimit = timeInput * 60; // Convert hours to minutes
  const n = movies.length;
  const dp = Array.from({ length: n + 1 }, () => Array(timeLimit + 1).fill(0));

  // Fill dp table
  for (let i = 1; i <= n; i++) {
    const { duration, satisfaction } = movies[i - 1];
    for (let t = 0; t <= timeLimit; t++) {
      if (duration <= t) {
        dp[i][t] = Math.max(dp[i-1][t], dp[i-1][t-duration] + satisfaction);
      } else {
        dp[i][t] = dp[i-1][t];
      }
    }
  }

  // Backtrack
  let t = timeLimit;
  const selectedMovies = [];
  for (let i = n; i > 0; i--) {
    if (dp[i][t] !== dp[i-1][t]) {
      selectedMovies.push(movies[i-1]);
      t -= movies[i-1].duration;
    }
  }

  displayResults(dp[n][timeLimit], selectedMovies.reverse());
}

// Display results
function displayResults(maxSatisfaction, selectedMovies) {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = `<h2>🎯 Maximum Satisfaction: ${maxSatisfaction}</h2>`;

  const cardsDiv = document.createElement('div');
  cardsDiv.className = 'cards';

  selectedMovies.forEach(movie => {
    const card = document.createElement('div');
    card.className = 'card';

    card.innerHTML = `
      <img src="${movie.poster}" alt="${movie.name}">
      <div class="card-body">
        <h3>${movie.name}</h3>
        <p>Duration: ${movie.duration} min</p>
        <p>Satisfaction: ${movie.satisfaction}</p>
        <div class="stars">${generateStars(movie.satisfaction)}</div>
      </div>
    `;

    cardsDiv.appendChild(card);
  });

  if (selectedMovies.length === 0) {
    resultsDiv.innerHTML += `<p>No movies fit within the time limit.</p>`;
  } else {
    resultsDiv.appendChild(cardsDiv);
  }
}

// Generate stars based on satisfaction
function generateStars(satisfaction) {
  const fullStars = Math.round(satisfaction / 20); // 100% / 5 = 20%
  return '⭐'.repeat(fullStars);
}

// Clear results
function clearResults() {
  document.getElementById('results').innerHTML = '';
}
// Dark mode toggle functionality
const darkModeToggle = document.getElementById('darkModeToggle');

darkModeToggle.addEventListener('click', function() {
  // Toggle dark mode class on body and container
  document.body.classList.toggle('dark-mode');
  const container = document.querySelector('.container');
  container.classList.toggle('dark-mode');

  // Toggle dark mode styles on the button
  darkModeToggle.classList.toggle('dark-mode');
});
