// Copyright 2021-2025 Ellucian Company L.P. and its affiliates.

import { useEffect, useMemo, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

import 'chart.js/auto';
import { Line } from 'react-chartjs-2';

import { Icon } from '@ellucian/ds-icons/lib';
import {
    FormControlLabel,
    FormGroup,
    IconButton,
    makeStyles,
    Radio,
    RadioGroup,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tooltip
} from '@ellucian/react-design-system/core';
import { spacing40 } from '@ellucian/react-design-system/core/styles/tokens';

import { useCache } from '@ellucian/experience-extension-utils';

import { withIntl } from '../i18n/ReactIntlProviderWrapper';

import { dispatchEvent } from '../util/events';

import { ApiDashboardProvider, useApiDashboard } from '../context/api-dashboard';

import { initializeLogging } from '../util/log-level';
initializeLogging('Today');

const cacheKey = 'api-dashboard-mode';

const useStyles = makeStyles()({
    root: {
        height: '100%',
        marginTop: 0,
        marginRight: spacing40,
        marginBottom: 0,
        marginLeft: spacing40,
        display: 'flex',
        flexDirection: 'column'
    },
    modeRadioGroup: {
        display: 'flex',
        flexDirection: 'row'
    },
    switchBox: {
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: spacing40
    },
    chartBox: {
        height: '100%'
    }
});

function onRefreshAll() {
    dispatchEvent({ name: 'refresh', data: {} });
}

function onRefresh(type) {
    dispatchEvent({ name: 'refresh', data: { type } });
}

const ApiDashboard = () => {
    const { classes } = useStyles();
    const { getItem, storeItem } = useCache();
    const intl = useIntl();
    const chartBoxRef = useRef(null);

    const { clear, stats, types } = useApiDashboard();

    const [mode, setMode] = useState('table');
    const [chartSize, setChartSize] = useState({ width: 0, height: 0 });
    const isChartSizeReady = chartSize.width > 0 && chartSize.height > 0;

    useEffect(() => {
        const element = chartBoxRef.current;
        if (!element) {
            return undefined;
        }

        const updateSize = () => {
            setChartSize({
                width: element.clientWidth,
                height: element.clientHeight
            });
        };

        updateSize();
        const observer = new ResizeObserver(updateSize);
        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [mode]);

    useEffect(() => {
        const { data: mode } = getItem({key: cacheKey});
        if (mode) {
            setMode(mode);
        }
    }, [getItem]);

    const chartData = useMemo(() => {
        const data = types.reduce(({labels = [], datasets = []}, type) => {
            let newLabels = labels;
            if (stats[type]) {
                const { color, count, times } = stats[type];
                if (count > labels.length) {
                    // create the labels
                    newLabels = [];
                    for ( let i = 0; i < count; i++ ) {
                        newLabels.push(String(i + 1));
                    }
                }

                datasets.push({
                    label: type,
                    data: times.map(time => (Math.round(time / 100) / 10)),
                    fill: false,
                    backgroundColor: color
                });
            }

            return {
                labels: newLabels,
                datasets
            }
        }, { labels: [], datasets: [] });

        return data;
    }, [stats, types]);

    const chartOptions = useMemo(() => ({
        responsive: false,
        maintainAspectRatio: false
    }), []);

    function onModeChange(event) {
        const { target: { value } } = event;
        setMode(value);
        storeItem({key: cacheKey, data: value});
    }

    function onClear() {
        clear();
    }

    return (
        <div className={classes.root}>
            <FormGroup className={classes.switchBox} row>
                <RadioGroup className={classes.modeRadioGroup} onChange={onModeChange} value={mode}>
                    <FormControlLabel
                        value="table"
                        control={<Radio/>}
                        label="Table"
                    />
                    <FormControlLabel
                        value="chart"
                        control={<Radio/>}
                        label="Chart"
                    />
                </RadioGroup>
                <div>
                    <Tooltip title={intl.formatMessage({id: 'Dash.clear'})}>
                        <IconButton color="gray" onClick={() => onClear()}>
                            <Icon name="trash"/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={intl.formatMessage({id: 'Dash.refresh'})}>
                        <IconButton color="gray" onClick={() => onRefreshAll()}>
                            <Icon name="refresh"/>
                        </IconButton>
                    </Tooltip>
                </div>
            </FormGroup>
            {mode === 'table' && (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                {intl.formatMessage({id: 'Dash.source'})}
                            </TableCell>
                            <TableCell>
                                {intl.formatMessage({id: 'Dash.count'})}
                            </TableCell>
                            <TableCell>
                                {intl.formatMessage({id: 'Dash.average'})}
                            </TableCell>
                            <TableCell>
                                {intl.formatMessage({id: 'Dash.actions'})}
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {types.map( type => (
                            <TableRow key={type}>
                                <TableCell>{type}</TableCell>
                                <TableCell>{stats[type].count}</TableCell>
                                <TableCell>{stats[type].average}</TableCell>
                                <TableCell>
                                    <IconButton color="gray" onClick={() => onRefresh(type)}>
                                        <Icon name="refresh"/>
                                    </IconButton>
                                    </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
            {mode === 'chart' && (
                <div className={classes.chartBox} ref={chartBoxRef}>
                    {isChartSizeReady && (
                        <Line
                            key={`${chartSize.width}x${chartSize.height}`}
                            className={classes.chart}
                            data={chartData}
                            options={chartOptions}
                            width={chartSize.width}
                            height={chartSize.height}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

function ApiDashboardWithProviders() {
    return (
        <ApiDashboardProvider>
            <ApiDashboard/>
        </ApiDashboardProvider>
    )
}

export default withIntl(ApiDashboardWithProviders);
