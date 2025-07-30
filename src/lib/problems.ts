// src/lib/problems.ts
interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  starterCode: string;
  testCases: Array<{
    input: any;
    expected: any;
  }>;
  examples: Array<{
    input: any;
    output: any;
    explanation?: string;
  }>;
}

export const problems: Problem[] = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    description: 'Given an array of integers, return indices of the two numbers that add up to a specific target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
    difficulty: 'easy',
    starterCode: `function twoSum(nums: number[], target: number): number[] {\n  // Your code here\n};`,
    testCases: [
      { input: { nums: [2,7,11,15], target: 9 }, expected: [0,1] },
      { input: { nums: [3,2,4], target: 6 }, expected: [1,2] },
      { input: { nums: [3,3], target: 6 }, expected: [0,1] }
    ],
    examples: [
      {
        input: { nums: [2,7,11,15], target: 9 },
        output: [0,1],
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      {
        input: { nums: [3,2,4], target: 6 },
        output: [1,2],
        explanation: "Because nums[1] + nums[2] == 6, we return [1, 2]."
      }
    ]
  },
  {
    id: 'reverse-string',
    title: 'Reverse String',
    description: 'Write a function that reverses a string. The input string is given as an array of characters. You must do this by modifying the input array in-place with O(1) extra memory.',
    difficulty: 'easy',
    starterCode: `function reverseString(s: string[]): void {\n  // Your code here\n};`,
    testCases: [
      { input: ["h","e","l","l","o"], expected: ["o","l","l","e","h"] },
      { input: ["H","a","n","n","a","h"], expected: ["h","a","n","n","a","H"] }
    ],
    examples: [
      {
        input: ["h","e","l","l","o"],
        output: ["o","l","l","e","h"]
      },
      {
        input: ["H","a","n","n","a","h"],
        output: ["h","a","n","n","a","H"]
      }
    ]
  },
  {
    id: 'palindrome-number',
    title: 'Palindrome Number',
    description: 'Given an integer x, return true if x is a palindrome, and false otherwise.',
    difficulty: 'easy',
    starterCode: `function isPalindrome(x: number): boolean {\n  // Your code here\n};`,
    testCases: [
      { input: 121, expected: true },
      { input: -121, expected: false },
      { input: 10, expected: false }
    ],
    examples: [
      {
        input: 121,
        output: true,
        explanation: "121 reads as 121 from left to right and from right to left."
      },
      {
        input: -121,
        output: false,
        explanation: "From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome."
      }
    ]
  }
];