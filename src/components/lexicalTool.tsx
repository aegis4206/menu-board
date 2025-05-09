import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { $createParagraphNode, $getRoot, EditorState } from 'lexical';
import { useEffect, useMemo, useRef } from 'react';
import LexicalToolPlugin from './lexicalToolPlugin';
import useDebounce from '../utils/debounce';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { Box, Paper, Typography } from '@mui/material';

interface ControlledEditorProps {
    value: string;
    onChange?: (value: string) => void;
    placeholder?: React.ReactNode;
    readOnly?: boolean;
}

function EditorContent({ value, readOnly }: { value: string, readOnly: boolean }) {
    const [editor] = useLexicalComposerContext();
    const hasInitialized = useRef(false);

    useEffect(() => {
        if (!hasInitialized.current) {
            editor.update(() => {
                const root = $getRoot();
                // 確保至少有一個空段落節點
                if (root.isEmpty()) {
                    const paragraph = $createParagraphNode();
                    root.append(paragraph);
                }
                // 處理初始值
                if (value) {
                    try {
                        const parsed = JSON.parse(value);
                        const editorState = editor.parseEditorState(parsed);
                        editor.setEditorState(editorState);
                    } catch (err) {
                        console.error('Failed to parse editor state:', err);
                    }
                }
            });
            hasInitialized.current = true;
        }
        if (readOnly && value) {
            try {
                const parsed = JSON.parse(value);
                const editorState = editor.parseEditorState(parsed);
                editor.setEditorState(editorState);
            } catch (err) {
                console.error('Failed to parse editor state:', err);
            }
        }
    }, [editor, value]);

    return null;
}

export default function LexicalTool({ value, onChange, readOnly = false }: ControlledEditorProps) {
    const initialConfig = useMemo(() => ({
        namespace: 'ControlledEditor',
        onError(error: Error) {
            throw error;
        },
        theme: {
            text: {
                bold: 'font-bold',
                italic: 'italic',
                underline: 'underline',
                strikethrough: 'line-through',
            }
        },
        editable: !readOnly,
        readOnly,
    }), [readOnly]);

    const handleEditorStateChange = (editorState: EditorState) => {
        const jsonString = JSON.stringify(editorState.toJSON());
        onChange?.(jsonString);
    };

    const debouncedEditorStateChange = useDebounce(handleEditorStateChange, 300);

    return (
        <LexicalComposer initialConfig={initialConfig}>
            <Paper elevation={readOnly ? 0 : 3} sx={{ p: 2, mb: 1, backgroundColor: readOnly ? '#f9f9f9' : '#fff' }}>
                {!readOnly && (
                    <Box mb={2}>
                        <LexicalToolPlugin />
                    </Box>
                )}
                <EditorContent value={value} readOnly={readOnly} />

                <Box
                    sx={{
                        position: 'relative',
                        minHeight: 150,
                        border: readOnly ? 'none' : '1px solid #ccc',
                        borderRadius: 1,
                        p: 1,
                        // backgroundColor: readOnly ? '#f9f9f9' : '#fff',
                        fontFamily: 'inherit',
                        cursor: 'text',
                        '& .editor-input': {

                        },
                        '&:focus-within': {
                            borderColor: 'primary.main',
                            boxShadow: 1,
                        },
                    }}

                    onClick={() => {
                        const el = document.querySelector('.editor-input') as HTMLElement;
                        if (el) {
                            el.focus();

                            // 對於某些 Android 手機，觸發一次點擊事件後 keyboard 仍不出現，因此強制聚焦後手動觸發 input 事件
                            if ('ontouchstart' in window) {
                                const event = new Event('touchend', { bubbles: true, cancelable: true });
                                el.dispatchEvent(event);
                            }
                        }
                    }}
                >
                    <RichTextPlugin
                        contentEditable={<ContentEditable style={{
                            position: 'relative', // 或不設
                            display: 'block', // 確保佔據空間
                            minHeight: '100%', // 保證高度
                            outline: 'none',
                            fontSize: '1rem',
                            lineHeight: '1.5',
                            cursor: 'text',
                        }} autoFocus className="editor-input" />}
                        placeholder={
                            <Typography
                                component="span"
                                variant="body1"
                                sx={{ color: 'text.secondary', opacity: 0.6, m: 0, position: 'absolute', top: 8 }}
                            >
                                請輸入內容...
                            </Typography>
                        }
                        ErrorBoundary={({ children }) => <div className="error">{children}</div>}
                    />
                </Box>

                {!readOnly && (
                    <OnChangePlugin
                        onChange={(editorState: EditorState) => {
                            debouncedEditorStateChange(editorState);
                        }}
                    />
                )}
                <HistoryPlugin />
            </Paper>
        </LexicalComposer>
    );
}
