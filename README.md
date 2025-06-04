<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Cameron's Repositories</title>
  <style>
    body { font-family: Arial, sans-serif; background: #f7f7f7; color: #333; padding: 20px; }
    h1 { text-align: center; margin-bottom: 40px; }
    .repo-list { display: flex; flex-wrap: wrap; justify-content: center; }
    .repo { background: #fff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin: 10px; padding: 15px; width: 200px; text-align: center; }
    .repo a { text-decoration: none; color: #0366d6; font-weight: bold; }
  </style>
</head>
<body>
  <h1>Hello</h1>
  <div id="repos" class="repo-list"></div>
  <script>
    fetch('https://api.github.com/users/cameronloveland/repos')
      .then(response => response.json())
      .then(repos => {
        const container = document.getElementById('repos');
        repos.forEach(repo => {
          const div = document.createElement('div');
          div.className = 'repo';
          div.innerHTML = `<a href="${repo.html_url}">${repo.name}</a>`;
          container.appendChild(div);
        });
      })
      .catch(error => console.error('Error fetching repos:', error));
  </script>
</body>
</html>
