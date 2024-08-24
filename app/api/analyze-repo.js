// pages/api/analyze-repo.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { repoUrl } = req.body;
    if (!repoUrl) {
        return res.status(400).json({ message: 'GitHub repo URL is required' });
    }

    // Extract the repo owner and name from the URL
    const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) {
        return res.status(400).json({ message: 'Invalid GitHub repo URL' });
    }

    const [_, owner, repo] = match;

    const SONARCLOUD_TOKEN = process.env.SONARCLOUD_TOKEN; // Make sure to add this token to your .env.local file
    const SONARCLOUD_ORG = process.env.SONARCLOUD_ORG; // Add your SonarCloud organization key here

    // Generate a unique project key
    const projectKey = `${owner}_${repo}`;

    // Create the project in SonarCloud
    try {
        const createProjectResponse = await fetch('https://sonarcloud.io/api/projects/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${Buffer.from(`${SONARCLOUD_TOKEN}:`).toString('base64')}`,
            },
            body: new URLSearchParams({
                organization: SONARCLOUD_ORG,
                name: repo,
                project: projectKey,
            }),
        });

        if (!createProjectResponse.ok) {
            const errorData = await createProjectResponse.json();
            return res.status(500).json({ message: `Error creating project: ${errorData.errors[0].msg}` });
        }

        // Trigger the analysis (you would typically do this through your CI/CD pipeline, but for simplicity we'll assume manual trigger)
        // For a real-world scenario, you'd set up a GitHub Action or similar CI/CD tool to handle this.

        res.status(200).json({ message: `Project created in SonarCloud with key: ${projectKey}` });

    } catch (error) {
        res.status(500).json({ message: `Error: ${error.message}` });
    }
}
