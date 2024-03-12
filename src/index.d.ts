type PokemonResponse = {
  id: number;
  name: string;
  sprites: {
    back_default: string;
    front_default: string;
    front_female: string;
    front_shiny: string;
    front_shiny_female: string;
  };
  cries: {
    latest: string;
  };
};
