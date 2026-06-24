import { usePortfolioStore } from '../../store/portfolioStore';

export function Contact() {
  const data = usePortfolioStore((state) => state.data?.contact);
  if (!data) return null;

  return (
    <section className="space-y-8" id="contact">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Get In Touch</h2>
        <div className="h-[1px] bg-zinc-800 flex-1" />
      </div>
      <div className="bg-zinc-900/20 border border-zinc-800 p-8 sm:p-12 rounded-3xl max-w-3xl mx-auto text-center space-y-8">
        <div className="space-y-4 max-w-xl mx-auto">
          <p className="text-zinc-400 text-lg font-light leading-relaxed">
            Let's create something functional and beautiful together. Feel free to check my public profiles or connect directly via email.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 font-mono text-sm pt-4 border-t border-zinc-900">
          <a href={`mailto:${data.email}`} className="text-emerald-400 hover:underline">↳ {data.email}</a>
          {data.github && <a href={data.github} target="_blank" rel="noreferrer" className="text-zinc-300 hover:text-white transition-colors">↳ GitHub</a>}
          {data.linkedin && <a href={data.linkedin} target="_blank" rel="noreferrer" className="text-zinc-300 hover:text-white transition-colors">↳ LinkedIn</a>}
        </div>
      </div>
    </section>
  );
}
