import { DeleteResult } from "typeorm";
import { Movie } from "./movies.entity";

export interface ProducerAwardInterval {
    producer: string;
    interval: number;
    previousWin: number;
    followingWin: number;
}

export interface IMoviesService {
    getMinAndMaxIntervalBetweenProducerAward(): Promise<{ min: ProducerAwardInterval[]; max: ProducerAwardInterval[] }>;
}

export interface IMoviesRepository {
    save(movies: Movie[]): Promise<Movie[]>
    deleteAll(): Promise<DeleteResult>
    getWinnerMovies(): Promise<Movie[]>
}