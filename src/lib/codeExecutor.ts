// src/lib/codeExecutor.ts
export async function executeCode(code: string, testCases: any[], languageId = 63) { // 63 = JavaScript
  const apiKey = process.env.JUDGE0_API_KEY;
  
  if (!apiKey) {
    throw new Error('JUDGE0_API_KEY environment variable is not set');
  }

  const response = await fetch('https://judge0-ce.p.rapidapi.com/submissions/batch', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-RapidAPI-Key': apiKey,
      'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
    },
    body: JSON.stringify({
      submissions: testCases.map(testCase => ({
        source_code: code,
        language_id: languageId,
        stdin: JSON.stringify(testCase.input),
        expected_output: JSON.stringify(testCase.expected)
      }))
    })
  });

  return await response.json();
}