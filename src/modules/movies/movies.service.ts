import { HttpException, Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { IMoviesRepository, IMoviesService, ProducerAwardInterval } from "./movies.interface";
import { Movie } from "./movies.entity";
import * as csv from 'csv-parser';
import * as fs from 'fs';

@Injectable()
export class MoviesService implements IMoviesService, OnModuleInit {
  constructor(
    @Inject('IMoviesRepository')
    private readonly moviesRepository: IMoviesRepository,
  ) {
  }

  async onModuleInit(): Promise<void> {
    const csvPath = process.env.FILE_PATH; 
    if (!csvPath) throw new Error('CSV file path not found');
    await this.moviesRepository.deleteAll();
    const movies = await this.loadMoviesFromCSV(csvPath);
    await this.moviesRepository.save(movies);
  }

  async loadMoviesFromCSV(filePath: string): Promise<Movie[]> {
    const movies: Movie[] = [];
    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv({ separator: ";" }))
        .on('data', (data) => {
          movies.push({
            title: data['title'],
            year: parseInt(data['year'], 10),
            producers: data['producers'],
            studios: data['studios'],
            winner: data['winner'] === 'yes',
          } as Movie);
        })
        .on('end', () => resolve(movies))
        .on('error', (error) => reject(error));
    });
  }

  splitProducers(producers: string): string[] {
    return producers.replaceAll(' and ', ',').replaceAll(', ', ',').split(',');
  }

  getProducersWinnerYears(movies: Movie[]): Map<string, number[]> {
    let producersWinnerYears = new Map<string, number[]>();
    for (let movie of movies) {
      let producers = this.splitProducers(movie.producers);
      for (let producer of producers) {
        if (!producersWinnerYears.has(producer)) {
          producersWinnerYears.set(producer, []);
        }
        producersWinnerYears.get(producer).push(movie.year);
      }
    }
    return producersWinnerYears;
  }

  getProducerAwardInterval(producer: string, interval: number, previousWin: number, followingWin: number): ProducerAwardInterval {
    return {
      producer,
      interval,
      previousWin,
      followingWin,
    };
  }

  
  async getMinAndMaxIntervalBetweenProducerAward(): Promise<{ min: ProducerAwardInterval[]; max: ProducerAwardInterval[] }> {
    const winnerMovies = await this.moviesRepository.getWinnerMovies();
    if(winnerMovies.length === 0) throw new HttpException('No winner movies found', 204);

    const producersWinnerYears = this.getProducersWinnerYears(winnerMovies);

    let producersWithMinInterval : ProducerAwardInterval[] = []
    let producersWithMaxInterval : ProducerAwardInterval[] = []

    for (let [producer, years] of producersWinnerYears) {
      if (years.length < 2) continue;
      const sortedYears = years.slice().sort((a, b) => a - b);
      const intervals = years.slice(1).map((year, i) => year - sortedYears[i]);
      const minInterval = Math.min(...intervals);
      const maxInterval = Math.max(...intervals);


      if (producersWithMinInterval.length === 0 || minInterval <= producersWithMinInterval[0].interval) {
        const producerAwardInterval = this.getProducerAwardInterval(producer, minInterval, sortedYears[intervals.indexOf(minInterval)], sortedYears[intervals.indexOf(minInterval) + 1]);
        if(producersWithMinInterval.length === 0 || minInterval < producersWithMinInterval[0].interval) {
          producersWithMinInterval = [producerAwardInterval];
        } else  {
          producersWithMinInterval.push(producerAwardInterval);
        } 
      }
      if (producersWithMaxInterval.length === 0 || maxInterval >= producersWithMaxInterval[0].interval) {
        const producerAwardInterval = this.getProducerAwardInterval(producer, minInterval, sortedYears[intervals.indexOf(minInterval)], sortedYears[intervals.indexOf(minInterval) + 1]);
        if(producersWithMaxInterval.length === 0 || maxInterval > producersWithMaxInterval[0].interval) {
          producersWithMaxInterval = [producerAwardInterval];
        } else {
          producersWithMaxInterval.push(producerAwardInterval);
        } 
      }
    }
    
    return { min: producersWithMinInterval, max: producersWithMaxInterval };
  }
}
