import React from "react";

const RoleInfoHeader = ({ role, experience, topicToFocus, description, questions, lastUpdated }) => {
    return (
        <div className="bg-white relative">
            <div className="container mx-auto px-10 md:px-6">
                <div className="h-[200px] flex flex-col justify-center relative z-10">
                    <div className="flex items-start">
                        <div className="flex-grow"> {/* Fixed typo: flex-groq → flex-grow */}
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-2xl font-semibold">
                                        {role}
                                    </h1>
                                    <h2 className="text-2xl font-medium">
                                        <p className="text-sm text-medium text-gray-900 mt-1">
                                            {topicToFocus} {/* Added curly braces to render prop value */}
                                        </p>
                                    </h2>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 mt-4">
                        <div className="text-[10px] font-semibold text-white bg-black px-3 py-1 rounded-full">
                            Experience: {experience} {experience === 1 ? "year" : "years"}
                        </div>

                        <div className="text-[10px] font-semibold text-white bg-black px-3 py-1 rounded-full">
                            {questions} Q&A {/* Added curly braces */}
                        </div>

                        <div className="text-[10px] font-semibold text-white bg-black px-3 py-1 rounded-full">
                            Last updated: {lastUpdated} {/* Fixed syntax */}
                        </div>
                    </div>
                </div>

                <div className="absolute w-[40vw] md:w-[30vw] h-[200px] flex items-center justify-center bg-white overflow-hidden top-0 right-0">
                    <div className="w-16 h-16 bg-lime-400 blur-[65px] animate-blob1"/>
                    <div className="w-16 h-16 bg-teal-400 blur-[65px] animate-blob2"/>
                    <div className="w-16 h-16 bg-cyan-300 blur-[45px] animate-blob3"/>
                    <div className="w-16 h-16 bg-fuchsia-200 blur-[45px] animate-blob1"/> {/* Fixed spelling: fuschia → fuchsia */}
                </div>
            </div>
        </div>

        
    );
};

export default RoleInfoHeader;