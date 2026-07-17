export type SelectedCity = {
  id: number;
  city: string;
  country: string;
};

export type AppState = {
  selectedCity: SelectedCity | null;

  search: string;

  menuOpen: boolean;
};

export const appState: AppState = {
  selectedCity: null,

  search: "",

  menuOpen: false,
};