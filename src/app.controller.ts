import { Controller, Get, Logger, Param, Query, Req } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiParam,
  ApiQuery,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { Request } from 'express';
import { AppService } from './app.service';
import { PaginatedDTO } from './dto/paginated.dto';
import { GetPokemonListDTO } from './dto/get-pokemon-list.dto';
import { GetPokemonDTO } from './dto/get-pokemon.dto';

@Controller('pokemon')
export class AppController {
  constructor(private readonly appService: AppService) {}
  private readonly logger = new Logger(AppController.name);

  @ApiResponse({
    status: 200,
    description:
      "Returns a paginated list of available resources for that API. By default, a list 'page' will contain up to 20 resources. If you would like to change this just add a 'limit' query parameter to the GET request, e.g. ?limit=60. You can use 'offset' to move to the next page, e.g. ?limit=60&offset=60.",
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedDTO) },
        {
          properties: {
            results: {
              type: 'array',
              items: { $ref: getSchemaPath(GetPokemonListDTO) },
            },
          },
        },
      ],
    },
  })
  @ApiQuery({ name: 'offset', type: 'number', required: false })
  @ApiQuery({ name: 'limit', type: 'number', required: false })
  @ApiQuery({
    name: 'name',
    type: 'string',
    required: false,
    description: 'Use this query to query Pokemons by name',
  })
  @ApiExtraModels(PaginatedDTO, GetPokemonListDTO)
  @Get('/')
  public async getAll(
    @Req() req: Request,
    @Query('name') name?: string,
    @Query('offset') offset?: number,
    @Query('limit') limit = 20,
  ): Promise<PaginatedDTO<GetPokemonListDTO>> {
    this.logger.log({
      httpEndpoint: req.path,
      message: 'request received',
    });

    const hasNameToFilter = name?.trim().length > 0;

    const getDataFn = hasNameToFilter
      ? () => this.appService.searchByName(name, offset, limit)
      : () => this.appService.getAll(offset, limit);

    const { data, count: total } = await getDataFn();

    return {
      total,
      offset: offset ?? 0,
      limit: limit ?? 0,
      data,
    };
  }

  @ApiResponse({
    status: 200,
    description: 'Returns pokemon detail',
    type: GetPokemonDTO,
  })
  @ApiParam({ name: 'name', description: 'Pokemon name to fetch data' })
  @Get('/:name')
  public async getByName(@Param('name') name: string) {
    const response = await this.appService.getByName(name);
    return {
      data: response,
    };
  }
}
