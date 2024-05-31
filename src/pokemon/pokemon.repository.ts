import { Injectable, Logger } from '@nestjs/common';
import { IPokemon, IPokemonResource } from '../interface/pokemon.interface';
import { ISpecie } from '../interface/specie.interface';

@Injectable()
export class PokemonRepository {
  constructor() {}
  private readonly API_BASEURL = 'https://pokeapi.co/api/v2/';
  private readonly logger = new Logger(PokemonRepository.name);

  public async getAll(
    offset: number,
    limit: number,
  ): Promise<IPokemonResource> {
    const url = `${this.API_BASEURL}/pokemon?offset=${offset}&limit=${limit}`;
    const response = await fetch(url);

    if (response.ok) {
      return response.json();
    }

    this.logger.error(`error while fetching data to API ${url}`);
    throw new Error(`HTTP Error! Status ${response.status}`);
  }

  public async getByName(name: string): Promise<IPokemon> {
    const url = `${this.API_BASEURL}/pokemon/${name}`;
    const response = await fetch(url);

    if (response.ok) {
      return response.json();
    }

    this.logger.error(`error while fetching data to API ${url}`);
    throw new Error(`HTTP Error! Status ${response.status} | ${url}`);
  }

  public async getSpecie(id: number): Promise<ISpecie> {
    const url = `${this.API_BASEURL}/pokemon-species/${id}/`;
    const response = await fetch(url);

    if (response.ok) {
      return response.json();
    }

    this.logger.error(`error while fetching data to API ${url}`);
    throw new Error(`HTTP Error! Status ${response.status} | ${url}`);
  }

  public async getByNameBulk(namesToFind: string[]) {
    const promises = namesToFind.map((name) => this.getByName(name));

    const generalResponse = await Promise.allSettled(promises);

    const { fulfilled, rejected } = generalResponse.reduce(
      ({ fulfilled, rejected }, cur) => {
        if (cur.status === 'fulfilled') {
          return {
            fulfilled: [...fulfilled, cur.value],
            rejected,
          };
        }

        return { fulfilled, rejected: [...rejected, cur.reason] };
      },
      { fulfilled: [], rejected: [] },
    );

    if (rejected.length > 0) {
      this.logger.error({
        message: `getByNameBulk found some errors\n${rejected.join('\n')}`,
      });
    }

    if (fulfilled.length === 0 && rejected.length > 0) {
      throw new Error(`HTTP Error! No results found`);
    }

    return fulfilled;
  }
}
