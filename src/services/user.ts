import { prismaClient } from "../lib/db";
import { createHmac, randomBytes } from 'node:crypto';
import jwt from 'jsonwebtoken';

export interface CreateUserPayload {
    firstName: string;
    lastName?: string;
    email: string;
    password: string;
}

export class UserService {
    public static generateHash(salt: string, password: string): string {
        return createHmac('sha256', salt).update(password).digest('hex');
    }

    public static async createUser(payload: CreateUserPayload) {
        const { firstName, lastName, email, password } = payload;
        const salt = randomBytes(16).toString('hex');
        const hashedPassword = UserService.generateHash(salt, password);

        try {
            const user = await prismaClient.user.create({
                data: {
                    firstName,
                    lastName,
                    email,
                    salt,
                    password: hashedPassword,
                },
            });
            return user;
        } catch (error) {
            console.error('Error creating user:', error);
            throw new Error('Unable to create user');
        }
    }

    public static async getUserToken({ email, password }: { email: string, password: string }) {
        try {
            const user = await prismaClient.user.findUnique({
                where: { email },
            });

            if (!user) {
                throw new Error('User not found');
            }

            const hashedPassword = UserService.generateHash(user.salt, password);

            if (hashedPassword !== user.password) {
                throw new Error('Invalid credentials');
            }

            const token = jwt.sign({ userId: user.id }, 'your_secret_key', { expiresIn: '1h' });

            return token;
        } catch (error) {
            console.error('Error getting user token:', error);
            throw new Error('Unable to get user token');
        }
    }
}
