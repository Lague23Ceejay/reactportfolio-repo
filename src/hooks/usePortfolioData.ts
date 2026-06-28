// src/hooks/usePortfolioData.ts

import { useEffect } from 'react';
import { usePortfolioStore } from '../store/portfolioStore';

export function usePortfolioData() {
  const { setPortfolioData, setError, setLoading } = usePortfolioStore();

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true);

        /* ==========================================================================
           🚀 SENIOR DEV FIX: EDGE CDN CACHE BUSTER OVERRIDE
           ========================================================================== */
        // Appending a unique timestamp string (?t=171829...) at the end of the file path 
        // forces Vercel's global CDN network and the browser to skip their local 
        // cache memory and load the freshest, newly committed data straight from the disk.
        const freshUrl = `/data.json?t=${Date.now()}`;

        const response = await fetch(freshUrl, {
          headers: {
            // Instructs the native browser client to avoid local memory caches
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });

        if (!response.ok) {
          throw new Error(`Data transmission protocol failed: ${response.status}`);
        }

        const cleanJsonPayload = await response.json();
        setPortfolioData(cleanJsonPayload);

      } catch (err: any) {
        console.error("Core content sync bootstrap failed:", err);
        setError(err?.message || "Failed to load application data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [setPortfolioData, setError, setLoading]);
}
