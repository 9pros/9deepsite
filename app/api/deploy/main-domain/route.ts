import { NextRequest, NextResponse } from "next/server";
import { Page } from "@/types";

export async function POST(request: NextRequest) {
  const { title, pages, prompts } = await request.json();

  if (!title || !pages || pages.length === 0) {
    return NextResponse.json(
      { message: "Title and HTML content are required.", ok: false },
      { status: 400 }
    );
  }

  try {
    // Deploy to main 9gent.com domain
    const deployment = await deployToMainDomain(pages, title);

    if (!deployment.success) {
      return NextResponse.json(
        { error: deployment.error, ok: false },
        { status: 500 }
      );
    }

    return NextResponse.json({
      url: "https://9gent.com",
      deploymentId: deployment.deploymentId,
      ok: true
    }, { status: 201 });

  } catch (err: any) {
    console.error('Main domain deployment error:', err);
    return NextResponse.json(
      { error: err.message, ok: false },
      { status: 500 }
    );
  }
}

async function deployToMainDomain(pages: Page[], title: string) {
  try {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;
    const projectName = "9gent-main"; // Project name for main domain

    if (!accountId || !apiToken) {
      throw new Error("Cloudflare configuration missing. Please set CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN environment variables.");
    }

    // Ensure project exists for main domain
    await ensureMainDomainProject(accountId, apiToken, projectName);

    // Use FormData approach for deployment
    const formData = new FormData();

    // Add manifest
    formData.append('manifest', JSON.stringify({
      "production_branch": "main",
      "compatibility_flags": [],
      "usage_model": "bundled"
    }));

    // Add all pages as files
    pages.forEach((page: Page) => {
      const filePath = page.path.startsWith('/') ? page.path.slice(1) : page.path;
      const fileName = filePath || 'index.html';
      const htmlContent = page.html;

      const blob = new Blob([htmlContent], { type: 'text/html' });
      formData.append(`files`, blob, fileName);
    });

    const createResponse = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}/deployments`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
        },
        body: formData
      }
    );

    if (!createResponse.ok) {
      const errorData = await createResponse.text();
      console.error('Main domain deployment failed:', errorData);
      throw new Error(`Failed to deploy to main domain: ${errorData}`);
    }

    const deploymentData = await createResponse.json();
    const deploymentId = deploymentData.result.id;

    console.log('Main domain deployment created successfully:', {
      deploymentId,
      projectName,
      url: "https://9gent.com"
    });

    return {
      success: true,
      deploymentId: deploymentId,
      url: "https://9gent.com"
    };

  } catch (error: any) {
    console.error('Main domain deployment error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

async function ensureMainDomainProject(accountId: string, apiToken: string, projectName: string) {
  // Check if project exists
  const checkResponse = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
      }
    }
  );

  if (checkResponse.ok) {
    console.log('Main domain project exists, skipping creation');
    return;
  }

  if (checkResponse.status === 404) {
    // Project doesn't exist, create it
    await createMainDomainProject(accountId, apiToken, projectName);
  } else {
    const errorData = await checkResponse.text();
    throw new Error(`Failed to check main domain project existence: ${errorData}`);
  }
}

async function createMainDomainProject(accountId: string, apiToken: string, projectName: string) {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: projectName,
        production_branch: "main",
        build_config: {
          build_command: "",
          destination_dir: "",
          root_dir: ""
        },
        deployment_configs: {
          production: {
            environment_variables: {},
            compatibility_flags: [],
            fail_open: true
          },
          preview: {
            environment_variables: {},
            compatibility_flags: [],
            fail_open: true
          }
        }
      })
    }
  );

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Failed to create main domain project: ${errorData}`);
  }

  // Set up 9gent.com as custom domain
  await setupMainDomain(accountId, apiToken, projectName);
}

async function setupMainDomain(accountId: string, apiToken: string, projectName: string) {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}/domains`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: "9gent.com"
      })
    }
  );

  if (!response.ok) {
    const errorData = await response.text();
    console.warn(`Failed to set up main domain: ${errorData}`);
    // Don't throw error as the deployment can still work
  }
}