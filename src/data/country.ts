import ArgentinaStates from './states/Argentina';
import BrazilStates from './states/Brazil';

export interface CountryDataProps {
  name: string;
  val: string;
  telephonePrefix: string;
  states: string[],
}

export const countryData: CountryDataProps[] = [
  {
    name: 'Argentina', val: 'Argentina', telephonePrefix: '+54', states: ArgentinaStates,
  },
  {
    name: 'Bolivia', val: 'Bolivia', telephonePrefix: '+591', states: [],
  },
  {
    name: 'Brazil', val: 'Brazil', telephonePrefix: '+55', states: BrazilStates,
  },
  {
    name: 'Colombia', val: 'Colombia', telephonePrefix: '+57', states: [],
  },
  {
    name: 'Mexico', val: 'Mexico', telephonePrefix: '+52', states: [],
  },
  {
    name: 'Pakistan', val: 'Pakistan', telephonePrefix: '+92', states: [],
  },
  {
    name: 'Peru', val: 'Peru', telephonePrefix: '+51', states: [],
  },
];

export const countriesWithStates: string[] = countryData.filter(c => c.states.length > 0).map(c => c.val);
