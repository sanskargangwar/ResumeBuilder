import {
  CrossIcon,
  FilePenLineIcon,
  LoaderCircleIcon,
  PencilIcon,
  PlusIcon,
  StepBack,
  StepBackIcon,
  TrashIcon,
  UploadCloudIcon,
} from "lucide-react";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import api from "../configs/api.js";
import pdfToText from "react-pdftotext";

const Dashboard = () => {

  const { token } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  const colors = [
    "#9333ea",
    "#d97706",
    "#dc2626",
    "#0284c7",
    "#16a34a",
  ];

  const [allResumes, setAllResumes] = useState([]);
  const [showCreateResume, setShowCreateResume] = useState(false);
  const [showUploadResume, setShowUploadResume] = useState(false);

  const [title, setTitle] = useState("");
  const [resume, setResume] = useState(null);

  const [editResumeId, setEditResumeId] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  // ================= LOAD RESUMES =================

  const loadAllResumes = async () => {

    try {

      const { data } = await api.get("/api/users/resumes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(data);

      setAllResumes(data?.resumes || []);

    } catch (error) {

      toast.error(
        error?.response?.data?.message || error.message
      );
    }
  };

  // ================= CREATE RESUME =================

  const createResume = async (e) => {

    e.preventDefault();

    try {

      const { data } = await api.post(
        "/api/resumes/create",
        { title },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAllResumes((prev) => [...prev, data.resume]);

      setTitle("");

      setShowCreateResume(false);

      toast.success("Resume Created");

      navigate(`/app/builder/${data.resume._id}`);

    } catch (error) {

      toast.error(
        error?.response?.data?.message || error.message
      );
    }
  };

  // ================= UPLOAD RESUME =================
  // here API is the httpslocalhost5173
  const uploadResume = async (e) => {

    e.preventDefault();

    if (!resume) {
      return toast.error("Please select resume file");
    }

    setIsLoading(true);

    try {

      const resumeText = await pdfToText(resume);

      const { data } = await api.post(
        "/api/ai/upload-resume",
        {
          title,
          resumeText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTitle("");
      setResume(null);

      setShowUploadResume(false);

      toast.success("Resume Uploaded");

      navigate(`/app/builder/${data.resumeId}`);

    } catch (error) {

      toast.error(
        error?.response?.data?.message || error.message
      );

    } finally {

      setIsLoading(false);
    }
  };

  // ================= EDIT TITLE =================

  const editTitle = async (e) => {

    e.preventDefault();

    try {

      const { data } = await api.put(
        "/api/resumes/update",
        {
          resumeId: editResumeId,
          resumeData: {
            title,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAllResumes((prev) =>
        prev.map((resume) =>
          resume._id === editResumeId
            ? { ...resume, title }
            : resume
        )
      );

      setTitle("");

      setEditResumeId("");

      toast.success(data.message);

    } catch (error) {

      toast.error(
        error?.response?.data?.message || error.message
      );
    }
  };

  // ================= DELETE RESUME =================

  const deleteResume = async (resumeId) => {

    try {

      const confirmDelete = window.confirm(
        "Delete this resume?"
      );

      if (!confirmDelete) return;

      const { data } = await api.delete(
        `/api/resumes/delete/${resumeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAllResumes((prev) =>
        prev.filter((resume) => resume._id !== resumeId)
      );

      toast.success(data.message);

    } catch (error) {

      toast.error(
        error?.response?.data?.message || error.message
      );
    }
  };

  // ================= USE EFFECT =================

  useEffect(() => {
    loadAllResumes();
  }, []);

  return (

    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* ================= TOP BUTTONS ================= */}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">

        {/* CREATE */}

        <div
          onClick={() => setShowCreateResume(true)}
          className="h-40 flex flex-col items-center justify-center border border-dashed rounded-xl cursor-pointer hover:shadow-lg transition"
        >
          <PlusIcon className="size-10 mb-2" />

          <p className="font-medium">
            Create Resume
          </p>
        </div>

        {/* UPLOAD */}

        <div
          onClick={() => setShowUploadResume(true)}
          className="h-40 flex flex-col items-center justify-center border border-dashed rounded-xl cursor-pointer hover:shadow-lg transition"
        >
          <UploadCloudIcon className="size-10 mb-2" />

          <p className="font-medium">
            Upload Existing
          </p>
        </div>
      </div>

      {/* ================= RESUME LIST ================= */}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-8">

        {allResumes?.map((resume, index) => {

          const baseColor = colors[index % colors.length];

          return (

            <div
              key={resume._id}
              onClick={() =>
                navigate(`/app/builder/${resume._id}`)
              }
              className="relative h-48 flex flex-col items-center justify-center rounded-xl border cursor-pointer hover:shadow-xl transition"
              style={{
                background: `linear-gradient(135deg, ${baseColor}15, ${baseColor}35)`,
                borderColor: `${baseColor}50`,
              }}
            >

              <FilePenLineIcon
                style={{ color: baseColor }}
                className="size-10 mb-3"
              />

              <p
                style={{ color: baseColor }}
                className="text-center px-2 font-semibold"
              >
                {resume.title}
              </p>

              <p
                className="text-xs mt-2"
                style={{ color: `${baseColor}90` }}
              >
                {new Date(
                  resume.updatedAt
                ).toLocaleDateString()}
              </p>

              {/* ACTIONS */}

              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute top-3 right-3 flex gap-2"
              >

                <TrashIcon
                  onClick={() =>
                    deleteResume(resume._id)
                  }
                  className="size-5 cursor-pointer hover:text-red-500"
                />

                <PencilIcon
                  onClick={() => {
                    setEditResumeId(resume._id);
                    setTitle(resume.title);
                  }}
                  className="size-5 cursor-pointer hover:text-blue-500"
                />

              </div>
            </div>
          );
        })}
      </div>

      {/* ================= CREATE MODAL ================= */}

      {showCreateResume && (

        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

          <div className="bg-white p-6 rounded-xl w-80 relative">

            {/* CLOSE BUTTON */}

            <button
              type="button"
              onClick={() => {
                setShowCreateResume(false);
                setTitle("");
              }}
              className="absolute top-3 right-3"
            >
              <StepBackIcon className="size-5 text-gray-500" />
            </button>

            <form onSubmit={createResume}>

              <h2 className="text-xl font-semibold mb-4">
                Create Resume
              </h2>

              <input
                required
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                className="border w-full p-2 rounded mb-4"
                placeholder="Enter resume title"
              />

              <button className="bg-green-600 hover:bg-green-700 text-white w-full py-2 rounded-lg">

                Create Resume

              </button>

            </form>
          </div>
        </div>
      )}

      {/* ================= UPLOAD MODAL ================= */}

      {showUploadResume && (

        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

          <div className="bg-white p-6 rounded-xl w-96 relative">

            {/* CLOSE BUTTON */}

            <button
              type="button"
              onClick={() => {
                setShowUploadResume(false);
                setTitle("");
                setResume(null);
              }}
              className="absolute top-3 right-3"
            >
              <StepBack className="size-5 text-gray-500" />
            </button>

            <form onSubmit={uploadResume}>

              <h2 className="text-xl font-semibold mb-4">

                Upload Resume

              </h2>

              {/* TITLE */}

              <input
                required
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                className="border w-full p-2 rounded mb-4"
                placeholder="My Resume"
              />

              {/* FILE SELECT */}

              <div className="border border-dashed rounded-xl p-6 text-center mb-5">

                <input
                  type="file"
                  accept=".pdf"
                  id="resumeFile"
                  hidden
                  onChange={(e) =>
                    setResume(e.target.files[0])
                  }
                />

                <label
                  htmlFor="resumeFile"
                  className="cursor-pointer"
                >

                  {resume ? (

                    <p className="text-green-600 font-medium">
                      {resume.name}
                    </p>

                  ) : (

                    <div>
                      <UploadCloudIcon className="mx-auto mb-2" />
                      <p>
                        Select Resume File
                      </p>
                    </div>
                  )}
                </label>
              </div>

              {/* BUTTON */}

              <button
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 text-white w-full py-2 rounded-lg flex items-center justify-center gap-2 disabled:opacity-70"
              >

                {isLoading && (
                  <LoaderCircleIcon className="animate-spin size-4" />
                )}

                {isLoading
                  ? "Uploading..."
                  : "Upload Resume"}

              </button>

            </form>
          </div>
        </div>
      )}

      {/* ================= EDIT MODAL ================= */}

      {editResumeId && (

        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

          <div className="bg-white p-6 rounded-xl w-80 relative">

            {/* CLOSE BUTTON */}

            <button
              type="button"
              onClick={() => {
                setEditResumeId("");
                setTitle("");
              }}
              className="absolute top-3 right-3"
            >
              <StepBackIcon className="size-5 text-gray-500" />
            </button>

            <form onSubmit={editTitle}>

              <h2 className="text-xl font-semibold mb-4">

                Edit Resume

              </h2>

              <input
                required
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                className="border w-full p-2 rounded mb-4"
              />

              <button className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded-lg">

                Update

              </button>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;