import { prismaClient } from "../lib/db";
import { createHmac, randomBytes } from 'node:crypto';
import jwt from 'jsonwebtoken';

export interface CreateUserPayload {
    firstName: string;
    lastName?: string;
    email: string;
    password: string;
}

const SECRET_KEY = 'your_secret_key'; // Ensure this is a strong, secret key

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

            const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });

            return token;
        } catch (error) {
            console.error('Error getting user token:', error);
            throw new Error('Unable to get user token');
        }
    }

    public static decodeJWTToken(token: string) {
        return jwt.verify(token, SECRET_KEY);
    }

    public static async getUserById(id: string) {
        try {
            const user = await prismaClient.user.findUnique({
                where: { id },
            });
            return user;
        } catch (error) {
            console.error('Error getting user by ID:', error);
            throw new Error('Unable to get user by ID');
        }
    }
}
