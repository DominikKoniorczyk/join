import { Keyframes } from "../../../services/animation.service";

export const slideOutAnimations: Keyframes[] = [
  {
    transform: "translate(-20%, 0)"
  },
  {
    transform: "translate(100%, 0)"
  }
];

export const slideInAnimations: Keyframes[] = [
  {
    transform: "translate(100%, 0)"
  },
  {
    transform: "translate(-20%, 0)"
  }
];
