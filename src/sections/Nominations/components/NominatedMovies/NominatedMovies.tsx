import React from "react";
import { Movie, MoviesAction } from "../../Nominations";
import styles from "./NominatedMovies.module.css";
import appStyles from "../../../../App.module.css";
import moviePosterPlaceholder from "../../../../assets/images/film-poster-placeholder.png";
import { ReactComponent as EmptyIcon } from "../../../../assets/svg/empty.svg";

// Empty icon from <div>Icons made by "https://www.flaticon.com/authors/pixel-perfect"
interface NominatedMoviesProps {
  movies: Movie[];
  nominatedMovies: Movie[];
  dispatch: React.Dispatch<MoviesAction>;
  setShowBanner: React.Dispatch<React.SetStateAction<boolean>>;
}

export const NominatedMovies = ({
  movies,
  nominatedMovies,
  setShowBanner,
  dispatch,
}: NominatedMoviesProps) => {
  const handleRemoval = (movie: Movie) => {
    const updatedMovies = movies.map((outMovie) => {
      if (outMovie.imdbID === movie.imdbID) {
        return {
          ...outMovie,
          isNominated: false,
        };
      }
      return outMovie;
    });

    const updatedNominatedMovies = nominatedMovies.filter(
      (nominatedMovie) => nominatedMovie.imdbID !== movie.imdbID
    );

    dispatch({
      type: "removeNominatedMovie",
      movies: updatedMovies,
      nominatedMovies: updatedNominatedMovies,
    });
  };

  return (
    <section>
      <h2 style={{ color: "white", textDecoration: "underline" }}>
        Nominations
      </h2>

      {nominatedMovies.length > 0 ? (
        <>
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
                      <span className={styles.nominatedMovieYear}>
                        ({Year})
                      </span>
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
          {nominatedMovies.length === 5 && (
            <button
              onClick={() => {
                setShowBanner(false);
                // Continue improvement
                // setMovieTitle("");
                // setMovies([]);
                // setNominatedMovies([]);
              }}
              className={styles.submitBtn}
            >
              Submit nominations
            </button>
          )}
        </>
      ) : (
        <section className={styles.emptySection}>
          <EmptyIcon className={styles.emptyIcon} />
          <p className={styles.emptyText}>No nominations yet!</p>
        </section>
      )}
    </section>
  );
};
