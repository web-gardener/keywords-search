import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material';
import React from 'react';
import './App.css';
import axios from 'axios';

interface Column {
	id: 'keywordText' | 'competition' | 'competitionIndex' | 'searchVolume' | 'lowTopPageBid' | 'highTopPageBid';
	label: string;
	minWidth?: number;
	align?: 'right';
	format?: (value: number) => string;
}

const columns: readonly Column[] = [
	{ id: 'keywordText', label: 'Keyword Text', minWidth: 170 },
	{ id: 'competition', label: 'Competition', minWidth: 100 },
	{
		id: 'competitionIndex',
		label: 'Competition Index',
		minWidth: 170,
		align: 'right',
		format: (value: number) => value.toLocaleString('en-US'),
	},
	{
		id: 'searchVolume',
		label: 'Search Volume',
		minWidth: 170,
		align: 'right',
		format: (value: number) => value.toLocaleString('en-US'),
	},
	{
		id: 'lowTopPageBid',
		label: 'Low Top Page Bid',
		minWidth: 170,
		align: 'right',
		format: (value: number) => value.toFixed(2),
	},
	{
		id: 'highTopPageBid',
		label: 'High Top Page Bid',
		minWidth: 170,
		align: 'right',
		// format: (value: number) => value.toFixed(2),
	},
];

interface Data {
	keywordText: string;
	competition: string;
	competitionIndex: number;
	searchVolume: number;
	lowTopPageBid: number;
	highTopPageBid: number;
}

function App() {
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);
	const [keyword, setKeyword] = React.useState('');
	const [rows, setRows] = React.useState<Data[]>([]);

	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	const handleSearch = (event: React.MouseEvent<HTMLButtonElement>) => {
		axios
			.post(
				'https://tools.wordstream.com/api/free-tools/google/keywords',
				{
					keyword: keyword,
					locationIds: [2840],
				},
				{
					headers: {
						'Content-Type': 'application/json',
					},
				}
			)
			.then((res) => {
				setRows(res.data.keywords);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const handleChangeKeyword = (event: React.ChangeEvent<HTMLInputElement>) => {
		setKeyword(event.target.value);
	};

	return (
		<Box className='App'>
			<Box>
				<Typography variant='h3' component='h1' gutterBottom>
					Keyword Tool
				</Typography>
				<Typography variant='h5' component='h2' gutterBottom>
					Enter a keyword or website URL to find suggestions
				</Typography>
				<TextField id='outlined-basic' label='Keywords' variant='outlined' onChange={handleChangeKeyword} />
				<Button variant='contained' sx={{ height: 56, ml: 2 }} onClick={handleSearch}>
					Search
				</Button>
			</Box>
			<Box>
				<Paper sx={{ width: '90%', overflow: 'hidden', marginLeft: 'auto', marginRight: 'auto', mt: 5 }}>
					<TableContainer>
						<Table stickyHeader aria-label='sticky table'>
							<TableHead>
								<TableRow>
									{columns.map((column) => (
										<TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
											{column.label}
										</TableCell>
									))}
								</TableRow>
							</TableHead>
							<TableBody>
								{rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
									return (
										<TableRow hover role='checkbox' tabIndex={-1} key={row.keywordText}>
											{columns.map((column) => {
												const value = row[column.id];
												return (
													<TableCell key={column.id} align={column.align}>
														{column.format && typeof value === 'number' ? column.format(value) : value}
													</TableCell>
												);
											})}
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</TableContainer>
					<TablePagination rowsPerPageOptions={[10, 25, 100]} component='div' count={rows.length} rowsPerPage={rowsPerPage} page={page} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage} />
				</Paper>
			</Box>
		</Box>
	);
}

export default App;
