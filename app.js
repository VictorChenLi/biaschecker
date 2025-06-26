import React, { useState } from 'react';

// Translation object for UI texts
const translations = {
    en: {
        title: "Bias Check",
        tagline: "Enter any topic or article URL to get summarized viewpoints from both left-leaning and right-leaning perspectives, helping you combat information bias.",
        inputPlaceholder: "e.g., 'climate change policy' or paste an article URL",
        getPerspectivesButton: "Get Perspectives",
        analyzingButton: "Analyzing...",
        leftPerspectiveHeading: "Left Perspective",
        rightPerspectiveHeading: "Right Perspective",
        articleSummaryHeading: "Article Summary",
        errorMessage: "Error!",
        fetchErrorMessage: "Failed to get a valid response from the AI. Please try again.",
        parseErrorMessage: "Failed to understand the data from the AI. The AI may not have provided the perspectives in the correct format. Showing the raw response below.",
        networkErrorMessage: "An error occurred: {{message}}. Please check your network connection or try again later.",
        urlFetchError: "Failed to fetch content from the provided URL. Please check the URL and try again.",
        footerText: "Built with GenAI to promote balanced understanding.",
        languageLabel: "Language:",
        englishOption: "English",
        chineseOption: "中文", // Displayed in the toggle
        biasSlider: {
            left: "Left",
            center: "Center",
            right: "Right"
        }
    },
    zh: {
        title: "兼听则明",
        tagline: "输入任何主题或文章网址，即可获取左翼和右翼观点的总结，助您消除信息偏见。",
        inputPlaceholder: "例如：'气候变化政策' 或 粘贴文章网址",
        getPerspectivesButton: "获取观点",
        analyzingButton: "分析中...",
        leftPerspectiveHeading: "左翼观点",
        rightPerspectiveHeading: "右翼观点",
        articleSummaryHeading: "文章摘要",
        errorMessage: "错误！",
        fetchErrorMessage: "未能从AI获取有效响应。请重试。",
        parseErrorMessage: "未能理解来自AI的数据。 AI可能未能正确提供观点。下面显示原始响应。",
        networkErrorMessage: "发生错误：{{message}}。请检查您的网络连接或稍后再试。",
        urlFetchError: "无法从提供的网址获取内容。请检查网址后重试。",
        footerText: "由GenAI构建，旨在促进平衡理解。",
        languageLabel: "语言：",
        englishOption: "英语",
        chineseOption: "中文", // Displayed in the toggle
        biasSlider: {
            left: "左",
            center: "中",
            right: "右"
        }
    }
};

// Main App component
const App = () => {
    // State for the current UI language, defaults to Chinese
    const [uiLanguage, setUiLanguage] = useState('zh');
    // Get translations based on the current UI language
    const t = translations[uiLanguage];

    // State to store the user's input topic or URL
    const [topic, setTopic] = useState('');
    // State to store the summary of the fetched article
    const [articleSummary, setArticleSummary] = useState('');
    // State for article bias score
    const [biasScore, setBiasScore] = useState(null);
    // State to store the generated left perspective summary
    const [leftPerspective, setLeftPerspective] = useState('');
    // State to store the generated right perspective summary
    const [rightPerspective, setRightPerspective] = useState('');
    // State to manage loading status during API calls
    const [isLoading, setIsLoading] = useState(false);
    // State to store any error messages
    const [error, setError] = useState('');

    /**
     * Handles the form submission to fetch perspectives from the AI.
     * It now detects if the input is a URL, fetches its content, and uses that for analysis.
     */
    const fetchPerspectives = async () => {
        // Clear previous results and errors
        setArticleSummary('');
        setBiasScore(null);
        setLeftPerspective('');
        setRightPerspective('');
        setError('');
        // Set loading state to true
        setIsLoading(true);

        try {
            const promptLanguage = uiLanguage === 'zh' ? 'Chinese' : 'English';
            let finalPrompt;
            let responseSchema;

            // Simple regex to check for a URL pattern
            const urlRegex = /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,6}\.?)(\/[\w.-]*)*\/?$/i;
            const isUrl = urlRegex.test(topic);

            // If the input is a URL, fetch its content
            if (isUrl) {
                // Define a schema that includes the article summary and a bias score
                responseSchema = {
                    type: 'OBJECT',
                    properties: {
                        articleSummary: { type: 'STRING' },
                        biasScore: { type: 'NUMBER' },
                        leftPerspective: { type: 'OBJECT', properties: { summary: { type: 'STRING' } }, required: ['summary'] },
                        rightPerspective: { type: 'OBJECT', properties: { summary: { type: 'STRING' } }, required: ['summary'] },
                    },
                    required: ['articleSummary', 'biasScore', 'leftPerspective', 'rightPerspective']
                };

                try {
                    // Using a more reliable CORS proxy to bypass browser security restrictions for fetching content.
                    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(topic)}`;
                    const response = await fetch(proxyUrl);
                    if (!response.ok) throw new Error(`Network response was not ok, status: ${response.status}`);
                    
                    const htmlContent = await response.text();
                    
                    // Create a temporary element to parse HTML and extract text content.
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = htmlContent;
                    // Remove script and style tags to clean up the content
                    tempDiv.querySelectorAll('script, style').forEach(el => el.remove());
                    const textContent = tempDiv.textContent || tempDiv.innerText || "";
                    
                    // Limit the content length to avoid an overly long prompt for the AI.
                    const analysisTopic = textContent.replace(/\s\s+/g, ' ').trim().substring(0, 5000);

                    // Create a prompt that asks for an article summary AND the two perspectives.
                    finalPrompt = `
Act as an expert political analyst. The following is the text content of an article. Your tasks are:
1. Provide a concise, neutral summary of the article's main points.
2. Analyze the article for political bias and provide a score from -100 (strongly left-leaning) to 100 (strongly right-leaning), where 0 represents a neutral view.
3. Analyze the article's content and provide a balanced summary of the key arguments from both a left-leaning and a right-leaning perspective.

All parts of your response must be in ${promptLanguage}.

Article Text: "${analysisTopic}"

Your final output must be a single JSON object adhering to the specified schema. Do not include any other text or explanation outside of the JSON object.`;

                } catch (err) {
                    console.error("URL fetch error:", err);
                    setError(t.urlFetchError);
                    setIsLoading(false);
                    return; // Stop execution if URL fetch fails
                }
            } else {
                // If not a URL, use the original schema and prompt
                responseSchema = {
                    type: 'OBJECT',
                    properties: {
                        leftPerspective: { type: 'OBJECT', properties: { summary: { type: 'STRING' } }, required: ['summary'] },
                        rightPerspective: { type: 'OBJECT', properties: { summary: { type: 'STRING' } }, required: ['summary'] },
                    },
                    required: ['leftPerspective', 'rightPerspective']
                };

                finalPrompt = `
Act as an expert political analyst. Your task is to provide a balanced overview of the topic "${topic}" from both left-leaning and right-leaning perspectives, in ${promptLanguage}.

Write a distinct summary for each perspective. The summary should reflect the key points, arguments, and tone you would expect to find for each side regarding "${topic}".

Your final output must be a single JSON object adhering to the specified schema. Do not include any other text or explanation outside of the JSON object.`;
            }

            // Prepare the payload for the Gemini API call
            const payload = {
                contents: [{ role: "user", parts: [{ text: finalPrompt }] }],
                generationConfig: {
                    responseMimeType: "application/json",
                    responseSchema: responseSchema,
                },
            };
            
            const apiKey = "";
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            // Process the AI's response
            if (result.candidates && result.candidates[0]?.content?.parts?.[0]) {
                const jsonText = result.candidates[0].content.parts[0].text;
                try {
                    const data = JSON.parse(jsonText);
                    if (data.leftPerspective && data.rightPerspective) {
                        setArticleSummary(data.articleSummary || '');
                        setBiasScore(data.biasScore !== undefined ? data.biasScore : null);
                        setLeftPerspective(data.leftPerspective.summary || '');
                        setRightPerspective(data.rightPerspective.summary || '');
                    } else {
                        throw new Error("Parsed JSON does not contain the expected properties.");
                    }
                } catch (e) {
                    setError(t.parseErrorMessage);
                    setLeftPerspective("Raw AI Response (failed to parse):\n" + jsonText);
                    setRightPerspective("");
                    console.error("Failed to parse or validate AI JSON response:", e, jsonText);
                }
            } else {
                setError(t.fetchErrorMessage);
                console.error("AI API response structure unexpected:", result);
            }
        } catch (err) {
            setError(t.networkErrorMessage.replace('{{message}}', err.message));
            console.error("Fetch error:", err);
        } finally {
            setIsLoading(false);
        }
    };
    
    // Helper to get slider indicator color based on score
    const getIndicatorStyle = (score) => {
        if (score < -15) return 'bg-blue-500 border-blue-700';
        if (score > 15) return 'bg-red-500 border-red-700';
        return 'bg-gray-500 border-gray-700';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 font-inter text-gray-800 flex flex-col items-center justify-center">
            <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-10 w-full max-w-4xl border border-gray-200 relative">
                
                {/* Language Toggle in top-right corner */}
                <div className="absolute top-4 right-4 md:top-6 md:right-6 flex items-center">
                    <span className={`text-sm font-semibold transition-colors ${uiLanguage === 'en' ? 'text-blue-600' : 'text-gray-500'}`}>
                        {t.englishOption}
                    </span>
                    <label htmlFor="language-toggle" className="flex items-center cursor-pointer mx-2">
                        <div className="relative">
                            <input
                                type="checkbox"
                                id="language-toggle"
                                className="sr-only"
                                checked={uiLanguage === 'zh'}
                                onChange={() => setUiLanguage(uiLanguage === 'en' ? 'zh' : 'en')}
                            />
                            <div className="block bg-gray-300 w-12 h-7 rounded-full"></div>
                            <div className={`dot absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform transform ${uiLanguage === 'zh' ? 'translate-x-full bg-blue-600' : ''}`}></div>
                        </div>
                    </label>
                    <span className={`text-sm font-semibold transition-colors ${uiLanguage === 'zh' ? 'text-blue-600' : 'text-gray-500'}`}>
                        {t.chineseOption}
                    </span>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                    {t.title}
                </h1>
                <p className="text-center text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                    {t.tagline}
                </p>


                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder={t.inputPlaceholder}
                        className="flex-grow p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent text-lg transition duration-200 ease-in-out hover:border-blue-400"
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' && topic.trim()) {
                                fetchPerspectives();
                            }
                        }}
                    />
                    <button
                        onClick={fetchPerspectives}
                        disabled={isLoading || !topic.trim()}
                        className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-purple-600 transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {t.analyzingButton}
                            </span>
                        ) : t.getPerspectivesButton}
                    </button>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-8" role="alert">
                        <strong className="font-bold">{t.errorMessage}</strong>
                        <span className="block sm:inline ml-2">{error}</span>
                    </div>
                )}
                
                {/* Article Summary Section - only shows if summary exists */}
                {articleSummary && (
                     <div className="bg-gray-50 p-6 rounded-xl shadow-lg border-l-4 border-gray-500 hover:shadow-xl transition-shadow duration-300 mb-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-x-6 gap-y-4 mb-4">
                            <h2 className="text-2xl font-bold text-gray-800 flex items-center whitespace-nowrap flex-shrink-0">
                               <svg className="w-6 h-6 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                {t.articleSummaryHeading}
                            </h2>
                            
                            {/* Bias Slider */}
                            {biasScore !== null && (
                                <div className="w-full sm:w-auto sm:flex-grow min-w-[200px]">
                                    <div className="relative h-3 w-full rounded-full bg-gradient-to-r from-blue-500 via-gray-300 to-red-500 shadow-inner">
                                        <div
                                            className={`group absolute top-1/2 h-6 w-6 rounded-full shadow-lg border-2 -translate-y-1/2 transition-all duration-500 ${getIndicatorStyle(biasScore)}`}
                                            style={{ left: `calc(${(biasScore + 100) / 2}% - 12px)` }}
                                        >
                                            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block px-2 py-1 bg-gray-800 text-white text-xs rounded-md shadow-lg whitespace-nowrap">
                                                {biasScore.toFixed(0)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between text-xs font-medium text-gray-500 mt-1.5">
                                        <span>{t.biasSlider.left}</span>
                                        <span>{t.biasSlider.center}</span>
                                        <span>{t.biasSlider.right}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap mt-4 border-t pt-4">{articleSummary}</p>
                    </div>
                )}


                {/* Perspectives Display */}
                {(leftPerspective || rightPerspective) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                        <div className="bg-blue-50 p-6 rounded-xl shadow-lg border-l-4 border-blue-500 hover:shadow-xl transition-shadow duration-300">
                            <h2 className="text-2xl font-bold text-blue-800 mb-4 flex items-center">
                                <svg className="w-6 h-6 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"></path></svg>
                                {t.leftPerspectiveHeading}
                            </h2>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-4">{leftPerspective}</p>
                        </div>
                        <div className="bg-red-50 p-6 rounded-xl shadow-lg border-l-4 border-red-500 hover:shadow-xl transition-shadow duration-300">
                            <h2 className="text-2xl font-bold text-red-800 mb-4 flex items-center">
                                <svg className="w-6 h-6 mr-2 text-red-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                {t.rightPerspectiveHeading}
                            </h2>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-4">{rightPerspective}</p>
                        </div>
                    </div>
                )}
            </div>
            <footer className="mt-8 text-gray-500 text-sm text-center">
                {t.footerText}
            </footer>
        </div>
    );
};

export default App;
