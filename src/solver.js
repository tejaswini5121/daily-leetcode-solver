require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetch the daily LeetCode problem
 */
async function getDailyProblem() {
    const query = `
        query questionOfToday {
            activeDailyCodingChallengeQuestion {
                date
                userStatus
                link
                question {
                    questionFrontendId
                    title
                    titleSlug
                    content
                    difficulty
                    topicTags {
                        name
                    }
                    exampleTestcases
                }
            }
        }
    `;

    try {
        const response = await axios.post('https://leetcode.com/graphql', { query });
        const data = response.data.data.activeDailyCodingChallengeQuestion;

        return {
            date: data.date,
            title: data.question.title,
            titleSlug: data.question.titleSlug,
            difficulty: data.question.difficulty,
            content: data.question.content,
            link: `https://leetcode.com${data.link}`,
            topicTags: data.question.topicTags.map(tag => tag.name),
            exampleTestcases: data.question.exampleTestcases
        };
    } catch (error) {
        console.error('Error fetching daily problem:', error.message);
        throw error;
    }
}

/**
 * Clean HTML content from problem description
 */
function cleanHTML(html) {
    return html
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .trim();
}

/**
 * Use Google Gemini AI to generate a solution in a specific language
 * Implements multi-model fallback and retry logic
 */
async function generateSolution(problem, language, modelState) {
    const cleanContent = cleanHTML(problem.content);
    const prompt = `You are an expert programmer solving LeetCode problems. 

Problem: ${problem.title}
Difficulty: ${problem.difficulty}
Topics: ${problem.topicTags.join(', ')}
Link: ${problem.link}

Problem Description:
${cleanContent}

IMPORTANT: Generate ONLY executable ${language} code. Do NOT include any markdown formatting, code blocks, or text outside the code.

Your response must be a complete, runnable ${language} file that includes:
1. A header comment block with:
   - Brief problem summary (1-2 sentences, not the full description)
   - Link to the problem
   - Approach explanation
   - Time complexity analysis
   - Space complexity analysis
2. Well-commented, executable code with inline comments explaining the logic
3. All explanations must be inside code comments (${language === 'Python' ? '#' : '//'} or /* */)

Keep the problem summary concise since the full problem description is in the README.md file.

The file should be ready to copy-paste and run directly in a ${language} compiler/interpreter.`;

    const apiKey = process.env.GEMINI_API_KEY;

    // Array of models to try in order of preference
    // We try both v1 and v1beta versions for maximum compatibility
    const models = [
        { name: 'gemini-1.5-flash', version: 'v1' },
        { name: 'gemini-2.5-flash-lite', version: 'v1beta' },
        { name: 'gemini-2.5-flash', version: 'v1beta' },
        { name: 'gemini-3-flash', version: 'v1beta' },
        { name: 'gemini-robotics-er-1.5-preview', version: 'v1beta' },
        { name: 'gemma-3-27b', version: 'v1beta' },
        { name: 'gemma-3-12b', version: 'v1beta' },
        { name: 'gemma-3-4b', version: 'v1beta' },
        { name: 'gemma-3-2b', version: 'v1beta' }
    ];

    for (let i = modelState.index; i < models.length; i++) {
        modelState.index = i; // Update state to current model
        const model = models[i];
        let retries = 1; // Only 1 retry per model

        while (retries >= 0) {
            try {
                console.log(`   (Trying model: ${model.name} (${model.version})${retries < 1 ? `, retry 1` : ''})`);
                const url = `https://generativelanguage.googleapis.com/${model.version}/models/${model.name}:generateContent?key=${apiKey}`;

                const response = await axios.post(url, {
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }]
                }, {
                    headers: { 'Content-Type': 'application/json' },
                    timeout: 45000 // Increased timeout to 45 seconds
                });

                if (response.data && response.data.candidates && response.data.candidates.length > 0 &&
                    response.data.candidates[0].content && response.data.candidates[0].content.parts &&
                    response.data.candidates[0].content.parts.length > 0) {

                    const text = response.data.candidates[0].content.parts[0].text;
                    if (text && text.trim().length > 0) {
                        return text;
                    }
                }
                throw new Error('Empty or invalid API response structure');

            } catch (error) {
                const status = error.response ? error.response.status : null;

                if (status === 429) {
                    console.log(`   ⚠️ Rate limit hit for ${model.name}.`);
                    if (retries > 0) {
                        console.log(`   Waiting 10s before retry...`);
                        await sleep(10000);
                        retries--;
                        continue;
                    } else {
                        console.log(`   Moving to next model...`);
                        break; // Break retry loop, move to next model
                    }
                } else if (status === 500 || status === 503) {
                    console.log(`   ⚠️ Server error (${status}) for ${model.name}.`);
                    if (retries > 0) {
                        console.log(`   Waiting 5s before retry...`);
                        await sleep(5000);
                        retries--;
                        continue;
                    } else {
                        console.log(`   Moving to next model...`);
                        break;
                    }
                } else {
                    console.error(`   ❌ Error with ${model.name}: ${error.message}`);
                    if (error.response && error.response.data) {
                        console.error('   API Error Details:', JSON.stringify(error.response.data));
                    }
                    break; // Break retry loop, move to next model
                }
            }
        }
    }

    throw new Error(`Failed to generate ${language} solution after trying all available models.`);
}

/**
 * Save problem description
 */
function saveProblemDescription(problem, baseDir) {
    const filename = 'README.md';
    const filepath = path.join(baseDir, filename);

    const cleanContent = cleanHTML(problem.content);

    const fileContent = `# ${problem.title}

**Difficulty:** ${problem.difficulty}  
**Topics:** ${problem.topicTags.join(', ')}  
**Link:** ${problem.link}  
**Date:** ${problem.date}

---

## Problem Description

${cleanContent}

---

## Solutions

- [JavaScript Solution](./javascript/${problem.date}-${problem.titleSlug}.js)
- [Python Solution](./python/${problem.date}-${problem.titleSlug}.py)
- [Java Solution](./java/${problem.date}-${problem.titleSlug}.java)
- [C++ Solution](./cpp/${problem.date}-${problem.titleSlug}.cpp)

---

*Generated by AI on ${new Date().toISOString()}*
`;

    fs.writeFileSync(filepath, fileContent, 'utf8');
    console.log(`✅ Problem description saved to: README.md`);
}

/**
 * Save solution to file
 */
function saveSolution(problem, solution, language, baseDir) {
    const extensions = {
        'JavaScript': 'js',
        'Python': 'py',
        'Java': 'java',
        'C++': 'cpp'
    };

    const langDir = path.join(baseDir, language.toLowerCase() === 'c++' ? 'cpp' : language.toLowerCase());

    if (!fs.existsSync(langDir)) {
        fs.mkdirSync(langDir, { recursive: true });
    }

    const filename = `${problem.date}-${problem.titleSlug}.${extensions[language]}`;
    const filepath = path.join(langDir, filename);

    fs.writeFileSync(filepath, solution, 'utf8');
    return filepath;
}

/**
 * Main function
 */
async function main() {
    try {
        console.log('🚀 Starting Daily LeetCode Solver v1.1...\n');

        if (!process.env.GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY environment variable is not set');
        }

        console.log('📥 Fetching daily LeetCode problem...');
        const problem = await getDailyProblem();
        console.log(`✅ Found problem: ${problem.title} (${problem.difficulty})\n`);

        const baseDir = path.join(__dirname, '../solutions', problem.date);
        if (!fs.existsSync(baseDir)) {
            fs.mkdirSync(baseDir, { recursive: true });
        }

        console.log('📝 Saving problem description...');
        saveProblemDescription(problem, baseDir);

        const languages = ['JavaScript', 'Python', 'Java', 'C++'];
        const modelState = { index: 0 };

        for (const lang of languages) {
            console.log(`🤖 Generating ${lang} solution...`);
            try {
                const solution = await generateSolution(problem, lang, modelState);
                if (solution) {
                    saveSolution(problem, solution, lang, baseDir);
                    console.log(`   ✅ ${lang} solution saved`);
                } else {
                    console.error(`   ❌ Failed to generate ${lang} solution: Received empty response`);
                }
                await sleep(2000); // 2s delay between languages
            } catch (err) {
                console.error(`   ❌ Failed to generate ${lang} solution: ${err.message}`);
            }
        }

        console.log('\n✨ Done! All solutions ready for commit.');

    } catch (error) {
        console.error('❌ Fatal Error:', error.message);
        process.exit(1);
    }
}

main();
