import React from "react";
import { Movie, QueryResponse } from "../../App";
import appStyles from "../../App.module.css";

interface MovieResultsProps {
  movieTitle?: string;
  data?: QueryResponse;
  setNominatedMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
}

export const MovieResults = ({
  movieTitle,
  data,
  setNominatedMovies,
}: MovieResultsProps) => {
  return (
    <section className={appStyles.container}>
      <h3>Results for {movieTitle}</h3>
      <ul>
        {data &&
          data.Search.map((movie) => {
            const { imdbID, Title, Year } = movie;
            return (
              <li key={imdbID}>
                <h2>{Title}</h2> <p>{Year}</p>
                <button
                  onClick={() => setNominatedMovies((prev) => [...prev, movie])}
                >
                  Nominate
                </button>
              </li>
            );
          })}
      </ul>
    </section>
  );
};
