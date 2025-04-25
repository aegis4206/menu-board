import { Box, ImageList, ImageListItem, ImageListItemBar, } from '@mui/material';
import { useTypes } from '../utils/fetchUrls';
import { useEffect, useState } from 'react';
import { TypesType } from '../types/board';
import { Link } from 'react-router-dom';


const Index = () => {
    const [types, setTypes] = useState<TypesType[]>([]);
    const typesApi = useTypes();



    useEffect(() => {
        getTypes();
        return () => {

        }
    }, [])

    const getTypes = async () => {
        const res = await typesApi.get();
        console.log(res);
        if (res.success) {
            setTypes((res.data as TypesType[]));
        }
    }

    return (
        <>
            <Box>
                <ImageList
                    cols={2} gap={8}
                >
                    {types.map((type) => (
                        <Link to={`/type/${type.id}`} key={type.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <ImageListItem>
                                <img
                                    src={type.imgurl}
                                    alt={type.name}
                                    loading="lazy"
                                    style={{ width: '100%', height: 'auto', objectFit: 'contain', }}
                                />
                                <ImageListItemBar
                                    title={type.name}
                                // subtitle={type.name}
                                // actionIcon={
                                // <IconButton
                                //     sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                                //     aria-label={`info about ${item.title}`}
                                // >
                                //     <InfoIcon />
                                // </IconButton>
                                // }
                                />
                            </ImageListItem>
                        </Link>
                    ))}
                </ImageList>
            </Box>
        </>
    );
};

export default Index;