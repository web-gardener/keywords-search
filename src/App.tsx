import { FormControl, FormControlLabel, Radio, RadioGroup, Stack, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import * as FileSaver from 'file-saver';
import * as React from 'react';

const steps = ['Step 1', 'Step 2', 'Step 3', 'Step 4', 'Step 5'];

export default function HorizontalLinearStepper() {
	const [activeStep, setActiveStep] = React.useState(0);
	const [skipped, setSkipped] = React.useState(new Set<number>());
	const [browserName, setBrowserName] = React.useState('Google');
	const [url, setUrl] = React.useState('');
	const [keywords, setKeywords] = React.useState([]);
	const [duration, setDuration] = React.useState(0);
	const [nextDisable, setNextDisable] = React.useState(false);
	const ServerURL = 'https://9f4c-65-109-52-221.ngrok-free.app';

	const isStepSkipped = (step: number) => {
		return skipped.has(step);
	};

	const handleNext = () => {
		let newSkipped = skipped;
		if (isStepSkipped(activeStep)) {
			newSkipped = new Set(newSkipped.values());
			newSkipped.delete(activeStep);
		}

		if (activeStep === 2) {
			scrapeKeywords();
		} else {
			setActiveStep((prevActiveStep) => prevActiveStep + 1);
		}
		setSkipped(newSkipped);
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

	const handleReset = () => {
		setActiveStep(0);
	};

	const scrapeKeywords = () => {
		const start = performance.now();
		setNextDisable(true);
		axios
			.get(`${ServerURL}/scrape_keywords?url=https://${url}`)
			.then((res) => {
				const end = performance.now();
				setDuration(Math.ceil(end - start) / 1000);
				setActiveStep((prevActiveStep) => prevActiveStep + 1);
				setKeywords(res.data);
				setNextDisable(false);
			})
			.catch((err) => {
				console.log(err);
			});
	};

  const saveFile = (data: string[], filename: string) => {
    const file = new Blob([data.join('\n')], {type: 'text/plain;charset=utf-8'});
    FileSaver.saveAs(file, filename);
  }

	const handleDownload = () => {
		const filename = "keywords.txt";
    saveFile(keywords, filename);
	};

	return (
		<Stack justifyContent='center' alignItems='center' sx={{ height: '100vh' }}>
			<Box sx={{ maxWidth: '800px', width: '100%' }}>
				<Stepper activeStep={activeStep}>
					{steps.map((label, index) => {
						const stepProps: { completed?: boolean } = {};
						const labelProps: {
							optional?: React.ReactNode;
						} = {};
						if (isStepSkipped(index)) {
							stepProps.completed = false;
						}
						return (
							<Step key={label} {...stepProps}>
								<StepLabel {...labelProps}>{label}</StepLabel>
							</Step>
						);
					})}
				</Stepper>
				{activeStep === steps.length ? (
					<Box>
						<Box sx={{ height: '300px', mt: 2 }}>
							<Typography sx={{ mt: 2, mb: 1 }}>All steps completed - you&apos;re finished</Typography>
						</Box>
						<Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
							<Box sx={{ flex: '1 1 auto' }} />
							<Button onClick={handleReset}>Reset</Button>
						</Box>
					</Box>
				) : (
					<React.Fragment>
						<Box sx={{ height: '300px', mt: 2, p: 1 }}>
							{activeStep === 0 && (
								<FormControl>
									<RadioGroup aria-labelledby='step-1-group-label' defaultValue='keywords-modules' name='step-1-group'>
										<FormControlLabel value='keywords-modules' control={<Radio />} label='Keywords Modules' />
										<FormControlLabel value='duplicates-remover' control={<Radio />} label='Duplicates remover' />
										<FormControlLabel value='add-prefix-and-suffix' control={<Radio />} label='Add Prefix & Suffix' />
									</RadioGroup>
								</FormControl>
							)}
							{activeStep === 1 && (
								<FormControl>
									<RadioGroup aria-labelledby='step-2-group-label' defaultValue='google' name='step-2-group'>
										<FormControlLabel value='google' control={<Radio />} label='Google' onClick={(e) => setBrowserName('Google')} />
										<FormControlLabel value='bing' control={<Radio />} label='Bing' onClick={(e) => setBrowserName('Bing')} />
										<FormControlLabel value='yahoojp' control={<Radio />} label='YahooJP' onClick={(e) => setBrowserName('YahooJP')} />
										<FormControlLabel value='ask' control={<Radio />} label='Ask' onClick={(e) => setBrowserName('Ask')} />
									</RadioGroup>
								</FormControl>
							)}
							{activeStep === 2 && <TextField id='url-input' label='URL link' variant='outlined' value={url} onChange={(e) => setUrl(e.target.value)} />}
							{activeStep === 3 && (
								<>
									<Typography variant='subtitle1' component='p'>
										Browser : {browserName}
									</Typography>
									<Typography variant='subtitle1' component='p'>
										Scraped kws : {keywords.length}
									</Typography>
									<Typography variant='subtitle1' component='p'>
										Time Taken To Scrap : {duration}s
									</Typography>
								</>
							)}
							{activeStep === 4 && (
								<>
									<Typography variant='subtitle1' component='p'>
										Download keywords
									</Typography>
									<Button variant='contained' onClick={handleDownload}>
										Download
									</Button>
								</>
							)}
						</Box>
						<Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
							<Button color='inherit' disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
								Back
							</Button>
							<Box sx={{ flex: '1 1 auto' }} />
							<Button onClick={handleNext} disabled={(activeStep === 2 && url === '') || nextDisable}>
								{activeStep === steps.length - 1 ? 'Finish' : 'Next'}
							</Button>
						</Box>
					</React.Fragment>
				)}
			</Box>
		</Stack>
	);
}
