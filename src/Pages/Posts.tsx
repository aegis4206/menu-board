import { useState, useRef, useEffect } from 'react';
import DataTablePage from '../components/dataTablePage';
import { posts, PostsType, TabsType, TypesType } from '../types/board';
import { usePosts, useTabs, useTypes } from '../utils/fetchUrls';
import { Box, Button, Grid2, MenuItem, TextField, Typography } from '@mui/material';
import ModalTool from '../components/modalTool';
import { ModalFieldConfig } from '../types/modal';
import { snackBarAtom } from '../states/global';
import { useAtom } from 'jotai';
import { TiUpload } from "react-icons/ti";
import { GridValueGetter } from '@mui/x-data-grid';
import { modalMessageAtom } from '../states/modal';
import LexicalTool from '../components/lexicalTool';

const fields: ModalFieldConfig[] = [
    { name: "id", label: "編號", type: "text", disabled: true },
    { name: "sort", label: "排序", type: "number", validation: ['isEmpty'] },
    { name: "title", label: "標題", type: "text", validation: ["isEmpty"] },
    { name: "content", label: "內容", type: "custom" },
    { name: "type_id", label: "分類名稱", type: "custom", validation: ["isEmpty"] },
    { name: "tab_id", label: "分頁名稱", type: "custom", validation: ["isEmpty"] },
    { name: "imgurl", label: "圖片", type: "custom", },
    // { name: "created_at", label: "建立時間", type: "text", disabled: true },
    // { name: "updated_at", label: "更新時間", type: "text", disabled: true },
];
const initData: PostsType = {
    id: "",
    sort: "",
    title: "",
    content: "",
    type_id: "",
    tab_id: "",
    imgurl: "",
    created_at: "",
    updated_at: "",
}

const Posts = () => {
    const [open, setOpen] = useState<boolean>(false);
    const [modalMode, setModalMode] = useState<"add" | "edit">("add");
    const [formData, setFormData] = useState(initData);
    const [modalFields, setModalFields] = useState(fields);
    const tableRef = useRef<{ getData: () => void }>(null);
    const titleMode = modalMode === "add" ? "新增" : modalMode === "edit" ? "編輯" : "刪除";
    const postsApi = usePosts();
    const [, setSnackBar] = useAtom(snackBarAtom);
    const typesApi = useTypes();
    const [typesList, setTypesList] = useState<TypesType[]>([]);
    const tabsApi = useTabs();
    const [tabsList, setTabsList] = useState<TabsType[]>([]);
    const [, setModalMessage] = useAtom(modalMessageAtom)


    const customRenderers = {
        type_id: (value: GridValueGetter) => {
            return typesList.find((item) => item.id == String(value))?.name || "無分類";
        },
        tab_id: (value: GridValueGetter) => {
            return tabsList.find((item) => item.id == String(value))?.name || "無分頁";
        },
    };

    const onDelete = (row: PostsType) => {
        setModalMessage({
            open: true,
            title: `刪除圖片`,
            onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                const result = await postsApi.delete(row);
                if (result.success) {
                    setModalMessage((prev) => prev ? { ...prev, open: false } : undefined)
                    setTimeout(() => {
                        tableRef.current?.getData();
                    }, 500);
                }
            },
            children: <Typography variant="body1" component="p">
                確定要刪除圖片為 {row.title}的資料嗎？
            </Typography>
        })
    };

    const onEdit = (row: PostsType) => {
        console.log(row);
        setImageUrl(null);
        setModalMode("edit");
        setFormData(row);
        setOpen(true);
        handleSelectInit(row.type_id);
    };
    const onAdd = () => {
        setImageUrl(null);
        setModalMode("add");
        setFormData({ ...initData });
        setOpen(true);
    }

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!formData.imgurl && imageUrl === null) return setSnackBar({ open: true, message: '請選擇圖片', severity: 'error' });


        const body = new FormData();
        const bodyKeys = Object.keys(formData);
        bodyKeys.forEach(key => {
            if (key === 'imgurl' && imageUrl) {
                body.append(key, img!);
                return;
            } else if (key === 'imgurl' && !imageUrl) {
                return;
            }
            body.append(key, formData[key as keyof PostsType])
        });

        const api = {
            add: () => postsApi.post(body),
            edit: () => postsApi.put(body),
        }

        const result = await api[modalMode]();
        if (result.success) {
            setOpen(false);
            tableRef.current?.getData();
        }
    }

    const [img, setImg] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);


    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImg(file);
        setImageUrl(URL.createObjectURL(file)); // 把 File 轉成可預覽的 URL

        // const formData = new FormData();
        // formData.append('image', file);

    };

    const customField = {
        imgurl: () =>
            <Box key="imgurl">
                <Button
                    variant="contained"
                    component="label"
                    startIcon={<TiUpload />}
                >
                    上傳圖片
                    <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleUpload}
                    />
                </Button>
                <Box mt={2}>
                    {imageUrl && (
                        <img
                            src={imageUrl}
                            alt="Uploaded"
                            style={{ width: '100%', maxHeight: "100%", objectFit: 'contain' }}
                        />
                    )}
                    {!imageUrl && formData.imgurl && (
                        <img
                            src={formData.imgurl}
                            alt="Uploaded"
                            style={{ width: '100%', maxHeight: "100%", objectFit: 'contain' }}
                        />
                    )}
                </Box>
            </Box>,
        type_id: (field: ModalFieldConfig, errors: Record<string, string>) =>
            <Grid2 size={{ xs: 12, md: 4 }} key={field.name}>
                <TextField
                    label={field.label}
                    name={field.name}
                    select
                    fullWidth
                    value={formData[field.name as keyof PostsType] as string | number ?? ""}
                    onChange={(event) => handleSelectChange(field.name, event.target.value)}
                    error={!!errors[field.name as string]}
                    helperText={errors[field.name as string]}
                >
                    {field.options ? field.options.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    )) : <MenuItem value="" disabled>
                        {field.label}
                    </MenuItem>}
                </TextField>
            </Grid2>,
        tab_id: (field: ModalFieldConfig, errors: Record<string, string>) =>
            <Grid2 size={{ xs: 12, md: 4 }} key={field.name}>
                <TextField
                    label={field.label}
                    name={field.name}
                    select
                    fullWidth
                    value={formData[field.name as keyof PostsType] ?? ""}
                    onChange={(event) => handleSelectChange(field.name, event.target.value)}
                    error={!!errors[field.name as string]}
                    helperText={errors[field.name as string]}
                >
                    {formData.type_id !== "" && field.options ? field.options.length !== 0 ? field.options.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    )) : <MenuItem value="" disabled>
                        無對應通路的分頁
                    </MenuItem> : <MenuItem value="" disabled>
                        請先選擇分類
                    </MenuItem>}
                </TextField>
            </Grid2>,
        content: (field: ModalFieldConfig) =>
            <Grid2 size={{ xs: 12, md: 12 }} key={field.name}>
                <LexicalTool value={formData.content} onChange={(newValue) => {
                    // console.log(newValue)
                    setFormData(pre => ({
                        ...pre,
                        content: newValue
                    }))
                }} />
            </Grid2>
    }


    const handleSelectChange = async (name: string, value: string) => {
        const tempFormData = { [name as keyof PostsType]: value }

        // 處理當通路id改變時 清空id
        if (name === 'type_id') {
            handleSelectInit(value);
            tempFormData.tab_id = "";
        }
        setFormData((prev) => ({
            ...prev,
            ...tempFormData
        }));
    };

    // 初始化選項
    const handleSelectInit = (type_id: string) => {
        const newFields = modalFields.map<ModalFieldConfig>((field) => {
            if (field.name === 'tab_id') {
                const temp = { ...field };
                temp.options = tabsList.filter(tab => tab.type_id === type_id).map((tab) => ({ value: tab.id, label: tab.name }));
                return temp;
            }

            return field;
        });
        setModalFields(newFields);
    }


    useEffect(() => {
        fieldsCheck()

        return () => {
        }
    }, [])

    const fieldsCheck = async () => {
        const newFields = await Promise.all(fields.map<Promise<ModalFieldConfig>>(async (field) => {
            if (field.name === 'type_id') {
                const result = await typesApi.get();
                if (result.success) {
                    const temp = { ...field };
                    temp.options = (result.data as TypesType[]).map((type) => ({ value: type.id, label: type.name }));
                    setTypesList(result.data as TypesType[])
                    return temp;
                }
            }
            if (field.name === 'tab_id') {
                const result = await tabsApi.get();
                if (result.success) {
                    const temp = { ...field };
                    temp.options = (result.data as TabsType[]).map((tab) => ({ value: tab.id, label: tab.name }));
                    setTabsList(result.data as TabsType[])
                    return temp;
                }
            }
            return field;
        }));
        setModalFields(newFields);

    }



    return (
        <>
            <Grid2 size={{ xs: 12, sm: 12 }}>
                <Typography variant="h5" component="h1" sx={{ mb: 1 }}>
                    圖片管理
                </Typography>
            </Grid2>
            <DataTablePage<PostsType>
                dataType={posts}
                fetchApi={usePosts}
                onEdit={onEdit}
                onAdd={onAdd}
                onDelete={onDelete}
                ref={tableRef}
                customRenderers={customRenderers}
            />
            <ModalTool
                open={open}
                setOpen={setOpen}
                title={`${titleMode}文章`}
                formData={formData}
                setFormData={setFormData}
                onSubmit={(event) => {
                    onSubmit(event);
                    // tableRef.current?.getData();
                }}
                fields={modalFields}
                customField={customField}
            />
        </>
    );
};

export default Posts;