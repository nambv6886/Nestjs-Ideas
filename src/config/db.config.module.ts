import { Sequelize } from 'sequelize-typescript';
import { Module } from '@nestjs/common';


export const databaseProbider = [
  {
    provide: 'Sequelize',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '123456',
        database: 'ideas',
        modelPaths: [__dirname + '/../modules/**/*.entity.[tj]s'],
        logging: false,
      })

      await sequelize.sync();
      return sequelize;
    }
  }
]

@Module({
  providers: [...databaseProbider],
  exports: [...databaseProbider]
})
export class DatabaseModule { }