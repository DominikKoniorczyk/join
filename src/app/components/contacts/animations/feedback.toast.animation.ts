import { Keyframes } from './../../../services/animation.service';

export const feedbackAnimations: Keyframes[] = [
  {
    offset: 0,
    transform: "translateX(120%)",
    opacity: "0"
  },
  {
    offset: 0.15,
    transform: "translateX(0)",
    opacity: "1"
  },
  {
    offset: 0.85,
    transform: "translateX(0)",
    opacity: "1"
  },
  {
    offset: 1,
    transform: "translateX(120%)",
    opacity: "0"
  }
];

export const slideOutAnimations: Keyframes[] = [
  {
    transform: "translate(-20%, 0)",
  },
  {
    transform: "translate(100%, 0)"
  }
];

