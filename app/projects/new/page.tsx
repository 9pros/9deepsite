'use client';

import { AppEditor } from "@/components/editor";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ProjectsNewContent() {
  const searchParams = useSearchParams();
  const prompt = searchParams.get('prompt');
  const url = searchParams.get('url');
  const autostart = searchParams.get('autostart') === 'true';
  
  return <AppEditor isNew initialPrompt={prompt} initialUrl={url} autostart={autostart} />;
}

export default function ProjectsNewPage() {
  return (
    <Suspense fallback={<AppEditor isNew />}>
      <ProjectsNewContent />
    </Suspense>
  );
}