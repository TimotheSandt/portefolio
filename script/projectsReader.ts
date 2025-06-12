export interface ProjectProps {
  title: string;
  image: {
    src: string;
    alt: string;
    legend: string;
  };
  page: string;
  summary: string;
  description: string[];
}


export function getProjects(): ProjectProps[] {
  const dirImages = "/trace/images/";

  const projects: ProjectProps[] = [
    {
      title: "Puissance X - Minimax",

      image: {
        src: "Minimax.png",
        alt: "Algorithme Minimax",
        legend:
          "Figure %s: Implémentation d'une intelligence artificielle pour le jeu de Puissance X, basée sur l'algorithme Minimax optimisé par l'élagage Alpha-Bêta.",
      },
      page: "/minimax",

      summary: "Création d'un jeu de puissance X en implémentant l'algorithme Minimax.",
      description: [
        "La Figure %s présente une vue de mon environnement de développement IDEA pendant la conception d'un jeu de Puissance X avec le langage Java. L'interface est en mode console, visible en bas à gauche de l'écran. Le cœur de ce projet a été de donner vie à une intelligence artificielle capable de rivaliser et de battre un humain. Pour cela, j'ai choisi d'implémenter l'algorithme Minimax, une approche fondamentale en intelligence artificielle des jeux. Ce principe permet à l'IA d'analyser les différentes séquences de coups possibles jusqu'à une certaine profondeur, afin de choisir la meilleure option pour atteindre la victoire, en anticipant et simulant les réponses de l'adversaire. L'objectif est de minimiser la pire perte tout en maximisant le meilleur gain potentiel.",
        "Pour que l'IA puisse anticiper, j'ai conçu une méthode permettant à l'algorithme d'imaginer les coups successifs, qu'ils soient les siens ou ceux de l'adversaire. J'ai utilisé la récursivité pour parcourir les différentes séquences de jeu, construisant ainsi une arborescence des possibilités. Chaque palier de cette exploration représente un tour de jeu. Minimax évalue chaque 'feuille' de cette arborescence – c'est-à-dire chaque état du plateau au dernier palier de l'exploration – puis transmet son score aux paliers précédents, permettant ainsi de remonter le meilleur chemin jusqu'au coup actuel.",
        "Afin d'optimiser les performances de l'IA et d'éviter qu'elle ne prenne pas un temps infini à réfléchir, j'ai intégré une optimisation cruciale : l'élagage Alpha-Bêta. Cette technique m'a permis de réduire considérablement le nombre de coups à évaluer dans l'arbre des possibilités du jeu, sans pour autant compromettre la qualité de la décision finale. En implémentant cette optimisation, j'ai pu améliorer significativement la performance de l'IA en lui permettant de ne pas calculer des branches entière de l'arbre des possibilités qui sont, par la nature de l'algorithme Minimax, nécessairement moins bien et fourniraient un moins bon score que ceux déjà évalués.",
        "Pour que l'IA puisse 'juger' de la qualité du plateau à un instant T, j'ai développé une fonction d'évaluation heuristique. Cette fonction attribue un score à chaque configuration du Puissance X en tenant compte d'éléments stratégiques comme les lignes de deux, trois ou quatre jetons alignés. C'est un point délicat mais essentiel, car une bonne fonction d'évaluation est essentielle pour garantir que l'IA joue au mieux possible en évaluant correctement une position du jeu.",
        "La console en bas de l'écran (visible à gauche) montre l'état du plateau dans la partie en cours ainsi que l'évaluation des coups possibles pour chaque colonne. Afficher ces informations, m'a été indispensable pour vérifier que l'IA évaluait correctement les état du jeux et que l'algorithme Minimax fonctionnait comme il fallait. Cela m'a permis de m'assister pour le débogage de l'algorithme afin de corriger les erreurs en réécrivant la fonction d'évaluation ou l'algorithme Minimax à plusieurs reprises jusqu'a ce qu'elle soit parfaitement fonctionnelle. C'est ainsi qu'après plusieurs corrections et réécritures de code, je me suis finalement tourné vers la variante negamax de l'algorithme Minimax.",
        " Bien que l'IA soit déjà fonctionnelle et offre une bonne expérience de jeu, je vois des pistes pour aller plus loin, notamment en affinant encore ma fonction d'évaluation ou en explorant d'autres techniques d'optimisation pour pousser la profondeur de recherche. Je pourrais notamment enregistrer l'arborescence des possibilités pour l'a réutiliser aux prochains coups afin de ne pas tout recalculer et de reprendre la ou l'IA s'était arêté au coup précédent",
      ],
    },
    {
      image: {
        src: "ChronosyncMCD.png",
        alt: "Chronosync Looping MCD",
        legend: "Figure %s: MCD sur Looping pour l'application Chronosync",
      },
      page: "/chronosync",

      title: "Chronosync MCD",
      summary:
        "Le MCD de l'application Chronosync qui permet de synchroniser le temps d'écran entre plusieurs apareils.",
      description: [
        "La figure %s est une capture d'écran de l'interface de Looping, une application qui permet la création de Modèles Conceptuel de Données ou MCD. J'ai donc utilisé cette outils pour designer le modèle de la base de données de l'application Chronosync qui permet de synchroniser le temps d'écran entre plusieurs appareils.",
        "Pour créer un MCD, il faut d'abord connaitre les données que l'on souhaite enregistrer dans des entité (en jaune) puis les lier entre elles avec des associations (en bleu). Il est aussi important de définir les cardinalités afin de préciser combien d'occurence d'une entité peuvent être liées à combien d'autres occurences d'autres entités. Cela permettent donc d'assurer la cohérence des relations entre les entités. Ici on peut voir que j'ai définit qu'un appareils (device) ne peut avoir qu'un seul OS et qu'un OS peut être lié à plusieurs appareils.",
        "Il est aussi possible d'avoir des associations réflexives, c'est à dire qu'elle lie une entité avec elle même. En effet, on peut voir que j'ai ajouté une association réflective entre les groupes d'application ce qui permet d'avoir des sous groupes d'application et que chaque sous groupes puissent aussi avoir des sous groupes.",
        "Il est important de créer un MCD de bonne qualités afin d'optimiser le plus possible le stockage des données. En effet, les bases de données peuvent enregistrer des quantité gigantesque de données, il faut donc pouvoir les enregister en évitant les doublons. Pour cela, j'ai séparer les données dans plusieurs entités quand certaine peuvent être utilisé à plusieurs reprise. Notamment pour l'utilisation et l'application utilisé, chaque utilisation est différentes mais une seule application peut être utilisé a plusieurs reprise. C'est pour ça que je n'ai pas enregistrer l'application dans utilisation mais dans une entité à part. ",
        " ",
        "Sur la droite de l'image, on peut aussi apercevoir le code SQL permettant de créer la base de données. Il est nécessaire d'utiliser le langage SQL pour créer et modifier les données car il permet de faire des requêtes sur la base de données. J'ai donc utiliser le script fourni et l'ai executé sur une base de données avec MariaDB. ",
      ],
    },
  ];

  for (let i = 0; i < projects.length; i++) {
    projects[i].image.src = dirImages + projects[i].image.src;
  }


  return projects;
}
