import React from "react";
import { Box, Skeleton, Stack } from "@mui/material";
export default class Loading extends React.Component {
  render() {
    return [...Array(3).keys()].map((i) => 
      <Stack spacing={1}>
        <Skeleton width={48} height={48} variant='circular' />
        <Skeleton variant='text'>

        </Skeleton>
        <Skeleton height={100} width={500} variant='rectangular'/>
        <Box style={{marginBottom: 2}}>
        </Box>
      </Stack>);
  }
}