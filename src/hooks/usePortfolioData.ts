import { useEffect } from 'react';
import { usePortfolioStore } from '../store/portfolioStore';

export const usePortfolioData = () => {
  const { setPortfolioData, setLoading, setError } = usePortfolioStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Appended timestamp query prevents browser asset caching issues on redeploys
        const response = await fetch(`/data.json?t=${Date.now()}`);
        if (!response.ok) throw new Error('Failed to fetch portfolio setup.');
        const data = await response.json();
        setPortfolioData(data);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setPortfolioData, setLoading, setError]);
};
