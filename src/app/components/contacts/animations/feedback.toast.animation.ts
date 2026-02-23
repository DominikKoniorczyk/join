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

export const feedbackDownToUpAnimations: Keyframes[] = [
  {
    offset: 0,
    transform: "translateX(-50%) translateY(100%)",
    opacity: "0",
    bottom: "0"
  },
  {
    offset: 0.15,
    transform: "translateX(-50%) translateY(0)",
    opacity: "1",
    bottom: "100px"
  },
  {
    offset: 0.85,
    transform: "translateX(-50%) translateY(0)",
    opacity: "1",
    bottom: "100px"
  },
  {
    offset: 1,
    transform: "translateX(-50%) translateY(100%)",
    opacity: "0",
    bottom: "0"
  }
];

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

export const slideUpAnimations: Keyframes[] = [
  {
    transform: "translate(-50%, 100%)"
  },
  {
    transform: "translate(-50%, -50%)"
  }
];

export const slideDownAnimations: Keyframes[] = [
  {
    transform: "translate(-50%, -50%)"
  },
  {
    transform: "translate(-50%, 100%)"
  }
];

