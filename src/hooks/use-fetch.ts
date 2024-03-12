import axios, { AxiosRequestConfig } from 'axios';
import { useEffect, useState } from 'react';

export const useFetch = (endpoint: string, query?: string) => {
  const [_query, setQuery] = useState(query);
  const [data, setData] = useState<PokemonResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const options: AxiosRequestConfig = {
    method: 'GET',
    url: `https://pokeapi.co/api/v2/${endpoint}/${_query}`,
  };

  const fetchData = async () => {
    if (!_query) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.request<PokemonResponse>(options);
      setData(response.data);
      setLoading(false);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [_query]);

  const refetch = (query: string) => {
    setData(null);
    setError(null);
    setQuery(query);
  };

  return { data, loading, error, refetch };
};
