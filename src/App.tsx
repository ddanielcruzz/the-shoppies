import React, { useState } from "react";
import styles from "./App.module.css";
import { QueryFunction, useQuery } from "react-query";
import { useDebounce } from "./lib/hooks/useDebounce";
import { MovieResults, NominatedMovies } from "./components";

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
}: {
  queryKey: [string, string];
}) => {
  const [, movieTitle] = queryKey;

  const res = await fetch(
    `https://www.omdbapi.com/?apikey=${
      process.env.REACT_APP_API
    }&type=movie&s=${encodeURI(movieTitle.toLocaleLowerCase().trim())}`
  );

  if (!res.ok) throw new Error("Network request failed");

  return res.json();
};

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [movieTitle, setMovieTitle] = useState("blade runner");
  const [nominatedMovies, setNominatedMovies] = useState<Movie[]>([]);
  const debouncedMovieTitle = useDebounce(movieTitle, 1000);

  const { data } = useQuery<unknown, unknown, QueryResponse>(
    ["movies", debouncedMovieTitle],
    fetchMovies,
    {
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

  console.log(data);

  const handleMovieSearch = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = evt;

    setMovieTitle(value);
  };

  return (
    <main className="App">
      <h1>The Shoppies</h1>
      <section>
        <h2>Movie title</h2>
        <input value={movieTitle} onChange={handleMovieSearch} type="text" />
      </section>
      <section className={styles.results}>
        <MovieResults
          movieTitle={movieTitle}
          movies={movies}
          setNominatedMovies={setNominatedMovies}
          setMovies={setMovies}
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
