import { Plus, Trash2 } from 'lucide-react';
import React from 'react';

const ProjectForm = ({ data = [], onChange }) => {

  const addProject = () => {
    const newProject = {
      name: "",
      type: "",
      description: "",
    };
    onChange([...data, newProject]);
  };

  const removeProject = (index) => {
    const updated = data.filter((_, i) => i !== index);
    onChange(updated);
  };

  const updateProject = (index, field, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='text-lg font-semibold text-gray-900'>Projects</h3>
          <p className='text-sm text-gray-500'>Add Your Projects</p>
        </div>

        {/* Add Button */}
        <button
          onClick={addProject}
          className='flex items-center gap-2 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors'
        >
          <Plus className="w-4 h-4 text-green-700" />
          Add Project
        </button>
      </div>

      {/* Empty State */}
      {data.length === 0 && (
        <p className="text-sm text-gray-500 mt-4">
          No projects added yet.
        </p>
      )}

      {/* Projects */}
      <div className='space-y-4 mt-6'>
        {data.map((project, index) => (
          <div key={index} className='p-4 border border-gray-200 rounded-lg space-y-3'>
            
            <div className='flex justify-between items-start'>
              <h4 className="font-medium">Project #{index + 1}</h4>

              <button
                onClick={() => removeProject(index)}
                className='text-red-500 hover:text-red-700'
              >
                <Trash2 className='w-4 h-4 text-red-500' />
              </button>
            </div>

            <div className='grid md:grid-cols-2 gap-3'>
              
              <input
                value={project.name || ""}
                onChange={(e) => updateProject(index, "name", e.target.value)}
                type='text'
                placeholder='Project Name'
                className='px-3 py-2 text-sm rounded-lg'
              />

              <input
                value={project.type || ""}
                onChange={(e) => updateProject(index, "type", e.target.value)}
                type='text'
                placeholder='Project Type'
                className='px-3 py-2 text-sm rounded-lg'
              />

              <textarea
                rows={4}
                value={project.description || ""}
                onChange={(e) => updateProject(index, "description", e.target.value)}
                placeholder='Describe your Project'
                className='md:col-span-2 px-3 py-2 text-sm rounded-lg'
              />
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectForm;