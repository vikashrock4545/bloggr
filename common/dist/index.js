"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePostInput = exports.createPostInput = exports.signinInput = exports.signupInput = void 0;
const zod_1 = require("zod");
exports.signupInput = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6).max(30),
    name: zod_1.z.string().min(1).max(50),
});
exports.signinInput = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6).max(30),
});
exports.createPostInput = zod_1.z.object({
    title: zod_1.z.string().min(1).max(30),
    content: zod_1.z.string().min(1).max(300),
});
exports.updatePostInput = zod_1.z.object({
    id: zod_1.z.string().min(1).max(30),
    title: zod_1.z.string().min(1).max(30),
    content: zod_1.z.string().min(1).max(300),
});
