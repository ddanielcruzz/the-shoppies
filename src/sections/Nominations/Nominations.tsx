import React, { useCallback, useEffect, useReducer, useState } from "react";
import { useQuery } from "react-query";
import { MovieResults, NominatedMovies } from "./components";
import { moviesReducer } from "./reducers";
import { fetchMovies } from "./utils";
import { useDebounce } from "../../lib/hooks/useDebounce";
import confetti from "canvas-confetti";
import appStyles from "../../App.module.css";
import styles from "./Nominations.module.css";

export interface Movie {
  Poster: string;
  Title: string;
  Year: string;
  imdbID: string;
  isNominated: boolean;
}
export interface MoviesState {
  movies: Movie[];
  nominatedMovies: Movie[];
  movieTitle: string;
}
export interface QueryResponse {
  Response: string;
  Search: Movie[];
  totalResults: string;
  Error?: string;
}

export interface Metadata {
  moviesError: string | undefined;
  totalResults: number;
}

const moviesInitialState = {
  movies: [],
  nominatedMovies: [],
  movieTitle: "",
};

export const Nominations = () => {
  const [localLoading, setLocalLoading] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [page, setPage] = useState(1);

  const [moviesState, dispatch] = useReducer(moviesReducer, moviesInitialState);
  const { movieTitle, nominatedMovies } = moviesState;

  const debouncedMovieTitle = useDebounce(movieTitle, 1000);

  useEffect(() => {
    if (nominatedMovies.length > 4) {
      const duration = 5 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      setShowBanner(true);

      const interval: NodeJS.Timeout = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        // since particles fall down, start a bit higher than random
        confetti(
          Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          })
        );
        confetti(
          Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          })
        );
      }, 250);
      return () => {
        confetti.reset();
        setShowBanner(false);
      };
    }
  }, [nominatedMovies]);

  const { data, refetch, isLoading } = useQuery<
    unknown,
    unknown,
    QueryResponse
  >(["movies", debouncedMovieTitle, page], fetchMovies, {
    keepPreviousData: true,
    onSuccess: (data) => {
      if (!data.Error) {
        const fetchedMovies = data.Search.map((movie) =>
          nominatedMovies.find((nominated) => nominated.imdbID === movie.imdbID)
            ? { ...movie, isNominated: true }
            : {
                ...movie,
                isNominated: false,
              }
        );
        dispatch({ type: "updateMovies", movies: fetchedMovies });
      }
    },
    enabled: false,
  });

  const refetchCb = useCallback(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (debouncedMovieTitle) refetchCb();
  }, [debouncedMovieTitle, refetchCb, page]);

  useEffect(() => {
    setPage(1);
    setLocalLoading(false);
  }, [debouncedMovieTitle]);

  const handleMovieSearch = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = evt;
    setLocalLoading(true);
    dispatch({ type: "updateMovieTitle", title: value });
  };

  const metadata: Metadata = {
    moviesError: data?.Error,
    totalResults: Number(data?.totalResults),
  };

  const bannerJSX = (
    <>
      <article className={styles.finishModal}>
        <h2>Congratulations! 🎉 🎊</h2>
        <h2>You finished your nomination</h2>
        <div className={styles.modalBtns}>
          <button
            className={appStyles.btnPrimary}
            onClick={() => {
              setShowBanner(false);
              dispatch({ type: "resetMovieState" });
            }}
          >
            Submit nominations
          </button>
          <button
            className={appStyles.btnPrimaryGhost}
            onClick={() => setShowBanner(false)}
          >
            Edit nominations
          </button>
        </div>
      </article>
      <div className={styles.overlay} />
    </>
  );

  return (
    <div>
      {showBanner && bannerJSX}
      <main className={styles.main}>
        <h1 className={styles.title}>The Shoppies 🏆🍿</h1>
        <section className={styles.instructions}>
          <h3>How to use:</h3>
          <ol>
            <li>Use the search bar to look for your favorite movies 🔎</li>
            <li>Hover over the poster to show the nomination button ⭐️</li>
            <li>After 5 nominations submit or edit the list 🚀</li>
          </ol>
        </section>
        <section className={styles.results}>
          <section className={styles.leftSide}>
            <section
              className={`${appStyles.container} ${styles.inputContainer}`}
            >
              <h2>Search movie title</h2>
              <input
                className={styles.input}
                value={movieTitle}
                onChange={handleMovieSearch}
                type="text"
                placeholder="Blade Runner"
              />
            </section>
            <MovieResults
              isLoading={isLoading || localLoading}
              metadata={metadata}
              moviesState={moviesState}
              dispatch={dispatch}
              pageState={{ page, setPage }}
            />
          </section>
          <section className={styles.rightSide}>
            <NominatedMovies
              nominatedMovies={nominatedMovies}
              dispatch={dispatch}
              setShowBanner={setShowBanner}
            />
          </section>
        </section>
      </main>
    </div>
  );
};
