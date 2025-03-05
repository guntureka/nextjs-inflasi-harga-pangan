"use client";

import { Fragment } from "react";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

const MAX_VISIBLE_SEGMENTS = 3;

function formatSegmentName(segment: string): string {
  return segment.replaceAll("-", " ");
}

export function BreadcrumbsProvider() {
  const currentPath = usePathname();
  const segments = currentPath.split("/").filter(Boolean);

  const rootSegment = {
    label: formatSegmentName(segments[0]),
    href: `/${segments[0]}`,
  };

  const hasHiddenSegments = segments.length > MAX_VISIBLE_SEGMENTS + 1;

  const visibleSegments = (hasHiddenSegments ? segments.slice(-MAX_VISIBLE_SEGMENTS) : segments.slice(1)).map(
    (segment, index) => {
      const startIndex = hasHiddenSegments ? segments.length - MAX_VISIBLE_SEGMENTS + index : index + 1;

      return {
        label: formatSegmentName(segment),
        href: `/${segments.slice(0, startIndex + 1).join("/")}`,
      };
    }
  );

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Root Segment */}
        <BreadcrumbItem>
          <BreadcrumbLink
            href={rootSegment.href}
            className={cn(
              "capitalize",
              rootSegment.href == currentPath && "pointer-events-none font-bold text-primary"
            )}
          >
            {rootSegment.label}
          </BreadcrumbLink>
        </BreadcrumbItem>

        {segments.length > 1 && <BreadcrumbSeparator />}

        {/* Hidden Segments Indicator */}
        {hasHiddenSegments && (
          <>
            <BreadcrumbEllipsis />
            <BreadcrumbSeparator />
          </>
        )}

        {/* Visible Segments */}
        {visibleSegments.map((segment, index) => {
          const isActiveSegment = segment.href === currentPath;

          return (
            <Fragment key={index}>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href={segment.href}
                  className={cn("capitalize", isActiveSegment && "pointer-events-none font-bold text-primary")}
                >
                  {segment.label}
                </BreadcrumbLink>
              </BreadcrumbItem>
              {index < visibleSegments.length - 1 && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

// Helper functions
