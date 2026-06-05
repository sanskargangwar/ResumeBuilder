import React, { useState,useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { dummyResumeData } from '../assets/assets';
import { ArrowLeftIcon } from 'lucide-react';
import ResumePreview from '../Components/ResumePreview';
import Loader from '../Components/Loader';
import api from '../configs/api';

const Preview = () => {
    const { resumeId } = useParams();
    const [resumeData, setResumeData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    const loadResume = async () =>{
       try {
        const {data} = await api.get('/api/resumes/public/' + resumeId)
        setResumeData(data.resume)
       } catch (error) {
        console.log(error.message);
       }
       finally{
        setIsLoading(false);
       }
    }

    useEffect(()=>{
        loadResume()
    },[resumeId])

    return resumeData ? (
        <div className='bg-slate-100'>
            <div className='max-w-3xl mx-auto py-10'>
                <ResumePreview 
                  data={resumeData} 
                  template={resumeData.template} 
                  accentColor={resumeData.accentColor} 
                  classes='py-4 bg-white'
                />
            </div>
        </div>
    ) : (
        <div>
            {isLoading ? <Loader/> :(
                <div>
                    <p className='text-center text-6xl text-slate-400 font-medium'>
                        Resume not found
                    </p>
                    <a href='/' className='mt-6 bg-green-500 text-white rounded-full px-6 h-9 flex items-center'>
                        <ArrowLeftIcon className='mr-2 size-4'/>
                        go to home page
                    </a>
                </div>
            )}
        </div>
    )
}

export default Preview;