import ClientRecipe from './ClientRecipe';

export type Step = { text: string; timerSec?: number };
export type Recipe = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  servings: number;
  prepMinutes: number;
  cookMinutes: number;
  totalMinutes: number;
  tags: string[];
  ingredients: string[];
  steps: Step[];
  notes?: string;
  isOwned: boolean;
  sourceUrl?: string | null;
};

const recipe: Recipe = {
  id: 'demo',
  title: 'Spaghetti Carbonara',
  description:
    'Silky, glossy carbonara with crispy pancetta and plenty of Parmesan. A quick weeknight classic that feels special.',
  // Dynamic Unsplash source (always resolves)
  imageUrl: 'https://images.unsplash.com/photo-1633337474564-1d9478ca4e2e?q=80&w=1471&auto=format&fit=crop',
  servings: 2,
  prepMinutes: 10,
  cookMinutes: 15,
  totalMinutes: 25,
  tags: ['Pasta', 'Quick', 'Italian', 'Comfort'],
  ingredients: [
    '200g spaghetti',
    '100g pancetta (or guanciale), diced',
    '2 large eggs',
    '50g Parmesan (finely grated)',
    'Freshly ground black pepper',
    'Salt',
  ],
  steps: [
    { text: 'Boil spaghetti in well-salted water until al dente.', timerSec: 600 },
    { text: 'In a pan, fry pancetta until crisp and golden.', timerSec: 300 },
    { text: 'Beat eggs with Parmesan; season generously with pepper.' },
    { text: 'Drain pasta (reserve water). Off heat, toss with pancetta, then stir in egg mixture until glossy.' },
  ],
  notes:
    'Use guanciale for a traditional touch. Work fast off heat to avoid scrambling the eggs. A splash of pasta water helps emulsify.',
  isOwned: true,
  sourceUrl: 'https://example.com/carbonara',
};

export default function Page() {
  return <ClientRecipe recipe={recipe} />;
}
