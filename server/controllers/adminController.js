import jwt from "jsonwebtoken";



export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const departments = {
            sanitation: {
                email: process.env.SANITATION_EMAIL,
                password: process.env.SANITATION_PASSWORD
            },
            publichealth: {
                email: process.env.PUBLICHEALTH_EMAIL,
                password: process.env.PUBLICHEALTH_PASSWORD
            },
            roads: {
                email: process.env.ROADS_EMAIL,
                password: process.env.ROADS_PASSWORD
            },
            water: {
                email: process.env.WATER_EMAIL,
                password: process.env.WATER_PASSWORD
            },
            electricity: {
                email: process.env.ELECTRICITY_EMAIL,
                password: process.env.ELECTRICITY_PASSWORD
            }
        };

        let matchedDepartment = null;

        // Check if credentials match any department
        for (const [deptName, creds] of Object.entries(departments)) {
            if (email === creds.email && password === creds.password) {
                matchedDepartment = deptName;
                break;
            }
        }

        // Fallback for general ADMIN credentials (optional, primarily for backward compatibility or super admin)
        if (!matchedDepartment && email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            // Default to sanitation or handle as super admin. 
            // For now, let's assume super admin can access 'sanitation' by default or we return a specific role.
            matchedDepartment = 'sanitation';
        }

        if (matchedDepartment) {
            const token = jwt.sign({ email, role: matchedDepartment }, process.env.JWT_SECRET, { expiresIn: "7d" });
            res.cookie('sellertoken', token, {
                httpOnly: true,
                maxAge: 24 * 7 * 60 * 60 * 1000,
            });
            return res.json({ success: true, message: 'logged in', department: matchedDepartment });
        } else {
            return res.json({ success: false, message: 'Invalid credentials' });
        }

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

export const isAdminAuth = async (req, res) => {
    try {
        return res.json({ success: true });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}
