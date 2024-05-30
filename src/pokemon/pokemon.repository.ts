import { Injectable, Logger } from '@nestjs/common';
import { IPokemon, IPokemonResource } from '../interface/pokemon.interface';

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
    throw new Error(`HTTP Error! Status ${response.status}`);
  }
}
