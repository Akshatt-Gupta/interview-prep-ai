import React, { useState } from 'react';
import { LuCopy, LuCheck, LuCode } from 'react-icons/lu';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

const AIResponsePreview = ({ content }) => {
    if (!content) return null;
    
    return (
        <div className="max-w-4xl mx-auto font-sans">
            <div className="prose prose-sm md:prose-base max-w-none text-gray-800">
                <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                        code({ node, inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || '');
                            const language = match ? match[1] : '';
                            const isInline = !className;
                            return !inline ? (
                                <CodeBlock code={String(children).replace(/\n$/, '')} language={language} />
                            ) : (
                                <code className="px-1.5 py-0.5 rounded bg-gray-100 text-sm font-mono" {...props}>
                                    {children}
                                </code>
                            );
                        },
                        
                        p({ children }) {
                            return <pre className="mb-4 leading-relaxed">{children}</pre>;
                        },
                        strong({ children }) {
                            return <strong className="font-semibold">{children}</strong>;
                        },
                        em({ children }) {
                            return <em className="italic">{children}</em>;
                        },
                        ul({ children }) {
                            return <ul className="list-disc pl-5 space-y-1 my-3">{children}</ul>;
                        },
                        ol({ children }) {
                            return <ol className="list-decimal pl-5 space-y-1 my-3">{children}</ol>;
                        },
                        li({ children }) {
                            return <li className="mb-1">{children}</li>;
                        },
                        blockquote({ children }) {
                            return (
                                <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4">
                                    {children}
                                </blockquote>
                            );
                        },
                        h1({ children }) {
                            return <h1 className="text-2xl font-bold mt-8 mb-4 text-gray-900">{children}</h1>;
                        },
                        h2({ children }) {
                            return <h2 className="text-xl font-bold mt-6 mb-3 text-gray-900">{children}</h2>;
                        },
                        h3({ children }) {
                            return <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-900">{children}</h3>;
                        },
                        h4({ children }) {
                            return <h4 className="text-base font-semibold mt-3 mb-2 text-gray-900">{children}</h4>;
                        },
                        a({ href, children }) {
                            return (
                                <a 
                                    href={href} 
                                    className="text-blue-600 hover:text-blue-800 hover:underline"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {children}
                                </a>
                            );
                        },
                        table({ children }) {
                            return (
                                <div className="overflow-x-auto my-4 rounded-lg border border-gray-200">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        {children}
                                    </table>
                                </div>
                            );
                        },
                        thead({ children }) {
                            return <thead className="bg-gray-50">{children}</thead>;
                        },
                        tbody({ children }) {
                            return <tbody className="divide-y divide-gray-200 bg-white">{children}</tbody>;
                        },
                        tr({ children }) {
                            return <tr>{children}</tr>;
                        },
                        th({ children }) {
                            return (
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {children}
                                </th>
                            );
                        },
                        td({ children }) {
                            return <td className="px-4 py-2 text-sm">{children}</td>;
                        },
                        hr() {
                            return <hr className="my-6 border-gray-200" />;
                        },
                        img({ src, alt }) {
                            return (
                                <img 
                                    src={src} 
                                    alt={alt} 
                                    className="my-4 max-w-full rounded-lg border border-gray-200"
                                    loading="lazy"
                                />
                            );
                        },
                    }}
                >
                    {content}
                </ReactMarkdown>
            </div>
        </div>
    );
};

function CodeBlock({ code, language }) {
    const [copied, setCopied] = useState(false);
    const copyCode = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className='relative my-4 rounded-lg overflow-hidden bg-gray-50 border border-gray-200'>
            <div className='flex items-center justify-between px-4 py-2 bg-gray-100 border-b border-gray-200'>
                <div className='flex items-center space-x-2'>
                    <LuCode size={16} className="text-gray-500"/>
                    <span className="text-xs font-medium text-gray-600">
                        {language || 'code'}
                    </span>
                </div>
                <button
                    onClick={copyCode}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
                    aria-label='Copy Code'
                >
                    {copied ? (
                        <LuCheck size={16} className="text-green-600"/>
                    ) : (
                        <LuCopy size={16}/>
                    )}
                </button>
            </div>
            <SyntaxHighlighter
                language={language}
                style={oneLight}
                customStyle={{ 
                    fontSize: '0.8125rem', // 13px
                    margin: 0,
                    padding: '1rem',
                    background: "transparent",
                    lineHeight: '1.5'
                }}
                showLineNumbers={code.split('\n').length > 5}
                lineNumberStyle={{ color: '#9CA3AF', minWidth: '2.25em' }}
            >
                {code}
            </SyntaxHighlighter>
        </div>
    );
}

export default AIResponsePreview;