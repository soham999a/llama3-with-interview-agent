"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { cn, getTechLogos } from "@/lib/utils";

const DisplayTechIcons = ({ techStack }: TechIconProps) => {
  const [techIcons, setTechIcons] = useState<Array<{tech: string, url: string}>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTechIcons = async () => {
      try {
        const icons = await getTechLogos(techStack);
        setTechIcons(icons);
      } catch (error) {
        console.error('Error loading tech icons:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTechIcons();
  }, [techStack]);

  if (loading) {
    return <div className="flex flex-row gap-2"><div className="animate-pulse bg-dark-300 rounded-full h-9 w-9"></div></div>;
  }

  return (
    <div className="flex flex-row">
      {techIcons.slice(0, 3).map(({ tech, url }, index) => (
        <div
          key={tech}
          className={cn(
            "relative group bg-dark-300 rounded-full p-2 flex flex-center",
            index >= 1 && "-ml-3"
          )}
        >
          <span className="tech-tooltip">{tech}</span>

          <Image
            src={url}
            alt={tech}
            width={100}
            height={100}
            className="size-5"
          />
        </div>
      ))}
    </div>
  );
};

export default DisplayTechIcons;
