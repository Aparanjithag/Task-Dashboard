import { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios
import { Filter } from 'lucide-react';
import { SearchBar } from './common/SearchBar';
import { TableHeader } from './table/TableHeader';
import { TaskRow } from './table/TaskRow';

const TaskTable = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tasks, setTasks] = useState([]); // State to store task
  const [filteredTasks, setFilteredTasks] = useState([]); // State for filtered task
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for error handling

  useEffect(() => {
    const fetchtasks = async () => {
      console.log("fetching");
      try {
        const token = localStorage.getItem('token'); // Get token from local storage
        const response = await axios.get('http://localhost:3001/project/get-my-assigned-projects', {
          headers: {
            'authorization': token, // Set Authorization header
            'Content-Type': 'application/json' // Set content type
          },
        });

        setTasks(response.data); // Set the task state
        setFilteredTasks(response.data); // Set the filtered task to initial task
      } catch (error) {
        setError(error.response ? error.response.data.message : error.message); // Handle any errors
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchProjects(); // Call the function to fetch projects
  }, []);

  // Search function
  const handleSearch = (e) => {
    e.preventDefault(); // Prevent default form submission
    const filtered = projects.filter((task) => {
      const { name, description } = task;
      const lowerCaseQuery = searchQuery.toLowerCase();
      return (
        name.toLowerCase().includes(lowerCaseQuery) ||
        description.toLowerCase().includes(lowerCaseQuery) ||
        (task.tags && task.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery))) // Check tags if they exist
      );
    });
    setFilteredTasks(filtered); // Set the filtered projects
  };

  // If loading, display a loading message
  if (loading) {
    return <div>Loading projects...</div>;
  }

  // If there's an error, display an error message
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="py-6 max-w-[1200px] mx-auto">
      <form onSubmit={handleSearch} className="flex justify-between items-center mb-8">
        <div className="hidden lg:block font-medium text-lg">Table view</div>
        <div className="flex gap-4">
          <SearchBar 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
            <Filter className="h-4 w-4" />
            <span>Search</span>
          </button>
        </div>
      </form>

      <div className="border rounded-lg">
        <table className="w-full">
          <thead>
            <TableHeader />
          </thead>
          <tbody>
            {filteredTasks.length > 0 ? (
              filteredTasks.map(task => (
                <TaskRow key={task.id} task={task} />
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4">No projects found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskTable;
