import React from "react";
import { Movie } from "../../App";
import appStyles from "../../App.module.css";

interface MovieResultsProps {
  movieTitle?: string;
  movies: Movie[];
  setNominatedMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  totalResults: number;
  page: number;
}

export const MovieResults = ({
  movieTitle,
  movies,
  setNominatedMovies,
  setMovies,
  page,
  setPage,
  totalResults,
}: MovieResultsProps) => {
  const handleNomination = (movie: Movie) => {
    setMovies(
      movies.map((outMovie) => {
        if (outMovie.imdbID === movie.imdbID) {
          return {
            ...outMovie,
            isNominated: true,
          };
        }
        return outMovie;
      })
    );
    setNominatedMovies((prev) => [...prev, { ...movie, isNominated: true }]);
  };

  return (
    <section className={appStyles.container}>
      <h2>Results for {movieTitle}</h2>
      <button
        disabled={page === 1}
        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
      >
        prev
      </button>
      <p>{page}</p>
      <button
        disabled={!(totalResults - 10 * page > 0)}
        onClick={() =>
          setPage((prev) => (totalResults - 10 * prev > 0 ? prev + 1 : prev))
        }
      >
        next
      </button>
      <ul>
        {movies.map((movie) => {
          const { imdbID, Title, Year, isNominated } = movie;
          return (
            <li key={imdbID}>
              <h3>{Title}</h3> <p>{Year}</p>
              <button
                disabled={isNominated}
                onClick={() => handleNomination(movie)}
              >
                Nominate
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
};
