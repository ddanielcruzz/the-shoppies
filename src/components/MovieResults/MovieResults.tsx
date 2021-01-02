import React from "react";
import { Movie } from "../../App";
import appStyles from "../../App.module.css";

interface MovieResultsProps {
  movieTitle?: string;
  movies: Movie[];
  setNominatedMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
}

export const MovieResults = ({
  movieTitle,
  movies,
  setNominatedMovies,
  setMovies,
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
      <h3>Results for {movieTitle}</h3>
      <ul>
        {movies.map((movie) => {
          const { imdbID, Title, Year, isNominated } = movie;
          return (
            <li key={imdbID}>
              <h2>{Title}</h2> <p>{Year}</p>
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
