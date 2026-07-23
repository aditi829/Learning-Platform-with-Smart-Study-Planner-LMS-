import { useEffect, useState } from "react";
import API from "../api/api";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    course_name: "",
    description: "",
    start_date: "",
    end_date: "",
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    try {
      const res = await API.get("/courses");
      setCourses(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  async function addCourse(e) {
    e.preventDefault();

    try {
      await API.post("/courses", form);

      setForm({
        course_name: "",
        description: "",
        start_date: "",
        end_date: "",
      });

      fetchCourses();
    } catch (err) {
      console.log(err);
    }
  }

  // ✅ SAFE DELETE (FIXED)
async function deleteCourse(course) {
  try {
    const id = course.id;

    console.log("Deleting course id:", id);

    const res = await API.delete(`/courses/${id}`);

    console.log("Deleted:", res.data);

    fetchCourses();

  } catch (err) {
    console.log("ERROR RESPONSE:", err.response?.data);
    console.log("STATUS:", err.response?.status);

    alert(err.response?.data?.detail || "Delete failed");
  }
}
  return (
    <div className="page">

      <h2>Courses</h2>

      {/* FORM */}
      <form className="form" onSubmit={addCourse}>

        <input
          placeholder="Course Name"
          value={form.course_name}
          onChange={(e) =>
            setForm({ ...form, course_name: e.target.value })
          }
        />

        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <input
          type="date"
          value={form.start_date}
          onChange={(e) =>
            setForm({ ...form, start_date: e.target.value })
          }
        />

        <input
          type="date"
          value={form.end_date}
          onChange={(e) =>
            setForm({ ...form, end_date: e.target.value })
          }
        />

        <button>Add Course</button>

      </form>

      {/* LIST */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid">

          {courses.map((course) => (
            <div className="card" key={course.id || course.course_id || course._id}>

              <h3>{course.course_name}</h3>
              <p>{course.description}</p>

              <button onClick={() => deleteCourse(course)}>
                Delete
              </button>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default Courses;