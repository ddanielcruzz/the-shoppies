import { Movie, MoviesState } from "..";

export type MoviesAction =
  | { type: "updateMovieTitle"; title: string }
  | { type: "updateMovies"; movies: Movie[] }
  | { type: "updateNominatedMovies"; nominatedMovies: Movie[] }
  | { type: "addNominatedMovie"; nominatedMovie: Movie }
  | { type: "removeNominatedMovie"; nominatedMovieId: Movie["imdbID"] }
  | { type: "resetMovieState" };

export const moviesReducer = (
  state: MoviesState,
  action: MoviesAction
): MoviesState => {
  switch (action.type) {
    case "updateMovieTitle":
      return { ...state, movieTitle: action.title };
    case "updateMovies":
      return { ...state, movies: action.movies };
    case "updateNominatedMovies":
      return { ...state, nominatedMovies: action.nominatedMovies };
    case "addNominatedMovie": {
      return {
        ...state,
        nominatedMovies: [
          ...state.nominatedMovies,
          { ...action.nominatedMovie, isNominated: true },
        ],

        movies: state.movies.map((movie) =>
          movie.imdbID === action.nominatedMovie.imdbID
            ? { ...movie, isNominated: true }
            : movie
        ),
      };
    }
    case "removeNominatedMovie":
      return {
        ...state,
        movies: state.movies.map((movie) =>
          movie.imdbID === action.nominatedMovieId
            ? { ...movie, isNominated: false }
            : movie
        ),
        nominatedMovies: state.nominatedMovies.filter(
          ({ imdbID }) => imdbID !== action.nominatedMovieId
        ),
      };
    case "resetMovieState":
      return { movieTitle: "", nominatedMovies: [], movies: [] };
    default:
      return state;
  }
};
