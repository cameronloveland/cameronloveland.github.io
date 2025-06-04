export default function HomePage() {
  return (
    <main className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">👋 Hi, I’m [Your Name]</h1>
      <p className="mb-6">Welcome to my portfolio site! Check out some of my GitHub projects below.</p>

      <ul className="space-y-4">
        <li>
          <a
            href="https://github.com/yourusername/project1"
            className="text-blue-500 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Project 1: Cool App
          </a>
        </li>
        <li>
          <a
            href="https://github.com/yourusername/project2"
            className="text-blue-500 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Project 2: Another Cool Thing
          </a>
        </li>
      </ul>
    </main>
  );
}
