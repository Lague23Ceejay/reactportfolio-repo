import { VercelRequest, VercelResponse } from '@vercel/node';
import { Octokit } from '@octokit/rest';

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ error: 'Missing content payload parameters.' });
  }

  const owner = process.env.GITHUB_OWNER || 'Lague23Ceejay';
  const repo = process.env.GITHUB_REPO || 'portfolio';
  const path = 'public/data.json';
  const branch = process.env.GITHUB_BRANCH || 'main';

  try {
    let sha: string | undefined = undefined;

    // Fetch existing data file tree mapping reference info if available
    try {
      const existingFile = await octokit.repos.getContent({ owner, repo, path, ref: branch });
      if (!Array.isArray(existingFile.data) && existingFile.data.type === 'file') {
        sha = existingFile.data.sha;
      }
    } catch (err) {
      // Gracefully catch cases where files are missing on initial repository generation
    }

    const updatedContentBuffer = Buffer.from(JSON.stringify(content, null, 2)).toString('base64');

    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      branch,
      message: 'cms: dynamic data.json layout adaptation commit',
      content: updatedContentBuffer,
      sha,
    });

    return res.status(200).json({ success: true, message: 'Configuration sync successful.' });
  } catch (error: any) {
    return res.status(500).json({ error: 'Upstream sync failure operational error.', details: error.message });
  }
}
