// Recipe data model
export interface Recipe {
  id: string;
  title: string;
  description: string;
  isPremium: boolean;
}

// Sample recipe data
export const recipes: Recipe[] = [
  {
    id: '1',
    title: 'Pancakes',
    description: 'Fluffy pancakes with maple syrup and fresh berries. Perfect for a weekend breakfast!',
    isPremium: false,
  },
  {
    id: '2',
    title: 'Omelette',
    description: 'Classic french omelette with herbs, cheese, and your favorite vegetables.',
    isPremium: false,
  },
  {
    id: '3',
    title: 'Chocolate Cake',
    description:
      'Rich, moist chocolate cake with silky chocolate ganache frosting. A decadent dessert for special occasions.',
    isPremium: true,
  },
  {
    id: '4',
    title: 'Caesar Salad',
    description: 'Fresh romaine lettuce with homemade caesar dressing, parmesan cheese, and crispy croutons.',
    isPremium: true,
  },
];

