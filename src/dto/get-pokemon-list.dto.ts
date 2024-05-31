import { ApiProperty } from '@nestjs/swagger';
import { IPokemon, Stat, Type } from '../interface/pokemon.interface';

export class GetPokemonListDTO {
  constructor(
    name: string,
    attack: Stat,
    defense: Stat,
    types: Type[],
    background: string,
  ) {
    this.name = name;
    this.attack = attack;
    this.defense = defense;
    this.types = types;
    this.background = background;
  }

  @ApiProperty({ description: 'Pokemon name' })
  name: string;

  @ApiProperty({ description: 'Pokemon attack stats data' })
  attack: Stat;

  @ApiProperty({ description: 'Pokemon defense stats data' })
  defense: Stat;

  @ApiProperty({ description: 'Pokemon type i.e. poison, eletric, water' })
  types: Type[];

  @ApiProperty({ description: 'URL Link to a image that can be used as URL' })
  background: string;
}

export function convertPokemonToPokemonListDTO(
  pokemon: IPokemon,
  background: string,
) {
  const attack = pokemon.stats.filter((stat) => {
    return stat.stat.name === 'attack';
  })[0];

  const defense = pokemon.stats.filter((stat) => {
    return stat.stat.name === 'defense';
  })[0];

  const dtoData = new GetPokemonListDTO(
    pokemon.name,
    attack,
    defense,
    pokemon.types,
    background,
  );
  return dtoData;
}
