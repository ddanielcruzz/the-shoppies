import React from "react";
import { Movie } from "../../App";
import styles from "./NominatedMovies.module.css";
import appStyles from "../../App.module.css";
import moviePosterPlaceholder from "../../assets/images/film-poster-placeholder.png";

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
    <section>
      <h2 style={{ color: "white", textDecoration: "underline" }}>
        Nominations
      </h2>
      <ul className={styles.movieResults}>
        {nominatedMovies.map((movie) => {
          const { imdbID, Title, Year, Poster, isNominated } = movie;
          return (
            <li className={styles.nominatedMovieItem} key={imdbID}>
              <img
                className={styles.nominatedMoviePoster}
                src={Poster === "N/A" ? moviePosterPlaceholder : Poster}
                alt={`Poster from ${Title}`}
              />
              <section className={styles.nominatedTitleAndYear}>
                <h3 className={styles.nominatedMovieTitle}>
                  {Title}{" "}
                  <span className={styles.nominatedMovieYear}>({Year})</span>
                </h3>
                <button
                  className={appStyles.btnDanger}
                  disabled={!isNominated}
                  onClick={() => handleRemoval(movie)}
                >
                  Remove
                </button>
              </section>
            </li>
          );
        })}
      </ul>
    </section>
  );
};
