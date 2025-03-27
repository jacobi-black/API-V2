# Guide de contribution

Ce document décrit les processus et conventions pour contribuer au projet CyberArk API Explorer.

## Table des matières

- [Code de conduite](#code-de-conduite)
- [Processus de contribution](#processus-de-contribution)
- [Conventions de code](#conventions-de-code)
- [Structure du projet](#structure-du-projet)
- [Tests](#tests)
- [Soumission de Pull Requests](#soumission-de-pull-requests)

## Code de conduite

Ce projet adhère à un code de conduite qui promeut un environnement ouvert et accueillant. En participant, vous vous engagez à respecter ce code. Veuillez signaler tout comportement inacceptable.

## Processus de contribution

1. **Fork du dépôt** sur GitHub
2. **Clonez** votre fork localement
3. **Créez une branche** pour votre contribution
4. **Effectuez vos modifications** en suivant les conventions de code
5. **Testez** vos modifications
6. **Commit** vos changements avec des messages clairs
7. **Push** vos modifications vers votre fork
8. **Soumettez une Pull Request** vers la branche principale

## Conventions de code

### Nomenclature

- **Fichiers source**: `kebab-case.ts`
- **Composants React**: `PascalCase.tsx`
- **Tests**: `[filename].spec.ts`
- **Stores Zustand**: `kebab-case.store.ts`
- **Schémas Zod**: `kebab-case.schema.ts`
- **Actions serveur**: `kebab-case.action.ts`

### Structure des composants React

```tsx
// Composants avec 1-2 props
export function MyComponent(props: { prop1: string; prop2: number }) {
  return <div>{props.prop1}</div>;
}

// Composants avec 3+ props
type MyComponentProps = { 
  prop1: string; 
  prop2: number;
  prop3: number;
}

export function MyComponent(props: MyComponentProps) {
  return <div>{props.prop1}</div>;
}
```

### Server vs Client Components

- Les Server Components doivent être async
- Les Client Components doivent avoir `'use client'` en haut du fichier
- Ne pas utiliser de hooks dans les Server Components

### Styling

- Utiliser Tailwind CSS pour le styling
- Préférer `flex gap-n` avec `flex-col` à `space-y-n`
- Utiliser `bg-white/50` au lieu de `bg-white bg-opacity-50`

## Structure du projet

Veuillez respecter la structure de dossiers suivante:

```
API_V2/
├── app/                      # Next.js App Router
├── components/               # Composants React
├── lib/                      # Bibliothèques et utilitaires
├── hooks/                    # Hooks React personnalisés
├── types/                    # Définitions de types TypeScript
├── store/                    # Stores Zustand
├── schemas/                  # Schémas Zod
├── actions/                  # Actions serveur
├── tests/                    # Tests
├── public/                   # Ressources statiques
└── docs/                     # Documentation
```

## Tests

Chaque contribution doit être accompagnée de tests appropriés:

- **Tests unitaires** pour les fonctions utilitaires et composants isolés
- **Tests d'intégration** pour les interactions entre composants
- **Tests E2E** pour les parcours utilisateur

Assurez-vous que tous les tests passent avant de soumettre une PR:

```bash
pnpm test
```

## Soumission de Pull Requests

1. Assurez-vous que votre PR est ciblée sur la bonne branche
2. Incluez une description claire de ce que fait votre PR
3. Référencez les issues concernées avec `#issue-number`
4. Assurez-vous que tous les tests passent
5. Obtenez une revue de code d'au moins un autre contributeur

Merci de contribuer à CyberArk API Explorer!
