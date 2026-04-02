export default defineEventHandler(() => {
  return [
    {
      id: 1, name: 'Starter', price: '83.25', oldPrice: '$999.00',
      usersText: 'Primary user + 0 free team members',
      exports: '10 000', traces: '500', rating: 4.8, category: 'Plans',
      description: 'Essential features for beginners', image: 'https://pwa-download.com/logos/nuxt.png'
    },
    {
      id: 2, name: 'Team', price: '207.50', oldPrice: '$2,490.00',
      usersText: 'Primary user + 2 free team members',
      exports: '50 000', traces: '1 000', rating: 4.5, category: 'Plans',
      description: 'Collaborative tools for small teams', image: 'https://pwa-download.com/logos/nuxt.png'
    },
    {
      id: 3, name: 'Business', price: '457.50', oldPrice: '$5,490.00',
      usersText: 'Primary user + 6 free team members',
      exports: '100 000', traces: '2 000', rating: 4.9, category: 'Plans',
      description: 'Advanced features for scaling', image: 'https://pwa-download.com/logos/nuxt.png'
    },
    // Додаткові дані для таблиці
    { id: 4, name: 'Pro Tool', price: '45.00', oldPrice: '$60.00', usersText: '5 users', exports: '1 000', traces: '100', rating: 4.1, category: 'Gadgets', description: 'Professional equipment', image: 'https://pwa-download.com/logos/nuxt.png' },
    { id: 5, name: 'Mini Pack', price: '9.99', oldPrice: '$15.00', usersText: '1 user', exports: '50', traces: '0', rating: 3.5, category: 'Accessories', description: 'Lightweight pack', image: 'https://pwa-download.com/logos/nuxt.png' }
  ]
})
