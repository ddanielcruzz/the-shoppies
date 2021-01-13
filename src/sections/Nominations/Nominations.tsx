import confetti from "canvas-confetti";
import React, { useCallback, useEffect, useState } from "react";
import { QueryFunction, QueryFunctionContext, useQuery } from "react-query";
import { MovieResults, NominatedMovies } from "./components";
import { useDebounce } from "../../lib/hooks/useDebounce";
import appStyles from "../../App.module.css";
import styles from "./Nominations.module.css";

export interface Movie {
  Poster: string;
  Title: string;
  Year: string;
  imdbID: string;
  isNominated: boolean;
}
export interface QueryResponse {
  Response: string;
  Search: Movie[];
  totalResults: string;
  Error?: string;
}

const fetchMovies: QueryFunction = async ({
  queryKey,
}: QueryFunctionContext<string[]>) => {
  const [, movieTitle, page] = queryKey;

  const res = await fetch(
    `https://www.omdbapi.com/?apikey=${
      process.env.REACT_APP_API
    }&type=movie&page=${page}&s=${encodeURI(
      movieTitle.toLocaleLowerCase().trim()
    )}`
  );

  if (!res.ok) throw new Error("Network request failed");

  return res.json();
};

export const Nominations = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [movieTitle, setMovieTitle] = useState("");
  const [localLoading, setLocalLoading] = useState(false);
  const [nominatedMovies, setNominatedMovies] = useState<Movie[]>([]);
  const [showBanner, setShowBanner] = useState(false);
  const [nominationFinished, setNominationFinished] = useState(false);
  const [page, setPage] = useState(1);
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
      setNominationFinished(true);

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

  useEffect(() => {
    if (nominationFinished && nominatedMovies.length < 5) {
      setNominationFinished(false);
    }
  }, [nominatedMovies, nominationFinished]);

  const { data, refetch, isLoading } = useQuery<
    unknown,
    unknown,
    QueryResponse
  >(["movies", debouncedMovieTitle, page], fetchMovies, {
    keepPreviousData: true,
    onSuccess: (data) => {
      if (!data.Error) {
        const fetchedMovies = data.Search.map((movie) => {
          if (
            nominatedMovies.find(
              (nominated) => nominated.imdbID === movie.imdbID
            )
          )
            return { ...movie, isNominated: true };
          return {
            ...movie,
            isNominated: false,
          };
        });

        setMovies(fetchedMovies);
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
    setMovieTitle(value);
  };

  return (
    <div>
      {showBanner && (
        <>
          <article className={styles.finishModal}>
            <h2>Congratulations! 🎉 🎊</h2>
            <h2>You finished your nomination</h2>
            <div className={styles.modalBtns}>
              <button
                className={appStyles.btnPrimary}
                onClick={() => {
                  setShowBanner(false);
                  setMovieTitle("");
                  setMovies([]);
                  setNominatedMovies([]);
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
      )}

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
              nominationFinished={nominationFinished}
              data={data}
              movieTitle={movieTitle}
              movies={movies}
              setNominatedMovies={setNominatedMovies}
              setMovies={setMovies}
              setPage={setPage}
              totalResults={Number(data?.totalResults)}
              page={page}
            />
          </section>
          <section className={styles.rightSide}>
            <NominatedMovies
              movies={movies}
              setMovies={setMovies}
              nominatedMovies={nominatedMovies}
              setNominatedMovies={setNominatedMovies}
              setShowBanner={setShowBanner}
              setMovieTitle={setMovieTitle}
            />
          </section>
        </section>
      </main>
    </div>
  );
};
