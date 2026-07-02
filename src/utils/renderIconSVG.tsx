// src/components/ui/renderIconSVG.tsx
import { FaReact, FaHtml5, FaCss3Alt, FaDatabase, FaJsSquare } from 'react-icons/fa';
// 1. Add SiDart to the react-icons/si import
import { SiSharp, SiPostgresql, SiTypescript, SiTailwindcss, SiFlutter, SiNodedotjs, SiDart, SiPython } from 'react-icons/si';

export function renderIconSVG(iconCode: string) {
  switch (iconCode.toLowerCase()) {
    case 'react': return <FaReact className="text-sky-400" />;
    case 'typescript': return <SiTypescript className="text-blue-500" />;
    case 'tailwind': return <SiTailwindcss className="text-cyan-400" />;
    case 'flutter': return <SiFlutter className="text-sky-500" />;
    case 'csharp': return <SiSharp className="text-purple-500" />;
    case 'html': return <FaHtml5 className="text-orange-500" />;
    case 'css': return <FaCss3Alt className="text-blue-400" />;
    case 'postgresql': return <SiPostgresql className="text-blue-600" />;
    case 'nodejs': return <SiNodedotjs className="text-green-500" />;
    case 'database': return <FaDatabase className="text-zinc-400" />;
    case 'javascript': return <FaJsSquare className="text-yellow-400" />;
    case 'dart': return <SiDart className="text-cyan-500" />;
    case 'python': return <SiPython className="text-blue-500" />;
    default: return <span className="text-xs text-zinc-500">?</span>;
  }
}
