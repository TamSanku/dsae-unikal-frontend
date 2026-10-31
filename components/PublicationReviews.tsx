'use client';

import { useState } from 'react';
import {
  formatDate,
  getPublicationReviews,
  postPublicationReview,
  type PublicationReview,
  type ReviewSummary,
} from '@/lib/backend';
import StarRating, { StarInput } from './StarRating';

/*
 * Les avis d'une publication.
 *
 * Ils vivent ici, dans la fiche — pas sur la carte du catalogue, qui reste
 * sobre. Le lecteur lit les avis déjà donnés et peut laisser le sien sans
 * créer de compte : la note d'abord, le nom et le commentaire ensuite. Rien
 * n'est inventé : sans avis, la section le dit franchement.
 */
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
  const [rating, setRating] = useState(0);
  const [author, setAuthor] = useState('');
  const [comment, setComment] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!rating) {
      setNotice({ ok: false, text: 'Choisissez une note de 1 à 5.' });
      return;
    }
    setBusy(true);
    setNotice(null);
    const result = await postPublicationReview(entryId, { rating, author, comment });
    if (result.success) {
      /* On relit les avis depuis l'API : c'est la version acceptée par le
       * serveur qui s'affiche, pas une ligne fabriquée dans le navigateur. */
      const fresh = await getPublicationReviews(entryId, Date.now());
      setReviews(fresh.reviews);
      setSummary(fresh.summary);
      setRating(0);
      setAuthor('');
      setComment('');
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

      {reviews.length === 0 ? (
        <p className="reviews-empty">Aucun avis pour le moment. Soyez le premier à en donner un.</p>
      ) : (
        <ul className="review-list">
          {reviews.map((review) => (
            <li key={review.id} className="review-item">
              <div className="review-item-head">
                <StarRating value={review.rating} size={15} />
                {review.createdAt && <span className="review-date">{formatDate(review.createdAt)}</span>}
              </div>
              {review.comment && <p className="review-comment">{review.comment}</p>}
              {review.author && <p className="review-author">{review.author}</p>}
            </li>
          ))}
        </ul>
      )}

      <form className="review-form" onSubmit={submit}>
        <h4>Donnez votre avis</h4>
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
            {busy ? 'Envoi…' : 'Publier mon avis'}
          </button>
          {notice && <span className={notice.ok ? 'review-notice ok' : 'review-notice'}>{notice.text}</span>}
        </div>
      </form>
    </section>
  );
}
