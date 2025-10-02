"use client";
import { useUpdateEffect } from "react-use";
import { useMemo, useState, useEffect, useRef } from "react";
import classNames from "classnames";
import { toast } from "sonner";
import { useThrottleFn, useDebounce } from "react-use";

import { cn } from "@/lib/utils";
import { GridPattern } from "@/components/magic-ui/grid-pattern";
import { htmlTagToText } from "@/lib/html-tag-to-text";
import { Page } from "@/types";

export const Preview = ({
  html,
  isResizing,
  isAiWorking,
  ref,
  device,
  currentTab,
  iframeRef,
  pages,
  setCurrentPage,
  isEditableModeEnabled,
  onClickElement,
}: {
  html: string;
  isResizing: boolean;
  isAiWorking: boolean;
  pages: Page[];
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
  ref: React.RefObject<HTMLDivElement | null>;
  iframeRef?: React.RefObject<HTMLIFrameElement | null>;
  device: "desktop" | "mobile";
  currentTab: string;
  isEditableModeEnabled?: boolean;
  onClickElement?: (element: HTMLElement) => void;
}) => {
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(
    null
  );

  const handleMouseOver = (event: MouseEvent) => {
    if (iframeRef?.current) {
      const iframeDocument = iframeRef.current.contentDocument;
      if (iframeDocument) {
        const targetElement = event.target as HTMLElement;
        if (
          hoveredElement !== targetElement &&
          targetElement !== iframeDocument.body
        ) {
          setHoveredElement(targetElement);
          targetElement.classList.add("hovered-element");
        } else {
          return setHoveredElement(null);
        }
      }
    }
  };
  const handleMouseOut = () => {
    setHoveredElement(null);
  };
  const handleClick = (event: MouseEvent) => {
    if (iframeRef?.current) {
      const iframeDocument = iframeRef.current.contentDocument;
      if (iframeDocument) {
        const targetElement = event.target as HTMLElement;
        if (targetElement !== iframeDocument.body) {
          onClickElement?.(targetElement);
        }
      }
    }
  };
  const handleCustomNavigation = (event: MouseEvent) => {
    if (iframeRef?.current) {
      const iframeDocument = iframeRef.current.contentDocument;
      if (iframeDocument) {
        const findClosestAnchor = (
          element: HTMLElement
        ): HTMLAnchorElement | null => {
          let current = element;
          while (current && current !== iframeDocument.body) {
            if (current.tagName === "A") {
              return current as HTMLAnchorElement;
            }
            current = current.parentElement as HTMLElement;
          }
          return null;
        };

        const anchorElement = findClosestAnchor(event.target as HTMLElement);
        if (anchorElement) {
          let href = anchorElement.getAttribute("href");
          if (href) {
            event.stopPropagation();
            event.preventDefault();

            if (href.includes("#") && !href.includes(".html")) {
              const targetElement = iframeDocument.querySelector(href);
              if (targetElement) {
                targetElement.scrollIntoView({ behavior: "smooth" });
              }
              return;
            }

            href = href.split(".html")[0] + ".html";
            const isPageExist = pages.some((page) => page.path === href);
            if (isPageExist) {
              setCurrentPage(href);
            }
          }
        }
      }
    }
  };

  useUpdateEffect(() => {
    const cleanupListeners = () => {
      if (iframeRef?.current?.contentDocument) {
        const iframeDocument = iframeRef.current.contentDocument;
        iframeDocument.removeEventListener("mouseover", handleMouseOver);
        iframeDocument.removeEventListener("mouseout", handleMouseOut);
        iframeDocument.removeEventListener("click", handleClick);
      }
    };

    if (iframeRef?.current) {
      const iframeDocument = iframeRef.current.contentDocument;
      if (iframeDocument) {
        cleanupListeners();

        if (isEditableModeEnabled) {
          iframeDocument.addEventListener("mouseover", handleMouseOver);
          iframeDocument.addEventListener("mouseout", handleMouseOut);
          iframeDocument.addEventListener("click", handleClick);
        }
      }
    }

    return cleanupListeners;
  }, [iframeRef, isEditableModeEnabled]);

  const selectedElement = useMemo(() => {
    if (!isEditableModeEnabled) return null;
    if (!hoveredElement) return null;
    return hoveredElement;
  }, [hoveredElement, isEditableModeEnabled]);

  // Smart debouncing - faster for initial content, slower for updates
  const [debouncedHtml, setDebouncedHtml] = useState(html || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [hasInitialContent, setHasInitialContent] = useState(false);
  
  // Track if there are pending changes
  const [hasPendingChanges, setHasPendingChanges] = useState(false);
  
  // Update immediately for first content or significant changes
  useEffect(() => {
    if (html && !hasInitialContent) {
      // First content - update immediately
      setDebouncedHtml(html);
      setHasInitialContent(true);
    } else if (!html) {
      // Reset when cleared
      setDebouncedHtml('');
      setHasInitialContent(false);
    } else if (html !== debouncedHtml) {
      setHasPendingChanges(true);
    }
  }, [html, hasInitialContent, debouncedHtml]);
  
  // Debounce subsequent updates
  useDebounce(
    () => {
      if (html !== debouncedHtml && hasInitialContent) {
        setIsUpdating(true);
        // Quick fade for smooth transition
        setTimeout(() => {
          setDebouncedHtml(html);
          setHasPendingChanges(false);
          setTimeout(() => setIsUpdating(false), 300);
        }, 100);
      }
    },
    1000, // Update every second for better live view
    [html, hasInitialContent, debouncedHtml]
  );

  return (
    <div
      ref={ref}
      className={classNames(
        "w-full border-l border-gray-900 h-full relative z-0 flex items-center justify-center",
        {
          "lg:p-4": currentTab !== "preview",
          "max-lg:h-0": currentTab === "chat",
          "max-lg:h-full": currentTab === "preview",
        }
      )}
      onClick={(e) => {
        if (isAiWorking) {
          e.preventDefault();
          e.stopPropagation();
          toast.warning("Please wait for the AI to finish working.");
        }
      }}
    >
      <GridPattern
        x={-1}
        y={-1}
        strokeDasharray={"4 2"}
        className={cn(
          "[mask-image:radial-gradient(900px_circle_at_center,white,transparent)]"
        )}
      />
      {!isAiWorking && hoveredElement && selectedElement && (
        <div
          className="cursor-pointer absolute bg-sky-500/10 border-[2px] border-dashed border-sky-500 rounded-r-lg rounded-b-lg p-3 z-10 pointer-events-none"
          style={{
            top:
              selectedElement.getBoundingClientRect().top +
              (currentTab === "preview" ? 0 : 24),
            left:
              selectedElement.getBoundingClientRect().left +
              (currentTab === "preview" ? 0 : 24),
            width: selectedElement.getBoundingClientRect().width,
            height: selectedElement.getBoundingClientRect().height,
          }}
        >
          <span className="bg-sky-500 rounded-t-md text-sm text-neutral-100 px-2 py-0.5 -translate-y-7 absolute top-0 left-0">
            {htmlTagToText(selectedElement.tagName.toLowerCase())}
          </span>
        </div>
      )}
      {/* Smooth transition overlay and update indicator */}
      {isUpdating && (
        <div className="absolute inset-0 bg-black/5 z-20 pointer-events-none transition-opacity duration-500" />
      )}
      
      {/* Pending changes indicator - subtle dot in corner */}
      {hasPendingChanges && !isUpdating && (
        <div className="absolute top-4 right-4 z-30">
          <div className="relative">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 w-2 h-2 bg-amber-500 rounded-full animate-ping"></div>
          </div>
          <div className="sr-only">Changes pending</div>
        </div>
      )}
      
      {/* Update in progress indicator */}
      {isUpdating && (
        <div className="absolute top-4 right-4 z-30 bg-black/70 backdrop-blur-sm text-white px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all duration-300">
          <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Updating...</span>
        </div>
      )}
      <iframe
        id="preview-iframe"
        ref={iframeRef}
        title="output"
        className={classNames(
          "w-full select-none bg-black h-full",
          "transition-opacity duration-500 ease-in-out",
          {
            "opacity-95": isUpdating,
            "opacity-100": !isUpdating,
            "pointer-events-none": isResizing || isAiWorking,
            "lg:max-w-md lg:mx-auto lg:!rounded-[42px] lg:border-[8px] lg:border-neutral-700 lg:shadow-2xl lg:h-[80dvh] lg:max-h-[996px]":
              device === "mobile",
            "lg:border-[8px] lg:border-neutral-700 lg:shadow-2xl lg:rounded-[24px]":
              currentTab !== "preview" && device === "desktop",
          }
        )}
        srcDoc={debouncedHtml || ''}
        onLoad={() => {
          if (iframeRef?.current?.contentWindow?.document?.body) {
            iframeRef.current.contentWindow.document.body.scrollIntoView({
              block: isAiWorking ? "end" : "start",
              inline: "nearest",
              behavior: isAiWorking ? "instant" : "smooth",
            });
          }
          // add event listener to all links in the iframe to handle navigation
          if (iframeRef?.current?.contentWindow?.document) {
            const links =
              iframeRef.current.contentWindow.document.querySelectorAll("a");
            links.forEach((link) => {
              link.addEventListener("click", handleCustomNavigation);
            });
          }
        }}
      />
    </div>
  );
};
