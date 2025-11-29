import { useEffect, RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { Language } from './types';

gsap.registerPlugin(ScrambleTextPlugin);

interface IntroAnimationProps {
  languages: Language[];
  greetingRef: RefObject<HTMLDivElement | null>;
  descriptionRef: RefObject<HTMLParagraphElement | null>;
  lineRefs: RefObject<(HTMLDivElement | null)[]>;
  onShowTip: () => void;
  onShowExplore: () => void;
}

export function useIntroAnimation({
  languages,
  greetingRef,
  descriptionRef,
  lineRefs,
  onShowTip,
  onShowExplore,
}: IntroAnimationProps) {
  useEffect(() => {
    if (!languages[0]) return;
    const first = languages[0];
    const tl = gsap.timeline({ delay: 0.5 });

    if (greetingRef.current) {
      gsap.set(greetingRef.current, { opacity: 1 });
    }

    lineRefs.current?.forEach((ref, index) => {
      if (ref) {
        gsap.set(ref, { scaleX: 0, opacity: 0 });
        tl.to(
          ref,
          {
            scaleX: 1,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
          },
          0.8 + index * 0.15,
        );
      }
    });

    if (descriptionRef.current) {
      gsap.set(descriptionRef.current, { opacity: 1 });
    }

    tl.call(onShowTip, [], 0.7);
    tl.call(onShowExplore, [], 0.7);

    return () => {
      tl.kill();
    };
  }, [
    languages,
    onShowTip,
    onShowExplore,
    greetingRef,
    descriptionRef,
    lineRefs,
  ]);
}
