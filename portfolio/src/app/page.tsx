import { CaptainsLogSidebar } from './components/CaptainsLogSidebar';
import EarthBackground from './components/EarthBackground';
import Header from './components/Header';
import { Projects } from './components/Projects';
import { getReposWithReadme } from './lib/getReposWithReadme';
import { Footer } from "./components/Footer";
import ClientLayout from './components/ClientLayout';
import HoverSoundGlobal from './components/HoverSoundGlobal';
import HeroIntro from './components/HeroIntro';

export default async function Home() {
  const repos = await getReposWithReadme();
  return (
    <>

      <ClientLayout>
        <div className="relative min-h-screen bg-neutral-950/60 backdrop-blur-md flex flex-col overflow-x-hidden">
          <div className="absolute inset-0 -z-10">
            <EarthBackground />
          </div>
          <Header />
          <HoverSoundGlobal />

          <main className="flex-1 flex flex-col items-center px-4 py-12 pt-28">
            {/* Main Content Grid */}
            <section className="w-full max-w-7xl grid grid-cols-3 lg:grid-cols-3 gap-8 sm:g bg-center">

              <div className='lg:col-span-1 lg:col-start-2'>
                <HeroIntro />
              </div>
            </section>

            <section className="w-full max-w-7xl grid grid-cols-3 lg:grid-cols-3 gap-8 sm:g bottom-0">
              {/* Projects - 1/3 width on desktop */}
              <div className="lg:col-span-1  animate-slide-in-left">
                <section className="perspective-[1200px] ">
                  <div className="tilt-left">
                    <Projects repos={repos} />
                  </div>
                </section>
              </div>
              <div className="lg:col-span-1"> </div>
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
        <Footer />

      </ClientLayout>
    </>
  );

}
