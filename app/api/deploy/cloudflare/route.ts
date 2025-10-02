import { NextRequest, NextResponse } from "next/server";
import { stackServerApp } from "@/stack/server";
import { isAuthenticated } from "@/lib/auth";
import Project from "@/models/Project";
import dbConnect from "@/lib/mongodb";
import { Page } from "@/types";
import User from "@/models/User";

export async function POST(request: NextRequest) {
  // Try Stack Auth first
  const stackUser = await stackServerApp.getUser();
  let userId: string;

  if (stackUser) {
    // Sync user to MongoDB
    await dbConnect();
    await User.findOneAndUpdate(
      { stack_user_id: stackUser.id },
      {
        stack_user_id: stackUser.id,
        email: stackUser.primaryEmail || '',
        display_name: stackUser.displayName,
        profile_image_url: stackUser.profileImageUrl,
        last_login: new Date(),
      },
      { upsert: true }
    );
    userId = stackUser.id;
  } else {
    // Fallback: Allow guest users or old auth
    const user = await isAuthenticated();
    userId = (user instanceof NextResponse || !user)
      ? `guest-${Date.now()}-${Math.random().toString(36).substring(7)}`
      : user.id;
  }

  const { title, pages, prompts, subdomain } = await request.json();

  if (!title || !pages || pages.length === 0 || !subdomain) {
    return NextResponse.json(
      { message: "Title, subdomain, and HTML content are required.", ok: false },
      { status: 400 }
    );
  }

  // Validate subdomain format
  const subdomainPattern = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;
  if (!subdomainPattern.test(subdomain) || subdomain.length < 3 || subdomain.length > 63) {
    return NextResponse.json(
      { message: "Invalid subdomain format. Use lowercase letters, numbers, and hyphens only (3-63 characters).", ok: false },
      { status: 400 }
    );
  }

  await dbConnect();

  try {
    // Check if subdomain already exists (allow overwriting for the same user)
    const existingProject = await Project.findOne({
      cloudflare_subdomain: subdomain,
    });

    if (existingProject && existingProject.user_id !== userId) {
      return NextResponse.json(
        { message: "Subdomain already taken. Please choose a different one.", ok: false },
        { status: 409 }
      );
    }

    // Deploy to Cloudflare Pages
    const deployment = await deployToCloudflare(pages, subdomain, title);

    if (!deployment.success) {
      return NextResponse.json(
        { error: deployment.error, ok: false },
        { status: 500 }
      );
    }

    // Save project to database
    const project = await Project.findOneAndUpdate(
      { user_id: userId, cloudflare_subdomain: subdomain },
      {
        user_id: userId,
        cloudflare_subdomain: subdomain,
        cloudflare_deployment_id: deployment.deploymentId,
        cloudflare_url: `https://${subdomain}.9gent.com`,
        title,
        prompts,
        pages,
        _updatedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      project,
      url: `https://${subdomain}.9gent.com`,
      deploymentId: deployment.deploymentId,
      ok: true
    }, { status: 201 });

  } catch (err: any) {
    console.error('Cloudflare deployment error:', err);
    console.error('Error details:', {
      message: err.message,
      stack: err.stack,
      name: err.name
    });
    return NextResponse.json(
      { error: err.message, ok: false, details: err.stack },
      { status: 500 }
    );
  }
}

async function deployToCloudflare(pages: Page[], subdomain: string, title: string) {
  try {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;
    const projectName = `9gent-${subdomain}`;

    if (!accountId || !apiToken) {
      throw new Error("Cloudflare configuration missing. Please set CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN environment variables.");
    }

    // Ensure project exists first
    await ensureCloudflareProject(accountId, apiToken, projectName, subdomain);

    // Use traditional FormData approach for Cloudflare Pages deployment
    const formData = new FormData();

    // Add manifest as a JSON string
    formData.append('manifest', JSON.stringify({
      "production_branch": "main",
      "compatibility_flags": [],
      "usage_model": "bundled"
    }));

    // Add all pages as files using Buffer and Blob
    pages.forEach((page: Page, index: number) => {
      const filePath = page.path.startsWith('/') ? page.path.slice(1) : page.path;
      const fileName = filePath || 'index.html';
      const htmlContent = page.html;

      // Create a Blob from the HTML content
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
      console.error('Create deployment failed:', errorData);
      throw new Error(`Failed to create deployment: ${errorData}`);
    }

    const deploymentData = await createResponse.json();
    const deploymentId = deploymentData.result.id;

    console.log('Deployment created successfully:', {
      deploymentId,
      projectName,
      subdomain,
      deploymentUrl: deploymentData.result.url,
      customUrl: `https://${subdomain}.9gent.com`
    });

    // The deployment URL from Cloudflare (should be the default Pages URL)
    const defaultUrl = deploymentData.result.url;
    const customUrl = `https://${subdomain}.9gent.com`;

    return {
      success: true,
      deploymentId: deploymentId,
      url: customUrl,
      defaultUrl: defaultUrl, // Include the default Cloudflare Pages URL as backup
    };

  } catch (error: any) {
    console.error('Deployment error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

async function ensureCloudflareProject(accountId: string, apiToken: string, projectName: string, subdomain: string) {
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
    console.log('Project exists, skipping creation');
    return; // Project exists
  }

  if (checkResponse.status === 404) {
    // Project doesn't exist, create it
    await createCloudflareProject(accountId, apiToken, projectName, subdomain);
  } else {
    const errorData = await checkResponse.text();
    throw new Error(`Failed to check project existence: ${errorData}`);
  }
}

async function createCloudflareProject(accountId: string, apiToken: string, projectName: string, subdomain: string) {
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
    throw new Error(`Failed to create Cloudflare project: ${errorData}`);
  }

  // Set up custom domain
  await setupCustomDomain(accountId, apiToken, projectName, subdomain);
}

async function setupCustomDomain(accountId: string, apiToken: string, projectName: string, subdomain: string) {
  const domain = `${subdomain}.9gent.com`;

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}/domains`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: domain
      })
    }
  );

  if (!response.ok) {
    const errorData = await response.text();
    console.warn(`Failed to set up custom domain: ${errorData}`);
    // Don't throw error here as the deployment can still work with the default Pages domain
  }
}