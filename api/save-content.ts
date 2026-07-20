// api/save-content.ts
import { VercelRequest, VercelResponse } from '@vercel/node';
import { Octokit } from '@octokit/rest';
import { PortfolioSchema } from '../src/types/portfolioSchema'; // ✅ new schema file

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ error: 'Missing content payload parameters.' });
  }

  // ✅ Validate incoming payload before commit
  const parseResult = PortfolioSchema.safeParse(content);
  if (!parseResult.success) {
    return res.status(400).json({
      error: 'Invalid schema',
      details: parseResult.error.format(),
    });
  }

  const safeContent = parseResult.data; // guaranteed valid JSON

  const owner = process.env.GITHUB_OWNER || 'Lague23Ceejay';
  const repo = process.env.GITHUB_REPO || 'reactportfolio-repo';
  const path = 'public/data.json';
  const branch = process.env.GITHUB_BRANCH || 'main';

  try {
    let sha: string | undefined = undefined;

    try {
      const existingFile = await octokit.repos.getContent({ owner, repo, path, ref: branch });
      if (!Array.isArray(existingFile.data) && existingFile.data.type === 'file') {
        sha = existingFile.data.sha;
      }
    } catch {
      // File missing on first commit — safe to ignore
    }

    const updatedContentBuffer = Buffer.from(JSON.stringify(safeContent, null, 2)).toString('base64');

    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      branch,
      message: 'cms: validated data.json commit',
      content: updatedContentBuffer,
      sha,
    });

    return res.status(200).json({ success: true, message: 'Configuration sync successful.' });
  } catch (error: any) {
    return res.status(500).json({
      error: 'Upstream sync failure operational error.',
      details: error.message,
    });
  }
}
