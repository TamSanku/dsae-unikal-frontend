export type TeamMember = {
  id: string;
  name: string;
  role: string;
  department: string;
  specialty: string;
  bio: string;
  category: 'Doyen' | 'Vice-doyen' | 'Personnel académique' | 'Personnel scientifique' | 'Enseignant' | 'Chercheur';
  image: string;
  publications: string[];
};

export const teamMembers: TeamMember[] = [
  {
    id: 'doyen',
    name: 'Prof. Jean-Michel Kasongo',
    role: 'Doyen de la faculté',
    department: 'Faculté de Sciences',
    specialty: 'Sciences de l’environnement',
    category: 'Doyen',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    publications: ['Étude sur la gestion durable des ressources naturelles', 'Impact climatique et systèmes agroforestiers'],
  },
  {
    id: 'vice-doyen-recherche',
    name: 'Dr. Marie Luvumbu',
    role: 'Vice-doyenne chargée de la recherche',
    department: 'Département de Biochimie',
    specialty: 'Biotechnologie appliquée',
    category: 'Vice-doyen',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
    publications: ['Intégration de la biotechnologie dans l’agriculture durable', 'Analyse de la valorisation des cultures locales'],
  },
  {
    id: 'responsable-scientifique',
    name: 'Dr. Samuel Bakala',
    role: 'Responsable scientifique',
    department: 'Unité de recherche en sciences exactes',
    specialty: 'Mathématiques appliquées',
    category: 'Personnel scientifique',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    publications: ['Modélisation des systèmes complexes', 'Optimisation de la gestion des ressources'],
  },
  {
    id: 'enseignant-1',
    name: 'Dr. Grace Mumbanza',
    role: 'Enseignante-chercheuse',
    department: 'Département de Physique',
    specialty: 'Énergie et matériaux',
    category: 'Enseignant',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80',
    publications: ['Évaluation des matériaux locaux pour l’énergie durable', 'Études de performance des capteurs environnementaux'],
  },
  {
    id: 'chercheur-1',
    name: 'Dr. Paul Mulongo',
    role: 'Chercheur principal',
    department: 'Laboratoire de recherche en santé publique',
    specialty: 'Santé et environnement',
    category: 'Chercheur',
    image: 'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=800&q=80',
    publications: ['Épidémiologie environnementale', 'Impacts du développement urbain sur la santé'],
  },
  {
    id: 'enseignant-2',
    name: 'Prof. Aline Ndaya',
    role: 'Professeure titulaire',
    department: 'Département de Chimie',
    specialty: 'Chimie organique et environnement',
    category: 'Personnel académique',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    publications: ['Synthèse de molécules bioactives', 'Valorisation des matières premières locales'],
  },
];

export type ResearchArea = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  description: string;
  goals: string[];
  projects: string[];
  publications: string[];
};

export const researchAreas: ResearchArea[] = [
  {
    slug: 'agriculture-durable',
    title: 'Agriculture durable et sécurité alimentaire',
    category: 'Agriculture',
    summary: 'Analyse des systèmes agricoles, amélioration des rendements et gestion des ressources.',
    description:
      'Ce domaine vise à renforcer la résilience des systèmes agricoles face au changement climatique, en combinant recherche fondamentale, innovation technologique et transfert de connaissances.',
    goals: ['Améliorer la productivité agricole', 'Développer des systèmes de culture résilients', 'Renforcer la sécurité alimentaire'],
    projects: ['Programme de semences locales améliorées', 'Étude sur la gestion durable des sols', 'Cartographie des zones à risque agricole'],
    publications: ['Contrôle nutritionnel des sols en milieu tropical', 'Résilience des cultures locales face au climat'],
  },
  {
    slug: 'energie-environnement',
    title: 'Énergie, environnement et développement durable',
    category: 'Énergie',
    summary: 'Études des solutions énergétiques durables et de leur adaptation aux contextes locaux.',
    description:
      'Ce programme s’intéresse à la production d’énergie renouvelable, à la protection de l’environnement et à la réduction des impacts socio-économiques liés à l’utilisation des ressources naturelles.',
    goals: ['Développer des solutions énergétiques durables', 'Évaluer les impacts environnementaux', 'Promouvoir l’innovation locale'],
    projects: ['Étude des ressources solaires et hydrauliques', 'Énergies renouvelables et qualité de vie', 'Modèles de gestion d’énergie dans les communautés'],
    publications: ['Performance des systèmes solaires en zone urbaine', 'Gestion durable des ressources énergétiques'],
  },
  {
    slug: 'sante-publique',
    title: 'Santé publique et environnement',
    category: 'Santé',
    summary: 'Analyse des liens entre environnement, santé humaine et développement communautaire.',
    description:
      'Ce domaine explore les déterminants environnementaux de la santé et met en relation recherche scientifique, surveillance épidémiologique et intervention de santé publique.',
    goals: ['Mieux comprendre les risques sanitaires', 'Développer des approches préventives', 'Renforcer la qualité des interventions'],
    projects: ['Étude de la pollution de l’eau et de la santé', 'Cartographie des risques environnementaux urbains', 'Suivi de la santé maternelle et infantile'],
    publications: ['Santé publique et qualité de l’eau', 'Facteurs environnementaux et mortalité évitable'],
  },
  {
    slug: 'sciences-mathematiques',
    title: 'Sciences exactes et modélisation',
    category: 'Sciences exactes',
    summary: 'Modélisation des systèmes complexes et applications scientifiques aux défis locaux.',
    description:
      'Les sciences exactes jouent un rôle central dans la compréhension des systèmes complexes et dans le développement de méthodes de modélisation appliquées.',
    goals: ['Optimiser les méthodes de calcul scientifique', 'Développer des outils de modélisation', 'Renforcer la recherche interdisciplinarité'],
    projects: ['Modélisation des dynamiques spatiales', 'Analyse statistique sur les systèmes écologiques', 'Mécanismes de prévision des phénomènes complexes'],
    publications: ['Analyse numérique des modèles environnementaux', 'Modélisation d’écosystèmes fragiles'],
  },
];

export type Publication = {
  id: string;
  title: string;
  authors: string;
  year: number;
  category: string;
  discipline: string;
  department: string;
  summary: string;
  keywords: string[];
  references: string;
  pdfUrl: string;
};

export const publications: Publication[] = [
  {
    id: 'art-01',
    title: 'Gestion durable des ressources naturelles et résilience des communautés rurales',
    authors: 'J. Kasongo, M. Luvumbu, P. Mulongo',
    year: 2024,
    category: 'Articles scientifiques',
    discipline: 'Sciences environnementales',
    department: 'Faculté de Sciences',
    summary: 'Cette étude examine les pratiques de gestion durable des ressources naturelles et leur capacité à renforcer la résilience des systèmes agricoles et pastoraux.',
    keywords: ['ressources naturelles', 'résilience', 'développement durable'],
    references: 'Kasongo, J., Luvumbu, M., Mulongo, P. (2024). Gestion durable des ressources naturelles et résilience des communautés rurales. Revue des Sciences de l’Environnement, 12(2), 55-74.',
    pdfUrl: '#',
  },
  {
    id: 'memoire-01',
    title: 'Impact des technologies agricoles sur la productivité dans la province de Tanganyika',
    authors: 'D. Kalonji',
    year: 2023,
    category: 'Mémoires',
    discipline: 'Agronomie',
    department: 'Département d’Agronomie',
    summary: 'Mémoire portant sur la diffusion des technologies agricoles et leur contribution à la productivité des exploitations familiales.',
    keywords: ['agriculture', 'productivité', 'technologie'],
    references: 'Kalonji, D. (2023). Impact des technologies agricoles sur la productivité dans la province de Tanganyika. Mémoire de fin d’études, Université de Kalemie.',
    pdfUrl: '#',
  },
  {
    id: 'these-01',
    title: 'Énergie renouvelable et développement local : dispositifs et modèles d’intégration',
    authors: 'A. Ndaya',
    year: 2022,
    category: 'Thèses',
    discipline: 'Chimie environnementale',
    department: 'Département de Chimie',
    summary: 'Thèse de doctorat consacrée aux opportunités d’intégration des énergies renouvelables dans le développement local et la réduction des émissions.',
    keywords: ['énergie renouvelable', 'développement local', 'écologie'],
    references: 'Ndaya, A. (2022). Énergie renouvelable et développement local : dispositifs et modèles d’intégration. Thèse de doctorat, Université de Kalemie.',
    pdfUrl: '#',
  },
  {
    id: 'rapport-01',
    title: 'Étude sur la qualité de l’eau potable dans les zones urbaines de Kalemie',
    authors: 'P. Mulongo, G. Mumbanza',
    year: 2024,
    category: 'Rapports de recherche',
    discipline: 'Santé publique',
    department: 'Laboratoire de santé publique',
    summary: 'Rapport de recherche sur la qualité de l’eau, les risques sanitaires et les dispositifs de protection communautaire.',
    keywords: ['eau', 'santé publique', 'qualité'],
    references: 'Mulongo, P., Mumbanza, G. (2024). Étude sur la qualité de l’eau potable dans les zones urbaines de Kalemie. Rapport de recherche, Université de Kalemie.',
    pdfUrl: '#',
  },
];

export type NewsItem = {
  slug: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  content: string;
  image: string;
};

export const newsItems: NewsItem[] = [
  {
    slug: 'seminaire-sciences-environnement',
    title: 'Séminaire sur les sciences de l’environnement et l’adaptation climatique',
    category: 'Séminaire',
    date: '15 novembre 2025',
    excerpt: 'Rencontre scientifique autour des enjeux climatiques et de l’adaptation des systèmes territoriaux.',
    content: 'Ce séminaire a réuni chercheurs, étudiants et acteurs territoriaux pour réfléchir aux mécanismes d’adaptation climatique et d’usage durable des ressources naturelles. Des communications scientifiques ont porté sur les nouveaux modèles d’adaptation locale, la gestion des sols et les systèmes alimentaires résilients.',
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'conference-recherche-medicale',
    title: 'Conférence internationale sur la recherche médicale et environnementale',
    category: 'Conférence',
    date: '28 octobre 2025',
    excerpt: 'Une plateforme d’échange entre scientifiques, praticiens et décideurs sur les questions de santé publique.',
    content: 'La conférence a permis d’analyser les récents résultats de recherche en santé environnementale, les meilleures pratiques de prévention et les méthodes de surveillance des risques sanitaires dans les contextes urbains et ruraux.',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'appel-a-contribution-recherche',
    title: 'Appel à contributions pour la prochaine édition scientifique',
    category: 'Appel à contributions',
    date: '02 décembre 2025',
    excerpt: 'Les chercheurs et enseignants sont invités à soumettre leurs travaux autour des thématiques universitaires.',
    content: 'L’université lance un appel à contributions pour son prochain colloque scientifique, avec des thématiques centrées sur l’innovation, la recherche appliquée, les sciences de l’environnement et la transformation sociale par la connaissance.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
  },
];
