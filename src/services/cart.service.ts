import prisma from '../lib/prisma';

export const cartService = {
  async getCart(userId: string) {
    return await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            book: true
          }
        }
      }
    });
  },
  
  async addToCart(userId: string, bookId: string, quantity: number) {
    return await prisma.$transaction(async (tx) => {
      // Check if book exists and has enough stock
      const book = await tx.book.findUnique({
        where: { id: bookId }
      });
      
      if (!book) {
        throw new Error('Book not found');
      }
      
      if (!book.isApproved) {
        throw new Error('Book is not approved for sale');
      }
      
      if ((book.stock || 0) < quantity) {
        throw new Error(`Not enough stock. Only ${book.stock} available.`);
      }
      
      // Get or create cart
      let cart = await tx.cart.findUnique({
        where: { userId },
        include: { items: true }
      });
      
      if (!cart) {
        // Create new cart with first item
        cart = await tx.cart.create({
          data: {
            userId,
            items: {
              create: {
                bookId,
                quantity,
                price: book.price
              }
            }
          },
          include: {
            items: {
              include: {
                book: true
              }
            }
          }
        });
      } else {
        // Check if item already exists in cart
        const existingItem = cart.items.find(item => item.bookId === bookId);
        
        if (existingItem) {
          const newQuantity = existingItem.quantity + quantity;
          
          // Check total quantity against stock
          if ((book.stock || 0) < newQuantity) {
            throw new Error(`Not enough stock. Only ${book.stock} available, you already have ${existingItem.quantity} in cart.`);
          }
          
          // Update existing item quantity
          await tx.cartItem.update({
            where: { id: existingItem.id },
            data: { quantity: newQuantity }
          });
        } else {
          // Add new item to cart
          await tx.cartItem.create({
            data: {
              cartId: cart.id,
              bookId,
              quantity,
              price: book.price
            }
          });
        }
        
        // Fetch updated cart
        cart = await tx.cart.findUnique({
          where: { userId },
          include: {
            items: {
              include: {
                book: true
              }
            }
          }
        });
      }
      
      return cart;
    });
  },
  
  async updateCartItem(userId: string, itemId: string, quantity: number) {
    return await prisma.$transaction(async (tx) => {
      // Find user's cart
      const cart = await tx.cart.findUnique({
        where: { userId },
        include: { items: true }
      });
      
      if (!cart) {
        throw new Error('Cart not found');
      }
      
      // Find cart item
      const cartItem = cart.items.find(item => item.id === itemId);
      if (!cartItem) {
        throw new Error('Item not found in cart');
      }
      
      // Check book stock
      const book = await tx.book.findUnique({
        where: { id: cartItem.bookId }
      });
      
      if (!book) {
        throw new Error('Book not found');
      }
      
      if ((book.stock || 0) < quantity) {
        throw new Error(`Not enough stock. Only ${book.stock} available.`);
      }
      
      // Update cart item
      await tx.cartItem.update({
        where: { id: itemId },
        data: { quantity }
      });
      
      // Get updated cart
      return await tx.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: {
              book: true
            }
          }
        }
      });
    });
  },
  
  async removeCartItem(userId: string, itemId: string) {
    return await prisma.$transaction(async (tx) => {
      // Find user's cart
      const cart = await tx.cart.findUnique({
        where: { userId },
        include: { items: true }
      });
      
      if (!cart) {
        throw new Error('Cart not found');
      }
      
      // Check if item exists in cart
      const cartItem = cart.items.find(item => item.id === itemId);
      if (!cartItem) {
        throw new Error('Item not found in cart');
      }
      
      // Remove item
      await tx.cartItem.delete({
        where: { id: itemId }
      });
      
      // Get updated cart
      return await tx.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: {
              book: true
            }
          }
        }
      });
    });
  },
  
  async clearCart(userId: string) {
    return await prisma.$transaction(async (tx) => {
      // Find user's cart
      const cart = await tx.cart.findUnique({
        where: { userId }
      });
      
      if (!cart) {
        return null; // Cart doesn't exist, nothing to clear
      }
      
      // Delete all cart items
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id }
      });
      
      return true;
    });
  },
  
  async getCartItemCount(userId: string) {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: true
      }
    });
    
    return cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
  },
  
  calculateCartTotal(items: any[]): number {
    return items.reduce((sum, item) => sum + (item.quantity * item.book.price), 0);
  }
};