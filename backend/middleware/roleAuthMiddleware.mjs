/**
 * Role-Based Access Control Middleware
 * ------------------------------------
 * Grants access only if user's role is in allowedRoles.
 * Responds with 401 if unauthenticated, 403 if role is not permitted.
 */

export default function roleAuthorization(allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        if (!allowedRoles.includes(req.user.user_category)) {
            return res
                .status(403)
                .json({ message: "Access denied: Insufficient role permissions" });
        }

        next();
    };
}
