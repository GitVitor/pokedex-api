import { ApiProperty } from '@nestjs/swagger';
import { IPokemon, Stat, Type } from '../interface/pokemon.interface';

export class GetPokemonListDTO {
  @ApiProperty()
  name: string;

  @ApiProperty()
  attack: Stat;

  @ApiProperty()
  defense: Stat;

  @ApiProperty()
  types: Type[];

  @ApiProperty()
  background: string;
}

export function convertPokemonToPokemonListDTO(pokemon: IPokemon) {
  return {
    name: pokemon.name,
    attack: pokemon.stats.filter((stat) => {
      return stat.stat.name === 'attack';
    })[0],
    defense: pokemon.stats.filter((stat) => {
      return stat.stat.name === 'defense';
    })[0],
    types: pokemon.types,
    background: pokemon.sprites.front_default || pokemon.sprites.back_default,
  };
}
