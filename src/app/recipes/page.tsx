import ClientRecipe from './ClientRecipe';

const recipe = {
  id: 'demo',
  title: 'Spaghetti Carbonara',
  description:
    'Silky, glossy carbonara with crispy pancetta and plenty of Parmesan. A quick weeknight classic that feels special.',
  imageUrl:
    'https://images.unsplash.com/photo-1588013273468-315fd88ea34c?q=80&w=1738&auto=format&fit=crop',
  servings: 2,
  prepMinutes: 10,
  cookMinutes: 15,
  totalMinutes: 25,
  tags: ['🍝 Pasta', '⭐ Quick', '🇮🇹 Italian', '🥓 Cozy'],
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
    {
      text:
        'Drain pasta (reserve some water). Off heat, toss with pancetta, then stir in egg mixture until glossy.',
    },
  ],
  notes:
    'Use guanciale for a traditional touch. Work fast off heat to avoid scrambling the eggs. A splash of pasta water helps emulsify.',
  isOwned: true,
  sourceUrl: 'https://example.com/carbonara',
};

export default function Page() {
  return <ClientRecipe recipe={recipe} />;
}
