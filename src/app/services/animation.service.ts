import { Injectable } from "@angular/core";

export interface Keyframes {
  offset?: number,
  top?: string,
  left?: string,
  right?: string,
  bottom?: string,
  transform?: string,
  opacity?: string
}

@Injectable({
  providedIn: 'root',
})
export class AnimationService {

  /**
   * Animates an HTML or SVG element using the provided keyframes.
   *
   * @param {HTMLElement | SVGElement} el - The element to animate.
   * @param {Keyframes[]} keyframes - The keyframes defining the animation.
   * @param {number} duration - Duration of the animation in milliseconds.
   * @param {boolean} forward - True for normal direction, false to reverse the animation.
   * @param {Animation | null} currentAnim - Optional reference to the current animation.
   * @returns {Promise<void>} Resolves when the animation finishes.
   */
   animate(el: HTMLElement | SVGElement, keyframes: Keyframes[], duration: number, forward: boolean, currentAnim: Animation | null = null): Promise<void> {
    const keys = forward ? this.returnKeyframes(keyframes) : this.returnInverseKeyframes(keyframes);
    return new Promise(resolve => {
      const anim = el.animate(keys, { duration, easing: 'ease-in-out', fill: 'forwards' });
      currentAnim = anim;
      anim.onfinish = () => {
        resolve();
        currentAnim = null;
      }
    });
  }

  /**
   * Returns a shallow copy of the provided keyframes in their original order.
   *
   * @param {Keyframes[]} keyframes - The keyframes to process.
   * @returns {any[]} The keyframes in forward order.
   */
   private returnKeyframes(keyframes: Keyframes[]): any[] {
    const keys: any[] = [];
    keyframes.forEach(currentKey => {
      keys.push(currentKey);
    });
    return keys;
  }

  /**
   * Returns a shallow copy of the provided keyframes in reverse order.
   *
   * @param {Keyframes[]} keyframes - The keyframes to process.
   * @returns {any[]} The keyframes in reverse order.
   */
   private returnInverseKeyframes(keyframes: Keyframes[]): any[] {
    const keys: any[] = [];
    for (const currentKey of [...keyframes].reverse()) {
      keys.push(currentKey);
    };
    return keys;
  }
}
