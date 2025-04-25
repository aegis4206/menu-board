import { useState, useRef } from 'react';
import DataTablePage from '../components/dataTablePage';
import { AuthUserType, authUser } from '../types/board';
import { useAdminUser } from '../utils/fetchUrls';
import { Grid2, Typography } from '@mui/material';
import ModalTool from '../components/modalTool';
import { ModalFieldConfig } from '../types/modal';

const fields: ModalFieldConfig[] = [
    { name: "username", label: "使用者名稱", type: "text", validation: ["isEmpty"] },
    { name: "password", label: "使用者密碼", type: "password", validation: ["isEmpty"] },
    { name: "name", label: "使用者全名", type: "text" },
    { name: "email", label: "使用者信箱", type: "text" },
    { name: "phone", label: "使用者手機號碼", type: "text" },
];
const initData: AuthUserType = {
    id: "",
    username: "",
    password: "",
    name: "",
    email: "",
    phone: "",
}

const Auth_user = () => {
    const [open, setOpen] = useState<boolean>(false);
    const [modalMode, setModalMode] = useState<"add" | "edit" | "delete">("add");
    const [formData, setFormData] = useState(initData);
    const [modalFields,] = useState(fields);
    const tableRef = useRef<{ getData: () => void }>(null);
    const titleMode = modalMode === "add" ? "新增" : modalMode === "edit" ? "編輯" : "刪除";
    const adminUserApi = useAdminUser();



    const onEdit = (row: AuthUserType) => {
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
        console.log(formData);
        const result = await adminUserApi.post(formData);
        if (result.success) {
            setOpen(false);
            tableRef.current?.getData();
        }
    }



    return (
        <>
            <Grid2 size={{ xs: 12, sm: 12 }}>
                <Typography variant="h5" component="h1" sx={{ mb: 1 }}>
                    使用者管理
                </Typography>
            </Grid2>
            <DataTablePage<AuthUserType >
                dataType={authUser}
                fetchApi={useAdminUser}
                onEdit={onEdit}
                onAdd={onAdd}
                ref={tableRef}
            />
            <ModalTool
                open={open}
                setOpen={setOpen}
                title={`${titleMode}使用者`}
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

export default Auth_user;