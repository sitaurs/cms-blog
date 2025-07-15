import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link,
  Image,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
  placeholder = "Start writing your content...",
  className = ""
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none dark:prose-invert prose-purple focus:outline-none min-h-[300px] p-4',
      },
    },
  });

  if (!editor) {
    return null;
  }

  const ToolbarButton: React.FC<{
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title: string;
  }> = ({ onClick, isActive, disabled, children, title }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded-lg transition-colors duration-200 ${
        isActive
          ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400'
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {children}
    </button>
  );

  return (
    <div className={`border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 ${className}`}>
      {/* Toolbar */}
      <div className="border-b border-slate-300 dark:border-slate-600 p-3">
        <div className="flex flex-wrap gap-1">
          {/* Text Formatting */}
          <div className="flex items-center space-x-1 mr-4">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive('bold')}
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive('italic')}
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleStrike().run()}
              isActive={editor.isActive('strike')}
              title="Strikethrough"
            >
              <Strikethrough className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleCode().run()}
              isActive={editor.isActive('code')}
              title="Inline Code"
            >
              <Code className="w-4 h-4" />
            </ToolbarButton>
          </div>

          {/* Headings */}
          <div className="flex items-center space-x-1 mr-4">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              isActive={editor.isActive('heading', { level: 1 })}
              title="Heading 1"
            >
              <Heading1 className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              isActive={editor.isActive('heading', { level: 2 })}
              title="Heading 2"
            >
              <Heading2 className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              isActive={editor.isActive('heading', { level: 3 })}
              title="Heading 3"
            >
              <Heading3 className="w-4 h-4" />
            </ToolbarButton>
          </div>

          {/* Lists */}
          <div className="flex items-center space-x-1 mr-4">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive('bulletList')}
              title="Bullet List"
            >
              <List className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive('orderedList')}
              title="Numbered List"
            >
              <ListOrdered className="w-4 h-4" />
            </ToolbarButton>
          </div>

          {/* Quote */}
          <div className="flex items-center space-x-1 mr-4">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              isActive={editor.isActive('blockquote')}
              title="Quote"
            >
              <Quote className="w-4 h-4" />
            </ToolbarButton>
          </div>

          {/* Undo/Redo */}
          <div className="flex items-center space-x-1">
            <ToolbarButton
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              title="Undo"
            >
              <Undo className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              title="Redo"
            >
              <Redo className="w-4 h-4" />
            </ToolbarButton>
          </div>
        </div>

        {/* Second Row - Additional Tools */}
        <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-slate-200 dark:border-slate-600">
          <button
            onClick={() => {
              const url = window.prompt('Enter URL:');
              if (url) {
                editor.chain().focus().setLink({ href: url }).run();
              }
            }}
            className="flex items-center space-x-2 px-3 py-1 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg transition-colors duration-200"
          >
            <Link className="w-4 h-4" />
            <span>Link</span>
          </button>

          <button
            onClick={() => {
              const url = window.prompt('Enter image URL:');
              const alt = window.prompt('Enter alt text (optional):') || '';
              if (url) {
                // Insert image as HTML since Image extension is not available
                const imageHtml = `<img src="${url}" alt="${alt}" style="max-width: 100%; height: auto;" />`;
                editor.chain().focus().insertContent(imageHtml).run();
              }
            }}
            className="flex items-center space-x-2 px-3 py-1 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg transition-colors duration-200"
          >
            <Image className="w-4 h-4" />
            <span>Image</span>
          </button>

          <button
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className="px-3 py-1 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg transition-colors duration-200"
          >
            Horizontal Rule
          </button>

          <button
            onClick={() => editor.chain().focus().setHardBreak().run()}
            className="px-3 py-1 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg transition-colors duration-200"
          >
            Line Break
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="min-h-[300px]">
        <EditorContent 
          editor={editor} 
          className="text-slate-900 dark:text-slate-100"
        />
      </div>

      {/* Footer with word count */}
      <div className="border-t border-slate-300 dark:border-slate-600 px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-b-lg">
        <div className="flex justify-between items-center text-sm text-slate-500 dark:text-slate-400">
          <span>
            {editor.storage.characterCount?.characters() || 0} characters, {' '}
            {editor.storage.characterCount?.words() || 0} words
          </span>
          <div className="flex items-center space-x-4">
            <span>Use Markdown shortcuts like **bold** or ## heading</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RichTextEditor;
