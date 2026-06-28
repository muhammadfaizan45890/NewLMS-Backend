import { User } from "../models/userModel.js";
import Course from "../models/Course.js";
// import Enrollment from "../models/Enrollment.js"
// ================= USERS =================

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "admin") {
      return res.status(403).json({ message: "Admin cannot be deleted" });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const users = await User.find();

    res.json({
      totalUsers: users.length,
      admins: users.filter(u => u.role === "admin").length,
      normalUsers: users.filter(u => u.role === "user").length,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ================= COURSES =================

export const addCourse = async (req, res) => {
  try {
    const { title, description, duration, image, price } = req.body;

    const course = await Course.create({
      title,
      description,
      duration,
      image,
      price,
      createdBy: req.user?.id,
      modules: [] // important init
    });

    res.status(201).json({
      message: "Course created successfully",
      course,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching courses" });
  }
};

// ================= DELETE COURSE =================
export const deleteCourse = async (req, res) => {
  try {

    const { id } = req.params

    // FIND COURSE
    const course = await Course.findById(id)

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      })
    }

    // DELETE COURSE
    await Course.findByIdAndDelete(id)

    res.status(200).json({
      success: true,
      message: "Course deleted successfully"
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      success: false,
      message: "Server Error"
    })
  }
}

// ================= COURSE BY ID (FIXED FOR EMBEDDED MODULES) =================

export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // modules already inside course
    res.json(course);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// ================= MODULES (EMBEDDED ARRAY LOGIC) =================

// ADD MODULE
export const addModuleToCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, videoUrl } = req.body;

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    course.modules.push({
      title,
      description,
      videoUrl,
    });

    await course.save();

    res.status(200).json({
      message: "Module added successfully",
      course,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE MODULE (BY INDEX)
export const deleteModuleFromCourse = async (req, res) => {
  try {
    const { courseId, moduleIndex } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    course.modules.splice(moduleIndex, 1);

    await course.save();

    res.json({
      message: "Module deleted successfully",
      course,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};