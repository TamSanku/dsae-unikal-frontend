'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { readScroll, writeScroll } from '@/lib/reader-notes';

/*
 * Retenir où l'on en était dans un document qui se lit au kilomètre — Word,
 * classeur, texte — et non page par page.
 *
 * On garde une **fraction** (0 à 1) de la hauteur parcourue, jamais un nombre de
 * pixels : la même reprise tombe donc juste sur un téléphone comme sur un grand
 * écran, où le texte n'occupe pas le même nombre de lignes.
 *
 * Le crochet rend une **référence de rappel**, pas un objet : ces visionneuses
 * affichent d'abord un sablier, et leur cadre de défilement n'existe donc pas au
 * premier rendu. Une référence d'objet serait encore vide à ce moment-là, et la
 * mesure se ferait sur rien. Le rappel, lui, prévient le crochet dès que le
 * cadre paraît — c'est ce qui rend la reprise fiable.
 *
 * La position s'écrit en quittant le cadre, et non à chaque défilement : écrire
 * à chaque pixel userait le stockage du visiteur pour rien. Un garde-fou évite
 * tout de même d'écrire quand rien n'a bougé de façon perceptible.
 */
export function useScrollMemory<T extends HTMLElement>(key: string, resetTick: number) {
  const [node, setNode] = useState<T | null>(null);
  /* Une référence de rappel stable : un rappel recréé à chaque rendu ferait
   * détacher puis rattacher le cadre sans fin. */
  const attach = useCallback((element: T | null) => setNode(element), []);

  /* Le cadre courant, pour l'action impérative de « Recommencer au début ». */
  const latest = useRef<T | null>(null);
  latest.current = node;

  useEffect(() => {
    if (!node) return;

    const span = () => node.scrollHeight - node.clientHeight;
    let last = -1;

    const save = () => {
      const available = span();
      if (available <= 0) return;
      const ratio = node.scrollTop / available;
      if (Math.abs(ratio - last) < 0.01) return;
      last = ratio;
      writeScroll(key, ratio);
    };

    /* Le contenu n'a pas encore sa hauteur au premier passage : on retente
     * quelques fois avant d'abandonner, sans quoi la reprise retomberait en
     * haut du document. */
    const saved = readScroll(key);
    let tries = 0;
    let timer = 0;
    const restore = () => {
      if (saved !== null && span() > 0) {
        node.scrollTop = saved * span();
        last = saved;
        return;
      }
      tries += 1;
      if (tries < 8) timer = window.setTimeout(restore, 150);
    };
    if (saved !== null) timer = window.setTimeout(restore, 60);

    node.addEventListener('scroll', save, { passive: true });
    return () => {
      window.clearTimeout(timer);
      save();
      node.removeEventListener('scroll', save);
    };
  }, [node, key]);

  /* « Recommencer au début » : on remonte en haut. */
  useEffect(() => {
    if (resetTick === 0) return;
    latest.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [resetTick]);

  return attach;
}
