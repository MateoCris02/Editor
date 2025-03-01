import React, { useState, useEffect, useRef } from 'react';
import { Split, Code, Eye, Download, Copy, RefreshCw } from 'lucide-react';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap, highlightActiveLine } from '@codemirror/view';
import { defaultKeymap } from '@codemirror/commands';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { autocompletion, completionKeymap } from '@codemirror/autocomplete';
import Swal from 'sweetalert2';

function App() {
  const [htmlCode, setHtmlCode] = useState('<div class="example">\n  <h1>Hello World</h1>\n  <p>Start editing to see changes</p>\n</div>');
  const [cssCode, setCssCode] = useState('.example {\n  background-color: #f0f0f0;\n  padding: 20px;\n  border-radius: 8px;\n  text-align: center;\n  font-family: Arial, sans-serif;\n}\n\nh1 {\n  color: #333;\n}\n\np {\n  color: #666;\n}');
  const [preview, setPreview] = useState('');
  const [activeTab, setActiveTab] = useState('html');
  const [isSplitView, setIsSplitView] = useState(true);
  
  const htmlEditorRef = useRef<HTMLDivElement>(null);
  const cssEditorRef = useRef<HTMLDivElement>(null);
  const htmlViewRef = useRef<EditorView | null>(null);
  const cssViewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    updatePreview();
  }, [htmlCode, cssCode]);

  useEffect(() => {
    // Initialize HTML editor
    if (htmlEditorRef.current && !htmlViewRef.current) {
      const startState = EditorState.create({
        doc: htmlCode,
        extensions: [
          keymap.of([...defaultKeymap, ...completionKeymap]),
          html(),
          autocompletion({
            override: [
              (context) => {
                let word = context.matchBefore(/\w*/);
                if (!word || word.from === word.to && !context.explicit) return null;
                return {
                  from: word.from,
                  options: [
                    { label: "div", type: "keyword" },
                    { label: "span", type: "keyword" },
                    { label: "p", type: "keyword" },
                    { label: "h1", type: "keyword" },
                    { label: "h2", type: "keyword" },
                    { label: "h3", type: "keyword" },
                    { label: "ul", type: "keyword" },
                    { label: "li", type: "keyword" },
                    { label: "a", type: "keyword" },
                    { label: "img", type: "keyword" },
                    { label: "button", type: "keyword" },
                    { label: "input", type: "keyword" },
                    { label: "form", type: "keyword" },
                    { label: "class", type: "attribute" },
                    { label: "id", type: "attribute" },
                    { label: "style", type: "attribute" },
                    { label: "href", type: "attribute" },
                    { label: "src", type: "attribute" },
                    { label: "alt", type: "attribute" },
                    { label: "type", type: "attribute" },
                  ]
                };
              }
            ]
          }),
          highlightActiveLine(),
          EditorView.theme({
            "&": {
              height: "100%",
              fontSize: "14px",
              backgroundColor: "#1f2937",
              color: "#e5e7eb"
            },
            ".cm-content": {
              fontFamily: "monospace",
              padding: "10px"
            },
            ".cm-cursor": {
              borderLeftColor: "#fff"
            },
            ".cm-activeLine": {
              backgroundColor: "#374151"
            },
            ".cm-gutters": {
              backgroundColor: "#1f2937",
              color: "#6b7280",
              border: "none"
            },
            ".cm-activeLineGutter": {
              backgroundColor: "#374151"
            },
            ".cm-selectionMatch": {
              backgroundColor: "#4b5563"
            },
            ".cm-tooltip": {
              backgroundColor: "#374151",
              border: "1px solid #4b5563",
              color: "#e5e7eb"
            },
            ".cm-tooltip-autocomplete": {
              "& > ul > li": {
                padding: "4px 8px"
              },
              "& > ul > li[aria-selected]": {
                backgroundColor: "#4b5563",
                color: "#e5e7eb"
              }
            }
          }),
          EditorView.updateListener.of(update => {
            if (update.docChanged) {
              setHtmlCode(update.state.doc.toString());
            }
          })
        ]
      });

      const view = new EditorView({
        state: startState,
        parent: htmlEditorRef.current
      });
      
      htmlViewRef.current = view;
    }

    // Initialize CSS editor
    if (cssEditorRef.current && !cssViewRef.current) {
      const startState = EditorState.create({
        doc: cssCode,
        extensions: [
          keymap.of([...defaultKeymap, ...completionKeymap]),
          css(),
          autocompletion({
            override: [
              (context) => {
                let word = context.matchBefore(/[\w-]*/);
                if (!word || word.from === word.to && !context.explicit) return null;
                return {
                  from: word.from,
                  options: [
                    { label: "background-color", type: "property" },
                    { label: "color", type: "property" },
                    { label: "font-family", type: "property" },
                    { label: "font-size", type: "property" },
                    { label: "font-weight", type: "property" },
                    { label: "margin", type: "property" },
                    { label: "padding", type: "property" },
                    { label: "border", type: "property" },
                    { label: "border-radius", type: "property" },
                    { label: "display", type: "property" },
                    { label: "flex", type: "property" },
                    { label: "grid", type: "property" },
                    { label: "position", type: "property" },
                    { label: "width", type: "property" },
                    { label: "height", type: "property" },
                    { label: "text-align", type: "property" },
                    { label: "text-decoration", type: "property" },
                    { label: "box-shadow", type: "property" },
                    { label: "transition", type: "property" },
                    { label: "transform", type: "property" },
                  ]
                };
              }
            ]
          }),
          highlightActiveLine(),
          EditorView.theme({
            "&": {
              height: "100%",
              fontSize: "14px",
              backgroundColor: "#1f2937",
              color: "#e5e7eb"
            },
            ".cm-content": {
              fontFamily: "monospace",
              padding: "10px"
            },
            ".cm-cursor": {
              borderLeftColor: "#fff"
            },
            ".cm-activeLine": {
              backgroundColor: "#374151"
            },
            ".cm-gutters": {
              backgroundColor: "#1f2937",
              color: "#6b7280",
              border: "none"
            },
            ".cm-activeLineGutter": {
              backgroundColor: "#374151"
            },
            ".cm-selectionMatch": {
              backgroundColor: "#4b5563"
            },
            ".cm-tooltip": {
              backgroundColor: "#374151",
              border: "1px solid #4b5563",
              color: "#e5e7eb"
            },
            ".cm-tooltip-autocomplete": {
              "& > ul > li": {
                padding: "4px 8px"
              },
              "& > ul > li[aria-selected]": {
                backgroundColor: "#4b5563",
                color: "#e5e7eb"
              }
            }
          }),
          EditorView.updateListener.of(update => {
            if (update.docChanged) {
              setCssCode(update.state.doc.toString());
            }
          })
        ]
      });

      const view = new EditorView({
        state: startState,
        parent: cssEditorRef.current
      });
      
      cssViewRef.current = view;
    }

    return () => {
      htmlViewRef.current?.destroy();
      cssViewRef.current?.destroy();
    };
  }, []);

  const updatePreview = () => {
    const combinedCode = `
      <html>
        <head>
          <style>${cssCode}</style>
        </head>
        <body>${htmlCode}</body>
      </html>
    `;
    setPreview(combinedCode);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    Swal.fire({
      title: '¡Copiado!',
      text: 'El código ha sido copiado al portapapeles',
      icon: 'success',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
      background: '#374151',
      color: '#e5e7eb',
      iconColor: '#10B981'
    });
  };

  const downloadCode = () => {
    const element = document.createElement('a');
    const file = new Blob([
      `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My HTML/CSS Project</title>
  <style>
${cssCode}
  </style>
</head>
<body>
${htmlCode}
</body>
</html>`
    ], { type: 'text/html' });
    element.href = URL.createObjectURL(file);
    element.download = 'index.html';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    Swal.fire({
      title: '¡Descargado!',
      text: 'Tu archivo ha sido descargado correctamente',
      icon: 'success',
      background: '#374151',
      color: '#e5e7eb',
      iconColor: '#10B981',
      confirmButtonColor: '#3B82F6',
      confirmButtonText: 'Genial'
    });
  };

  const resetCode = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción restablecerá todo tu código a los valores predeterminados',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, restablecer',
      cancelButtonText: 'Cancelar',
      background: '#374151',
      color: '#e5e7eb',
      iconColor: '#F59E0B'
    }).then((result) => {
      if (result.isConfirmed) {
        const defaultHtml = '<div class="example">\n  <h1>Cadastro Web</h1>\n  <p>Comience a escribir el código a tu producto!</p>\n</div>';
        const defaultCss = '.example {\n  background-color: #f0f0f0;\n  padding: 20px;\n  border-radius: 8px;\n  text-align: center;\n  font-family: Arial, sans-serif;\n}\n\nh1 {\n  color: #333;\n}\n\np {\n  color: #666;\n}';
        
        setHtmlCode(defaultHtml);
        setCssCode(defaultCss);
        
        if (htmlViewRef.current) {
          htmlViewRef.current.dispatch({
            changes: {
              from: 0,
              to: htmlViewRef.current.state.doc.length,
              insert: defaultHtml
            }
          });
        }
        
        if (cssViewRef.current) {
          cssViewRef.current.dispatch({
            changes: {
              from: 0,
              to: cssViewRef.current.state.doc.length,
              insert: defaultCss
            }
          });
        }
        
        Swal.fire({
          title: '¡Restablecido!',
          text: 'Tu código ha sido restablecido a los valores predeterminados',
          icon: 'success',
          background: '#374151',
          color: '#e5e7eb',
          iconColor: '#10B981'
        });
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 p-4 flex justify-between items-center border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <Code size={24} className="text-blue-400" />
          <h1 className="text-xl font-bold">Editor de Código | Cadastro Web </h1>
        </div>
        <div className="flex space-x-4">
          <button 
            onClick={() => {
              setIsSplitView(!isSplitView);
              if (isSplitView) {
                Swal.fire({
                  title: 'Vista previa oculta',
                  text: 'Puedes volver a mostrarla cuando quieras',
                  icon: 'info',
                  toast: true,
                  position: 'top-end',
                  showConfirmButton: false,
                  timer: 1500,
                  background: '#374151',
                  color: '#e5e7eb',
                  iconColor: '#3B82F6'
                });
              }
            }} 
            className="flex items-center space-x-1 px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 transition-colors"
          >
            <Split size={16} />
            <span>{isSplitView ? 'Hide Preview' : 'Show Preview'}</span>
          </button>
          <button 
            onClick={downloadCode} 
            className="flex items-center space-x-1 px-3 py-1 rounded bg-green-600 hover:bg-green-500 transition-colors"
          >
            <Download size={16} />
            <span>Descargar</span>
          </button>
          <button 
            onClick={resetCode} 
            className="flex items-center space-x-1 px-3 py-1 rounded bg-red-600 hover:bg-red-500 transition-colors"
          >
            <RefreshCw size={16} />
            <span>Reset</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Editor Section */}
        <div className={`flex flex-col ${isSplitView ? 'w-1/2' : 'w-full'}`}>
          {/* Tabs */}
          <div className="bg-gray-800 flex border-b border-gray-700">
            <button 
              className={`px-4 py-2 ${activeTab === 'html' ? 'bg-gray-700 text-blue-400' : 'hover:bg-gray-700'}`}
              onClick={() => setActiveTab('html')}
            >
              HTML
            </button>
            <button 
              className={`px-4 py-2 ${activeTab === 'css' ? 'bg-gray-700 text-blue-400' : 'hover:bg-gray-700'}`}
              onClick={() => setActiveTab('css')}
            >
              CSS
            </button>
          </div>

          {/* Code Editor */}
          <div className="flex-1 relative">
            <div 
              ref={htmlEditorRef}
              className={`w-full h-full ${activeTab === 'html' ? 'block' : 'hidden'}`}
            ></div>
            <div 
              ref={cssEditorRef}
              className={`w-full h-full ${activeTab === 'css' ? 'block' : 'hidden'}`}
            ></div>
            
            {/* Copy Button */}
            <button 
              onClick={() => copyToClipboard(activeTab === 'html' ? htmlCode : cssCode)}
              className="absolute top-2 right-2 p-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors z-10"
              title="Copy to clipboard"
            >
              <Copy size={16} />
            </button>
          </div>
        </div>

        {/* Preview Section */}
        {isSplitView && (
          <div className="w-1/2 flex flex-col border-l border-gray-700">
            <div className="bg-gray-800 px-4 py-2 flex items-center border-b border-gray-700">
              <Eye size={16} className="mr-2" />
              <span>Preview</span>
            </div>
            <div className="flex-1 bg-white">
              <iframe
                title="preview"
                srcDoc={preview}
                className="w-full h-full border-none"
                sandbox="allow-scripts"
              ></iframe>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 p-2 text-center text-sm text-gray-400 border-t border-gray-700">
        <p>Editor de Código de Cadastro Web - Mateo Cristaldo</p>
      </footer>
    </div>
  );
}

export default App;