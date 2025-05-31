import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import { toast } from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";
import { LuCircleAlert, LuListCollapse, LuArrowUp } from "react-icons/lu";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import RoleInfoHeader from "../../components/RoleInfoHeader";
import SpinnerLoader from "../../components/Loader/SpinnerLoader";
import QuestionCard from "../../components/Cards/QuestionCard";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import AIResponsePreview from "../../components/AIResponsePreview";
import Drawer from "../../components/Loader/Drawer";
import SkeletonLoader from "../../components/Loader/SkeletonLoader";

const InterviewPrep = () => {
  const { sessionId } = useParams();
  const [session, setSession] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [openLearnMoreDrawer, setOpenLearnMoreDrawer] = useState(false);
  const [explanation, setExplanation] = useState({ title: '', content: '' });
  const [isExplanationLoading, setIsExplanationLoading] = useState(false);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const fetchSessionDetailsById = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.SESSION.GET_BY_ID(sessionId));
      if (response.data?.session) {
        setSession(response.data.session);
      }
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Failed to load session");
      toast.error(error.response?.data?.message || "Failed to load session details");
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  const generateMoreQuestions = async () => {
    try {
      setIsGeneratingQuestions(true);
      setErrorMsg("");
  
      // 1. Validate required data
      if (!sessionId) throw new Error("Session not loaded properly");
      if (!session?.role) throw new Error("Role information missing");
      if (!session?.experience) throw new Error("Experience level missing");
  
      // 2. Make API call to generate questions
      const { data: aiData } = await axiosInstance.post(
        API_PATHS.AI.GENERATE_QUESTIONS,
        {
          role: session.role,
          experience: session.experience,
          topicToFocus: session.topicToFocus || "general",
          numberOfQuestions: 10,
        }
      );
  
      // 3. Handle multiple possible response formats
      let questionsArray = [];
      
      // Case 1: Direct array response
      if (Array.isArray(aiData)) {
        questionsArray = aiData;
      }
      // Case 2: { questions: [] } format
      else if (aiData?.questions && Array.isArray(aiData.questions)) {
        questionsArray = aiData.questions;
      }
      // Case 3: { data: [] } format
      else if (aiData?.data && Array.isArray(aiData.data)) {
        questionsArray = aiData.data;
      }
      else {
        console.error("Unsupported response format:", aiData);
        throw new Error("AI service returned unexpected data format");
      }
  
      // 4. Validate and transform questions
      const validQuestions = questionsArray
        .map(q => ({
          question: q.question?.toString()?.trim() || "No question provided",
          answer: q.answer?.toString()?.trim() || "",
        }))
        .filter(q => q.question !== "No question provided");
  
      if (validQuestions.length === 0) {
        throw new Error("No valid questions were generated");
      }
  
      // 5. Save to session
      const { data: saveData } = await axiosInstance.post(
        API_PATHS.QUESTION.ADD_TO_SESSION,
        {
          sessionId,
          questions: validQuestions,
        }
      );
  
      if (!saveData?.success) {
        throw new Error(saveData?.message || "Failed to save questions");
      }
  
      // 6. Update UI
      toast.success(`Added ${validQuestions.length} new questions!`);
      fetchSessionDetailsById();
  
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          "Question generation failed";
      setErrorMsg(errorMessage);
      toast.error(errorMessage);
      console.error("Generation error:", {
        error,
        sessionId,
        session: session?.id,
      });
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  const toggleQuestionPinStatus = async (questionId) => {
    try {
      const response = await axiosInstance.post(API_PATHS.QUESTION.PIN(questionId));
      
      if (response.data?.success) {
        toast.success(response.data.message || "Pin status updated");
        fetchSessionDetailsById();
      } else {
        toast.error(response.data?.message || "Failed to update pin status");
      }
    } catch (error) {
      console.error("Error occurred:", error);
      toast.error(error.response?.data?.message || "Failed to update pin status");
    }
  };

  const generateConceptExplanation = async (question) => {
    try {
      setErrorMsg("");
      setExplanation({ title: '', content: '' });
      setIsExplanationLoading(true);
      setOpenLearnMoreDrawer(true);

      const response = await axiosInstance.post(API_PATHS.AI.GENERATE_EXPLANATION, { question });

      if (response.data?.success) {
        setExplanation({
          title: response.data.data?.title || question,
          content: response.data.data?.explanation || response.data.data?.content || response.data.data
        });
      } else {
        throw new Error(response.data?.error || "Invalid response format");
      }
    } catch (error) {
      const serverError = error.response?.data?.error;
      const message = serverError || error.message || "Failed to generate explanation";
      setErrorMsg(message);
      console.error("Error:", error);
    } finally {
      setIsExplanationLoading(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  useEffect(() => {
    if (sessionId) fetchSessionDetailsById();
    
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sessionId, fetchSessionDetailsById]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-screen">
          <SpinnerLoader />
        </div>
      </DashboardLayout>
    );
  }

  if (errorMsg && !openLearnMoreDrawer) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-screen">
          <p className="text-red-500">{errorMsg}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <RoleInfoHeader
        role={session?.role || ""}
        experience={session?.experience || ""}
        topicToFocus={session?.topicToFocus || ""}
        description={session?.description || ""}
        questions={session?.questions?.length || 0}
        lastUpdated={
          session?.updatedAt ? moment(session?.updatedAt).format("DD MMM YYYY") : "-"
        }
      />

      <div className="container mx-auto pt-4 px-4 md:px-0">
        <h2 className="text-lg font-semibold text-black">
          Interview Q&A
        </h2>
        <div className="grid grid-cols-12 gap-4 mt-5 mb-10">
          <div className={`col-span-12 ${openLearnMoreDrawer ? "md:col-span-7" : "md:col-span-8"}`}>
            {session?.questions?.length > 0 ? (
              <AnimatePresence>
                {[...session.questions]
                  .sort((a, b) => (a.isPinned === b.isPinned ? 0 : a.isPinned ? -1 : 1))
                  .map((data) => (
                    <motion.div
                      key={data._id}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 100, 
                        damping: 10 
                      }}
                      layout
                    >
                      <QuestionCard 
                        question={data.question}
                        answer={data.answer}
                        isPinned={data.isPinned}
                        onTogglePin={() => toggleQuestionPinStatus(data._id)}
                        onLearnMore={() => generateConceptExplanation(data.question)}
                      />
                    </motion.div>
                  ))}
              </AnimatePresence>
            ) : (
              <p className="text-gray-500 mb-4">No questions found yet</p>
            )}

            {/* Always visible Generate More button */}
            <div className="flex items-center justify-center mt-5">
              <button 
                className={`flex items-center gap-3 text-sm text-white font-medium bg-black px-5 py-2 rounded ${
                  isGeneratingQuestions ? 'opacity-75 cursor-not-allowed' : 'hover:bg-gray-800'
                }`}
                onClick={generateMoreQuestions}
                disabled={isGeneratingQuestions}
              >
                {isGeneratingQuestions ? (
                  <>
                    <SpinnerLoader size={20}/>
                    Generating Questions...
                  </>
                ) : (
                  <>
                    <LuListCollapse className="text-lg"/>
                    Generate More Questions
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Drawer Content */}
          <Drawer
            isOpen={openLearnMoreDrawer}
            onClose={() => setOpenLearnMoreDrawer(false)}
            title={explanation.title || "Concept Explanation"}
          >
            {errorMsg && (
              <p className="flex gap-2 text-sm text-amber-600 font-medium">
                <LuCircleAlert className="mt-1" />{errorMsg}
              </p>
            )}
            {isExplanationLoading && <SkeletonLoader />}
            {!isExplanationLoading && explanation.content && (
              <AIResponsePreview content={explanation.content} />
            )}
          </Drawer>
        </div>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 bg-black text-white rounded-full shadow-lg hover:bg-gray-800 transition-all"
          aria-label="Back to top"
        >
          <LuArrowUp size={20} />
        </button>
      )}
    </DashboardLayout>
  );
};

export default InterviewPrep;