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
exports.userroute = exports.resetsession = exports.generate_otp = exports.transportmail = void 0;
const client_1 = require("@prisma/client");
const types_1 = require("../types");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_1 = require("express");
const nodemailer_1 = __importDefault(require("nodemailer"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const otp_generator_1 = __importDefault(require("otp-generator"));
const middleware_1 = require("../middleware");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const router = (0, express_1.Router)();
exports.transportmail = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.password
    },
    port: 465,
    secure: false,
    host: 'smtp.gmail.com'
});
const prisma = new client_1.PrismaClient();
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    const verify = types_1.UserRegister.safeParse({ name, email, password });
    if (!verify.success) {
        return res.status(400).json({ messge: "Invalid data" });
    }
    const verifyemail = yield prisma.user.findUnique({
        where: {
            email: email
        }
    });
    if (verifyemail) {
        return res.status(400).json({ message: "Email already exist" });
    }
    yield (0, exports.generate_otp)(req, res);
    res.status(200).send({ message: "OTP sent. Please verify to complete registration." });
}));
const generate_otp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email } = req.body;
    req.app.locals.OTP = otp_generator_1.default.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
        digits: true
    });
    const verifyotp = {
        from: process.env.EMAIL_USERNAME,
        to: email,
        subject: 'Account Verification Code - Automate with [Your Product Name]',
        html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f5f7fb; padding: 20px; border: 1px solid #dce0e6; border-radius: 8px;">
        <h1 style="font-size: 24px; font-weight: bold; color: #3b3f5c; text-align: center; margin-bottom: 25px;">Verify Your [Your Product Name] Account</h1>
        <div style="background-color: #ffffff; border: 1px solid #dce0e6; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); overflow: hidden;">
            <div style="background-color: #635bff; padding: 15px;">
                <h2 style="font-size: 20px; font-weight: bold; color: #ffffff; text-align: center; margin: 0;">Your Verification Code</h2>
            </div>
            <div style="padding: 20px; text-align: center;">
                <p style="font-size: 18px; font-weight: bold; color: #635bff; margin: 0;">${req.app.locals.OTP}</p>
            </div>
        </div>
        <div style="padding: 20px;">
            <p style="font-size: 14px; color: #6b7280;">Hi ${name},</p>
            <p style="font-size: 14px; color: #6b7280; margin-bottom: 20px;">Thank you for signing up for [Your Product Name]. To activate your account and start automating your workflows, use the verification code provided above.</p>
            <p style="font-size: 14px; color: #6b7280; margin-bottom: 20px;">If you didn’t sign up for [Your Product Name], please ignore this email. Your account will remain inactive.</p>
            <div style="text-align: center; margin-top: 30px;">
                <a href="[Verification Page URL]" style="display: inline-block; font-size: 14px; color: #ffffff; background-color: #635bff; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Verify My Account</a>
            </div>
        </div>
        <footer style="margin-top: 30px; text-align: center; font-size: 12px; color: #6b7280;">
            <p>&copy; ${new Date().getFullYear()} [Your Product Name]. All rights reserved.</p>
            <p><a href="[Privacy Policy URL]" style="color: #635bff; text-decoration: none;">Privacy Policy</a> | <a href="[Support URL]" style="color: #635bff; text-decoration: none;">Support</a></p>
        </footer>
    </div>
    `
    };
    exports.transportmail.sendMail(verifyotp, (err, info) => {
        if (info) {
            console.log(info);
            res.status(200).send({ message: "OTP sent please verify to complete registration" });
        }
        else {
            console.log(err);
        }
    });
});
exports.generate_otp = generate_otp;
router.post("/verify_otp", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { code, email, name, password } = req.body;
        if (!code) {
            res.send({ message: "`code` is required" });
        }
        // console.log(req.app.locals.OTP);
        if (parseInt(code) != parseInt(req.app.locals.OTP)) {
            res.send({ message: "Invalid OTP" });
        }
        else {
            req.app.locals.OTP = null;
            req.app.locals.resetsession = true;
            const salt = yield bcrypt_1.default.genSalt(10);
            const hash = bcrypt_1.default.hashSync(password, salt);
            const user = yield prisma.user.create({
                data: {
                    name,
                    email,
                    password: hash
                }
            });
            const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "365d" });
            console.log(token);
            res.send({ token, status: 200, user });
        }
    }
    catch (err) {
        console.log(err);
        throw new Error("Invalid OTP");
    }
}));
const resetsession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.app.local.resetsession) {
        req.app.local.resetsession = false;
        res.send({ message: "Session reset" });
    }
    else {
        res.send({ message: "Session alredy reset" });
    }
});
exports.resetsession = resetsession;
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const verif = types_1.usersingin.safeParse({ email, password });
    if (!verif.success) {
        return res.status(400).json({ message: "Inavlid input" });
    }
    const userfind = yield prisma.user.findUnique({
        where: {
            email: email
        }
    });
    if (!userfind) {
        return res.status(400).json({ message: "No user found Kindly register" });
    }
    const checkpassword = bcrypt_1.default.compareSync(password, userfind.password);
    if (!checkpassword) {
        return res.status(400).json({ message: "Invalid Passwordd" });
    }
    const token = jsonwebtoken_1.default.sign({ id: userfind.id }, process.env.JWT_SECRET, { expiresIn: "365d" });
    console.log(token);
    res.send({ token, status: 200, userfind });
}));
router.get("/user", middleware_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.id;
    if (!id) {
        return res.status(400).json("No id foud");
    }
    const user = yield prisma.user.findUnique({
        where: {
            id: id
        }
    });
    res.send({ user, status: 200 });
}));
exports.userroute = router;
