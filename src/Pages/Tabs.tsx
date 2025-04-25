import { useState, useRef, useEffect } from 'react';
import DataTablePage from '../components/dataTablePage';
import { tabs, TabsType, TypesType } from '../types/board';
import { useTabs, useTypes } from '../utils/fetchUrls';
import { Grid2, Typography } from '@mui/material';
import ModalTool from '../components/modalTool';
import { ModalFieldConfig } from '../types/modal';
import { GridValueGetter } from '@mui/x-data-grid';
import { modalMessageAtom } from '../states/modal';
import { useAtom } from 'jotai';

const fields: ModalFieldConfig[] = [
    { name: "id", label: "編號", type: "text", disabled: true },
    { name: "name", label: "分頁名稱", type: "text", validation: ["isEmpty"] },
    { name: "type_id", label: "分類名稱", type: "select", validation: ["isEmpty"] },
    { name: "imgurl", label: "圖片", type: "custom", },
    // { name: "created_at", label: "建立時間", type: "text", disabled: true },
    // { name: "updated_at", label: "更新時間", type: "text", disabled: true },
];
const initData: TabsType = {
    id: "",
    name: "",
    type_id: "",
    created_at: "",
    updated_at: "",
}

const Tabs = () => {
    const [open, setOpen] = useState<boolean>(false);
    const [modalMode, setModalMode] = useState<"add" | "edit">("add");
    const [formData, setFormData] = useState(initData);
    const [modalFields, setModalFields] = useState(fields);
    const tableRef = useRef<{ getData: () => void }>(null);
    const titleMode = modalMode === "add" ? "新增" : modalMode === "edit" ? "編輯" : "刪除";
    const tabsApi = useTabs();
    const TypesApi = useTypes();
    const [typesList, setTypesList] = useState<TypesType[]>([]);
    const [, setModalMessage] = useAtom(modalMessageAtom)


    const customRenderers = {
        type_id: (value: GridValueGetter) => {
            return typesList.find((item) => item.id == String(value))?.name || "無分類";
        },
    };

    const onDelete = (row: TabsType) => {
        setModalMessage({
            open: true,
            title: `刪除圖片`,
            onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                const result = await tabsApi.delete(row);
                if (result.success) {
                    setModalMessage((prev) => prev ? { ...prev, open: false } : undefined)
                    setTimeout(() => {
                        tableRef.current?.getData();
                    }, 500);
                }
            },
            children: <Typography variant="body1" component="p">
                確定要刪除分頁為 {row.name}的資料嗎？
            </Typography>
        })
    };

    const onEdit = (row: TabsType) => {
        console.log(row);
        setModalMode("edit");
        setFormData(row);
        setOpen(true);

    };
    const onAdd = () => {
        setModalMode("add");
        setFormData({ ...initData });
        setOpen(true);
    }

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const api = {
            add: () => tabsApi.post(formData),
            edit: () => tabsApi.put(formData),
        }


        const result = await api[modalMode]();
        if (result.success) {
            setOpen(false);
            tableRef.current?.getData();
        }
    }

    useEffect(() => {
        fieldsCheck()

        return () => {
        }
    }, [])

    const fieldsCheck = async () => {
        const newFields = await Promise.all(fields.map<Promise<ModalFieldConfig>>(async (field) => {
            if (field.name === 'type_id') {
                const result = await TypesApi.get();
                if (result.success) {
                    const temp = { ...field };
                    temp.options = (result.data as TypesType[]).map((data) => ({ value: data.id, label: data.name }));
                    setTypesList(result.data as TypesType[])
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
                    分頁管理
                </Typography>
            </Grid2>
            <DataTablePage<TabsType>
                dataType={tabs}
                fetchApi={useTabs}
                onEdit={onEdit}
                onAdd={onAdd}
                onDelete={onDelete}
                ref={tableRef}
                customRenderers={customRenderers}
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

            />
        </>
    );
};

export default Tabs;