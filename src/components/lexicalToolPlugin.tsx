import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
    $getSelection,
    $isRangeSelection,
    FORMAT_TEXT_COMMAND,
    TextNode,
    $isTextNode,
    $isElementNode,
    LexicalNode,
} from 'lexical';
import useDebounce from '../utils/debounce';
import { Button, FormControl, Input, InputLabel, Select, SelectChangeEvent, Stack } from '@mui/material';
import { useState } from 'react';
import { FaBold, FaItalic, FaStrikethrough, FaUnderline } from 'react-icons/fa';

export default function LexicalToolPlugin() {
    const [editor] = useLexicalComposerContext();
    const [color, setColor] = useState('#000000');
    const [fontSize, setFontSize] = useState('');

    // 遞歸獲取所有 TextNode
    const getAllTextNodes = (node: LexicalNode): TextNode[] => {
        const textNodes: TextNode[] = [];
        if ($isTextNode(node)) {
            textNodes.push(node as TextNode);
        } else if ($isElementNode(node)) {
            node.getChildren().forEach((child) => {
                textNodes.push(...getAllTextNodes(child));
            });
        }
        return textNodes;
    };

    const applyStyle = (key: string, value: string) => {
        editor.update(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) {
                console.log('No valid range selection');
                return;
            }
            // 獲取選區中的所有節點
            const nodes = selection.getNodes();
            const textNodes: TextNode[] = [];
            nodes.forEach((node) => {
                textNodes.push(...getAllTextNodes(node));
            });

            if (textNodes.length === 0) {
                console.log('No text nodes found in selection');
                return;
            }

            console.log('Applying style:', { key, value, textNodes });
            textNodes.forEach((node) => {
                const currentStyle = node.getStyle();
                const styleObj = parseStyle(currentStyle);
                styleObj[key] = value;
                const updatedStyle = convertStyleToString(styleObj);
                node.setStyle(updatedStyle);
                console.log('Updated node style:', updatedStyle);
            });
        });
    };

    const parseStyle = (style: string): Record<string, string> => {
        const styleObj: Record<string, string> = {};
        if (!style) return styleObj;
        const styleArray = style.split(';').filter(Boolean);
        styleArray.forEach((item) => {
            const [prop, val] = item.split(':').map(str => str.trim());
            if (prop && val) {
                styleObj[prop] = val;
            }
        });
        return styleObj;
    };

    const convertStyleToString = (styleObj: Record<string, string>): string => {
        return Object.entries(styleObj)
            .map(([key, value]) => `${key}: ${value}`)
            .join('; ') + ';';
    };

    const debouncedApplyColor = useDebounce((value: string) => applyStyle('color', value), 300);
    const debouncedApplyFontSize = useDebounce((value: string) => applyStyle('font-size', value), 300);

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newColor = e.target.value;
        setColor(newColor);
        setTimeout(() => {
            // const editorElement = document.querySelector('.editor-input') as HTMLElement;
            // if (editorElement) {
            //     editorElement.focus();
            // }
            debouncedApplyColor(newColor);
        }, 100);
    };

    const handleFontSizeChange = (e: SelectChangeEvent) => {
        const size = e.target.value;
        console.log('Font size selected:', size);
        if (size) {
            setFontSize("");
            setTimeout(() => {
                const editorElement = document.querySelector('.editor-input') as HTMLElement;
                if (editorElement) {
                    editorElement.focus();
                }
                debouncedApplyFontSize(size);
            }, 100);
        }
    };

    return (
        <Stack direction="row" spacing={1} p={2} mb={2} sx={{ backgroundColor: '#f5f5f5', borderRadius: 1 }}>
            <Button size='small' variant="text" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}>
                <FaBold />
            </Button>
            <Button size='small' variant="text" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}>
                <FaItalic />
            </Button>
            <Button size='small' variant="text" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')}>
                <FaStrikethrough />
            </Button>
            <Button size='small' variant="text" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}>
                <FaUnderline />
            </Button>


            <Input
                type="color"
                value={color}
                color='primary'
                onChange={handleColorChange}
                style={{ width: 40, height: 40, border: 'none', background: 'transparent', cursor: 'pointer' }}
                title="文字顏色"
            />

            <FormControl variant="outlined" size="small">
                <InputLabel id="font-size-label">字體大小</InputLabel>
                <Select
                    native
                    labelId="font-size-label"
                    value={fontSize}
                    onChange={handleFontSizeChange}
                    label="字體大小"
                    sx={{ minWidth: 120 }}
                >
                    <option value="" disabled>字體大小</option>
                    <option value="12px">12px</option>
                    <option value="16px">16px</option>
                    <option value="20px">20px</option>
                    <option value="24px">24px</option>
                    <option value="32px">32px</option>
                </Select>
            </FormControl>
        </Stack>
    );
}