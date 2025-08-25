import { CockpitOverlay, FloatingAstronaut } from "@/components/background";
import { Logs, Projects, Terminal, RadioPlayer } from "@/components/hud";
import { getReposWithReadme } from "@/api/github";

export default async function HomeLanding() {
  const repos = await getReposWithReadme();
  return (
    <div className="relative min-h-screen bg-neutral-950/60 backdrop-blur-md flex flex-col overflow-hidden">
      <main
        id="main-content"
        className="z-10 flex-1 flex flex-col items-center px-4 py-12 pt-60 relative pb-[220px]"
      >
        <FloatingAstronaut />

        {/* Glass Texture/Effect */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-900/9 to-transparent" />
          <img
            src="/glass-texture.png"
            alt="glass texture"
            className="w-full h-full object-cover opacity-10 mix-blend-screen fixed"
          />
        </div>

        <img
          src="/cockpit-hud.png"
          alt="HUD Overlay"
          className="hidden md:block fixed top-0 left-1/2 w-screen h-screen -translate-x-1/2 z-0 pointer-events-none"
        />

        <CockpitOverlay />

        {/* Main Content Grid */}
        <section className="w-full max-w-7xl grid grid-cols-3 gap-8 bg-center relative pointer-events-none">
          <div className="hidden lg:block lg:col-span-1" />
          <div className="lg:col-span-1 lg:col-start-2">
            {/* Hero Section */}
            <section className="w-full max-w-2xl flex flex-col items-center text-center mb-12 fade-out-delayed absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:static lg:translate-x-0 lg:translate-y-0">
              <img
                src="https://github.com/cameronloveland.png"
                alt="Cameron Loveland"
                className="w-20 h-20 rounded-full border-4 border-neutral-800 shadow mb-4 opacity-0 animate-fade-in delay-[100ms]"
              />
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 tracking-tight opacity-0 animate-fade-in delay-[300ms]">
                Cameron Loveland
              </h1>
              <p className="text-neutral-300 text-2xl opacity-0 animate-fade-in delay-[500ms]">
                Software Engineer
              </p>
            </section>
          </div>
          <div className="hidden lg:block lg:col-span-1" />
        </section>

        {/* HUD ROW */}
        <section className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-2 px-2 md:px-4 fixed bottom-0 md:bottom-8 z-20">
          {/* Projects - 1/3 width on desktop */}
          <div className="md:col-span-1 animate-slide-in-left pointer-events-auto">
            <section className="perspective-[1200px]">
              <div className="md:tilt-left">
                <Projects repos={repos} />
              </div>
            </section>
          </div>
          {/* Middle Section - 1/3 width, animates from bottom, no tilt */}
          <div className="hidden md:block md:col-span-1 animate-slide-in-up pointer-events-auto">
            <section className="perspective-[1200px]">
              <div className="flex flex-col gap-2">
                <Terminal />
                <RadioPlayer />
              </div>
            </section>
          </div>
          {/* Captain's Log - 1/3 width */}
          <div className="hidden md:block md:col-span-1 animate-slide-in-right pointer-events-auto">
            <section className="perspective-[1200px]">
              <div className="md:tilt-right">
                <Logs />
              </div>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}

