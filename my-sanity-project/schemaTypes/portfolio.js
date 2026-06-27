export default {
  name: 'portfolio',
  title: 'Portfolio Gallery',
  type: 'document',
  fields: [
    { name: 'title', title: 'Design Title', type: 'string' },
    { name: 'image', title: 'Upload Image', type: 'image', options: { hotspot: true } },
    { 
      name: 'category', 
      title: 'Category', 
      type: 'string',
      options: {
        list: [
          { title: 'Press on Nails', value: 'press-on-nails' },
          { title: 'Nail Extensions', value: 'nail-extensions' },
          { title: 'Toe Extensions', value: 'toe-extensions' },
          { title: 'Navratri Nails', value: 'navratri-nails' }
        ]
      }
    }
  ]
}