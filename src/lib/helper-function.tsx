import { useToast } from "@/hooks/use-toast";
import { FeatureCollection } from "geojson";
import React from "react";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/gif"];

export const formatFieldLabel = (field: string) => {
  return field
    .replace(/([A-Z])/g, " $1")
    .replace(/[-_]/g, " ")
    .toLowerCase();
};

export const validateFileImage = (file: File): boolean => {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Image size should be less than 5MB");
  }

  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    throw new Error("Please upload a valid image file (JPEG, PNG, or GIF)");
  }

  return true;
};

export const useShowToast = () => {
  const { toast } = useToast();

  return {
    showSuccessToast: (message?: string) => {
      toast({
        title: "Success",
        description: message || "Operation completed successfully",
      });
    },
    showErrorToast: (error: Error | string) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : error,
        variant: "destructive",
      });
    },
  };
};

export const getImageKey = (url: string) => {
  return url.split("/").pop();
};

export function parseGeoJSON(jsonString: string): FeatureCollection | null {
  try {
    const parsedData = JSON.parse(jsonString);

    if (!parsedData?.type || parsedData.type !== "FeatureCollection") {
      throw new Error("Invalid GeoJSON format");
    }

    return parsedData;
  } catch (error) {
    console.error("Failed to parse GeoJSON:", error instanceof Error ? error.message : error);
    return null;
  }
}

export function parseStringToFloat(value: string) {
  return parseFloat(value.replace(",", "."));
}
