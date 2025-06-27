import FloatingAstronaut from './components/FloatingAstronaut';
import { EarthBackground } from './components/background';
import { CaptainsLogSidebar, Projects } from './components/hud';
import Terminal from './components/hud/Terminal';
import { getReposWithReadme } from './lib/github';


export default async function Home() {
  const repos = await getReposWithReadme();
  return (
    <>
      <div className="relative  min-h-screen bg-neutral-950/60 backdrop-blur-md flex flex-col overflow-hidden">
        <div className="absolute inset-0 z-[-2] ">
          <EarthBackground />
        </div>

        <main className="z-10 flex-1 flex flex-col items-center px-4 py-12 pt-28 relative">
          <FloatingAstronaut />
          {/* Main Content Grid */}
          <section className="w-full max-w-7xl grid grid-cols-3 lg:grid-cols-3 gap-8 sm:g bg-center">

            <div className='lg:col-span-1 lg:col-start-2'>
              {/* Hero Section */}
              <section className="w-full max-w-2xl flex flex-col items-center text-center mb-12 fade-out-delayed">
                <img
                  src="https://github.com/cameronloveland.png"
                  alt="Cameron Loveland"
                  className="w-20 h-20 rounded-full border-4 border-neutral-800 shadow mb-4 opacity-0 animate-fade-in delay-[100ms]"
                />
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 tracking-tight opacity-0 animate-fade-in delay-[300ms]">
                  Cameron Loveland
                </h1>
                <p className="text-neutral-400 text-md opacity-0 animate-fade-in delay-[500ms]">
                  Software Engineer
                </p>
                <p className="text-neutral-500 italic text-sm mt-1 opacity-0 animate-fade-in delay-[700ms]">
                  Welcome aboard — this is my interactive portfolio site.
                </p>
              </section>
            </div>
          </section>

          <section className="w-full max-w-7xl grid grid-cols-3 lg:grid-cols-3 gap-0 sm:g bottom-0  mt-auto">
            {/* Projects - 1/3 width on desktop */}
            <div className="lg:col-span-1  animate-slide-in-left">
              <section className="perspective-[1200px] ">
                <div className="tilt-left">
                  <Projects repos={repos} />
                </div>
              </section>
            </div>
            {/* Middle Section - 1/3 width, animates from bottom, no tilt */}
            <div className="lg:col-span-1 animate-slide-in-up">
              <section className="perspective-[1200px]">
                <div>
                  <Terminal />
                </div>
              </section>
            </div>
            {/* Captain's Log - 1/3 width */}
            <div className="lg:col-span-1 animate-slide-in-right">
              <section className="perspective-[1200px]">
                <div className="tilt-right">
                  <CaptainsLogSidebar />
                </div>
              </section>
            </div>
          </section>
        </main>
      </div>
    </>
  );

}
