'use client';

import { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  readOnly?: boolean;
}

export default function CodeEditor({ value, onChange, language, readOnly = false }: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const editorInstanceRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    if (editorRef.current) {
      // Configure Monaco environment
      if (typeof window !== 'undefined') {
        window.MonacoEnvironment = {
          getWorkerUrl: function (moduleId, label) {
            if (label === 'json') {
              return '/monaco-editor/min/vs/language/json/json.worker.js';
            }
            if (label === 'css' || label === 'scss' || label === 'less') {
              return '/monaco-editor/min/vs/language/css/css.worker.js';
            }
            if (label === 'html' || label === 'handlebars' || label === 'razor') {
              return '/monaco-editor/min/vs/language/html/html.worker.js';
            }
            if (label === 'typescript' || label === 'javascript') {
              return '/monaco-editor/min/vs/language/typescript/ts.worker.js';
            }
            return '/monaco-editor/min/vs/editor/editor.worker.js';
          }
        };
      }

      // Create the editor
      const editor = monaco.editor.create(editorRef.current, {
        value: value,
        language: language,
        theme: 'vs-dark',
        readOnly: readOnly,
        automaticLayout: true,
        minimap: { enabled: false },
        fontSize: 14,
        fontFamily: 'JetBrains Mono, Fira Code, Consolas, monospace',
        lineNumbers: 'on',
        glyphMargin: false,
        folding: false,
        lineDecorationsWidth: 0,
        lineNumbersMinChars: 3,
        scrollBeyondLastLine: false,
        roundedSelection: false,
        contextmenu: false,
        cursorStyle: 'line',
        cursorBlinking: 'blink',
        wordWrap: 'on',
        // Battle arena styling
        renderLineHighlight: 'gutter',
        selectionHighlight: false,
        occurrencesHighlight: false,
        codeLens: false,
        hover: { enabled: false },
        links: false,
        quickSuggestions: false,
        suggestOnTriggerCharacters: false,
        acceptSuggestionOnEnter: 'off',
        tabCompletion: 'off',
        wordBasedSuggestions: false,
        parameterHints: { enabled: false },
        autoClosingBrackets: 'always',
        autoClosingQuotes: 'always',
        autoSurround: 'languageDefined',
        scrollbar: {
          vertical: 'auto',
          horizontal: 'auto',
          useShadows: false,
          verticalScrollbarSize: 8,
          horizontalScrollbarSize: 8,
        }
      });

      editorInstanceRef.current = editor;

      // Listen for content changes
      const disposable = editor.onDidChangeModelContent(() => {
        const currentValue = editor.getValue();
        onChange(currentValue);
      });

      // Add some battle-specific key bindings
      editor.addAction({
        id: 'run-tests',
        label: 'Run Tests',
        keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
        run: () => {
          // This will be handled by parent component
          const event = new CustomEvent('run-tests');
          window.dispatchEvent(event);
        }
      });

      return () => {
        disposable.dispose();
        editor.dispose();
      };
    }
  }, []);

  // Update editor value when prop changes (for opponent's code sync)
  useEffect(() => {
    if (editorInstanceRef.current && editorInstanceRef.current.getValue() !== value) {
      const editor = editorInstanceRef.current;
      const position = editor.getPosition();
      editor.setValue(value);
      if (position) {
        editor.setPosition(position);
      }
    }
  }, [value]);

  // Update read-only state
  useEffect(() => {
    if (editorInstanceRef.current) {
      editorInstanceRef.current.updateOptions({ readOnly });
    }
  }, [readOnly]);

  return (
    <div className="h-full w-full relative">
      <div ref={editorRef} className="h-full w-full" />
      
      {readOnly && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center pointer-events-none">
          <div className="text-white text-xl font-bold animate-pulse">
            ⚔️ Battle Not Started ⚔️
          </div>
        </div>
      )}
    </div>
  );
}