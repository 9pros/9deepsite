/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { MdSave } from "react-icons/md";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LoginModal } from "@/components/login-modal";
import { useUser } from "@/hooks/useUser";
import { Page } from "@/types";
import { DeployOptions } from "./deploy-options";

export function DeployButton({
  pages,
  prompts,
}: {
  pages: Page[];
  prompts: string[];
}) {
  const { user } = useUser();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center justify-end gap-5">
      <div className="relative flex items-center justify-end">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div>
              <Button variant="default" className="max-lg:hidden !px-4 bg-[#375CEC] hover:bg-[#2a4bc7] border-none">
                <MdSave className="size-4" />
                Publish your Project
              </Button>
              <Button variant="default" size="sm" className="lg:hidden bg-[#375CEC] hover:bg-[#2a4bc7] border-none">
                Publish
              </Button>
            </div>
          </PopoverTrigger>
          <PopoverContent
            className="!rounded-2xl !p-0 !bg-white !border-neutral-200 w-[500px] max-w-[95vw] text-center overflow-hidden"
            align="end"
          >
            <DeployOptions pages={pages} prompts={prompts} user={user} onClose={() => setOpen(false)} />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
