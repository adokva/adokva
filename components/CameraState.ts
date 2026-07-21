export type CameraTarget = {
  lat: number;
  lon: number;
} | null;

export type CameraMode =
  | "idle"
  | "flying"
  | "orbit";

export interface CameraState {
  mode: CameraMode;
  target: CameraTarget;
}

export const initialCameraState: CameraState = {
  mode: "idle",
  target: null,
};