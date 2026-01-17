'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Placeholder from '@tiptap/extension-placeholder'
import { common, createLowlight } from 'lowlight'
import { useEffect } from 'react'
import { EditorToolbar } from './EditorToolbar'

const lowlight = createLowlight(common)

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

export function RichTextEditor({ content, onChange, placeholder = 'Start writing...' }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // We use CodeBlockLowlight instead
      }),
      Underline,
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: parseContent(content),
    immediatelyRender: false, // Prevent SSR hydration mismatch
    editorProps: {
      attributes: {
        class: 'prose-editor focus:outline-none min-h-[200px] px-4 py-2',
      },
    },
    onUpdate: ({ editor }) => {
      const json = JSON.stringify(editor.getJSON())
      onChange(json)
    },
  })

  // Update editor content when content prop changes (e.g., switching notes)
  useEffect(() => {
    if (editor && content) {
      const currentContent = JSON.stringify(editor.getJSON())
      if (currentContent !== content) {
        const parsed = parseContent(content)
        editor.commands.setContent(parsed)
      }
    }
  }, [editor, content])

  return (
    <div className="flex flex-col h-full">
      <EditorToolbar editor={editor} />
      <div className="flex-1 overflow-y-auto">
        <EditorContent
          editor={editor}
          className="h-full"
        />
      </div>
    </div>
  )
}

function parseContent(content: string): Record<string, unknown> | string {
  if (!content) {
    return {
      type: 'doc',
      content: [{ type: 'paragraph' }]
    }
  }

  try {
    return JSON.parse(content)
  } catch {
    // If it's not valid JSON, treat as plain text and convert to TipTap format
    return convertPlainTextToTipTap(content)
  }
}

function convertPlainTextToTipTap(text: string): Record<string, unknown> {
  const paragraphs = text.split('\n').map(line => {
    if (line.trim() === '') {
      return { type: 'paragraph' }
    }
    return {
      type: 'paragraph',
      content: [{ type: 'text', text: line }]
    }
  })

  return {
    type: 'doc',
    content: paragraphs.length > 0 ? paragraphs : [{ type: 'paragraph' }]
  }
}
