import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ArrowLeftIcon,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  DownloadCloud,
  EyeIcon,
  EyeOffIcon,
  FileText,
  FolderIcon,
  GraduationCap,
  Share2Icon,
  Sparkles,
  User,
} from "lucide-react";
import PersonalInfoForm from "../Components/PersonalInfoForm";
import { dummyResumeData } from "../assets/assets"; // ✅ MISSING IMPORT FIX
import ResumePreview from "../Components/ResumePreview";
import TemplateSelector from "../Components/TemplateSelector";
import ColorPicker from "../Components/ColorPicker";
import ProfessionalSummary from "../Components/ProfessionalSummary";
import ExperienceForm from "../Components/ExperienceForm";
import EducationForm from "../Components/EducationForm";
import ProjectForm from "../Components/ProjectForm";
import SkillsForm from "../Components/SkillsForm";
import api from "../configs/api";
import toast from "react-hot-toast";

const ResumeBuilder = () => {
  const { resumeId } = useParams();
  const {token} = useSelector(state =>state.auth)
  const navigate = useNavigate();
  const [resumeData, setResumeData] = useState({
    id: "",
    title: "",
    personal_info: {},
    professional_summary: "",
    experience: [],
    education: [],
    project: [],
    skills: [],
    template: "classic",
    accent_color: "#3B82F6",
    public: false,
  });

  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [removeBackground, setRemoveBackground] = useState(false);

  const sections = [
    { id: "personal", name: "Personal Info", icon: User },
    { id: "summary", name: "Summary", icon: FileText },
    { id: "experience", name: "Experience", icon: Briefcase },
    { id: "education", name: "Education", icon: GraduationCap },
    { id: "projects", name: "Projects", icon: FolderIcon },
    { id: "skills", name: "Skills", icon: Sparkles },
  ];

  const activeSection = sections[activeSectionIndex];

  // ✅ LOAD RESUME
  const loadExistingResume = async() => {
    try {
      const {data} = await api.get('/api/resumes/get/'+ resumeId, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if(data.resume){
        setResumeData(data.resume)
        document.title = data.resume.title
      }
    } catch (error) {
      console.log(error.message);
      
    }
  };

  useEffect(() => {
    loadExistingResume();
  }, [resumeId]);

  const changeResumeVisibility = async () => {
    try {

      const formData = new FormData()
      formData.append("resumeId", resumeId)
      formData.append("resumeData", JSON.stringify({public: !resumeData.public}))

      const {data} = await api.put('/api/resumes/update',formData,{
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setResumeData({...resumeData, public: !resumeData.public})
      toast.success(data.message)
    } catch (error) {
      console.error("Error saving resume", error)
    }
  }


  const shareResume = ()=>{
    const frontendUrl = window.location.href.split('/app/')[0];
    const resumeUrl = frontendUrl + '/view/' + resumeId;

    if(navigator.share){
      navigator.share({url: resumeUrl, text: "My Resume"})
    }
    else{
      alert('share not supported on this browser')
    }
  }
  const downloadresume = ()=>{
    window.print();  
  }

  const saveResume = async()=>{
    try {
      let updatedResumeData = structuredClone(resumeData)

      // remove image from updatedResumeData
      if(typeof resumeData.personal_info.image === 'object'){
        delete updatedResumeData.personal_info.image
      }
      const formData = new FormData();
      formData.append("resumeId", resumeId)
      formData.append('resumeData', JSON.stringify(updatedResumeData))
      removeBackground && formData.append("removeBackGround", "yes");
      typeof resumeData.personal_info.image === 'object' && formData.append("image",resumeData.personal_info.image)

      const {data} = await api.put('/api/resumes/update',formData, 
        { headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setResumeData(data.resume)
      toast.success(data.message)
    } catch (error) {
      console.error(error);
      
    }
  }
  return (
    <div>
      {/* TOP BAR */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Link to="/app" className="flex items-center gap-2 text-sm">
          <ArrowLeftIcon className="size-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* LEFT PANEL */}
          <div className="relative lg:col-span-5">
            <div className="bg-white rounded-lg shadow-sm border p-6 pt-4 relative overflow-hidden">

              {/* PROGRESS BAR */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200"></div>

              <div
                className="absolute top-0 left-0 h-1 bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500"
                style={{
                  width: `${(activeSectionIndex / (sections.length - 1)) * 100
                    }%`,
                }}
              />

              {/* HEADER */}
              <div className="flex justify-between items-center mb-6 border-b pb-2">
                <h2 className="font-semibold text-lg">
                  {activeSection.name}
                </h2>
                <div className="flex justify-between items-center mb-6 border-b border-gray-300 py-1">
                  <TemplateSelector selectedTemplate={resumeData.template}
                    onChange={(template) => setResumeData(prev => ({ ...prev, template }))} />
                  <ColorPicker selectedColor={resumeData.accent_color}
                    onChange={(color) => setResumeData(prev => ({ ...prev, accent_color: color }))} />
                </div>
                <div className="flex items-center gap-2">
                  {/* PREVIOUS */}
                  <button
                    onClick={() =>
                      setActiveSectionIndex((prev) =>
                        Math.max(prev - 1, 0)
                      )
                    }
                    disabled={activeSectionIndex === 0}
                    className="flex items-center gap-1 px-3 py-1 text-sm rounded hover:bg-gray-100 disabled:opacity-50"
                  >
                    <ChevronLeft className="size-4" />
                    Prev
                  </button>

                  {/* NEXT */}
                  <button
                    onClick={() =>
                      setActiveSectionIndex((prev) =>
                        Math.min(prev + 1, sections.length - 1)
                      )
                    }
                    disabled={
                      activeSectionIndex === sections.length - 1
                    }
                    className="flex items-center gap-1 px-3 py-1 text-sm rounded hover:bg-gray-100 disabled:opacity-50"
                  >
                    Next
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>

              {/* FORM CONTENT */}
              <div className="space-y-6">
                {activeSection.id === "personal" && (
                  <PersonalInfoForm
                    data={resumeData.personal_info}
                    onChange={(data) => // ✅ FIX: onChange lowercase
                      setResumeData((prev) => ({
                        ...prev,
                        personal_info: data,
                      }))
                    }
                    removeBackground={removeBackground}
                    setRemoveBackground={setRemoveBackground}
                  />
                )}
                {activeSection.id === 'summary' && (
                  <ProfessionalSummary data={resumeData.professional_summary}
                    onChange={(data) => setResumeData(prev => ({ ...prev, professional_summary: data }))}
                    setResumeData={setResumeData}
                  />
                )}
                {activeSection.id === 'experience' && (
                  <ExperienceForm data={resumeData.experience}
                    onChange={(data) => setResumeData(prev => ({ ...prev, experience: data })
                    )}

                  />
                )}
                {activeSection.id === 'education' && (
                  <EducationForm data={resumeData.education}
                    onChange={(data) => setResumeData(prev => ({ ...prev, education: data })
                    )}

                  />
                )}
                {activeSection.id === 'projects' && (
                  <ProjectForm
                    data={resumeData.project}
                    onChange={(data) =>
                      setResumeData(prev => ({
                        ...prev,
                        project: data
                      }))
                    }
                  />
                )}
                {activeSection.id === 'skills' && (
                  <SkillsForm
                    data={resumeData.skills}
                    onChange={(data) =>
                      setResumeData(prev => ({
                        ...prev,
                        skills: data
                      }))
                    }
                  />
                )}
              </div>
              <button onClick={()=>{toast.promise(saveResume, {loading: 'Saving...'})}}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md mt-6 text-sm font-medium transition"
              >
                Save Changes
              </button>
            </div>
          </div>

          {/* RIGHT PANEL (PREVIEW) */}
          <div className="lg:col-span-7 max-lg:mt-6">
            <div className="relative w-full">
              <div className="absolute bottom-3 left-0 right-0 flex items-center 
             justify-end gap-2">
                {resumeData.public && (
                  <button onClick={shareResume} className=" flex items-center p-2 px-4 gap-2 text-x5
                  bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600
                  rounded-lg ring-blue-300 hover:ring transitions-colors">
                    <Share2Icon className="size-4" /> Share 
                  </button>
                )}
                <button onClick={changeResumeVisibility} className="flex items-center p-2 px-4 gap-2 text-xs
                bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600
                ring-purple-300 rounded-lg hover:ring transitions-colors">
                  {resumeData.public ? <EyeIcon className="size-4" /> : <EyeOffIcon className="size-4" />}
                  {resumeData.public ? 'Public' : 'Private'}
                </button>
                <button onClick={downloadresume} className="flex items-center gap-2 px-6 py-2 text-xs bg-gradient-to-br from-green-100
                to-green-200 text-green rounded-lg ring-green-300 hover:ring transition-colors">
                  <DownloadCloud className="size-4" /> Download
                </button>
              </div>
            </div>
            {/* resume preview */}
            <ResumePreview data={resumeData} template={resumeData.template}
              accentColor={resumeData.accent_color} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;