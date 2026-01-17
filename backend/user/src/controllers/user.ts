import { generateToken } from "../config/generateToken.js";
import { publishToQueue } from "../config/rabbitmq.js";
import TryCatch from "../config/TryCatch.js";
import { redisClient } from "../index.js";
import { User } from "../model/User.js";

export const loginUser = TryCatch(async (req , res) => {
    const {email} = req.body; 
    const rateLimitKey = `otp:ratelimit:${email}`;
    const rateLimit = await redisClient.get(rateLimitKey);
    
    if(rateLimit) {
        res.status(429).json({ message: "Too many requests. Please try again later." });
        return ;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const otpKey = `otp:${email}`;
    await redisClient.set(otpKey, otp, {
        EX: 5 * 60,
    });
    // lưu vào redis chổng spam(1 phút mới được gửi lại)
    await redisClient.set(rateLimitKey, '1', {
        EX: 60,
    });

    const message = {
        to: email,
        subject: "Your OTP Code",
        body: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
    };
    // không gửi mail trực tiếp từ user service mà gửi qua rabbitmq (nhanh và khi lỗi không ảnh hưởng đến logic)
    await publishToQueue("send-otp", message);

    res.status(200).json({ message: "OTP sent to your email address." });

})


export const verifyUser = TryCatch(async (req , res) => {
    // lấy email và otp từ body . otp là mã người dùng nhập vào
    const {email , otp : enteredOtp} = req.body;
    if(!email || !enteredOtp) {
        res.status(400).json({ message: "Email and OTP are required." });
        return ;
    }

    const otpKey = `otp:${email}`;
    const storedOtp = await redisClient.get(otpKey);

    if(!storedOtp || storedOtp !== enteredOtp){
        res.status(400).json({ message: "Invalid or expired OTP." });
        return ;
    }
    // xóa otp sau khi xác thực thành công
    await redisClient.del(otpKey);

    // tạo hoặc lấy user từ db
    let user = await User.findOne({email})
    if(!user){
        const name = email.slice(0,8);
        user = await User.create({name , email});
    }

    const token = generateToken(user);

    res.json ({
        message: "User verified successfully.",
        token,
        user,
    });
});