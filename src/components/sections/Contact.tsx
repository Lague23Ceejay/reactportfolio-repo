import { usePortfolioStore } from '../../store/portfolioStore';
import { QRCodeSVG } from 'qrcode.react';

export function Contact() {
  const data = usePortfolioStore((state) => state.data?.contact);
  if (!data) return null;

  return (
    <section className="space-y-8">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Get In Touch</h2>
        <div className="h-[1px] bg-zinc-800 flex-1" />
      </div>
      <div className="grid md:grid-cols-2 gap-12 items-center bg-zinc-900/20 border border-zinc-800 p-8 sm:p-12 rounded-3xl">
        <div className="space-y-6">
          <p className="text-zinc-400 text-lg font-light leading-relaxed">Let's create something functional and beautiful together. Feel free to check my public profiles or connect directly via email.</p>
          <div className="flex flex-col gap-3 font-mono text-sm">
            <a href={`mailto:${data.email}`} className="text-emerald-400 hover:underline">↳ {data.email}</a>
            {data.github && <a href={data.github} target="_blank" rel="noreferrer" className="text-zinc-300 hover:text-white transition-colors">↳ GitHub Profile</a>}
            {data.linkedin && <a href={data.linkedin} target="_blank" rel="noreferrer" className="text-zinc-300 hover:text-white transition-colors">↳ LinkedIn Profile</a>}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-4 bg-zinc-950/50 p-6 rounded-2xl border border-zinc-800/80 w-fit mx-auto">
          <QRCodeSVG value={data.websiteUrl || window.location.origin} size={140} bgColor="transparent" fgColor="#34d399" level="H" />
          <span className="text-xs font-mono text-zinc-500 tracking-wider">Scan to visit website</span>
        </div>
      </div>
    </section>
  );
}
