import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";

export const useCartStore = create(
  persist(
    (set) => ({
      cartItems: [],

      addToCart: (product, quantity = 1) =>
        set((state) => {
          const uniqueId = product.id ?? uuidv4();

          const exists = state.cartItems.find(
            (item) => item.cartItemId === uniqueId
          );

          if (exists) {
            return {
              cartItems: state.cartItems.map((item) =>
                item.cartItemId === uniqueId
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          } else {
            return {
              cartItems: [
                ...state.cartItems,
                {
                  ...product,
                  quantity,
                  cartItemId: uniqueId,
                },
              ],
            };
          }
        }),

      removeFromCart: (cartItemId) =>
        set((state) => ({
          cartItems: state.cartItems.filter(
            (item) => item.cartItemId !== cartItemId
          ),
        })),

      updateQuantity: (cartItemId, quantity) =>
        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            item.cartItemId === cartItemId ? { ...item, quantity } : item
          ),
        })),

      clearCart: () => set({ cartItems: [] }),
    }),
    {
      name: "pawty-cart", // 👈 key trong localStorage
      getStorage: () => localStorage,
    }
  )
);
