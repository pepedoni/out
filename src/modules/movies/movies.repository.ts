import { Injectable } from "@nestjs/common";
import { IMoviesRepository } from "./movies.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Movie } from "./movies.entity";
import { DeleteResult, Repository } from "typeorm";

@Injectable()
export class MoviesRepository implements IMoviesRepository {
    constructor(
        @InjectRepository(Movie)
        private readonly repository: Repository<Movie>,
    ) {}

    async getWinnerMovies(): Promise<Movie[]> {
        return this.repository.find({ where: { winner: true }, order: { year: 'ASC' } });
    }
    
    async save(movies: Movie[]): Promise<Movie[]> {
        return this.repository.save(movies);
    }

    async deleteAll(): Promise<DeleteResult> {
        let result =  this.repository.delete({});
        return result;
    }
}