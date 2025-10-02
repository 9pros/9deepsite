import { useRef, useState, useEffect } from "react";
import { Images, Upload } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Project } from "@/types";
import Loading from "@/components/loading";
import { RiCheckboxCircleFill } from "react-icons/ri";

export const Uploader = ({
  onLoading,
  isLoading,
  onFiles,
  onSelectFile,
  selectedFiles,
  files,
  project,
}: {
  onLoading: (isLoading: boolean) => void;
  isLoading: boolean;
  files: string[];
  onFiles: React.Dispatch<React.SetStateAction<string[]>>;
  onSelectFile: (file: string) => void;
  selectedFiles: string[];
  project?: Project | null;
}) => {

  const [open, setOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch existing images when component mounts or project changes
  useEffect(() => {
    const fetchExistingImages = async () => {
      const uploadPath = project?.space_id || 'local/uploads';
      try {
        const response = await fetch(`/api/me/projects/${uploadPath}/images`);
        if (response.ok) {
          const data = await response.json();
          if (data.images && Array.isArray(data.images)) {
            onFiles(data.images);
          }
        }
      } catch (error) {
        console.error('Failed to fetch existing images:', error);
      }
    };

    fetchExistingImages();
  }, [project?.space_id]); // eslint-disable-line react-hooks/exhaustive-deps

  const uploadFiles = async (files: FileList | null) => {
    if (!files) return;

    onLoading(true);

    try {
      const images = Array.from(files).filter((file) => {
        return file.type.startsWith("image/");
      });

      if (images.length === 0) {
        console.error('No valid image files selected');
        onLoading(false);
        return;
      }

      const data = new FormData();
      images.forEach((image) => {
        data.append("images", image);
      });

      // Use a default path if no project exists
      const uploadPath = project?.space_id || 'local/uploads';
      
      const response = await fetch(
        `/api/me/projects/${uploadPath}/images`,
        {
          method: "POST",
          body: data,
        }
      );
      
      if (response.ok) {
        const responseData = await response.json();
        
        if (responseData.uploadedFiles && Array.isArray(responseData.uploadedFiles)) {
          onFiles((prev) => {
            const newFiles = [...prev, ...responseData.uploadedFiles];
            return newFiles;
          });
        }
      } else {
        const contentType = response.headers.get('content-type');
        console.error('Upload failed with status:', response.status, 'Content-Type:', contentType);
        
        if (contentType && contentType.includes('application/json')) {
          const error = await response.json();
          console.error('Error details:', error);
        } else {
          const text = await response.text();
          console.error('Non-JSON error response:', text.substring(0, 200));
        }
      }
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      onLoading(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <form>
        <PopoverTrigger asChild>
          <Button
            size="iconXs"
            variant="outline"
            className="!border-neutral-600 !text-neutral-400 !hover:!border-neutral-500 hover:!text-neutral-300"
          >
            <Images className="size-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="!rounded-2xl !p-0 !bg-white !border-neutral-100 min-w-xs text-center overflow-hidden"
        >
          <>
            <header className="bg-neutral-50 p-6 border-b border-neutral-200/60">
              <div className="flex items-center justify-center -space-x-4 mb-3">
                <div className="size-9 rounded-full bg-pink-200 shadow-2xs flex items-center justify-center text-xl opacity-50">
                  🎨
                </div>
                <div className="size-11 rounded-full bg-amber-200 shadow-2xl flex items-center justify-center text-2xl z-2">
                  🖼️
                </div>
                <div className="size-9 rounded-full bg-sky-200 shadow-2xs flex items-center justify-center text-xl opacity-50">
                  💻
                </div>
              </div>
              <p className="text-xl font-semibold text-neutral-950">
                Add Custom Images
              </p>
              <p className="text-sm text-neutral-500 mt-1.5">
                Upload images to your project and use them with DeepSite!
              </p>
            </header>
            <main className="space-y-4 p-5">
              <div>
                <p className="text-xs text-left text-neutral-700 mb-2">
                  Uploaded Images {files.length > 0 && `(${files.length})`}
                </p>
                <div className="grid grid-cols-4 gap-1 flex-wrap max-h-40 overflow-y-auto">
                  {files.length === 0 ? (
                    <div className="col-span-4 text-center text-xs text-neutral-400 py-4">
                      No images uploaded yet
                    </div>
                  ) : (
                    files.map((file) => (
                    <div
                      key={file}
                      className="select-none relative cursor-pointer bg-white rounded-md border-[2px] border-white hover:shadow-2xl transition-all duration-300"
                      onClick={() => onSelectFile(file)}
                    >
                      {/* Use img tag instead of Next Image for local dynamic images */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={file}
                        alt="uploaded image"
                        width={56}
                        height={56}
                        className="object-cover w-full rounded-sm aspect-square"
                        onError={(e) => {
                          console.error('Failed to load image:', file);
                          e.currentTarget.src = '/api/placeholder/56/56';
                        }}
                      />
                      {selectedFiles.includes(file) && (
                        <div className="absolute top-0 right-0 h-full w-full flex items-center justify-center bg-black/50 rounded-md">
                          <RiCheckboxCircleFill className="size-6 text-neutral-100" />
                        </div>
                      )}
                    </div>
                    ))
                  )}
                </div>
              </div>
              <div>
                <p className="text-xs text-left text-neutral-700 mb-2">
                  Or import images from your computer
                </p>
                <Button
                  variant="black"
                  onClick={() => fileInputRef.current?.click()}
                  className="relative w-full"
                >
                  {isLoading ? (
                    <>
                      <Loading
                        overlay={false}
                        className="ml-2 size-4 animate-spin"
                      />
                      Uploading image(s)...
                    </>
                  ) : (
                    <>
                      <Upload className="size-4" />
                      Upload Images
                    </>
                  )}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  multiple
                  accept="image/*"
                  onChange={(e) => uploadFiles(e.target.files)}
                />
              </div>
            </main>
          </>
        </PopoverContent>
      </form>
    </Popover>
  );
};
