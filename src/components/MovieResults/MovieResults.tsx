import React from "react";
import { Movie } from "../../App";
import appStyles from "../../App.module.css";
import styles from "./MovieResults.module.css";
import moviePosterPlaceholder from "../../assets/images/film-poster-placeholder.png";

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

      <ul className={styles.movieResults}>
        {movies.map((movie) => {
          const { imdbID, Title, Year, Poster, isNominated } = movie;
          return (
            <li className={styles.movieItem} key={imdbID}>
              <img
                className={styles.moviePoster}
                src={Poster === "N/A" ? moviePosterPlaceholder : Poster}
                alt={`Poster from ${Title}`}
              />
              <h3 className={styles.movieTitle}>
                {Title} <span className={styles.movieYear}>({Year})</span>
              </h3>
              <button
                className={appStyles.btnPrimary}
                disabled={isNominated}
                onClick={() => handleNomination(movie)}
              >
                Nominate
              </button>
            </li>
          );
        })}
      </ul>
      <section className={styles.paginationButtons}>
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        >
          prev
        </button>
        <p>{page}</p>
        <button
          // Comment: operation , make variable
          disabled={!(totalResults - 10 * page > 0)}
          onClick={() =>
            setPage((prev) => (totalResults - 10 * prev > 0 ? prev + 1 : prev))
          }
        >
          next
        </button>
      </section>
    </section>
  );
};
