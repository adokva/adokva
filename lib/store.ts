export interface SelectedCity {
  id: number;
  city: string;
  country: string;
}

export interface AppState {
  selectedCity: SelectedCity | null;

  searchOpen: boolean;

  menuOpen: boolean;
}

export const store: AppState = {
  selectedCity: null,

  searchOpen: false,

  menuOpen: false,
};