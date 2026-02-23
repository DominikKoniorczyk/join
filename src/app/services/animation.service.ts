import { Injectable } from "@angular/core";

export interface Keyframes{
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
  animate(el: HTMLElement | SVGElement, keyframes: Keyframes[], duration: number, forward: boolean, currentAnim: Animation | null = null): Promise<void> {
    const keys = forward ? this.returnKeyframes(keyframes) : this.returnInverseKeyframes(keyframes);
    return new Promise(resolve => {
      const anim = el.animate(keys, {
        duration,
        easing: 'ease-in-out',
        fill: 'forwards'
      });
      currentAnim = anim;
      anim.onfinish = () => {
        resolve();
        currentAnim = null;
      }
    });
  }

  private returnKeyframes(keyframes: Keyframes[]):any [] {
    const keys: any[] = [];
    keyframes.forEach(currentKey => {
      keys.push(currentKey);
    });
    return keys;
  }

  private returnInverseKeyframes(keyframes: Keyframes[]):any [] {
    const keys: any[] = [];
    for (const currentKey of [...keyframes].reverse()) {
      keys.push(currentKey);
    };
    return keys;
  }
}
