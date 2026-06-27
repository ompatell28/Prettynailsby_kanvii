export default {
  name: 'portfolio',
  title: 'Portfolio Gallery',
  type: 'document',
  fields: [
    { name: 'title', title: 'Design Title', type: 'string' },
    { name: 'image', title: 'Upload Image', type: 'image', options: { hotspot: true } },
    { name: 'category', title: 'Category', type: 'string' } 
  ]
}