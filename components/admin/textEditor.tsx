"use client";
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Color from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import { useEffect, useState, useCallback } from 'react';
import { Bold, Italic, List, ListOrdered, Link as LinkIcon, Undo, Redo } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type RichTextEditorProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const COLOR_OPTIONS = [
  { label: 'Red',    value: '#ef4444' },
  { label: 'Blue',   value: '#3b82f6' },
  { label: 'Green',  value: '#22c55e' },
  { label: 'Yellow', value: '#eab308' },
];

const ToolBtn = ({
  onClick, active, disabled = false, title, children,
}: {
  onClick: () => void
  active?: boolean
  disabled?: boolean
  title: string
  children: React.ReactNode
}) => (
  <button
    type="button"
    onMouseDown={(e) => {
      e.preventDefault(); // keeps editor focus & fires before blur so isActive is correct
      onClick();
    }}
    disabled={disabled}
    title={title}
    className={`
      cursor-pointer p-1.5 rounded transition-colors duration-100 text-gray-500
      hover:bg-gray-200 hover:text-gray-800
      active:scale-95
      disabled:opacity-30 disabled:cursor-not-allowed
      ${active ? 'bg-gray-200 text-gray-900' : ''}
    `}
  >
    {children}
  </button>
);

const MenuBar = ({
  editor,
  onLinkClick,
}: {
  editor: any
  onLinkClick: () => void
}) => {
  // Re-render on every editor transaction so active states are always in sync
  const [, forceUpdate] = useState(0);
  useEffect(() => {
    if (!editor) return;
    const handler = () => forceUpdate(n => n + 1);
    editor.on('transaction', handler);
    return () => editor.off('transaction', handler);
  }, [editor]);

  if (!editor) return null;

  const activeColor = COLOR_OPTIONS.find(c =>
    editor.isActive('textStyle', { color: c.value })
  )?.value;

  return (
    <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-gray-50 border-b border-gray-200">

      <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold">
        <Bold size={13} />
      </ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic">
        <Italic size={13} />
      </ToolBtn>

      <div className="w-px h-4 bg-gray-300 mx-1" />

      <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet List">
        <List size={13} />
      </ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Ordered List">
        <ListOrdered size={13} />
      </ToolBtn>
      <ToolBtn onClick={onLinkClick} active={editor.isActive('link')} title="Link">
        <LinkIcon size={13} />
      </ToolBtn>

      <div className="w-px h-4 bg-gray-300 mx-1" />

      {/* Color swatches */}
      <div className="flex items-center gap-1">
        {COLOR_OPTIONS.map(({ label, value }) => (
          <button
            type="button"
            key={value}
            onMouseDown={(e) => {
              e.preventDefault();
              if (activeColor === value) {
                editor.chain().focus().unsetColor().run();
              } else {
                editor.chain().focus().setColor(value).run();
              }
            }}
            title={label}
            style={{ backgroundColor: value }}
            className={`
              cursor-pointer w-4 h-4 rounded-full transition-all duration-100
              hover:scale-110
              ${activeColor === value
                ? 'ring-2 ring-offset-1 ring-gray-500 scale-110'
                : 'ring-1 ring-black/10'
              }
            `}
          />
        ))}
      </div>

      <div className="w-px h-4 bg-gray-300 mx-1" />

      <ToolBtn
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        title="Undo"
      >
        <Undo size={13} />
      </ToolBtn>
      <ToolBtn
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        title="Redo"
      >
        <Redo size={13} />
      </ToolBtn>
    </div>
  );
};

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const [mounted, setMounted] = useState(false);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');

  useEffect(() => { setMounted(true); }, []);

  const editor = useEditor({
    extensions: [
      // StarterKit v3 already bundles Link, BulletList, OrderedList, etc.
      // Configure Link via StarterKit instead of registering a duplicate extension.
      StarterKit.configure({
        link: {
          openOnClick: false,
          HTMLAttributes: {
            class: 'text-blue-600 underline cursor-pointer',
          },
        },
      }),
      TextStyle,
      Color,
    ],
    content: value,
    onUpdate: ({ editor }) => { onChange(editor.getHTML()); },
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'outline-none min-h-37.5 text-sm text-gray-800 leading-relaxed',
      },
    },
  });

  // Keep editor content in sync with external value — but only when the editor
  // is NOT focused, otherwise we'd reset the cursor on every keystroke as the
  // parent re-renders with the value we just emitted from onUpdate.
  useEffect(() => {
    if (!editor) return;
    if (editor.isFocused) return;
    if (value === editor.getHTML()) return;
    editor.commands.setContent(value, { emitUpdate: false });
  }, [value, editor]);

  const openLinkDialog = useCallback(() => {
    if (!editor) return;
    
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to, ' ');
    
    const existingUrl = editor.getAttributes('link').href ?? '';
    
    setLinkUrl(existingUrl);
    setLinkText(selectedText);
    setLinkDialogOpen(true);
  }, [editor]);

  const applyLink = () => {
    if (!editor) return;

    const trimmedUrl = linkUrl.trim();
    const trimmedText = linkText.trim() || trimmedUrl;

    // After inserting linked text, ProseMirror keeps the link mark in
    // "stored marks" so the next typed character would extend the link.
    // Clear it so the cursor escapes the link.
    const clearStoredLinkMark = () => {
      const linkMarkType = editor.schema.marks.link;
      if (!linkMarkType) return;
      const tr = editor.state.tr.removeStoredMark(linkMarkType);
      editor.view.dispatch(tr);
    };

    if (!trimmedUrl) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      const { from, to } = editor.state.selection;
      const hasSelection = from !== to;
      const isOnExistingLink = editor.isActive('link');

      if (isOnExistingLink) {
        // Editing an existing link — replace the whole link mark range with the new text/url.
        editor
          .chain()
          .focus()
          .extendMarkRange('link')
          .insertContent({
            type: 'text',
            text: trimmedText,
            marks: [{ type: 'link', attrs: { href: trimmedUrl } }],
          })
          .run();
        clearStoredLinkMark();
      } else if (hasSelection) {
        // There's a text selection — apply a link mark to it.
        editor.chain().focus().setLink({ href: trimmedUrl }).run();
        clearStoredLinkMark();
      } else {
        // No selection — insert the link text as a new linked node.
        editor
          .chain()
          .focus()
          .insertContent({
            type: 'text',
            text: trimmedText,
            marks: [{ type: 'link', attrs: { href: trimmedUrl } }],
          })
          .run();
        clearStoredLinkMark();
      }
    }

    setLinkDialogOpen(false);
    setLinkUrl('');
    setLinkText('');
  };

  const removeLink = () => {
    editor?.chain().focus().extendMarkRange('link').unsetLink().run();
    setLinkDialogOpen(false);
    setLinkUrl('');
    setLinkText('');
  };

  if (!mounted || !editor) return null;

  return (
    <>
      <div className="w-full border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden transition-all duration-200 focus-within:border-gray-400 focus-within:shadow-md">
        <MenuBar editor={editor} onLinkClick={openLinkDialog} />
        <div className={`
          px-3 py-2 relative
          [&_.tiptap]:outline-none
          [&_.tiptap_p]:my-0
          [&_.tiptap_ul]:my-0.5 [&_.tiptap_ul]:pl-5 [&_.tiptap_ul]:list-disc [&_.tiptap_ul]:list-outside
          [&_.tiptap_ul_li]:my-0 [&_.tiptap_ul_li_p]:my-0
          [&_.tiptap_ol]:my-0.5 [&_.tiptap_ol]:pl-5 [&_.tiptap_ol]:list-decimal [&_.tiptap_ol]:list-outside
          [&_.tiptap_ol_li]:my-0 [&_.tiptap_ol_li_p]:my-0
        `}>
          <EditorContent editor={editor} />
          {placeholder && !editor.getText() && (
            <div className="absolute top-2 left-3 text-gray-400 pointer-events-none text-sm italic">
              {placeholder}
            </div>
          )}
        </div>
      </div>

      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Insert Link</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="link-text">Text</Label>
              <Input
                id="link-text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="Text to display"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="link-url">URL</Label>
              <Input
                id="link-url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-between">
            <Button type="button" variant="outline" onClick={removeLink}>
              Remove Link
            </Button>
            <Button type="button" onClick={applyLink}>
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
