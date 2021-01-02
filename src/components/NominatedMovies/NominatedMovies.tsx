import React from "react";
import { Movie } from "../../App";
import appStyles from "../../App.module.css";

interface NominatedMoviesProps {
  movies: Movie[];
  nominatedMovies: Movie[];
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
  setNominatedMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
}

export const NominatedMovies = ({
  movies,
  setMovies,
  nominatedMovies,
  setNominatedMovies,
}: NominatedMoviesProps) => {
  const handleRemoval = (movie: Movie) => {
    setMovies(
      movies.map((outMovie) => {
        if (outMovie.imdbID === movie.imdbID) {
          return {
            ...outMovie,
            isNominated: false,
          };
        }
        return outMovie;
      })
    );
    setNominatedMovies(
      nominatedMovies.filter(
        (nominatedMovie) => nominatedMovie.imdbID !== movie.imdbID
      )
    );
  };

  return (
    <section className={appStyles.container}>
      <ul>
        {nominatedMovies.map((movie) => {
          const { imdbID, Title, Year, isNominated } = movie;
          return (
            <li key={imdbID}>
              <h2>{Title}</h2> <p>{Year}</p>
              <button
                disabled={!isNominated}
                onClick={() => handleRemoval(movie)}
              >
                Remove
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
};
