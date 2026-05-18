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

export const imageSlideInAnimations: Keyframes[] = [
  {
    top: "100%",
    transform: "translateY(0%)"
  },
  {
    top: "50%",
    transform: "translateY(-50%)"
  }
];

export const imageSlideOutAnimations: Keyframes[] = [
  {
    top: "50%",
    transform: "translateY(-50%)"
  },
  {
    top: "100%",
    transform: "translateY(0%)"
  }
]
