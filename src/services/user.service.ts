import { Prisma } from '../generated/prisma';
import prisma from '../lib/prisma';
import bcrypt from 'bcrypt';

export interface ProfileUpdateData {
  name?: string;
  email?: string;
  phone?: string | null;
  avatar?: string | null;
}

export interface AddressData {
  name: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
  phone?: string | null;
}
const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12');

export class EmailInUseError extends Error {
  constructor(message: string = 'Email is already in use') {
    super(message);
    this.name = 'EmailInUseError';
  }
}

export class ResourceNotFoundError extends Error {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`);
    this.name = 'ResourceNotFoundError';
  }
}

export class AuthenticationError extends Error {
  constructor(message: string = 'Authentication error') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export const userService = {

  async getUserProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            addresses: true
          }
        }
      }
    });
    
    if (!user) {
      throw new ResourceNotFoundError('User');
    }
    
    return user;
  },
  
  async updateUserProfile(userId: string, profileData: ProfileUpdateData) {
    try {
      return await prisma.$transaction(async (tx) => {
        if (profileData.email) {
          const existingUser = await tx.user.findFirst({
            where: {
              email: profileData.email,
              id: { not: userId }
            }
          });
          
          if (existingUser) {
            throw new EmailInUseError();
          }
        }
        return await tx.user.update({
          where: { id: userId },
          data: profileData,
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true
          }
        });
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new ResourceNotFoundError('User');
      }
      throw error; 
    }
  },

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        password: true
      }
    });
    
    if (!user) {
      throw new ResourceNotFoundError('User');
    }
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new AuthenticationError('Current password is incorrect');
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS);
    await prisma.user.update({
      where: { id: userId },
      data: { 
        password: hashedPassword,
        updatedAt: new Date()
      }
    });
    
    return { message: 'Password changed successfully' };
  },
  
  async getUserAddresses(userId: string) {
    return await prisma.address.findMany({
      where: { userId },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' }
      ]
    });
  },
  
  async addUserAddress(userId: string, addressData: AddressData) {
    return await prisma.$transaction(async (tx) => {
      const existingAddressCount = await tx.address.count({
        where: { userId }
      });
      
      const isFirstAddress = existingAddressCount === 0;
      const shouldBeDefault = addressData.isDefault || isFirstAddress;
      if (shouldBeDefault) {
        await tx.address.updateMany({
          where: { 
            userId,
            isDefault: true 
          },
          data: { isDefault: false }
        });
      }
      return await tx.address.create({
        data: {
          ...addressData,
          isDefault: shouldBeDefault,
          userId
        }
      });
    });
  },

  async updateUserAddress(userId: string, addressId: string, addressData: Partial<AddressData>) {
    try {
      return await prisma.$transaction(async (tx) => {
        const existingAddress = await tx.address.findFirst({
          where: { id: addressId, userId }
        });
        
        if (!existingAddress) {
          throw new ResourceNotFoundError('Address');
        }
        
        if (addressData.isDefault === true) {
          await tx.address.updateMany({
            where: { 
              userId,
              isDefault: true,
              id: { not: addressId }
            },
            data: { isDefault: false }
          });
        }
        
        return await tx.address.update({
          where: { id: addressId },
          data: addressData
        });
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new ResourceNotFoundError('Address');
      }
      throw error;
    }
  },

  async deleteUserAddress(userId: string, addressId: string) {
    try {
      await prisma.$transaction(async (tx) => {
        const address = await tx.address.findFirst({
          where: { id: addressId, userId }
        });
        
        if (!address) {
          throw new ResourceNotFoundError('Address');
        }
        await tx.address.delete({
          where: { id: addressId }
        });
        
        if (address.isDefault) {
          const nextAddress = await tx.address.findFirst({
            where: { userId },
            orderBy: { createdAt: 'asc' }
          });
          
          if (nextAddress) {
            await tx.address.update({
              where: { id: nextAddress.id },
              data: { isDefault: true }
            });
          }
        }
      });
      
      return { message: 'Address deleted successfully' };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new ResourceNotFoundError('Address');
      }
      throw error;
    }
  },

  async getDefaultAddress(userId: string) {
    const defaultAddress = await prisma.address.findFirst({
      where: { 
        userId,
        isDefault: true 
      }
    });
    
    if (!defaultAddress) {
      throw new ResourceNotFoundError('Default address');
    }
    
    return defaultAddress;
  }
};