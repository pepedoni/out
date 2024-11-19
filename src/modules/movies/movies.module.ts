import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { MoviesRepository } from './movies.repository';
import { Movie } from './movies.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Movie])],
  controllers: [MoviesController],
  providers: [
    {
      provide: 'IMoviesRepository',
      useClass: MoviesRepository,
    },
    {
      provide: 'IMoviesService',
      useClass: MoviesService
    }
  ],
})
export class MoviesModule {}
