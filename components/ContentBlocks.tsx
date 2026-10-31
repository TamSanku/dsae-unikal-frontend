import { Fragment } from 'react';
import { mediaUrl } from '@/lib/backend';

/*
 * Le corps d'un contenu publié : ses blocs, dans l'ordre de la rédaction.
 *
 * C'est ce qui fait qu'un document rédigé dans l'espace de gestion sort sur le
 * portail tel qu'il a été composé — paragraphe, image, liste, citation, pièce
 * jointe. Rien n'est inventé : un bloc absent n'existe pas, et une adresse de
 * média relative est rattachée à l'origine du backend pour s'afficher vraiment.
 */

export type ContentBlock =
  | { type: 'paragraph'; id?: string; text: string }
  | { type: 'heading'; id?: string; level: number; text: string }
  | { type: 'list'; id?: string; ordered: boolean; items: string[] }
  | { type: 'quote'; id?: string; text: string }
  | { type: 'divider'; id?: string }
  | { type: 'image'; id?: string; mediaUrl: string; alt?: string; caption?: string }
  | { type: 'video'; id?: string; mediaUrl: string; caption?: string }
  | { type: 'file'; id?: string; mediaUrl: string; fileName?: string }
  | { type: 'embed'; id?: string; url: string; caption?: string }
  | { type: 'rich'; id?: string; doc?: { content?: any[] } };

const URL_PATTERN = /(https?:\/\/[^\s<>()]+|www\.[^\s<>()]+)/g;

/** Les adresses nues d'un texte deviennent des liens cliquables. */
function linkify(text: string) {
  return text.split(URL_PATTERN).map((part, index) => {
    if (!part) return null;
    if (/^(https?:\/\/|www\.)/i.test(part)) {
      const href = part.startsWith('www.') ? `https://${part}` : part;
      return (
        <a key={index} href={href} target="_blank" rel="noopener noreferrer">
          {part}
        </a>
      );
    }
    return <Fragment key={index}>{part}</Fragment>;
  });
}

function renderInline(nodes: any[], keyPrefix: string) {
  return nodes.map((node, index) => {
    const key = `${keyPrefix}-${index}`;
    if (node.type === 'hardBreak') return <br key={key} />;
    if (node.type !== 'text') return null;
    let element: React.ReactNode = node.text ?? '';
    for (const mark of node.marks ?? []) {
      if (mark.type === 'bold') element = <strong key={key}>{element}</strong>;
      else if (mark.type === 'italic') element = <em key={key}>{element}</em>;
      else if (mark.type === 'underline') element = <u key={key}>{element}</u>;
      else if (mark.type === 'strike') element = <s key={key}>{element}</s>;
      else if (mark.type === 'code') element = <code key={key}>{element}</code>;
      else if (mark.type === 'link') {
        const href = String(mark.attrs?.href ?? '');
        if (href) {
          element = (
            <a key={key} href={mediaUrl(href)} target="_blank" rel="noopener noreferrer">
              {element}
            </a>
          );
        }
      }
    }
    return <Fragment key={key}>{element}</Fragment>;
  });
}

function renderRich(doc: { content?: any[] } | undefined, keyPrefix: string) {
  return (doc?.content ?? []).map((node, index) => {
    const key = `${keyPrefix}-${index}`;
    if (node.type === 'paragraph') return <p key={key}>{renderInline(node.content ?? [], key)}</p>;
    if (node.type === 'bulletList' || node.type === 'orderedList') {
      const items = (node.content ?? []).map((item: any, itemIndex: number) => (
        <li key={`${key}-${itemIndex}`}>
          {(item.content ?? []).flatMap((paragraph: any) => renderInline(paragraph.content ?? [], `${key}-${itemIndex}`))}
        </li>
      ));
      return node.type === 'orderedList' ? <ol key={key}>{items}</ol> : <ul key={key}>{items}</ul>;
    }
    return null;
  });
}

function Block({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'paragraph':
      return <p>{linkify(block.text)}</p>;
    case 'rich':
      return <>{renderRich(block.doc, block.id ?? 'rich')}</>;
    case 'heading':
      return block.level === 2 ? <h2>{block.text}</h2> : block.level === 3 ? <h3>{block.text}</h3> : <h4>{block.text}</h4>;
    case 'list':
      return block.ordered ? (
        <ol>{block.items.map((item, index) => <li key={index}>{linkify(item)}</li>)}</ol>
      ) : (
        <ul>{block.items.map((item, index) => <li key={index}>{linkify(item)}</li>)}</ul>
      );
    case 'quote':
      return <blockquote>{linkify(block.text)}</blockquote>;
    case 'divider':
      return <hr />;
    case 'image':
      return (
        <figure>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={mediaUrl(block.mediaUrl)} alt={block.alt || block.caption || ''} loading="lazy" />
          {block.caption ? <figcaption>{block.caption}</figcaption> : null}
        </figure>
      );
    case 'video':
      return (
        <figure>
          <video src={mediaUrl(block.mediaUrl)} controls preload="metadata" />
          {block.caption ? <figcaption>{block.caption}</figcaption> : null}
        </figure>
      );
    case 'file':
      /* Le nom du fichier joint n'est jamais montré : la fiche porte déjà
       * « Lire » et « Télécharger ». Un bloc fichier ne produit donc rien. */
      return null;
    case 'embed':
      return (
        <figure>
          <a href={mediaUrl(block.url)} target="_blank" rel="noopener noreferrer">
            {block.caption || block.url}
          </a>
        </figure>
      );
    default:
      return null;
  }
}

export default function ContentBlocks({ blocks }: { blocks?: ContentBlock[] | null }) {
  if (!blocks?.length) return null;
  return (
    <div className="content-blocks">
      {blocks.map((block, index) => (
        <Block block={block} key={block.id ?? index} />
      ))}
    </div>
  );
}
