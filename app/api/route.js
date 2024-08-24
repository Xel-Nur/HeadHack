// app/api/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
    const { repoUrl } = await request.json();
    if (!repoUrl) {
        return NextResponse.json({ message: 'GitHub repo URL is required' }, { status: 400 });
    }

    // Extract the repo owner and name from the URL
    const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) {
        return NextResponse.json({ message: 'Invalid GitHub repo URL' }, { status: 400 });
    }

    const [_, owner, repo] = match;

    const SONARCLOUD_TOKEN = process.env.SONARCLOUD_TOKEN;
    const SONARCLOUD_ORG = process.env.SONARCLOUD_ORG;

    // Generate a unique project key
    const projectKey = `${owner}_${repo}`;

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
            return NextResponse.json({ message: `Error creating project: ${errorData.errors[0].msg}` }, { status: 500 });
        }

        return NextResponse.json({ message: `Project created in SonarCloud with key: ${projectKey}` });

    } catch (error) {
        return NextResponse.json({ message: `Error: ${error.message}` }, { status: 500 });
    }
}