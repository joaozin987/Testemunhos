import { Module, Global, Inject } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

export const PG_CONNECTION = 'PG_CONNECTION';

const dbProvider = {
    provide: PG_CONNECTION,
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
        const isProduction = configService.get<string>('NODE_ENV') === 'production';
        return new Pool({
            connectionString: configService.get<string>('DATABASE_URL'),
            ssl: isProduction ? { rejectUnauthorized: false } : false,
        });
    },
};

@Global()

@Module({
    imports: [ConfigModule],
    providers: [dbProvider],
    exports: [dbProvider],
})
export class DatabaseModule{}