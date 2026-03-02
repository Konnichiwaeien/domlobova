import { useState, useEffect } from "react";

export interface LandingData {
  id?: number;
  documentId?: string;
  name?: string;
  slug?: string;
  heroTitle?: string;
  heroDescription?: string;
  marqueePhotos?: {
    id: number;
    documentId?: string;
    url: string;
  }[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
}

export const useLandingData = (slug: string) => {
  const [data, setData] = useState<LandingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fallback to local API if env is not defined
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337/api";

        // Fetch landing by slug & populate marqueePhotos
        const response = await fetch(
          `${apiUrl}/landings?filters[slug][$eq]=${slug}&populate[marqueePhotos]=*`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch landing data");
        }

        const json = await response.json();
        if (json.data && json.data.length > 0) {
          setData(json.data[0]);
        } else {
          setData(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchData();
    }
  }, [slug]);

  return { data, loading, error };
};
