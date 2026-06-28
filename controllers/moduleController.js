import Module from "../models/Module.js";

// CREATE MODULE
export const createModule = async (req, res) => {
  try {
    const { courseId, title, description, youtubeUrl, order } = req.body;

    if (!courseId || !title || !youtubeUrl) {
      return res.status(400).json({
        message: "courseId, title and youtubeUrl are required",
      });
    }

    const module = await Module.create({
      courseId,
      title,
      description,
      youtubeUrl,
      order,
    });

    res.status(201).json({
      message: "Module created successfully",
      module,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET MODULES BY COURSE
export const getModulesByCourse = async (req, res) => {
  try {
    const modules = await Module.find({ courseId: req.params.courseId })
      .sort({ order: 1 });

    res.json(modules);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    // safety check
    if (!id) {
      return res.status(400).json({ message: "Course ID is required" });
    }

    // get course
    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // get modules separately
    const modules = await Module.find({ courseId: id }).sort({ order: 1 });

    // return combined response
    res.json({
      _id: course._id,
      title: course.title,
      description: course.description,
      duration: course.duration,
      price: course.price,
      image: course.image,
      createdBy: course.createdBy,
      modules, // 🔥 THIS FIXES YOUR FRONTEND ISSUE
    });

  } catch (error) {
    console.log("GET COURSE ERROR:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET SINGLE MODULE
export const getModuleById = async (req, res) => {
  try {
    const module = await Module.findById(req.params.id);

    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    res.json(module);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE MODULE
export const updateModule = async (req, res) => {
  try {
    const module = await Module.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    res.json({
      message: "Module updated successfully",
      module,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE MODULE
export const deleteModule = async (req, res) => {
  try {
    const module = await Module.findByIdAndDelete(req.params.id);

    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    res.json({ message: "Module deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};