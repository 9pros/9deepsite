import { Page } from "@/types";
import { CloudflareDeployContent } from "./cloudflare-content";

export const DeployOptions = ({
  pages,
  prompts,
  onClose,
}: {
  pages: Page[];
  prompts: string[];
  user?: any;
  onClose?: () => void;
}) => {
  // Always show the deployment form directly
  return <CloudflareDeployContent pages={pages} prompts={prompts} onClose={onClose} />;
};