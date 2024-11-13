import React from 'react'
// import 'react-quill/dist/quill.snow.css'

interface CourseContentRendererProps {
  content: string
}

export default function CourseContentRenderer({ content }: CourseContentRendererProps) {
  return (
    <div className="prose mt-2 quill-content">
      <style jsx global>{`
        .quill-content {
          border: none !important;
        }
        .quill-content .ql-editor {
          padding: 0;
          border: none !important;
        }
        .quill-content p {
          margin-bottom: 1em;
        }
        .quill-content .ql-indent-1 {
          padding-left: 3em;
        }
        .quill-content .ql-indent-2 {
          padding-left: 6em;
        }
        .quill-content ol, 
        .quill-content ul {
          padding-left: 1.5em;
          margin-bottom: 1em;
          list-style-type: decimal;
        }
        .quill-content li {
          margin-bottom: 0.5em;
        }
        .quill-content li.ql-indent-1 {
          padding-left: 3em;
        }
        .quill-content li.ql-indent-2 {
          padding-left: 6em;
        }
        .quill-content strong {
          font-weight: bold;
        }
        .quill-content em {
          font-style: italic;
        }
        /* Remove any borders from the container */
        .quill-content > div {
          border: none !important;
        }
        /* Remove any outline or border from the content area */
        .ql-container {
          border: none !important;
        }
      `}</style>
      <div className="ql-editor" dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  )
}