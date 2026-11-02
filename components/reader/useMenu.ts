'use client';

import { useEffect, useRef, useState } from 'react';

/*
 * Un menu qui s'ouvre, et se referme comme on l'attend.
 *
 * Trois comportements, toujours les mêmes : le clic à l'extérieur ferme, Échap
 * ferme, et le panneau reste ancré à son bouton. Les écrire une fois évite
 * qu'un menu se ferme et qu'un autre non.
 *
 * Échap s'arrête ici : sans cela, la touche traverserait jusqu'au lecteur et
 * fermerait le document alors qu'on voulait seulement refermer le menu.
 */
export function useMenu<T extends HTMLElement = HTMLDivElement>() {
  const [open, setOpen] = useState(false);
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.stopPropagation();
      setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    /* En capture : on doit voir la touche avant le lecteur, pour la retenir. */
    document.addEventListener('keydown', onKey, true);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey, true);
    };
  }, [open]);

  return { open, setOpen, ref };
}
