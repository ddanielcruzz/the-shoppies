import React from "react";
import { Metadata, Movie, MoviesState } from "../../Nominations";
import { MoviesAction } from "../../reducers";
import appStyles from "../../../../App.module.css";
import styles from "./MovieResults.module.css";
import moviePosterPlaceholder from "../../../../assets/images/film-poster-placeholder.png";

interface PageState {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

interface MovieResultsProps {
  metadata: Metadata;
  isLoading: boolean;
  moviesState: MoviesState;
  pageState: PageState;
  dispatch: React.Dispatch<MoviesAction>;
}

const LIMIT = 10;

export const MovieResults = ({
  metadata: { moviesError, totalResults },
  moviesState: { movieTitle, movies, nominatedMovies },
  pageState: { page, setPage },
  dispatch,
  isLoading,
}: MovieResultsProps) => {
  const nominationFinished = nominatedMovies.length === 5;

  const handleNomination = (movie: Movie) => {
    dispatch({
      type: "addNominatedMovie",
      nominatedMovie: movie,
    });
  };

  return (
    <section className={appStyles.container}>
      <h2>Results for {movieTitle}</h2>

      {isLoading ? (
        <div className={styles.loadContainer}>
          <div className={appStyles.dotFlashing} />
        </div>
      ) : moviesError ? (
        <h2>{moviesError}</h2>
      ) : (
        <>
          <ul className={styles.movieResults}>
            {movies.map((movie, idx) => {
              const { imdbID, Title, Year, Poster, isNominated } = movie;
              return (
                <li
                  style={{ "--index": idx } as React.CSSProperties}
                  className={styles.movieItem}
                  key={imdbID}
                >
                  <article className={styles.posterContainer}>
                    <img
                      className={styles.moviePoster}
                      src={Poster === "N/A" ? moviePosterPlaceholder : Poster}
                      alt={`Poster from ${Title}`}
                    />
                    <article className={styles.buttonContainer}>
                      <button
                        className={appStyles.btnPrimary}
                        disabled={isNominated || nominationFinished}
                        onClick={() => handleNomination(movie)}
                      >
                        Nominate
                      </button>
                    </article>
                  </article>
                  <h3 className={styles.movieTitle}>
                    {Title} <span className={styles.movieYear}>({Year})</span>
                  </h3>
                </li>
              );
            })}
          </ul>
          {totalResults > 10 && (
            <section className={styles.paginationButtons}>
              <button
                className={styles.paginationBtn}
                disabled={page === 1}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              >
                prev
              </button>
              <p>{page}</p>
              <button
                className={styles.paginationBtn}
                disabled={!(totalResults - LIMIT * page > 0)}
                onClick={() =>
                  setPage((prev) =>
                    totalResults - LIMIT * prev > 0 ? prev + 1 : prev
                  )
                }
              >
                next
              </button>
            </section>
          )}
        </>
      )}
    </section>
  );
};
