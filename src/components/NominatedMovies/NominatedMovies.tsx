import React from "react";
import { Movie } from "../../App";
import appStyles from "../../App.module.css";

interface NominatedMoviesProps {
  nominatedMovies: Movie[];
}

export const NominatedMovies = ({ nominatedMovies }: NominatedMoviesProps) => {
  return (
    <section className={appStyles.container}>
      <ul>
        {nominatedMovies.map((movie) => (
          <li>{movie.Title}</li>
        ))}
      </ul>
    </section>
  );
};
