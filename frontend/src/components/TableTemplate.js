import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TablePagination,
  TableSortLabel,
  TextField,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";

import { StyledTableCell, StyledTableRow } from "./styles";

const TableTemplate = ({
  buttonHaver: ButtonHaver,
  columns,
  rows,
  classes,
  rowStyle,
  disableSearch,
}) => {
  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [order, setOrder] = useState("asc");

  const [orderBy, setOrderBy] = useState("");

  const [search, setSearch] = useState("");

  const [filterClass, setFilterClass] = useState("all");

  const handleRequestSort = property => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSearchChange = event => {
    setSearch(event.target.value);
  };

  const handleFilterClassChange = event => {
    setFilterClass(event.target.value);
  };

  const filteredRows = rows.filter(row => {
    const matchesSearch = columns.some(column =>
      String(row[column.id]).toLowerCase().includes(search.toLowerCase())
    );
    const matchesClass =
      filterClass === "all" || row.sclassName === filterClass || row.sclass === filterClass;
    return matchesSearch && matchesClass;
  });

  const sortedRows = filteredRows.sort((a, b) => {
    if (orderBy) {
      if (order === "asc") {
        return a[orderBy] < b[orderBy] ? -1 : 1;
      } else {
        return a[orderBy] > b[orderBy] ? -1 : 1;
      }
    }
    return 0;
  });

  return (
    <>
      <Grid container columnSpacing={2}>
        {classes && (
          <Grid item xs={6}>
            <FormControl variant="outlined" fullWidth margin="normal">
              <InputLabel id="class-filter-label">Lọc theo lớp</InputLabel>
              <Select
                labelId="class-filter-label"
                value={filterClass}
                onChange={handleFilterClassChange}
                label="Lọc theo lớp"
              >
                <MenuItem value="all">Tất cả</MenuItem>
                {classes.map((sclass, index) => (
                  <MenuItem key={index} value={sclass}>
                    {sclass}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}
        <Grid item xs={classes ? 6 : 12} mb="1rem">
          {disableSearch ? null : (
            <TextField
              label="Tìm kiếm"
              variant="outlined"
              fullWidth
              margin="normal"
              value={search}
              onChange={handleSearchChange}
              fontSize="2rem"
            />
          )}
        </Grid>
      </Grid>
      <TableContainer>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <StyledTableRow>
              {columns.map(column => (
                <StyledTableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth, fontSize: "1.25rem" }}
                  sortDirection={orderBy === column.id ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={orderBy === column.id ? order : "asc"}
                    onClick={() => handleRequestSort(column.id)}
                  >
                    {column.label}
                  </TableSortLabel>
                </StyledTableCell>
              ))}
              <StyledTableCell style={{ fontSize: "1.25rem" }}>
                HÀNH ĐỘNG
              </StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {sortedRows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map(row => {
                return (
                  <StyledTableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.id}
                    style={rowStyle ? rowStyle(row) : {}}
                  >
                    {columns.map(column => {
                      const value = row[column.id];
                      return (
                        <StyledTableCell
                          key={column.id}
                          align={column.align}
                          style={{ fontSize: "1.25rem" }}
                        >
                          {column.format && typeof value === "number"
                            ? column.format(value)
                            : value}
                        </StyledTableCell>
                      );
                    })}
                    <StyledTableCell align="center">
                      <ButtonHaver row={row} style={{ fontSize: "1.25rem" }} />
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 100]}
        component="div"
        count={sortedRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={event => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
      />
    </>
  );
};

export default TableTemplate;
