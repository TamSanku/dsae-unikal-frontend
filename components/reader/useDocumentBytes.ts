'use client';

import { useEffect, useState } from 'react';

/*
 * Le téléchargement des octets d'un document, avec son état.
 *
 * Word, Excel et texte ont besoin du fichier entier pour le lire : le
 * navigateur n'en sait rien faire seul. PDF, image, son et vidéo n'en ont pas
 * besoin — ils le lisent en flux — et la visionneuse Office en ligne va le
 * chercher elle-même.
 *
 * `url` vient du serveur et ne change pas pendant la vie du lecteur : la
 * requête part donc une seule fois. Le résultat est annulé si l'écran se ferme
 * avant la fin, pour ne pas écrire dans un composant démonté.
 */

export type BytesState =
  | { status: 'loading' }
  | { status: 'ready'; data: ArrayBuffer }
  | { status: 'error'; message: string };

export function useDocumentBytes(url: string): BytesState {
  const [state, setState] = useState<BytesState>({ status: 'loading' });

  useEffect(() => {
    if (!url) {
      setState({ status: 'error', message: 'Aucune adresse de document n’a été fournie.' });
      return;
    }

    const controller = new AbortController();
    setState({ status: 'loading' });

    fetch(url, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Le serveur a répondu ${response.status}.`);
        }
        return response.arrayBuffer();
      })
      .then((data) => setState({ status: 'ready', data }))
      .catch((error: unknown) => {
        /* Une annulation n'est pas un échec : c'est la fermeture du lecteur. */
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setState({
          status: 'error',
          message:
            'Le fichier n’a pas pu être récupéré. Vérifiez votre connexion, puis réessayez.',
        });
      });

    return () => controller.abort();
  }, [url]);

  return state;
}
