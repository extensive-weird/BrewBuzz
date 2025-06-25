/**
 * Change Password Controller
 * --------------------------
 * Allows authenticated users to securely change their password.
 *
 * - Validates input fields and password strength
 * - Verifies old password before updating
 * - Hashes the new password before saving to the database
 *
 */
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const bcrypt = require("bcryptjs");

import User from "../models/User.mjs";


export const changePassword = async (req, res) => {
    try{
        const {oldPassword, newPassword, confirmNewPassword } = req.body;
        const userId= req.user.id; // asume authenicationg middlware is used

        // validate input fields
        if (!oldPassword || !newPassword || !confirmNewPassword) {
            return res.status(400).json ({message: "All fields are required. "});

        }
        if (newPassword == oldPassword) {
            return res.status(400).json({message: "New password must be different from old password."});

        }

        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({message: "New passwords do not match. "});

        }

        if (newPassword.length < 8) {
            return res.status(400).json({message: "Password must be at least 8 characters long."});

        }

        if(!/\d/.test(newPassword) || !/[A-Z]/.test(newPassword)) {
            return res.status(400).json ({
                message: "New password must include at least one uppercase letter, and one number"
            });
        }

        // fetch user details from the database
        const user = await User.findByPk (userId);
        if(!user) {
            return res.status(404).json({message: "User not found."});

        }

        //verify old password
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({message: "Old password is incorrect"});
        }

    

        // hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // update password in database
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({message: "Password changed successfully."});
    }
    catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({message: "Server error. please try again later"});
}
};
