export type UserProfile = {

  nickname: string;

  bornCountry: string;
  bornCity: string;

  liveCountry: string;
  liveCity: string;

  visited: string[];

  handedness: "left" | "right";

  planets: string[];

};

export const demoProfile: UserProfile = {

  nickname: "",

  bornCountry: "",
  bornCity: "",

  liveCountry: "",
  liveCity: "",

  visited: [],

  handedness: "right",

  planets: ["Земля"]

};