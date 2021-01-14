import React from "react";
import { Movie, MoviesState, QueryResponse } from "../../Nominations";
import { MoviesAction } from "../../reducers";
import appStyles from "../../../../App.module.css";
import styles from "./MovieResults.module.css";
import moviePosterPlaceholder from "../../../../assets/images/film-poster-placeholder.png";

interface MovieResultsProps {
  data?: QueryResponse;
  moviesState: MoviesState;
  dispatch: React.Dispatch<MoviesAction>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  totalResults: number;
  page: number;
  nominationFinished: boolean;
  isLoading: boolean;
}

export const MovieResults = ({
  data,
  moviesState: { movieTitle, movies },
  dispatch,
  page,
  setPage,
  totalResults,
  nominationFinished,
  isLoading,
}: MovieResultsProps) => {
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
      ) : data?.Error ? (
        <h2>{data.Error}</h2>
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
                // Note: operation , make variable
                disabled={!(totalResults - 10 * page > 0)}
                onClick={() =>
                  setPage((prev) =>
                    totalResults - 10 * prev > 0 ? prev + 1 : prev
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
