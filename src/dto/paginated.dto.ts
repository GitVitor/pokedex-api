import { ApiProperty } from '@nestjs/swagger';

export class PaginatedDTO<T> {
  @ApiProperty()
  limit: number;

  @ApiProperty()
  offset: number;

  @ApiProperty()
  total: number;

  data: T[];
}
