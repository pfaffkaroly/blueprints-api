import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blueprint } from '../src/blueprints/entities/blueprint.entity';
import { BlueprintsModule } from '../src/blueprints/blueprints.module';

describe('Blueprints E2E Test', () => {
  let app: INestApplication;
  let server: any;
  let createdId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        // Use SQLite in-memory DB just for testing
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Blueprint],
          synchronize: true,
          dropSchema: true,
        }),
        TypeOrmModule.forFeature([Blueprint]),
        BlueprintsModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
    server = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /blueprints should create blueprint', async () => {
    const res = await request(server)
      .post('/blueprints')
      .send({
        name: 'aws_neptune',
        version: '1.1.0',
        author: 'bluebricks@example.com',
        data: {
          packages: ['aws', 'neptune'],
          props: { region: 'us-east-1' },
          outs: ['endpoint'],
        },
      })
      .expect(201);

    expect(res.body).toHaveProperty('id');
    createdId = res.body.id;
  });

  it('GET /blueprints should list all', async () => {
    const res = await request(server).get('/blueprints').expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('GET /blueprints/:id should get one', async () => {
    const res = await request(server)
      .get(`/blueprints/${createdId}`)
      .expect(200);

    expect(res.body).toHaveProperty('id', createdId);
  });

  it('PUT /blueprints/:id should update one', async () => {
    const res = await request(server)
      .put(`/blueprints/${createdId}`)
      .send({
        name: 'aws_neptune_updated',
        version: '1.2.0',
        author: 'bluebricks@example.com',
        data: {
          packages: ['aws', 'neptune'],
          props: { region: 'us-west-2' },
          outs: ['endpoint', 'port'],
        },
      })
      .expect(200);

    expect(res.body.name).toBe('aws_neptune_updated');
  });

  it('DELETE /blueprints/:id should delete one', async () => {
    await request(server).delete(`/blueprints/${createdId}`).expect(200);
  });

  it('GET /blueprints/:id should return 404 for deleted blueprint', async () => {
    await request(app.getHttpServer()).get(`/blueprints/${createdId}`).expect(404);
  });
});
