import { Controller, Get, HttpException, Inject } from '@nestjs/common';
import { IMoviesService } from './movies.interface';

@Controller('movies')
export class MoviesController {
  constructor(
    @Inject('IMoviesService')
    private readonly moviesService: IMoviesService
  ) {}

  @Get('producers/intervalAward')
  async getMinAndMaxIntervalBetweenProducerAward() {
    try {
      return await this.moviesService.getMinAndMaxIntervalBetweenProducerAward();
    } catch (error) {
      throw error;
    }
  }
}
