import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  items: [],
  
  addItem: (product) => {
    const items = get().items;
    const existingItem = items.find(item => item.id === product.id);
    
    if (existingItem) {
      set({
        items: items.map(item =>
          item.id === product.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        )
      });
    } else {
      set({
        items: [...items, { ...product, quantidade: 1 }]
      });
    }
  },
  
  removeItem: (productId) => {
    set({
      items: get().items.filter(item => item.id !== productId)
    });
  },
  
  updateQuantity: (productId, quantidade) => {
    set({
      items: get().items.map(item =>
        item.id === productId
          ? { ...item, quantidade }
          : item
      )
    });
  },
  
  clearCart: () => {
    set({ items: [] });
  },
  
  get total() {
    return get().items.reduce(
      (sum, item) => sum + (item.preco * item.quantidade),
      0
    );
  }
}));
