import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios
import { ToastContainer, toast } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

const AddTaskModal = ({ isOpen, onClose }) => {
  const [TaskName, setTaskName] = useState('');
  const [TaskDescription, setTaskDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({
    TaskName: false,
    TaskDescription: false,
    deadline: false,
  });

  useEffect(() => {
    if (touched.TaskName) validateTaskName(TaskName);
  }, [TaskName, touched.TaskName]);

  useEffect(() => {
    if (touched.TaskDescription) validateTaskDescription(TaskDescription);
  }, [TaskDescription, touched.TaskDescription]);

  useEffect(() => {
    if (touched.deadline) validateDeadline(deadline);
  }, [deadline, touched.deadline]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setTouched({
      projectName: true,
      projectDescription: true,
      deadline: true,
    });
    if (Object.keys(validationErrors).length === 0) {
      const token = localStorage.getItem('token'); // Get token from local storage
      const formattedDeadline = formatDeadline(deadline); // Format the deadline
      const TaskData = {
        name: TaskName,
        description: TaskDescription,
        deadline: formattedDeadline,
        tags: [] // Replace with actual tags if needed
      };

      try {
        const response = await axios.post('http://localhost:3001/project/create', TaskData, {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 200) {
          toast.success('Project created successfully!'); // Show success message
          onClose(); // Close modal after submission
          window.location.reload();
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 401) {
            toast.error('Unauthorized! Please log in again.'); // Show unauthorized message
          } else if (error.response.status === 500) {
            toast.error('Internal server error! Please try again later.'); // Show server error
          }
        } else {
          toast.error('An unexpected error occurred!'); // Show general error message
        }
      }
    }
  };

  const formatDeadline = (date) => {
    const [year, month, day] = date.split('-'); // Assuming input format is YYYY-MM-DD
    return `${day}/${month}/${year}`; // Format to DD/MM/YYYY
  };

  const validateProjectName = (name) => {
    if (name.length < 4) {
      setErrors((prev) => ({ ...prev, TaskName: 'Task name must be at least 4 characters long' }));
    } else {
      setErrors((prev) => ({ ...prev, TaskName: undefined }));
    }
  };

  const validateTaskDescription = (description) => {
    if (description.split(' ').length < 10) {
      setErrors((prev) => ({ ...prev, TaskDescription: 'Task description must be at least 10 words long' }));
    } else {
      setErrors((prev) => ({ ...prev, TaskDescription: undefined }));
    }
  };

  const validateDeadline = (date) => {
    const selectedDate = new Date(date);
    const currentDate = new Date();
    const minDeadline = new Date(currentDate.setDate(currentDate.getDate() + 2));
    if (!date || selectedDate < minDeadline) {
      setErrors((prev) => ({ ...prev, deadline: 'Deadline must be at least 2 days ahead of today' }));
    } else {
      setErrors((prev) => ({ ...prev, deadline: undefined }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (TaskName.length < 4) {
      errors.TaskName = 'Task name must be at least 4 characters long';
    }
    if (TaskDescription.split(' ').length < 10) {
      errors.TaskDescription = 'Task description must be at least 10 words long';
    }
    const selectedDate = new Date(deadline);
    const currentDate = new Date();
    const minDeadline = new Date(currentDate.setDate(currentDate.getDate() + 2));
    if (!deadline || selectedDate < minDeadline) {
      errors.deadline = 'Deadline must be at least 2 days ahead of today';
    }
    return errors;
  };

  const handleFocus = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  return (
    <>
      <ToastContainer /> {/* Include ToastContainer for displaying toasts */}
      {isOpen && (
        <div className="z-50 fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center transition-opacity duration-300">
          <div className="bg-white py-12 px-12 rounded-lg shadow-lg max-w-lg mx-h-lg w-full relative">
            <h2 className="text-xl font-semibold mb-4">Add New Task</h2>

            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-700 shadow-2xl text-4xl"
            >
              &times;
            </button>

            <form onSubmit={handleSubmit}>
              {/* Task Name */}
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Task Name
                </label>
                <input
                  type="text"
                  placeholder="Enter Task name"
                  value={TaskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  onFocus={() => handleFocus('TaskName')}
                  className={`w-full p-2 border ${touched.TaskName && errors.TaskName ? 'border-red-500' : 'border-black'} rounded focus:outline-none focus:border-blue-500`}
                />
                {touched.TaskName && errors.TaskName && (
                  <p className="text-red-500 text-sm mt-1">{errors.TaskName}</p>
                )}
              </div>

              {/* Task Description */}
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Task Description
                </label>
                <textarea
                  placeholder="Enter Task description"
                  value={TaskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  onFocus={() => handleFocus('TaskDescription')}
                  className={`w-full p-2 border ${touched.TaskDescription && errors.TaskDescription ? 'border-red-500' : 'border-black'} rounded focus:outline-none focus:border-blue-500`}
                />
                {touched.TaskDescription && errors.TaskDescription && (
                  <p className="text-red-500 text-sm mt-1">{errors.TaskDescription}</p>
                )}
              </div>

              {/* Deadline */}
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Deadline
                </label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  onFocus={() => handleFocus('deadline')}
                  className={`w-full p-2 border ${touched.deadline && errors.deadline ? 'border-red-500' : 'border-black'} rounded focus:outline-none focus:border-blue-500`}
                />
                {touched.deadline && errors.deadline && (
                  <p className="text-red-500 text-sm mt-1">{errors.deadline}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-950 text-white rounded-lg hover:bg-blue-900 transition-colors"
              >
                Add Task
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddTaskModal;