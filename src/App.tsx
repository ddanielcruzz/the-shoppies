import React, { useEffect, useState } from "react";
import styles from "./App.module.css";
import { QueryFunction, QueryFunctionContext, useQuery } from "react-query";
import { useDebounce } from "./lib/hooks/useDebounce";
import { MovieResults, NominatedMovies } from "./components";
import confetti from "canvas-confetti";

export interface Movie {
  Poster: string;
  Title: string;
  Year: string;
  imdbID: string;
  isNominated: boolean;
}
export interface QueryResponse {
  Response: string;
  Search: Movie[];
  totalResults: string;
}
// TODO: See how can I type this function
// TODO: When you add an space it reloads the data, maybe remove react query to have more control of fetching, or maybe it's ok as user may input another word
const fetchMovies: QueryFunction = async ({
  queryKey,
}: QueryFunctionContext<string[]>) => {
  const [, movieTitle, page] = queryKey;
  console.log(queryKey);

  const res = await fetch(
    `https://www.omdbapi.com/?apikey=${
      process.env.REACT_APP_API
    }&type=movie&page=${page}&s=${encodeURI(
      movieTitle.toLocaleLowerCase().trim()
    )}`
  );

  if (!res.ok) throw new Error("Network request failed");

  return res.json();
};

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [movieTitle, setMovieTitle] = useState("blade runner");
  const [nominatedMovies, setNominatedMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const debouncedMovieTitle = useDebounce(movieTitle, 1000);

  useEffect(() => {
    if (nominatedMovies.length > 4) {
      const duration = 5 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval: NodeJS.Timeout = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        // since particles fall down, start a bit higher than random
        confetti(
          Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          })
        );
        confetti(
          Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          })
        );
      }, 250);
      return () => {
        confetti.reset();
      };
    }
  }, [nominatedMovies]);

  const { data } = useQuery<unknown, unknown, QueryResponse>(
    ["movies", debouncedMovieTitle, page],
    fetchMovies,
    {
      keepPreviousData: true,
      onSuccess: (data) => {
        const fetchedMovies = data.Search.map((movie) => {
          if (
            nominatedMovies.find(
              (nominated) => nominated.imdbID === movie.imdbID
            )
          )
            return { ...movie, isNominated: true };
          return {
            ...movie,
            isNominated: false,
          };
        });
        setMovies(fetchedMovies);
      },
    }
  );

  const handleMovieSearch = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = evt;

    setMovieTitle(value);
  };

  return (
    <main>
      <h1>The Shoppies</h1>
      <section className={`${styles.container} ${styles.inputContainer}`}>
        <h2>Movie title</h2>
        <input value={movieTitle} onChange={handleMovieSearch} type="text" />
      </section>
      <section className={styles.results}>
        <MovieResults
          movieTitle={movieTitle}
          movies={movies}
          setNominatedMovies={setNominatedMovies}
          setMovies={setMovies}
          setPage={setPage}
          totalResults={Number(data?.totalResults)}
          page={page}
        />
        <NominatedMovies
          movies={movies}
          setMovies={setMovies}
          nominatedMovies={nominatedMovies}
          setNominatedMovies={setNominatedMovies}
        />
      </section>
    </main>
  );
}

export default App;
