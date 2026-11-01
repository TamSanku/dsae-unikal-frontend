import Link from 'next/link';

/*
 * Le contenu de l'aide : les questions fréquentes et les guides d'utilisation.
 *
 * Séparé de la page pour qu'elle reste lisible : ici vivent les textes, la page
 * ne fait que les ranger en onglets. Chaque entrée porte un champ `search` — la
 * question ou le titre, le corps en clair, plus quelques mots que l'on
 * emploierait naturellement. C'est ce champ que lit la recherche de l'aide
 * (`components/HelpBrowser.tsx`), jamais le HTML rendu.
 *
 * Rien n'est inventé : chaque réponse et chaque étape décrivent ce que le
 * portail fait réellement.
 */

export type FaqItem = {
  key: string;
  question: string;
  answer: React.ReactNode;
  /* Le texte cherché : la question et le corps en clair, plus quelques mots que
   * l'on emploierait naturellement. La recherche ne lit que ce champ. */
  search: string;
};

export type FaqGroup = { key: string; label: string; items: FaqItem[] };

export const FAQ_GROUPS: FaqGroup[] = [
  {
    key: 'decouvrir',
    label: 'Découvrir le DSAE et le portail',
    items: [
      {
        key: 'qu-est-ce-que-le-dsae',
        question: 'Qu’est-ce que le DSAE ?',
        answer: (
          <>
            Le Domaine des Sciences Agronomiques et de l’Environnement est une composante de
            l’Université de Kalemie. Il réunit la formation, la recherche appliquée et l’appui aux
            communautés autour de l’agriculture, de l’élevage et de la gestion durable de
            l’environnement. En savoir plus sur la page{' '}
            <Link href="/a-propos">À propos</Link>.
          </>
        ),
        search:
          'Qu’est-ce que le DSAE Domaine des Sciences Agronomiques et de l’Environnement composante Université de Kalemie UNIKAL formation recherche appliquée appui communautés agriculture élevage environnement',
      },
      {
        key: 'a-qui-s-adresse-le-portail',
        question: 'À qui s’adresse ce portail ?',
        answer: (
          <>
            Aux étudiants, aux enseignants et chercheurs, aux producteurs et aux communautés, aux
            institutions partenaires, aux journalistes et à toute personne curieuse des travaux du
            domaine. Chaque rubrique se lit sans compte à créer.
          </>
        ),
        search:
          'À qui s’adresse ce portail public étudiants enseignants chercheurs producteurs communautés partenaires journalistes visiteurs sans compte',
      },
      {
        key: 'quelles-rubriques',
        question: 'Quelles rubriques puis-je consulter ?',
        answer: (
          <>
            Le menu mène à <Link href="/actualites">Actualités</Link>,{' '}
            <Link href="/a-propos">À propos</Link>, <Link href="/universite">Université</Link>,{' '}
            <Link href="/equipe">Équipe</Link>, <Link href="/recherche">Recherche</Link>,{' '}
            <Link href="/publications">Publications</Link>,{' '}
            <Link href="/s-engager">S’engager</Link>, <Link href="/alumni">Alumni</Link> et{' '}
            <Link href="/aide">Aide et support</Link>. Le pied de page reprend la même suite, plus
            les pages légales.
          </>
        ),
        search:
          'Quelles rubriques puis-je consulter menu Accueil Actualités À propos Université Équipe Recherche Publications S’engager Alumni Aide et support pied de page pages légales',
      },
      {
        key: 'langues',
        question: 'Le portail est-il disponible en plusieurs langues ?',
        answer: (
          <>
            Le portail est publié en français. Aucune traduction automatique n’est proposée : les
            contenus sont rédigés et publiés dans cette langue par l’équipe du DSAE.
          </>
        ),
        search:
          'Le portail est-il disponible en plusieurs langues français traduction anglais lingala swahili',
      },
      {
        key: 'suivre-activites',
        question: 'Comment suivre les activités du DSAE ?',
        answer: (
          <>
            La page <Link href="/actualites">Actualités</Link> rassemble les annonces, séminaires et
            événements. Vous pouvez aussi demander l’inscription à la newsletter depuis le{' '}
            <Link href="/contact?subject=newsletter">formulaire de contact</Link>.
          </>
        ),
        search:
          'Comment suivre les activités du DSAE actualités annonces séminaires conférences événements newsletter inscription',
      },
      {
        key: 'reutiliser-contenus',
        question: 'Puis-je réutiliser les contenus du site ?',
        answer: (
          <>
            Les textes et les documents sont destinés à la formation et à la recherche. Vous pouvez
            les citer en indiquant clairement la source et le lien vers la fiche. Pour un usage
            commercial ou une reproduction importante, écrivez-nous depuis le{' '}
            <Link href="/contact">formulaire de contact</Link>.
          </>
        ),
        search:
          'Puis-je réutiliser les contenus du site citer source lien droits usage commercial reproduction copyright',
      },
    ],
  },
  {
    key: 'rechercher',
    label: 'Rechercher et naviguer',
    items: [
      {
        key: 'recherche-globale',
        question: 'Comment chercher sur tout le portail ?',
        answer: (
          <>
            Cliquez sur la loupe, en haut de la page, à côté de « S’engager ». Un champ s’ouvre :
            tapez un mot, et les fiches qui correspondent apparaissent — actualités, publications,
            membres de l’équipe, alumni, axes de recherche. Chaque résultat mène directement à sa
            fiche. Le raccourci clavier Ctrl + K (ou ⌘ + K sur Mac) ouvre aussi la recherche.
          </>
        ),
        search:
          'Comment chercher sur tout le portail recherche globale loupe en haut du site Ctrl K champ résultats actualités publications équipe alumni axes',
      },
      {
        key: 'recherche-rubrique',
        question: 'Comment chercher dans une rubrique précise ?',
        answer: (
          <>
            Chaque rubrique (Équipe, Publications, Actualités, Alumni) possède sa propre barre de
            recherche, au-dessus de la liste. Tapez un mot — un nom, un titre, un mot-clé : la liste
            se resserre aussitôt, sans recharger la page.
          </>
        ),
        search:
          'Comment chercher dans une rubrique précise barre de recherche catalogue liste se resserre nom titre mot-clé',
      },
      {
        key: 'onglets',
        question: 'Comment fonctionnent les onglets ?',
        answer: (
          <>
            Chaque catalogue se range en onglets : les catégories pour l’équipe, les domaines pour
            les publications et les alumni. Cliquez sur un onglet pour ne garder que cette partie de
            la liste. Un clic sur « Tout » (ou « À la une » pour les actualités) montre de nouveau
            l’ensemble.
          </>
        ),
        search:
          'Comment fonctionnent les onglets catégories équipe domaines publications alumni tout voir à la une ensemble',
      },
      {
        key: 'onglets-defilement',
        question: 'Les onglets dépassent de l’écran, que faire ?',
        answer: (
          <>
            Les onglets restent sur une seule ligne : si la rangée est plus large que l’écran, elle
            défile horizontalement. Faites glisser du doigt sur téléphone, ou utilisez la molette
            avec la touche Maj sur ordinateur.
          </>
        ),
        search:
          'Les onglets dépassent de l’écran que faire défilement horizontal glisser doigt molette maj téléphone',
      },
      {
        key: 'filtrer',
        question: 'Comment filtrer une liste ?',
        answer: (
          <>
            À côté de la barre de recherche, l’icône d’entonnoir ouvre les filtres. Sur les
            publications, on choisit une date et un niveau d’études ; sur les alumni, un niveau. Un
            compteur rappelle combien de filtres sont actifs, et un lien les remet tous à zéro.
          </>
        ),
        search:
          'Comment filtrer une liste entonnoir filtres publications date niveau d’études alumni compteur réinitialiser',
      },
      {
        key: 'a-la-une',
        question: 'Que signifie « À la une » dans les actualités ?',
        answer: (
          <>
            « À la une » est la vue d’ensemble du fil : elle montre <em>toutes</em> les actualités
            publiées, quel que soit leur type. Les onglets suivants resserrent le fil sur un type
            précis — DSAE, Presse, Communiqué… Une actualité paraît donc à la fois sous « À la une »
            et sous son type.
          </>
        ),
        search:
          'Que signifie À la une dans les actualités vue d’ensemble fil toutes les actualités type DSAE Presse Communiqué',
      },
      {
        key: 'menu-telephone',
        question: 'Le menu fonctionne-t-il sur téléphone ?',
        answer: (
          <>
            Oui. Sur petit écran, le bouton en haut à droite ouvre le menu latéral, où toutes les
            rubriques sont accessibles. Un appui sur une rubrique referme le menu et ouvre la page.
          </>
        ),
        search:
          'Le menu fonctionne-t-il sur téléphone mobile bouton menu latéral tiroir rubriques responsive',
      },
    ],
  },
  {
    key: 'contenus',
    label: 'Publications, actualités et recherche',
    items: [
      {
        key: 'lire-publication',
        question: 'Comment lire une publication ou une actualité ?',
        answer: (
          <>
            Cliquez sur une carte pour ouvrir sa fiche. Le texte s’y déroule ; quand un document est
            joint (PDF, mémoire…), il se lit dans la page ou se télécharge depuis la fiche.
          </>
        ),
        search:
          'Comment lire une publication ou une actualité ouvrir fiche document joint PDF mémoire lecteur',
      },
      {
        key: 'telecharger',
        question: 'Comment télécharger un document ?',
        answer: (
          <>
            Sur la fiche, le bouton « Télécharger » récupère le document joint. Le nom du fichier
            apparaît alors dans votre dossier de téléchargements habituel.
          </>
        ),
        search:
          'Comment télécharger un document bouton télécharger PDF fichier pièce jointe',
      },
      {
        key: 'axe-filiere',
        question: 'Qu’est-ce qu’un axe de recherche, une filière ?',
        answer: (
          <>
            Un <strong>axe de recherche</strong> est un champ scientifique conduit par le domaine ;
            il se lit sur la page <Link href="/recherche">Recherche</Link>. Une{' '}
            <strong>filière</strong> est une voie de formation et les axes qui s’y rattachent ; elle
            se lit sur la page <Link href="/a-propos">À propos</Link>.
          </>
        ),
        search:
          'Qu’est-ce qu’un axe de recherche une filière formation voie scientifique recherche à propos',
      },
      {
        key: 'trouver-membre',
        question: 'Comment retrouver un membre de l’équipe ou un alumni ?',
        answer: (
          <>
            La page <Link href="/equipe">Équipe</Link> liste les responsables et acteurs
            scientifiques, rangés par catégorie. La page <Link href="/alumni">Alumni</Link> présente
            les diplômés, rangés par domaine. Dans les deux cas, la barre de recherche retrouve une
            personne par son nom, sa fonction ou son parcours.
          </>
        ),
        search:
          'Comment retrouver un membre de l’équipe ou un alumni équipe catégorie diplômés domaine recherche nom fonction parcours',
      },
      {
        key: 'partager-fiche',
        question: 'Puis-je partager une fiche ?',
        answer: (
          <>
            Oui. Chaque fiche a sa propre adresse : copiez-la depuis la barre du navigateur et
            partagez-la. Le lien ouvre directement le même contenu.
          </>
        ),
        search:
          'Puis-je partager une fiche adresse URL lien copier barre du navigateur',
      },
      {
        key: 'a-lire-aussi',
        question: 'À quoi sert le carrousel en bas d’une fiche ?',
        answer: (
          <>
            En bas d’une fiche, un carrousel propose d’autres documents ou actualités à lire. Sur une
            publication, il met d’abord en avant les documents du même domaine. Les flèches font
            défiler d’un cran et s’éteignent aux deux bouts.
          </>
        ),
        search:
          'À quoi sert le carrousel en bas d’une fiche à lire aussi autres documents actualités flèches même domaine',
      },
    ],
  },
  {
    key: 'avis',
    label: 'Avis sur les publications',
    items: [
      {
        key: 'laisser-avis',
        question: 'Comment laisser un avis sur une publication ?',
        answer: (
          <>
            Ouvrez la fiche de la publication, puis cliquez sur « Laisser un avis ». Choisissez une
            note de 1 à 5 étoiles, ajoutez un nom et un commentaire si vous le souhaitez, puis
            validez. Votre avis apparaît aussitôt dans la liste.
          </>
        ),
        search:
          'Comment laisser un avis sur une publication étoiles note 1 à 5 commentaire valider',
      },
      {
        key: 'avis-compte',
        question: 'Faut-il un compte pour donner un avis ?',
        answer: (
          <>
            Non. Un avis se laisse sans créer de compte : le portail ne demande ni adresse e-mail ni
            mot de passe. Le nom est facultatif — si vous le laissez vide, l’avis s’affiche sans nom.
          </>
        ),
        search:
          'Faut-il un compte pour donner un avis anonyme sans inscription e-mail mot de passe nom facultatif anonyme',
      },
      {
        key: 'modifier-avis',
        question: 'Comment modifier ou retirer mon avis ?',
        answer: (
          <>
            Après l’envoi, le bouton devient « Gérer mon avis » : vous pouvez le corriger ou le
            retirer. Le navigateur retient l’avis que vous avez écrit sur cet appareil — sur un autre
            appareil ou après un nettoyage des données, il ne pourra plus le reconnaître.
          </>
        ),
        search:
          'Comment modifier ou retirer mon avis gérer mon avis corriger supprimer navigateur appareil données',
      },
      {
        key: 'avis-moderation',
        question: 'Pourquoi mon avis n’apparaît-il pas tout de suite ?',
        answer: (
          <>
            Un avis peut être masqué par la modération si son contenu ne convient pas. Un avis
            retenu s’affiche immédiatement ; dans le cas contraire, l’équipe du DSAE le relit.
          </>
        ),
        search:
          'Pourquoi mon avis n’apparaît-il pas tout de suite modération masqué relu équipe',
      },
      {
        key: 'avis-multiple',
        question: 'Puis-je laisser plusieurs avis sur une même publication ?',
        answer: (
          <>
            Un avis par publication et par appareil : le portail vous propose de modifier l’avis
            existant plutôt que d’en ajouter un second. Cela garde la note moyenne fidèle.
          </>
        ),
        search:
          'Puis-je laisser plusieurs avis sur une même publication un seul avis par appareil note moyenne',
      },
    ],
  },
  {
    key: 'partenariat',
    label: 'Partenariat, contact et newsletter',
    items: [
      {
        key: 'proposer-partenariat',
        question: 'Comment proposer un partenariat ?',
        answer: (
          <>
            La page <Link href="/s-engager">S’engager</Link> ouvre un formulaire dédié : décrivez
            votre institution et l’objet de la collaboration. Votre message est transmis directement
            à l’équipe du DSAE.
          </>
        ),
        search:
          'Comment proposer un partenariat s’engager collaboration institution coopération message',
      },
      {
        key: 'partenaires',
        question: 'Qui sont les partenaires du DSAE ?',
        answer: (
          <>
            Les institutions et structures qui travaillent avec le domaine sont présentées dans
            l’onglet « Nos partenaires » de la page{' '}
            <Link href="/s-engager?volet=partenaires">S’engager</Link>.
          </>
        ),
        search:
          'Qui sont les partenaires du DSAE institutions structures nos partenaires s’engager',
      },
      {
        key: 'contacter',
        question: 'Comment vous contacter ?',
        answer: (
          <>
            Utilisez le <Link href="/contact">formulaire de contact</Link> : votre message arrive
            directement à l’équipe. Pour un signalement technique, choisissez l’objet prérempli
            « Signaler un problème ».
          </>
        ),
        search:
          'Comment vous contacter formulaire de contact message équipe signalement adresse e-mail téléphone',
      },
      {
        key: 'newsletter',
        question: 'Comment demander l’inscription à la newsletter ?',
        answer: (
          <>
            Envoyez une demande depuis le{' '}
            <Link href="/contact?subject=newsletter">formulaire de contact</Link>, avec l’objet
            « Inscription à la newsletter ». L’équipe confirmera la prise en compte de votre
            demande.
          </>
        ),
        search:
          'Comment demander l’inscription à la newsletter formulaire objet inscription demande e-mail',
      },
      {
        key: 'coordonnees-universite',
        question: 'Où trouver les coordonnées de l’université ?',
        answer: (
          <>
            La page <Link href="/universite">Université</Link> présente l’UNIKAL et mène à son site
            officiel. La page <Link href="/contact">Contact</Link> rassemble les moyens de joindre
            l’équipe du domaine.
          </>
        ),
        search:
          'Où trouver les coordonnées de l’université UNIKAL site officiel contact adresse Kalemie',
      },
    ],
  },
  {
    key: 'donnees',
    label: 'Données, accessibilité et problèmes',
    items: [
      {
        key: 'vie-privee',
        question: 'Le portail respecte-t-il ma vie privée ?',
        answer: (
          <>
            Le portail mesure l’audience de façon anonyme et seulement si vous l’acceptez : pages
            consultées, durée de lecture, provenance, pays et type d’appareil. Aucune donnée
            personnelle n’est revendue, et l’adresse IP n’est pas conservée. Vous pouvez refuser :
            le portail reste entièrement accessible.
          </>
        ),
        search:
          'Le portail respecte-t-il ma vie privée données personnelles mesure d’audience anonyme adresse IP cookies consentement RGPD refuser',
      },
      {
        key: 'gerer-cookies',
        question: 'Comment changer mon choix de cookies ?',
        answer: (
          <>
            Le lien « Gérer les cookies », au bas de chaque page, rouvre le bandeau. Vous pouvez y
            accepter ou refuser la mesure d’audience à tout moment — le choix n’est jamais définitif.
          </>
        ),
        search:
          'Comment changer mon choix de cookies gérer les cookies bandeau accepter refuser mesure d’audience',
      },
      {
        key: 'signaler',
        question: 'Comment signaler une erreur ou un problème ?',
        answer: (
          <>
            Ouvrez le <Link href="/contact?subject=report">formulaire de signalement</Link> et
            décrivez la page concernée et ce qui ne fonctionne pas. Plus votre description est
            précise, plus vite le problème est compris.
          </>
        ),
        search:
          'Comment signaler une erreur ou un problème formulaire signalement page concernée description',
      },
      {
        key: 'page-ne-s-affiche-pas',
        question: 'Une page ne s’affiche pas, que faire ?',
        answer: (
          <>
            Rechargez d’abord la page, puis essayez un autre navigateur ou videz le cache. Si le
            problème persiste, signalez-le en précisant l’adresse de la page et le navigateur
            utilisé, via le <Link href="/contact?subject=report">formulaire de signalement</Link>.
          </>
        ),
        search:
          'Une page ne s’affiche pas que faire recharger autre navigateur vider le cache signalement adresse navigateur',
      },
      {
        key: 'document-ne-s-ouvre-pas',
        question: 'Un document ne s’ouvre pas, que faire ?',
        answer: (
          <>
            Essayez le bouton « Télécharger » de la fiche, puis ouvrez le fichier depuis votre
            appareil. Si le document manque toujours, signalez-le en indiquant son titre, via le{' '}
            <Link href="/contact?subject=report">formulaire de signalement</Link>.
          </>
        ),
        search:
          'Un document ne s’ouvre pas que faire télécharger fichier PDF lecteur signalement titre',
      },
    ],
  },
];

export type GuideItem = {
  key: string;
  title: string;
  intro: string;
  steps: string[];
  tip?: string;
  search: string;
};

export type GuideGroup = { key: string; label: string; items: GuideItem[] };

export const GUIDES_GROUPS: GuideGroup[] = [
  {
    key: 'decouvrir',
    label: 'Découvrir le portail',
    items: [
      {
        key: 'se-reperer',
        title: 'Se repérer dans le portail',
        intro:
          'Le portail se lit comme un site classique : une barre en haut, une page au centre, un pied de page en bas.',
        steps: [
          'La barre du haut porte le logo et les rubriques : Accueil, Actualités, À propos, Université, Équipe, Recherche, Publications, S’engager, Alumni, Aide et support.',
          'La rubrique où vous vous trouvez est marquée d’un trait sous son nom.',
          'Le pied de page reprend la même suite et déplie les sous-pages d’une rubrique (types d’actualité, catégories d’équipe, domaines…).',
          'Le bandeau de cookies apparaît au premier passage : vous pouvez accepter ou refuser la mesure d’audience.',
        ],
        tip: 'La même suite d’entrées se retrouve en haut et en bas : le pied de page sert de sommaire complet.',
        search:
          'Se repérer dans le portail barre du haut logo rubriques accueil pied de page sommaire sous-pages cookies',
      },
      {
        key: 'menu-telephone',
        title: 'Utiliser le menu sur téléphone',
        intro: 'Sur petit écran, les rubriques se rangent dans un menu latéral.',
        steps: [
          'Touchez le bouton en haut à droite pour ouvrir le menu.',
          'Toutes les rubriques y sont listées, l’une sous l’autre.',
          'Touchez une rubrique : la page s’ouvre et le menu se referme.',
          'Pour refermer sans changer de page, touchez la croix ou la zone sombre à côté du menu.',
        ],
        search:
          'Utiliser le menu sur téléphone mobile bouton menu latéral tiroir rubriques croix refermer',
      },
      {
        key: 'recherche-globale',
        title: 'Rechercher sur tout le portail',
        intro:
          'La loupe de la barre du haut cherche dans toutes les rubriques à la fois — c’est le moyen le plus rapide de trouver une information précise.',
        steps: [
          'Cliquez sur la loupe, à côté de « S’engager » (ou appuyez sur Ctrl + K, ⌘ + K sur Mac).',
          'Tapez un ou deux mots : un titre, un nom, un thème.',
          'Les fiches qui correspondent apparaissent, chacune avec sa rubrique et un aperçu.',
          'Cliquez sur un résultat pour ouvrir la fiche ; appuyez sur Échap pour refermer la recherche.',
        ],
        tip: 'Plusieurs mots se cumulent : « sol fertile » ne montre que les fiches qui portent les deux.',
        search:
          'Rechercher sur tout le portail loupe Ctrl K champ résultat rubrique aperçu fiche Échap global',
      },
      {
        key: 'trouver-dans-rubrique',
        title: 'Trouver une information dans une rubrique',
        intro:
          'Chaque rubrique présente son contenu en liste, avec une recherche, des onglets et parfois des filtres.',
        steps: [
          'Ouvrez la rubrique voulue depuis le menu.',
          'Repérez la barre de recherche, juste au-dessus de la liste.',
          'Choisissez un onglet pour vous limiter à une catégorie ou à un domaine.',
          'Ouvrez les filtres (icône d’entonnoir) pour affiner encore, par date ou par niveau.',
        ],
        search:
          'Trouver une information dans une rubrique liste recherche onglets filtres entonnoir catégorie domaine',
      },
    ],
  },
  {
    key: 'explorer',
    label: 'Explorer les contenus',
    items: [
      {
        key: 'chercher-catalogue',
        title: 'Chercher dans un catalogue',
        intro: 'La recherche d’une rubrique resserre la liste sans recharger la page.',
        steps: [
          'Cliquez dans la barre de recherche de la rubrique (Équipe, Publications, Actualités ou Alumni).',
          'Tapez un mot : un nom, une fonction, un titre, un mot-clé.',
          'La liste ne garde que les entrées qui contiennent ce mot, à mesure que vous tapez.',
          'Effacez le champ pour retrouver la liste entière.',
        ],
        tip: 'La recherche d’une rubrique ne couvre que cette rubrique ; la loupe du haut couvre tout le portail.',
        search:
          'Chercher dans un catalogue barre de recherche rubrique équipe publications actualités alumni taper mot liste',
      },
      {
        key: 'naviguer-onglets',
        title: 'Naviguer par onglets',
        intro: 'Les onglets rangent une liste par catégorie, par domaine ou par type.',
        steps: [
          'Repérez la rangée d’onglets sous la barre de recherche.',
          'Cliquez sur un onglet : la liste ne garde que cette partie.',
          'Cliquez sur « Tout » (ou « À la une » pour les actualités) pour revoir l’ensemble.',
          'Si la rangée dépasse de l’écran, faites-la glisser horizontalement.',
        ],
        search:
          'Naviguer par onglets catégorie domaine type tout voir à la une rangée glisser horizontalement',
      },
      {
        key: 'filtrer-liste',
        title: 'Filtrer une liste',
        intro: 'Les filtres affinent une liste selon un critère précis.',
        steps: [
          'Cliquez sur l’icône d’entonnoir, à côté de la barre de recherche.',
          'Choisissez un critère : une date de publication, un niveau d’études.',
          'Le nombre de filtres actifs s’affiche sur l’icône.',
          'Cliquez sur « Réinitialiser » pour tout remettre à zéro.',
        ],
        search:
          'Filtrer une liste entonnoir date de publication niveau d’études réinitialiser critère',
      },
      {
        key: 'parcourir-actualites',
        title: 'Parcourir les actualités',
        intro: 'Le fil d’actualité se lit d’un seul regard, puis se resserre par type.',
        steps: [
          'Ouvrez la page Actualités.',
          '« À la une » montre toutes les actualités publiées, les plus récentes d’abord.',
          'Choisissez un type (DSAE, Presse, Communiqué…) pour resserrer le fil.',
          'Cliquez sur une carte pour ouvrir l’actualité complète.',
        ],
        tip: 'Une actualité paraît à la fois sous « À la une » et sous son type.',
        search:
          'Parcourir les actualités fil à la une type DSAE Presse Communiqué carte récentes',
      },
    ],
  },
  {
    key: 'lire',
    label: 'Lire, télécharger et réagir',
    items: [
      {
        key: 'lire-publication',
        title: 'Ouvrir et lire une publication',
        intro: 'La fiche d’une publication réunit tout : le texte, les auteurs et le document.',
        steps: [
          'Depuis la page Publications, cliquez sur la couverture ou le titre d’un document.',
          'La fiche s’ouvre : titre, auteurs, résumé, domaine et niveau.',
          'Le texte rédigé se déroule sous la couverture.',
          'Le document joint se lit dans la page quand un lecteur est disponible.',
        ],
        search:
          'Ouvrir et lire une publication fiche couverture titre auteurs résumé domaine niveau document lecteur',
      },
      {
        key: 'telecharger-document',
        title: 'Télécharger un document',
        intro: 'Un document joint se télécharge depuis sa fiche.',
        steps: [
          'Ouvrez la fiche de la publication.',
          'Cliquez sur le bouton « Télécharger ».',
          'Le fichier arrive dans le dossier de téléchargements de votre appareil.',
          'Si rien ne se passe, essayez le bouton « Lire », puis téléchargez depuis le lecteur.',
        ],
        search:
          'Télécharger un document bouton télécharger lire lecteur fichier PDF téléchargements',
      },
      {
        key: 'consulter-equipe',
        title: 'Consulter l’équipe, les alumni et la recherche',
        intro: 'Trois rubriques présentent les personnes et les travaux du domaine.',
        steps: [
          'Équipe : les responsables et acteurs scientifiques, rangés par catégorie.',
          'Alumni : les diplômés, rangés par domaine, avec un filtre par niveau.',
          'Recherche : les axes scientifiques et les projets qui s’y rattachent.',
          'Dans chaque liste, cliquez sur une carte pour ouvrir la fiche complète.',
        ],
        search:
          'Consulter l’équipe les alumni et la recherche responsables acteurs scientifiques diplômés axes projets',
      },
      {
        key: 'laisser-avis',
        title: 'Laisser un avis sur une publication',
        intro: 'Un avis se donne sans compte, en quelques secondes.',
        steps: [
          'Ouvrez la fiche d’une publication.',
          'Cliquez sur « Laisser un avis ».',
          'Choisissez une note de 1 à 5 étoiles, puis un nom et un commentaire si vous le souhaitez.',
          'Validez : votre avis apparaît dans la liste, et le bouton devient « Gérer mon avis ».',
        ],
        tip: 'Pour corriger ou retirer votre avis plus tard, rouvrez la fiche sur le même appareil.',
        search:
          'Laisser un avis sur une publication note étoiles commentaire gérer mon avis corriger retirer',
      },
    ],
  },
  {
    key: 'compte-aide',
    label: 'Préférences, contact et aide',
    items: [
      {
        key: 'cookies',
        title: 'Choisir ou modifier ses préférences de cookies',
        intro: 'La mesure d’audience est optionnelle et réversible à tout moment.',
        steps: [
          'Au premier passage, le bandeau de cookies apparaît en bas de page.',
          'Choisissez « Accepter » ou « Refuser » : le portail reste entièrement accessible.',
          'Pour changer d’avis, ouvrez « Gérer les cookies » au bas de chaque page.',
          'Ajustez votre choix, puis validez : il est enregistré aussitôt.',
        ],
        search:
          'Choisir ou modifier ses préférences de cookies bandeau accepter refuser gérer les cookies mesure d’audience',
      },
      {
        key: 'newsletter',
        title: 'Demander la newsletter',
        intro: 'L’inscription à la newsletter se fait par le formulaire de contact.',
        steps: [
          'Ouvrez la page Contact.',
          'Choisissez l’objet « Inscription à la newsletter ».',
          'Indiquez l’adresse à laquelle vous souhaitez recevoir les informations.',
          'Envoyez : l’équipe confirmera la prise en compte.',
        ],
        search:
          'Demander la newsletter inscription formulaire de contact objet adresse e-mail',
      },
      {
        key: 'proposer-contenu',
        title: 'Proposer une publication, une actualité ou un partenariat',
        intro: 'Toute contribution passe par l’équipe, qui décide de sa publication.',
        steps: [
          'Pour un partenariat : page S’engager, formulaire « Proposer le partenariat ».',
          'Pour une publication ou une actualité : page Contact, en décrivant votre proposition.',
          'Précisez le sujet, les auteurs et, si possible, le document à joindre.',
          'L’équipe examine la proposition ; la publication n’est jamais automatique.',
        ],
        search:
          'Proposer une publication une actualité ou un partenariat contribution équipe sujet auteurs document',
      },
      {
        key: 'obtenir-aide',
        title: 'Signaler un problème ou demander de l’aide',
        intro: 'Un formulaire unique sert au contact comme au signalement technique.',
        steps: [
          'Ouvrez le formulaire de signalement (objet prérempli « Signaler un problème »).',
          'Indiquez l’adresse de la page concernée.',
          'Décrivez ce qui ne fonctionne pas et, si utile, le navigateur utilisé.',
          'Envoyez : l’équipe du DSAE en prend connaissance.',
        ],
        tip: 'Un message précis — page, action, résultat attendu — se traite bien plus vite.',
        search:
          'Signaler un problème ou demander de l’aide formulaire signalement page navigateur décrire contacter',
      },
    ],
  },
];

/** Le corps d'une fiche de guide : l'introduction, les étapes, puis l'astuce. */
export function GuideBody({ guide }: { guide: GuideItem }) {
  return (
    <>
      <p className="guide-intro">{guide.intro}</p>
      <ol className="guide-steps">
        {guide.steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      {guide.tip && (
        <p className="guide-tip">
          <span aria-hidden="true">💡</span> {guide.tip}
        </p>
      )}
    </>
  );
}

