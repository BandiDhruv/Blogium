import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import { BubbleMenu } from '@tiptap/react';
import Placeholder from '@tiptap/extension-placeholder';

interface TextEditorProps {
    onChange: (value: string) => void;
    label: string;
    className?:string,
    placeholder:string,
  }
  
  export function TextEditor({ onChange, label,className='',placeholder }: TextEditorProps) {
    const editor = useEditor({
        extensions: [StarterKit,
            Underline,
            Link,
            Superscript,
            SubScript,
            Highlight,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Placeholder.configure({placeholder:placeholder})
        ],
        content: '',
        onUpdate:({editor})=>{
            const html=editor.getHTML();
            onChange(html);
        }
    });

    return (
        <>
            <label className={`block mb-1 text-[#000000] ${label==='Title'?' text-[1.75rem] font-medium ':label==='Post'?' text-[3.5rem] font-extralarge ':'text-[1rem] font-small'} `}>
                {label}
            </label>
            <RichTextEditor  editor={editor} className={className}>
                {editor && (
                    <BubbleMenu editor={editor}>
                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Bold />
                            <RichTextEditor.Italic />
                            <RichTextEditor.Underline />
                            <RichTextEditor.Strikethrough />
                            <RichTextEditor.ClearFormatting />
                            <RichTextEditor.Highlight />
                            <RichTextEditor.Code />
                            <RichTextEditor.H1 />
                            <RichTextEditor.H2 />
                            <RichTextEditor.H3 />
                            <RichTextEditor.H4 />
                            <RichTextEditor.Blockquote />
                            <RichTextEditor.Hr />
                            <RichTextEditor.BulletList />
                            <RichTextEditor.OrderedList />
                            <RichTextEditor.Subscript />
                            <RichTextEditor.Superscript />
                            <RichTextEditor.Link />
                            <RichTextEditor.Unlink />
                            <RichTextEditor.AlignLeft />
                            <RichTextEditor.AlignCenter />
                            <RichTextEditor.AlignJustify />
                            <RichTextEditor.AlignRight />
                            <RichTextEditor.Undo />
                            <RichTextEditor.Redo />
                        </RichTextEditor.ControlsGroup>
                    </BubbleMenu>
                )}
                <RichTextEditor.Content />
            </RichTextEditor>
        </>
    );
}