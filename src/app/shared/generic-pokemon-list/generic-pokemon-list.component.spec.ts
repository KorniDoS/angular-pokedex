import { GenericPokemonListComponent } from './generic-pokemon-list.component';
import { PokemonListItem } from '../../interfaces/pokemon-list-item.interface';

describe('GenericPokemonListComponent', () => {
  let component: GenericPokemonListComponent;

  beforeEach(() => {
    component = new GenericPokemonListComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit remove event when removePokemon is called', () => {
    const spy = jest.spyOn(component['remove'], 'emit');
    component.removePokemon(42);
    expect(spy).toHaveBeenCalledWith(42);
  });

  it('should emit move event when movePokemon is called and showCatchButton is true', () => {
    component.showCatchButton = true;
    const spy = jest.spyOn(component['move'], 'emit');
    component.movePokemon(99);
    expect(spy).toHaveBeenCalledWith(99);
  });

  it('should not emit move event when movePokemon is called and showCatchButton is false', () => {
    component.showCatchButton = false;
    const spy = jest.spyOn(component['move'], 'emit');
    component.movePokemon(77);
    expect(spy).not.toHaveBeenCalled();
  });

  it('should accept pokemons input', () => {
    const pokemons: PokemonListItem[] = [
      { id: 1, name: 'bulbasaur' },
      { id: 2, name: 'ivysaur' },
    ];
    component.pokemons = pokemons;
    expect(component.pokemons).toEqual(pokemons);
  });
});
