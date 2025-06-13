import { useState, useRef } from 'react';
import DataTablePage from '../components/dataTablePage';
import { types, TypesType } from '../types/board';
import { useTypes } from '../utils/fetchUrls';
import { Box, Button, Grid2, Typography } from '@mui/material';
import ModalTool from '../components/modalTool';
import { ModalFieldConfig } from '../types/modal';
import { useAtom } from 'jotai';
import { snackBarAtom } from '../states/global';
import { TiUpload } from 'react-icons/ti';
import { modalMessageAtom } from '../states/modal';

const fields: ModalFieldConfig[] = [
    { name: "id", label: "編號", type: "text", disabled: true },
    { name: "sort", label: "排序", type: "number", validation: ['isEmpty'] },
    { name: "name", label: "分類名稱", type: "text", validation: ["isEmpty"] },
    { name: "imgurl", label: "圖片", type: "custom", },
    // { name: "created_at", label: "建立時間", type: "text", disabled: true },
    // { name: "updated_at", label: "更新時間", type: "text", disabled: true },
];
const initData: TypesType = {
    id: "",
    sort: "",
    name: "",
    imgurl: "",
    created_at: "",
    updated_at: "",
}

const Types = () => {
    const [open, setOpen] = useState<boolean>(false);
    const [modalMode, setModalMode] = useState<"add" | "edit">("add");
    const [formData, setFormData] = useState(initData);
    const [modalFields,] = useState(fields);
    const tableRef = useRef<{ getData: () => void }>(null);
    const titleMode = modalMode === "add" ? "新增" : modalMode === "edit" ? "編輯" : "刪除";
    const typesApi = useTypes();
    const [, setSnackBar] = useAtom(snackBarAtom);
    const [, setModalMessage] = useAtom(modalMessageAtom)

    const onDelete = (row: TypesType) => {
        setModalMessage({
            open: true,
            title: `刪除圖片`,
            onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                const result = await typesApi.delete(row);
                if (result.success) {
                    setModalMessage((prev) => prev ? { ...prev, open: false } : undefined)
                    setTimeout(() => {
                        tableRef.current?.getData();
                    }, 500);
                }
            },
            children: <Typography variant="body1" component="p">
                確定要刪除分類為 {row.name}的資料嗎？
            </Typography>
        })
    };

    const onEdit = (row: TypesType) => {
        console.log(row);
        setImageUrl(null);
        setModalMode("edit");
        setFormData(row);
        setOpen(true);

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
            body.append(key, formData[key as keyof TypesType])
        });

        const api = {
            add: () => typesApi.post(body),
            edit: () => typesApi.put(body),
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
                            src={`${import.meta.env.VITE_API_URL}${formData.imgurl}`}
                            alt="Uploaded"
                            style={{ width: '100%', maxHeight: "100%", objectFit: 'contain' }}
                        />
                    )}
                </Box>
            </Box>
    }


    return (
        <>
            <Grid2 size={{ xs: 12, sm: 12 }}>
                <Typography variant="h5" component="h1" sx={{ mb: 1 }}>
                    分類管理
                </Typography>
            </Grid2>
            <DataTablePage<TypesType>
                dataType={types}
                fetchApi={useTypes}
                onEdit={onEdit}
                onAdd={onAdd}
                onDelete={onDelete}
                ref={tableRef}
            />
            <ModalTool
                open={open}
                setOpen={setOpen}
                title={`${titleMode}分類`}
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

export default Types;