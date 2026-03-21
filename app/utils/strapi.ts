// app/utils/strapi.ts

/**
 * Extracts raw plain text from Strapi V5 Rich Text (Blocks) format.
 * Strapi Blocks is an array of objects e.g. [{ type: 'paragraph', children: [{ text: '...' }] }]
 */
export function extractTextFromBlocks(description: any): string {
  if (!description) return '';
  
  if (typeof description === 'string') {
    return description;
  }
  
  if (Array.isArray(description)) {
    return description.map(block => {
      if (block.children && Array.isArray(block.children)) {
        return block.children.map((child: any) => child.text || '').join('');
      }
      return '';
    }).join('\n\n');
  }

  return 'Descripción no disponible.';
}

/**
 * Extracts size/stock variants from a product's repeatable component `Variantes`.
 * Returns an array of objects { size: string, stock: number }.
 */
export function extractVariantes(product: any): { size: string; stock: number }[] {
  if (!product || !product.Variantes) return [];
  return product.Variantes.map((v: any) => ({
    size: v.Talla,
    stock: v.Stock ?? 0,
  }));
}
