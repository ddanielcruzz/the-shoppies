import React from "react";
import { Movie } from "../../App";
import appStyles from "../../App.module.css";

interface NominatedMoviesProps {
  movies: Movie[];
  nominatedMovies: Movie[];
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
}

export const NominatedMovies = ({
  movies,
  setMovies,
  nominatedMovies,
}: NominatedMoviesProps) => {
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
                onClick={() => {
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
                }}
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
