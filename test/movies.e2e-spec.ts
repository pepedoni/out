import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviesModule } from '../src/modules/movies/movies.module';
import { Movie } from '../src/modules/movies/movies.entity';

describe('MoviesController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.FILE_PATH = '/app/files/test.csv';
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MoviesModule,
        TypeOrmModule.forRoot({
          type: 'sqlite', // Banco de dados em memória
          database: ':memory:',
          entities: [Movie],
          synchronize: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Deve retornar o produtor com maior e menor intervalo entre prêmios', async () => {

    const response = await request(app.getHttpServer())
      .get('/movies/producers/intervalAward')
      .expect(200);

    expect(response.body).toEqual({
      min: [
        {
          producer: "Joel Silver",
          interval: 1,
          previousWin: 1990,
          followingWin: 1991
        }
      ],
      max: [
        {
          producer: "Matthew Vaughn",
          interval: 13,
          previousWin: 2002,
          followingWin: 2015
        }
      ]
    });
  });
});
