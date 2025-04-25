// components/DataTablePage.tsx
import { useState, useEffect, useMemo, useImperativeHandle, RefObject } from 'react';
import { GridColDef, GridRenderCellParams, GridValueGetter } from '@mui/x-data-grid';
import { Box, Button, Collapse, Grid2 } from '@mui/material';
import DataTable from './dataTables';
import { FetchActionsType, TableRow } from '../types/fetch';
import FieldTool from './fieldTool';
import { ModalFieldConfig } from '../types/modal';
import { IoMdAdd, IoMdArrowDown, IoMdArrowUp } from 'react-icons/io';
import { CiSearch, CiEraser } from "react-icons/ci";
import { useSearchParams } from 'react-router-dom';

interface DataTablePageProps<T> {
    dataType: Record<string, string>;
    fetchApi: () => FetchActionsType<T>;
    customRenderers?: {
        [key: string]: (param: GridValueGetter, row?: T) => string;
    };
    onAdd?: () => void;
    onEdit?: (row: T) => void;
    onDelete?: (row: T) => void;
    extendColumns?: GridColDef[];
    ref?: RefObject<{ getData: () => void } | null>;
    paramFields?: ModalFieldConfig[];
    extendActions?: (params: GridRenderCellParams) => React.ReactNode;
    viewOnly?: boolean;
}

function DataTablePage<T extends TableRow>({
    dataType,
    fetchApi,
    customRenderers = {},
    onAdd,
    onEdit,
    onDelete,
    extendColumns = [],
    ref,
    paramFields = [],
    extendActions,
    viewOnly = false,
}: DataTablePageProps<T>) {
    const paramsDataInit = useMemo(() => paramFields.reduce((acc, field) => {
        acc[field.name] = "";
        return acc;
    }, {} as Record<string, string>), [paramFields]);
    const [rows, setRows] = useState<T[]>([]);
    const [paramsData, setParamsData] = useState<Record<string, string>>(paramsDataInit);
    const [advance, setAdvance] = useState(false);
    const [searchParams] = useSearchParams();

    const paramFieldsHandle = useMemo(() => paramFields.filter((field) => field.param).
        map(field => {
            const newField = { ...field };
            delete newField.disabled;
            return newField;
        }), [paramFields]);


    const api = fetchApi();

    const searchParamsHandle = useMemo(
        () => {
            if (searchParams.size > 0) {
                const params: Record<string, string> = { ...paramsDataInit };
                searchParams.forEach((value, key) => {
                    if (key !== "page" && key !== "size") {
                        params[key] = value;
                    }
                });
                setParamsData(params);
                setAdvance(true);
                return params;
            } else {
                setParamsData(paramsDataInit);
                setAdvance(false);
            }
        },
        [searchParams]
    )


    const getData = async (param: Record<string, string> = paramsData) => {
        // 移除空白參數
        const filteredParams = Object.fromEntries(
            Object.entries(param).filter(([, value]) => value.toString().trim() !== "")
        );
        const result = await api.get(filteredParams);
        if (result.success) {
            setRows((result.data ?? []) as T[]);
        }
    };


    useImperativeHandle(ref, () => ({
        getData,
    }));

    useEffect(() => {
        const params = searchParamsHandle;
        getData(params);
    }, [searchParams]);

    const columns: GridColDef[] = useMemo(() => {
        const defaultActions: GridColDef[] = viewOnly ? [] : [
            {
                field: 'operation',
                headerName: '操作',
                width: extendActions ? 150 : 150,
                headerAlign: 'center',
                sortable: false,          // 關閉排序
                filterable: false,        // 關閉過濾
                disableColumnMenu: true,  // 禁用列選單
                renderCell: (params) => (
                    <>
                        {extendActions && extendActions(params)}
                        <Button
                            size='small'
                            color="secondary"
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit?.(params.row);
                            }}
                        >
                            編輯
                        </Button>
                        <Button
                            size='small'
                            color="error"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete?.(params.row);
                            }}
                        >
                            刪除
                        </Button>
                    </>
                ),
            }
        ]
        return [
            ...defaultActions,
            ...Object.keys(dataType).map<GridColDef>((key) => {
                let width = String(dataType[key]).length * 25;
                switch (key) {
                    case "imgurl":
                        width = 250;
                        break;
                    case "content":
                        width = 150;
                        break;
                    case "title":
                        width = 100;
                        break;
                }
                const baseCol: GridColDef = {
                    field: key,
                    headerName: dataType[key],
                    width
                };
                return customRenderers[key]
                    ? { ...baseCol, valueGetter: customRenderers[key] }
                    : baseCol;
            }),
            ...extendColumns,
        ]
    }, [customRenderers]);

    const onSearch = () => {
        getData(paramsData);
    }

    const onParamsClear = () => {
        setParamsData(paramsDataInit);
        getData(paramsDataInit);
    }

    return (
        <>
            <Grid2 size={{ xs: 12, sm: 12 }}>
                <Box sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 1,
                }}>
                    <Box sx={{ marginRight: 1 }} hidden={viewOnly}>
                        <Button
                            startIcon={<IoMdAdd />}
                            variant='contained'
                            color='info'
                            onClick={onAdd}
                            component="div"
                        >新增</Button>
                    </Box>
                    <Box hidden={paramFieldsHandle.length == 0}>
                        <Box
                            sx={{
                                display: 'inline-flex',
                                visibility: advance ? 'visible' : 'hidden',
                                opacity: advance ? 1 : 0,
                                transform: advance ? 'translateY(0)' : 'translateY(-20px)',
                                transition: 'opacity 0.5s ease, transform 0.5s ease',
                            }}>
                            <Button
                                hidden={!advance}
                                sx={{ marginRight: 1 }}
                                variant="contained"
                                color="secondary"
                                onClick={onSearch}
                                startIcon={<CiSearch />}>
                                搜尋
                            </Button>
                            <Button
                                hidden={!advance}
                                sx={{ marginRight: 1 }}
                                variant="contained"
                                color="warning"
                                onClick={onParamsClear}
                                startIcon={<CiEraser />}>
                                清除
                            </Button>
                        </Box>
                        <Button

                            endIcon={advance ? <IoMdArrowUp /> : <IoMdArrowDown />}
                            variant='text'
                            color='info'
                            onClick={() => setAdvance(!advance)}
                            component="div"
                        >進階搜尋</Button>
                    </Box>
                </Box>
                <Collapse in={paramFieldsHandle.length > 0 && advance}>
                    <Grid2
                        container spacing={2}
                        border={1}
                        borderColor="divider"
                        p={1}
                    >
                        <FieldTool
                            fieldsData={paramsData}
                            setFieldsData={setParamsData}
                            fields={paramFieldsHandle}
                        />

                    </Grid2>
                </Collapse>
            </Grid2>
            <DataTable<T> columns={columns} rows={rows} />
        </>
    );
}

export default DataTablePage;