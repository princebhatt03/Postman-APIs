const Admin = require('../models/admin.models');
const bcrypt = require('bcrypt');

function adminController() {
  return {
    // ********** ADMIN's POST ROUTES CONTROLLERS **********

    // ✅ Admin Registration Controller
    async registerAdmin(req, res) {
      const { Name, AdminID, adminUsername, email, mobile, password } =
        req.body;

      // Basic validation
      if (
        !Name ||
        !AdminID ||
        !adminUsername ||
        !email ||
        !mobile ||
        !password
      ) {
        return res.status(400).json({ message: 'All fields are required.' });
      }

      try {
        // Check if adminUsername or AdminID already exists
        const existingAdminUsername = await Admin.findOne({ adminUsername });
        if (existingAdminUsername) {
          return res
            .status(409)
            .json({ message: 'Admin username already exists.' });
        }

        const existingAdminID = await Admin.findOne({ AdminID });
        if (existingAdminID) {
          return res.status(409).json({ message: 'Admin ID already exists.' });
        }

        // Hash password securely with bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new Admin instance
        const newAdmin = new Admin({
          Name,
          AdminID,
          adminUsername,
          email,
          mobile,
          password: hashedPassword,
        });

        // Save new admin to DB
        await newAdmin.save();

        // Send clean response to frontend or Postman
        return res.status(201).json({
          success: true,
          message: 'Admin registered successfully',
          admin: {
            id: newAdmin._id,
            Name: newAdmin.Name,
            AdminID: newAdmin.AdminID,
            adminUsername: newAdmin.adminUsername,
            email: newAdmin.email,
            mobile: newAdmin.mobile,
          },
          // Optional: Send JWT token for auto-login later
          // token: "JWT_TOKEN_HERE"
        });

        /*
           React Frontend Use Case:
           if (res.data.success) {
             // Redirect to login page or admin dashboard
             navigate("/admin/login");
           }
           */
      } catch (error) {
        console.error('Error registering admin:', error);
        return res.status(500).json({
          success: false,
          message: 'Internal Server Error',
          error: error.message,
        });
      }
    },

    // ✅ Admin Login Controller
    async loginAdmin(req, res) {
      const { adminUsername, password } = req.body;

      // Input validation
      if (!adminUsername || !password) {
        return res
          .status(400)
          .json({ message: 'Admin username and password are required.' });
      }

      try {
        // Check if admin exists
        const admin = await Admin.findOne({ adminUsername });
        if (!admin) {
          return res.status(404).json({ message: 'Admin not found.' });
        }

        // Compare password using bcrypt
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
          return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // If valid, send response (JWT can be added later)
        return res.status(200).json({
          success: true,
          message: 'Login successful',
          admin: {
            id: admin._id,
            Name: admin.Name,
            AdminID: admin.AdminID,
            adminUsername: admin.adminUsername,
            email: admin.email,
            mobile: admin.mobile,
          },
          // token: "JWT_TOKEN_HERE" // Add in future for auth
        });

        /*
           React Frontend Use Case:
           if (res.data.success) {
             // Save admin info/token in localStorage
             localStorage.setItem('admin', JSON.stringify(res.data.admin));
             // Redirect to admin dashboard
             navigate('/admin/dashboard');
           }
           */
      } catch (error) {
        console.error('Admin login error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
    },

    // ✅ Update Admin Controller (PATCH)
    async updateAdmin(req, res) {
      const { id } = req.params;
      const { Name, AdminID, adminUsername, email, mobile, password } =
        req.body;

      try {
        // Find admin by ID
        const admin = await Admin.findById(id);
        if (!admin) {
          return res.status(404).json({ message: 'Admin not found' });
        }

        // Update only provided fields
        if (Name) admin.Name = Name;
        if (AdminID) admin.AdminID = AdminID;
        if (adminUsername) admin.adminUsername = adminUsername;
        if (email) admin.email = email;
        if (mobile) admin.mobile = mobile;

        // Hash password if provided
        if (password) {
          const hashedPassword = await bcrypt.hash(password, 10);
          admin.password = hashedPassword;
        }

        // Update timestamp
        admin.updatedAt = new Date();

        // Save updated admin
        const updatedAdmin = await admin.save();

        return res.status(200).json({
          success: true,
          message: 'Admin updated successfully',
          admin: {
            id: updatedAdmin._id,
            Name: updatedAdmin.Name,
            AdminID: updatedAdmin.AdminID,
            adminUsername: updatedAdmin.adminUsername,
            email: updatedAdmin.email,
            mobile: updatedAdmin.mobile,
            updatedAt: updatedAdmin.updatedAt,
          },
        });

        /*
           React Frontend Use Case:
           const response = await axios.patch(`/api/admins/update/${adminId}`, updatedFields);
           if (response.data.success) {
             alert("Profile Updated");
             navigate('/admin/profile');
           }
           */
      } catch (error) {
        console.error('Error updating admin:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
    },

    // ✅ Delete Admin Controller
    async deleteAdmin(req, res) {
      const { id } = req.params;

      try {
        const deletedAdmin = await Admin.findByIdAndDelete(id);

        if (!deletedAdmin) {
          return res.status(404).json({ message: 'Admin not found' });
        }

        return res.status(200).json({
          success: true,
          message: 'Admin deleted successfully',
          admin: {
            id: deletedAdmin._id,
            adminUsername: deletedAdmin.adminUsername,
            email: deletedAdmin.email,
          },
        });

        /*
           React Frontend Use Case:
           const res = await axios.delete(`/api/admins/delete/${adminId}`);
           if (res.data.success) {
             alert("Admin account deleted");
             navigate('/admin/register');
           }
           */
      } catch (error) {
        console.error('Error deleting admin:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
    },
  };
}

module.exports = adminController;