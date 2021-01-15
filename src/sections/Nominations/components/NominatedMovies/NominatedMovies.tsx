import React from "react";
import { Movie } from "../../Nominations";
import { MoviesAction } from "../../reducers";
import moviePosterPlaceholder from "../../../../assets/images/film-poster-placeholder.png";
import { ReactComponent as EmptyIcon } from "../../../../assets/svg/empty.svg";
import appStyles from "../../../../App.module.css";
import styles from "./NominatedMovies.module.css";
import { useHistory } from "react-router-dom";

// Empty icon from <div>Icons made by "https://www.flaticon.com/authors/pixel-perfect"
interface NominatedMoviesProps {
  nominatedMovies: Movie[];
  dispatch: React.Dispatch<MoviesAction>;
  setShowBanner: React.Dispatch<React.SetStateAction<boolean>>;
}

export const NominatedMovies = ({
  nominatedMovies,
  setShowBanner,
  dispatch,
}: NominatedMoviesProps) => {
  const history = useHistory();

  const handleRemoval = (nominatedMovieId: Movie["imdbID"]) => {
    dispatch({
      type: "removeNominatedMovie",
      nominatedMovieId,
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
            {nominatedMovies.map(
              ({ imdbID, Title, Year, Poster, isNominated }) => (
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
                      onClick={() => handleRemoval(imdbID)}
                    >
                      Remove
                    </button>
                  </section>
                </li>
              )
            )}
          </ul>
          {nominatedMovies.length === 5 && (
            <button
              onClick={() => {
                setShowBanner(false);
                dispatch({ type: "resetMovieState" });
                history.push("/submitted");
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
