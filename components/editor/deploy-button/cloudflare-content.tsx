import { Globe, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Page } from "@/types";
import { api } from "@/lib/api";

export const CloudflareDeployContent = ({
  pages,
  prompts,
  onClose,
}: {
  pages: Page[];
  prompts: string[];
  onClose?: () => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [mainDomainLoading, setMainDomainLoading] = useState(false);
  const [config, setConfig] = useState({
    title: "",
    subdomain: "",
  });

  const deployToCloudflare = async () => {
    if (!config.title || !config.subdomain) {
      toast.error("Please enter both a title and subdomain for your website.");
      return;
    }

    // Validate subdomain format
    const subdomainPattern = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;
    if (!subdomainPattern.test(config.subdomain) || config.subdomain.length < 3 || config.subdomain.length > 63) {
      toast.error("Invalid subdomain format. Use lowercase letters, numbers, and hyphens only (3-63 characters).");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/deploy/cloudflare", {
        title: config.title,
        subdomain: config.subdomain,
        pages,
        prompts,
      });

      if (res.data.ok) {
        toast.success(`Website deployed successfully! Available at: ${res.data.url}`);

        // Open the deployed website in a new tab
        window.open(res.data.url, '_blank');

        if (onClose) {
          onClose();
        }
      } else {
        toast.error(res?.data?.error || "Failed to deploy website");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.message || "Deployment failed");
    } finally {
      setLoading(false);
    }
  };

  const deployToMainDomain = async () => {
    if (!config.title) {
      toast.error("Please enter a title for your website.");
      return;
    }

    setMainDomainLoading(true);

    try {
      const res = await api.post("/deploy/main-domain", {
        title: config.title,
        pages,
        prompts,
      });

      if (res.data.ok) {
        toast.success(`Website deployed successfully to main domain! Available at: https://9gent.com`);

        // Open the deployed website in a new tab
        window.open("https://9gent.com", '_blank');

        if (onClose) {
          onClose();
        }
      } else {
        toast.error(res?.data?.error || "Failed to deploy to main domain");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.message || "Main domain deployment failed");
    } finally {
      setMainDomainLoading(false);
    }
  };

  const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.toLowerCase();
    // Remove invalid characters and enforce pattern
    value = value.replace(/[^a-z0-9-]/g, '');
    // Ensure it doesn't start or end with hyphen
    value = value.replace(/^-+|-+$/g, '');
    // Limit length
    value = value.slice(0, 63);

    setConfig({ ...config, subdomain: value });
  };

  return (
    <>
      <header className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b border-neutral-200/60">
        <div className="flex items-center justify-center mb-3">
          <div className="size-12 rounded-full bg-blue-500 shadow-lg flex items-center justify-center">
            <Globe className="size-6 text-white" />
          </div>
        </div>
        <p className="text-xl font-semibold text-neutral-950">
          Publish Your Website
        </p>
        <p className="text-sm text-neutral-600 mt-1.5">
          Enter your website details and publish it with a custom *.9gent.com subdomain. Your site will be live in seconds!
        </p>
      </header>

      <main className="space-y-4 p-6">
        <div>
          <p className="text-sm text-neutral-700 mb-2">
            Website title:
          </p>
          <Input
            type="text"
            placeholder="My Awesome Website"
            value={config.title}
            onChange={(e) => setConfig({ ...config, title: e.target.value })}
            className="!bg-white !border-neutral-300 !text-neutral-800 !placeholder:text-neutral-400 selection:!bg-blue-100"
          />
        </div>

        <div>
          <p className="text-sm text-neutral-700 mb-2">
            Choose your subdomain:
          </p>
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="mysite"
              value={config.subdomain}
              onChange={handleSubdomainChange}
              className="!bg-white !border-neutral-300 !text-neutral-800 !placeholder:text-neutral-400 selection:!bg-blue-100 flex-1"
            />
            <span className="text-sm text-neutral-500 whitespace-nowrap">.9gent.com</span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Use lowercase letters, numbers, and hyphens only (3-63 characters)
          </p>
          {config.subdomain && (
            <p className="text-xs text-blue-600 mt-1">
              Your website will be available at: <strong>https://{config.subdomain}.9gent.com</strong>
            </p>
          )}
        </div>

        <div className="space-y-3">
          <Button
            variant="default"
            onClick={deployToMainDomain}
            className="relative w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 border-none"
            disabled={mainDomainLoading || !config.title}
          >
            Publish to 9gent.com <Star className="size-4 ml-2" />
            {mainDomainLoading && <Loading className="ml-2 size-4 animate-spin" />}
          </Button>

          <div className="flex items-center space-x-2">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-xs text-gray-500 px-2">OR</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          <Button
            variant="default"
            onClick={deployToCloudflare}
            className="relative w-full bg-blue-500 hover:bg-blue-600 border-none"
            disabled={loading}
          >
            Publish with Custom Subdomain <Globe className="size-4 ml-2" />
            {loading && <Loading className="ml-2 size-4 animate-spin" />}
          </Button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-800">
            <strong>Tip:</strong> Your website will be deployed with a fast, global CDN and will be accessible worldwide within seconds.
          </p>
        </div>
      </main>
    </>
  );
};