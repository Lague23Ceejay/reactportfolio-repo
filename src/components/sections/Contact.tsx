// src/components/sections/Contact.tsx

import { usePortfolioStore } from '../../store/portfolioStore';
import { useThemeStore, dimensionPacks } from '../../store/themeStore';
import { ResumeEnvelope } from '../ui/ResumeEnvelope';
import { ScrollReveal } from '../ui/ScrollReveal';
import { RevealGroup } from '../ui/RevealGroup';

export function Contact() {
  const data = usePortfolioStore((state) => state.data?.contact);
  const { currentDimension } = useThemeStore();
  const pack = dimensionPacks[currentDimension];

  if (!data) return null;

  const cardLayoutClass =
    currentDimension === 'creamy'
      ? 'bg-white border-stone-200/80 text-stone-900 shadow-md'
      : 'bg-zinc-900/20 border-zinc-800 text-zinc-100 shadow-2xl';

  return (
    <section
      className={`space-y-8 py-10 rounded-3xl px-4 sm:px-6 transition-colors duration-500 ${
        currentDimension === 'creamy'
          ? 'bg-[#FFF7C2]/40'
          : currentDimension === 'arctic'
          ? 'bg-[#20133A]/50'
          : 'bg-zinc-900/20'
      }`}
      id="contact"
    >
      {/* HEADER — reveal from left */}
      <ScrollReveal direction="left">
        <div className="flex items-center gap-4">
          <h2
            className={`text-2xl sm:text-3xl font-bold tracking-tight transition-colors duration-500 ${pack.textPrimary}`}
          >
            Get In Touch
          </h2>
          <div
            className={`h-px flex-1 transition-colors duration-500 ${
              currentDimension === 'creamy' ? 'bg-stone-400/40' : 'bg-zinc-800'
            }`}
          />
        </div>
      </ScrollReveal>

      {/* CONTACT CARD — reveal from up */}
      <ScrollReveal direction="up" delay={0.06}>
        <div
          className={`p-8 sm:p-12 rounded-3xl max-w-3xl mx-auto text-center space-y-8 border transition-all duration-500 ${cardLayoutClass}`}
        >
          {/* DESCRIPTION — reveal from right */}
          <ScrollReveal direction="right" delay={0.1}>
            <div className="space-y-4 max-w-xl mx-auto">
              <p
                className={`text-lg font-normal leading-relaxed transition-colors duration-500 ${pack.textSecondary}`}
              >
                Let's create something functional and beautiful together. Feel free to check my public profiles or connect directly via email.
              </p>
            </div>
          </ScrollReveal>

          {/* Resume button — reveal from down */}
          <ScrollReveal direction="down" delay={0.14}>
            <div className="flex flex-col items-center gap-4 cursor-target">
              <ResumeEnvelope resumeUrl={data.resumeUrl} resumeLabel="Resume" />
            </div>
          </ScrollReveal>

          {/* Social links — stagger left */}
          <RevealGroup direction="left" baseDelay={0.18} step={0.05}>
            <div
              className={`flex flex-col sm:flex-row justify-center items-center gap-6 font-mono text-sm pt-4 border-t transition-colors duration-500 ${
                currentDimension === 'creamy' ? 'border-stone-200' : 'border-zinc-900'
              }`}
            >
              <a
                href={`mailto:${data.email}`}
                className={`font-bold transition-all ${
                  currentDimension === 'creamy'
                    ? 'text-rose-600 hover:text-rose-700 underline cursor-target'
                    : 'text-emerald-400 hover:underline cursor-target'
                }`}
              >
                ↳ {data.email}
              </a>

              {data.github && (
                <a
                  href={data.github}
                  target="_blank"
                  rel="noreferrer"
                  className={`transition-colors font-medium ${
                    currentDimension === 'creamy'
                      ? 'text-stone-600 hover:text-stone-900 cursor-target'
                      : 'text-zinc-300 hover:text-white cursor-target'
                  }`}
                >
                  ↳ Fiverr
                </a>
              )}

              {data.linkedin && (
                <a
                  href={data.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className={`transition-colors font-medium ${
                    currentDimension === 'creamy'
                      ? 'text-stone-600 hover:text-stone-900 cursor-target'
                      : 'text-zinc-300 hover:text-white cursor-target'
                  }`}
                >
                  ↳ LinkedIn
                </a>
              )}

              {data.upwork && (
                <a
                  href={data.upwork}
                  target="_blank"
                  rel="noreferrer"
                  className={`transition-colors font-medium ${
                    currentDimension === 'creamy'
                      ? 'text-stone-600 hover:text-stone-900 cursor-target'
                      : 'text-zinc-300 hover:text-white cursor-target'
                  }`}
                >
                  ↳ Upwork
                </a>
              )}
            </div>
          </RevealGroup>
        </div>
      </ScrollReveal>
    </section>
  );
}
