import { CaptainsLogSidebar } from './components/CaptainsLogSidebar';
import EarthBackground from './components/EarthBackground';
import Header from './components/Header';
import { Projects } from './components/Projects';
import { getReposWithReadme } from './lib/getReposWithReadme';
import { Footer } from "./components/Footer";

export default async function Home() {
  const repos = await getReposWithReadme();

  return (
    <div>
      <div className="relative min-h-screen bg-neutral-950/60 backdrop-blur-md flex flex-col">
        {/* <div className="absolute inset-0 -z-10"> */}
        <div>
          <EarthBackground />
        </div>
        <Header />

        <main className="flex-1 flex flex-col items-center px-4 py-12 pt-28">


          {/* Main Content Grid */}
          <section className="w-full max-w-7xl grid grid-cols-3 lg:grid-cols-3 gap-8">
            {/* Projects - 1/3 width on desktop */}
            <div className="lg:col-span-1">
              <Projects repos={repos} />
            </div>
            <div className='lg:col-span-1'>
              {/* Hero Section */}
              <section
                id="about"
                className="w-full max-w-2xl flex flex-col items-center text-center mb-12"
              >
                <img
                  src="https://github.com/cameronloveland.png"
                  alt="Cameron Loveland"
                  className="w-20 h-20 rounded-full border-4 border-neutral-800 shadow mb-4"
                />
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 tracking-tight">
                  Cameron Loveland
                </h1>
                <p className="text-neutral-400 text-md">Software Engineer</p>
                <p className="text-neutral-500 italic text-sm mt-1">
                  Welcome aboard — this is my interactive portfolio site.
                </p>
                <div className="flex gap-4 justify-center mt-4">
                  <a
                    href="https://github.com/cameronloveland"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-400 hover:text-white transition"
                  >
                    <svg
                      width="24"
                      height="24"
                      fill="currentColor"
                      className="inline-block"
                    >
                      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.75.41-1.27.74-1.56-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 2.9-.39c.98 0 1.97.13 2.9.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.8 1.19 1.83 1.19 3.09 0 4.43-2.69 5.41-5.25 5.7.42.36.79 1.09.79 2.2 0 1.59-.01 2.87-.01 3.26 0 .31.21.67.8.56C20.71 21.39 24 17.08 24 12c0-6.27-5.23-11.5-12-11.5z" />
                    </svg>
                  </a>
                </div>
              </section>
            </div>
            {/* Captain's Log - 1/3 width */}
            <div className="lg:col-span-1">
              <CaptainsLogSidebar />
            </div>
          </section>
        </main>


      </div>
      <Footer />
    </div>
  );
}
