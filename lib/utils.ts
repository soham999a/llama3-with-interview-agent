import { interviewCovers, mappings } from "@/constants";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const techIconBaseURL = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";

const normalizeTechName = (tech: string) => {
  if (!tech) return 'default';

  try {
    const key = tech.toLowerCase().replace(/\.js$/, "").replace(/\s+/g, "");
    return mappings[key as keyof typeof mappings] || key;
  } catch (error) {
    console.error('Error normalizing tech name:', error);
    return 'default';
  }
};

const checkIconExists = async (url: string) => {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok; // Returns true if the icon exists
  } catch {
    return false;
  }
};

export const getTechLogos = async (techArray: string[] | string) => {
  // Handle both string and array inputs
  const technologies = Array.isArray(techArray)
    ? techArray
    : typeof techArray === 'string'
      ? techArray.split(',').map(t => t.trim())
      : [];

  if (technologies.length === 0) {
    return [{ tech: 'default', url: '/tech.svg' }];
  }

  try {
    const logoURLs = technologies.map((tech) => {
      const normalized = normalizeTechName(tech);
      if (!normalized) {
        return {
          tech,
          url: '/tech.svg',
        };
      }
      return {
        tech,
        url: `${techIconBaseURL}/${normalized}/${normalized}-original.svg`,
      };
    });

    // For client-side, we'll skip the actual fetch check to avoid CORS issues
    // and just return the URLs directly
    return logoURLs;
  } catch (error) {
    console.error('Error in getTechLogos:', error);
    return [{ tech: 'default', url: '/tech.svg' }];
  }
};

export const getRandomInterviewCover = () => {
  const randomIndex = Math.floor(Math.random() * interviewCovers.length);
  return `/covers${interviewCovers[randomIndex]}`;
};
