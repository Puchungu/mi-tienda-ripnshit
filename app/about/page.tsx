// app/about/page.tsx

export default function AboutPage() {
  return (
    <div className="selection:bg-purple-300 selection:text-purple-900">

      {/* HERO SECTION */}
      <section className="relative w-full h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2000&auto=format&fit=crop" 
            alt="Fashion Model Editorial" 
            className="w-full h-full object-cover filter brightness-[0.85] grayscale-[20%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#fafafa] via-transparent to-transparent opacity-100" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center mt-32">
          <h1 className="text-7xl md:text-9xl font-black text-white tracking-tighter uppercase mb-6 leading-[0.85] drop-shadow-2xl">
            We Are <br/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-300 to-rose-300 drop-shadow-none">
              The Youth
            </span>
          </h1>
        </div>
      </section>

      {/* MANIFESTO SECTION */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <p className="text-sm font-bold tracking-widest uppercase text-purple-600 mb-8">The Manifesto</p>
        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-zinc-900 leading-tight mb-10">
          Redefining modern aesthetic for a digital generation.
        </h2>
        <div className="text-lg md:text-xl text-zinc-500 font-medium leading-relaxed max-w-2xl mx-auto space-y-6">
          <p>
            Born from the underground. Built for the streets. RipNShit isn't just a label, it's a movement aimed at tearing down the traditional boundaries of fashion. 
          </p>
          <p>
            We curate and design with a strict adherence to minimalism, high-contrast silhouettes, and raw aesthetic purity. No loud logos. Just premium cuts and an unapologetic attitude.
          </p>
        </div>
      </section>

      {/* IMAGE GRID SECTION */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1 */}
          <div className="group relative aspect-square overflow-hidden rounded-3xl bg-zinc-100 flex items-center justify-center">
            <img 
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop" 
              alt="Our Studio" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-500" />
            <div className="absolute bottom-10 left-10 right-10">
              <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Our Studio</h3>
              <p className="text-white/80 font-medium">Where the aesthetic is crafted.</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group relative aspect-square overflow-hidden rounded-3xl bg-zinc-100 flex items-center justify-center mt-0 md:mt-24">
            <img 
              src="https://images.unsplash.com/photo-1616423640778-28d1b53229bd?q=80&w=1000&auto=format&fit=crop" 
              alt="The Culture" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-500" />
            <div className="absolute bottom-10 left-10 right-10">
              <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">The Culture</h3>
              <p className="text-white/80 font-medium">Embracing the noise.</p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
