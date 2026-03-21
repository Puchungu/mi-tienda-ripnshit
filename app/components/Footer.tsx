// app/components/Footer.tsx

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200/50 bg-white pt-20 pb-10 mt-auto">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center justify-center text-center">
        <div className="text-3xl font-black tracking-tighter uppercase text-zinc-900 mb-6">
          Rip<span className="text-purple-600">N</span>Shit.
        </div>
        <p className="text-zinc-500 max-w-sm mb-10 font-medium">
          Join the movement. Redefining modern aesthetic for the digital youth.
        </p>
        <div className="flex gap-6 mb-16 text-zinc-400">
          <a href="#" className="hover:text-zinc-900 transition-colors">Instagram</a>
          <a href="#" className="hover:text-zinc-900 transition-colors">TikTok</a>
          <a href="#" className="hover:text-zinc-900 transition-colors">Twitter</a>
        </div>
        <p className="text-sm font-bold tracking-widest uppercase text-zinc-400">
          © 2024 RipNShit Store. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
