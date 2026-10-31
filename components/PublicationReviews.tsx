'use client';

import { useEffect, useState } from 'react';
import {
  deletePublicationReview,
  formatDate,
  getPublicationReviews,
  postPublicationReview,
  updatePublicationReview,
  type PublicationReview,
  type ReviewSummary,
} from '@/lib/backend';
import StarRating, { StarInput } from './StarRating';

/*
 * Les avis d'une publication.
 *
 * Deux gestes, deux boutons : « Voir les avis » déplie la liste, « Laisser un
 * avis » ouvre le formulaire. Une fois l'avis envoyé, le formulaire se referme
 * et le bouton devient « Gérer mon avis » — on peut alors le corriger ou le
 * retirer. Le lecteur n'a pas de compte : son navigateur retient l'identifiant
 * de l'avis qu'il a écrit, et le serveur vérifie qu'il appartient bien à ce
 * document. Rien n'est inventé : sans avis, la liste le dit franchement.
 */

const STORAGE_PREFIX = 'dsae.review.';

type Mine = { id: string; rating: number; author: string; comment: string };

function readMine(entryId: string): Mine | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(`${STORAGE_PREFIX}${entryId}`);
    return raw ? (JSON.parse(raw) as Mine) : null;
  } catch {
    return null;
  }
}

function writeMine(entryId: string, mine: Mine | null) {
  if (typeof window === 'undefined') return;
  try {
    if (mine) window.localStorage.setItem(`${STORAGE_PREFIX}${entryId}`, JSON.stringify(mine));
    else window.localStorage.removeItem(`${STORAGE_PREFIX}${entryId}`);
  } catch {
    /* Le stockage peut être refusé (mode privé) : l'avis reste envoyé, seul le
     * rappel local du « mon avis » manque. Rien d'autre ne casse. */
  }
}

export default function PublicationReviews({
  entryId,
  initialReviews,
  initialSummary,
}: {
  entryId: string;
  initialReviews: PublicationReview[];
  initialSummary: ReviewSummary;
}) {
  const [reviews, setReviews] = useState(initialReviews);
  const [summary, setSummary] = useState(initialSummary);
  const [mine, setMine] = useState<Mine | null>(null);
  const [listOpen, setListOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [author, setAuthor] = useState('');
  const [comment, setComment] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    setMine(readMine(entryId));
  }, [entryId]);

  const refresh = async () => {
    /* On relit les avis depuis l'API : c'est la version acceptée par le serveur
     * qui s'affiche, pas une ligne fabriquée dans le navigateur. */
    const fresh = await getPublicationReviews(entryId, Date.now());
    setReviews(fresh.reviews);
    setSummary(fresh.summary);
  };

  const startCreate = () => {
    setRating(0);
    setAuthor('');
    setComment('');
    setNotice(null);
    setFormOpen(true);
  };

  const startEdit = () => {
    if (!mine) return;
    setRating(mine.rating);
    setAuthor(mine.author);
    setComment(mine.comment);
    setNotice(null);
    setFormOpen(true);
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!rating) {
      setNotice({ ok: false, text: 'Choisissez une note de 1 à 5.' });
      return;
    }
    setBusy(true);
    setNotice(null);
    const payload = { rating, author, comment };
    const result = mine
      ? await updatePublicationReview(entryId, mine.id, payload)
      : await postPublicationReview(entryId, payload);
    if (result.success) {
      if (!mine) {
        const fresh = await getPublicationReviews(entryId, Date.now());
        const created = fresh.reviews.find(
          (review) => review.rating === rating && review.comment === comment && review.author === author
        );
        if (created) {
          const record: Mine = { id: created.id, rating, author, comment };
          writeMine(entryId, record);
          setMine(record);
        }
      } else {
        writeMine(entryId, { id: mine.id, rating, author, comment });
        setMine({ id: mine.id, rating, author, comment });
      }
      await refresh();
      /* Le formulaire se referme dès l'envoi : le bouton devient « Gérer mon
       * avis », la liste reste consultable. */
      setFormOpen(false);
      setListOpen(true);
      setNotice({ ok: true, text: result.message });
    } else {
      setNotice({ ok: false, text: result.message });
    }
    setBusy(false);
  };

  const remove = async () => {
    if (!mine) return;
    setBusy(true);
    setNotice(null);
    const result = await deletePublicationReview(entryId, mine.id);
    if (result.success) {
      writeMine(entryId, null);
      setMine(null);
      setFormOpen(false);
      await refresh();
      setNotice({ ok: true, text: result.message });
    } else {
      setNotice({ ok: false, text: result.message });
    }
    setBusy(false);
  };

  return (
    <section className="publication-reviews" aria-labelledby="avis">
      <div className="reviews-head">
        <h3 id="avis">Avis</h3>
        <StarRating value={summary.average} count={summary.count} size={18} />
      </div>

      <div className="reviews-actions">
        <button
          type="button"
          className="btn btn-secondary"
          aria-expanded={listOpen}
          onClick={() => setListOpen((value) => !value)}
        >
          {listOpen ? 'Masquer les avis' : 'Voir les avis'}
          {summary.count > 0 ? ` (${summary.count})` : ''}
        </button>
        {mine ? (
          <button type="button" className="btn btn-primary" onClick={startEdit}>
            Gérer mon avis
          </button>
        ) : (
          <button type="button" className="btn btn-primary" onClick={startCreate}>
            Laisser un avis
          </button>
        )}
      </div>

      {notice && <p className={notice.ok ? 'review-notice ok' : 'review-notice'}>{notice.text}</p>}

      {listOpen && (
        reviews.length === 0 ? (
          <p className="reviews-empty">Aucun avis pour le moment. Soyez le premier à en donner un.</p>
        ) : (
          <ul className="review-list">
            {reviews.map((review) => (
              <li key={review.id} className="review-item">
                <div className="review-item-head">
                  <StarRating value={review.rating} size={15} />
                  {review.createdAt && <span className="review-date">{formatDate(review.createdAt)}</span>}
                  {mine?.id === review.id && <span className="review-mine">Votre avis</span>}
                </div>
                {review.comment && <p className="review-comment">{review.comment}</p>}
                {review.author && <p className="review-author">{review.author}</p>}
              </li>
            ))}
          </ul>
        )
      )}

      {formOpen && (
        <form className="review-form" onSubmit={submit}>
          <h4>{mine ? 'Gérer mon avis' : 'Donnez votre avis'}</h4>
          <StarInput value={rating} onChange={setRating} />
          <div className="review-fields">
            <label>
              <span>Votre nom</span>
              <input value={author} maxLength={80} onChange={(event) => setAuthor(event.target.value)} placeholder="Facultatif" />
            </label>
            <label className="grow">
              <span>Votre commentaire</span>
              <textarea value={comment} maxLength={2000} rows={3} onChange={(event) => setComment(event.target.value)} placeholder="Ce que vous pensez de ce document" />
            </label>
          </div>
          <div className="review-actions">
            <button type="submit" className="btn btn-primary" disabled={busy}>
              {busy ? 'Envoi…' : mine ? 'Enregistrer mon avis' : 'Publier mon avis'}
            </button>
            <button type="button" className="btn btn-secondary" disabled={busy} onClick={() => setFormOpen(false)}>
              Annuler
            </button>
            {mine && (
              <button type="button" className="review-delete" disabled={busy} onClick={remove}>
                Retirer mon avis
              </button>
            )}
          </div>
        </form>
      )}
    </section>
  );
}
