"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const db_1 = require("../lib/db");
const node_crypto_1 = require("node:crypto");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET_KEY = 'your_secret_key'; // Ensure this is a strong, secret key
class UserService {
    static generateHash(salt, password) {
        return (0, node_crypto_1.createHmac)('sha256', salt).update(password).digest('hex');
    }
    static createUser(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { firstName, lastName, email, password } = payload;
            const salt = (0, node_crypto_1.randomBytes)(16).toString('hex');
            const hashedPassword = UserService.generateHash(salt, password);
            try {
                const user = yield db_1.prismaClient.user.create({
                    data: {
                        firstName,
                        lastName,
                        email,
                        salt,
                        password: hashedPassword,
                    },
                });
                return user;
            }
            catch (error) {
                console.error('Error creating user:', error);
                throw new Error('Unable to create user');
            }
        });
    }
    static getUserToken(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email, password }) {
            try {
                const user = yield db_1.prismaClient.user.findUnique({
                    where: { email },
                });
                if (!user) {
                    throw new Error('User not found');
                }
                const hashedPassword = UserService.generateHash(user.salt, password);
                if (hashedPassword !== user.password) {
                    throw new Error('Invalid credentials');
                }
                const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
                return token;
            }
            catch (error) {
                console.error('Error getting user token:', error);
                throw new Error('Unable to get user token');
            }
        });
    }
    static decodeJWTToken(token) {
        return jsonwebtoken_1.default.verify(token, SECRET_KEY);
    }
    static getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield db_1.prismaClient.user.findUnique({
                    where: { id },
                });
                return user;
            }
            catch (error) {
                console.error('Error getting user by ID:', error);
                throw new Error('Unable to get user by ID');
            }
        });
    }
}
exports.UserService = UserService;
